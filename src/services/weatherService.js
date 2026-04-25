import axiosInstance from "../utils/axiosInstance";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
const LOCATION = {
  latitude: 21.07,
  longitude: 103.71,
  name: "Thuận Châu, Sơn La",
  timezone: "Asia/Bangkok",
};
const CACHE_KEY = "thuanchau-weather-cache-v1";
const CACHE_TTL = 30 * 60 * 1000;
const WEATHER_API = "https://api.open-meteo.com/v1/forecast";
let pendingWeatherPromise = null;

const DAILY_FIELDS = [
  "temperature_2m_max",
  "temperature_2m_min",
  "precipitation_sum",
  "windspeed_10m_max",
  "weathercode",
  "relative_humidity_2m_max",
].join(",");

const WEATHER_CODES = {
  0: { icon: "☀️", label: "Trời quang" },
  1: { icon: "⛅", label: "Có mây" },
  2: { icon: "⛅", label: "Có mây" },
  3: { icon: "⛅", label: "Có mây" },
  45: { icon: "🌫️", label: "Sương mù" },
  48: { icon: "🌫️", label: "Sương mù" },
  51: { icon: "🌦️", label: "Mưa nhỏ" },
  53: { icon: "🌦️", label: "Mưa nhỏ" },
  55: { icon: "🌦️", label: "Mưa nhỏ" },
  61: { icon: "🌧️", label: "Mưa vừa/to" },
  63: { icon: "🌧️", label: "Mưa vừa/to" },
  65: { icon: "🌧️", label: "Mưa vừa/to" },
  71: { icon: "❄️", label: "Có tuyết" },
  73: { icon: "❄️", label: "Có tuyết" },
  75: { icon: "❄️", label: "Có tuyết" },
  80: { icon: "⛈️", label: "Mưa rào" },
  81: { icon: "⛈️", label: "Mưa rào" },
  82: { icon: "⛈️", label: "Mưa rào" },
  95: { icon: "🌩️", label: "Giông bão" },
};

const DAY_LABELS = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

const safeStorage = {
  get(key) {
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  set(key, value) {
    try {
      window.localStorage.setItem(key, value);
    } catch {
      /* ignore */
    }
  },
};

const formatDayLabel = (dateString) => {
  const date = new Date(`${dateString}T00:00:00`);
  return DAY_LABELS[date.getDay()] || "";
};

const toNumber = (value) => {
  if (value === null || value === undefined || value === "") return null;
  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue : null;
};

const getWeatherInfo = (code) =>
  WEATHER_CODES[Number(code)] || { icon: "🌤️", label: "Thời tiết khác" };

const normalizeForecast = (daily = {}) => {
  const dates = daily.time || [];
  return dates.map((date, index) => {
    const code = Number(daily.weathercode?.[index] ?? 0);
    const info = getWeatherInfo(code);
    return {
      date,
      dayLabel: formatDayLabel(date),
      weathercode: code,
      weatherIcon: info.icon,
      weatherLabel: info.label,
      temperatureMax: toNumber(daily.temperature_2m_max?.[index]),
      temperatureMin: toNumber(daily.temperature_2m_min?.[index]),
      precipitationSum: toNumber(daily.precipitation_sum?.[index]),
      windspeedMax: toNumber(daily.windspeed_10m_max?.[index]),
      humidityMax: toNumber(daily.relative_humidity_2m_max?.[index]),
    };
  });
};

const normalizePayload = (payload) => {
  const forecast = normalizeForecast(payload?.daily || {});
  return {
    location: { ...LOCATION },
    forecast,
    current: forecast[0] || null,
  };
};

const readCache = () => {
  const cached = safeStorage.get(CACHE_KEY);
  if (!cached) return null;

  try {
    const parsed = JSON.parse(cached);
    if (!parsed?.timestamp || !parsed?.data) return null;
    if (Date.now() - parsed.timestamp > CACHE_TTL) return null;
    return parsed.data;
  } catch {
    return null;
  }
};

const writeCache = (data) => {
  safeStorage.set(CACHE_KEY, JSON.stringify({ timestamp: Date.now(), data }));
};

const fetchFromProxy = async () => {
  const res = await axiosInstance.get("/weather");
  return res.data?.data || res.data;
};

const fetchFromOpenMeteo = async () => {
  const url = new URL(WEATHER_API);
  url.searchParams.set("latitude", LOCATION.latitude);
  url.searchParams.set("longitude", LOCATION.longitude);
  url.searchParams.set("daily", DAILY_FIELDS);
  url.searchParams.set("timezone", LOCATION.timezone);
  url.searchParams.set("forecast_days", "7");

  const response = await fetch(url.toString());
  if (!response.ok) throw new Error("Không thể tải dữ liệu thời tiết.");
  return response.json();
};

const loadWeather = async () => {
  const cached = readCache();
  if (cached) return cached;

  if (pendingWeatherPromise) return pendingWeatherPromise;

  pendingWeatherPromise = (async () => {
    try {
      const proxyData = await fetchFromProxy();
      const normalized = proxyData?.forecast
        ? proxyData
        : normalizePayload(proxyData);
      writeCache(normalized);
      return normalized;
    } catch {
      const directData = await fetchFromOpenMeteo();
      const normalized = normalizePayload(directData);
      writeCache(normalized);
      return normalized;
    } finally {
      pendingWeatherPromise = null;
    }
  })();

  return pendingWeatherPromise;
};

export const getWeatherCodeInfo = (code) => getWeatherInfo(code);

export const getCurrentWeather = async () => {
  const weather = await loadWeather();
  return weather.current;
};

export const getWeatherOverview = async () => {
  const weather = await loadWeather();
  return weather;
};

export const getWeekForecast = async () => {
  const weather = await loadWeather();
  return weather.forecast || [];
};

export const getAgricultureWarnings = (weatherData = {}) => {
  const forecast = Array.isArray(weatherData.forecast)
    ? weatherData.forecast
    : Array.isArray(weatherData)
      ? weatherData
      : [];

  const safeForecast = forecast.filter(Boolean);

  const warnings = [];
  const pushWarning = (level, message, icon) => {
    if (!message || warnings.some((warning) => warning.message === message))
      return;
    warnings.push({ level, message, icon });
  };

  safeForecast.forEach((day) => {
    const dayLabel = day.dayLabel ? `vào ${day.dayLabel}` : "";
    if ((day.precipitationSum ?? 0) > 50) {
      pushWarning(
        "danger",
        `Mưa lớn ${dayLabel} - Tạm hoãn phun thuốc, kiểm tra thoát nước`.trim(),
        "⚠️",
      );
    }
    if ((day.temperatureMin ?? 999) < 10) {
      pushWarning(
        "warning",
        `Nhiệt độ thấp ${dayLabel} - Che phủ cây con, cà phê, chè non`.trim(),
        "⚠️",
      );
    }
    if ((day.windspeedMax ?? 0) > 40) {
      pushWarning(
        "warning",
        `Gió mạnh ${dayLabel} - Chằng buộc cây, hoãn gieo hạt`.trim(),
        "⚠️",
      );
    }
    if (Number(day.weathercode) === 95) {
      pushWarning(
        "danger",
        `Giông bão ${dayLabel} - Không ra đồng, bảo vệ nông sản`.trim(),
        "🔴",
      );
    }
  });

  for (let index = 0; index <= safeForecast.length - 3; index += 1) {
    const window = safeForecast.slice(index, index + 3);
    const isDryAndHot = window.every(
      (day) =>
        (day.precipitationSum ?? 0) === 0 && (day.temperatureMax ?? 0) > 35,
    );
    if (isDryAndHot) {
      const fromDay = window[0]?.dayLabel ? `từ ${window[0].dayLabel}` : "";
      const toDay = window[2]?.dayLabel ? `đến ${window[2].dayLabel}` : "";
      pushWarning(
        "warning",
        `Nắng hạn kéo dài ${fromDay} ${toDay} - Tăng cường tưới nước`.trim(),
        "⚠️",
      );
      break;
    }
  }

  return warnings;
};

export default {
  getCurrentWeather,
  getWeatherOverview,
  getWeekForecast,
  getAgricultureWarnings,
  getWeatherCodeInfo,
};
