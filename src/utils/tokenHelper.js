const ACCESS_TOKEN_KEY = "tc_access_token";
const REFRESH_TOKEN_KEY = "tc_refresh_token";
const USER_KEY = "tc_user";
const STORAGE_MODE_KEY = "tc_auth_storage_mode";
const STORAGE_MODES = {
  LOCAL: "local",
  SESSION: "session",
};

const resolveStorage = (remember = true) =>
  remember ? localStorage : sessionStorage;

const resolveActiveStorage = () => {
  const mode = localStorage.getItem(STORAGE_MODE_KEY);
  if (mode === STORAGE_MODES.SESSION) return sessionStorage;
  if (mode === STORAGE_MODES.LOCAL) return localStorage;

  if (sessionStorage.getItem(ACCESS_TOKEN_KEY)) return sessionStorage;
  return localStorage;
};

export const getToken = () => {
  const sessionToken = sessionStorage.getItem(ACCESS_TOKEN_KEY);
  if (sessionToken) return sessionToken;
  return localStorage.getItem(ACCESS_TOKEN_KEY);
};

export const getRefreshToken = () => {
  const sessionToken = sessionStorage.getItem(REFRESH_TOKEN_KEY);
  if (sessionToken) return sessionToken;
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};

export const setToken = (token) => {
  const storage = resolveActiveStorage();
  storage.setItem(ACCESS_TOKEN_KEY, token);
};

export const setTokens = (accessToken, refreshToken, options = {}) => {
  const remember = options.remember !== false;
  const selectedStorage = resolveStorage(remember);
  const otherStorage = remember ? sessionStorage : localStorage;

  selectedStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  selectedStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  otherStorage.removeItem(ACCESS_TOKEN_KEY);
  otherStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.setItem(
    STORAGE_MODE_KEY,
    remember ? STORAGE_MODES.LOCAL : STORAGE_MODES.SESSION,
  );
};

export const clearTokens = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(STORAGE_MODE_KEY);
  sessionStorage.removeItem(ACCESS_TOKEN_KEY);
  sessionStorage.removeItem(REFRESH_TOKEN_KEY);
  sessionStorage.removeItem(USER_KEY);
};

export const saveUser = (user, options = {}) => {
  const remember = options.remember !== false;
  const selectedStorage = resolveStorage(remember);
  const otherStorage = remember ? sessionStorage : localStorage;

  selectedStorage.setItem(USER_KEY, JSON.stringify(user));
  otherStorage.removeItem(USER_KEY);
};

export const getSavedUser = () => {
  try {
    const raw =
      sessionStorage.getItem(USER_KEY) || localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const isTokenPresent = () => !!getToken();
