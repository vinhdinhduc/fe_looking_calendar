import React, { useEffect, useState } from 'react'
import { LuCircleAlert, LuCloudRain, LuFolderTree, LuLeaf, LuSearch, LuTriangleAlert, LuUsers, LuWind } from 'react-icons/lu'
import { FaChartLine } from 'react-icons/fa6'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend,
} from 'recharts'
import useStats from '../hooks/useStats'
import Spinner from '../../../../components/Spinner/Spinner'
import { getAgricultureWarnings, getCurrentWeather, getWeekForecast } from '../../../../services/weatherService'
import './DashboardStats.css'

const STAT_CARDS = [
  { key: 'totalPlants',     label: 'Cây trồng',    icon: LuLeaf, color: 'green' },
  { key: 'totalCategories', label: 'Nhóm cây',     icon: LuFolderTree, color: 'blue'  },
  { key: 'totalUsers',      label: 'Người dùng',   icon: LuUsers, color: 'amber' },
  { key: 'totalSearches',   label: 'Lượt tìm kiếm', icon: LuSearch, color: 'teal'  },
]

const PIE_COLORS = ['#1e5c38','#2e7d52','#4a7c59','#c8813a','#e67e22','#f0c484','#27ae60']

const formatTemperature = (value) => (Number.isFinite(Number(value)) ? `${Math.round(Number(value))}°C` : '--')
const formatRain = (value) => (Number.isFinite(Number(value)) ? `${Math.round(Number(value) * 10) / 10} mm` : '--')
const formatWind = (value) => (Number.isFinite(Number(value)) ? `${Math.round(Number(value))} km/h` : '--')

const DashboardStats = () => {
  const { dashboard, topPlants, topKeywords, activity, byCategory, loading, error } = useStats()
  const [currentWeather, setCurrentWeather] = useState(null)
  const [weekForecast, setWeekForecast] = useState([])
  const [weatherWarnings, setWeatherWarnings] = useState([])
  const [weatherError, setWeatherError] = useState('')

  useEffect(() => {
    let mounted = true

    const loadWeather = async () => {
      try {
        const [current, forecast] = await Promise.all([
          getCurrentWeather(),
          getWeekForecast(),
        ])

        if (!mounted) return

        setCurrentWeather(current || null)
        setWeekForecast(forecast || [])
        setWeatherWarnings(getAgricultureWarnings({ forecast: [current, ...(forecast || []).slice(1)] }))
      } catch (err) {
        if (!mounted) return
        setWeatherError(err?.message || 'Không thể tải dữ liệu thời tiết.')
      }
    }

    loadWeather()
    return () => { mounted = false }
  }, [])

  if (loading) return <Spinner size="lg" text="Đang tải thống kê..." />
  if (error) {
    return (
      <div className="dashboard-stats__error">
        <LuCircleAlert aria-hidden="true" />
        {error}
      </div>
    )
  }

  return (
    <div className="dashboard-stats">
      <section className="weather-panel" aria-label="Thông tin thời tiết nông nghiệp">
        <div className="weather-panel__header">
          <h3 className="weather-panel__title">
            <LuCloudRain aria-hidden="true" />
            Thời tiết nông nghiệp
          </h3>
          {currentWeather?.dayLabel && (
            <span className="weather-panel__subtitle">Hôm nay ({currentWeather.dayLabel})</span>
          )}
        </div>

        {weatherError ? (
          <p className="weather-panel__error">{weatherError}</p>
        ) : (
          <>
            <div className="weather-panel__current">
              <span className="weather-panel__icon" aria-hidden="true">{currentWeather?.weatherIcon || '🌤️'}</span>
              <div className="weather-panel__current-info">
                <p className="weather-panel__label">{currentWeather?.weatherLabel || 'Đang cập nhật'}</p>
                <p className="weather-panel__temp">{formatTemperature(currentWeather?.temperatureMax)} / {formatTemperature(currentWeather?.temperatureMin)}</p>
              </div>
              <div className="weather-panel__meta">
                <span>
                  <LuCloudRain aria-hidden="true" />
                  {formatRain(currentWeather?.precipitationSum)}
                </span>
                <span>
                  <LuWind aria-hidden="true" />
                  {formatWind(currentWeather?.windspeedMax)}
                </span>
              </div>
            </div>

            <div className="weather-panel__forecast">
              {(weekForecast || []).slice(0, 4).map((day) => (
                <div key={day.date} className="weather-panel__forecast-item">
                  <span className="weather-panel__forecast-day">{day.dayLabel || '—'}</span>
                  <span className="weather-panel__forecast-icon" aria-hidden="true">{day.weatherIcon || '🌤️'}</span>
                  <span className="weather-panel__forecast-temp">{formatTemperature(day.temperatureMax)}</span>
                </div>
              ))}
            </div>

            {weatherWarnings.length > 0 && (
              <div className="weather-panel__warnings">
                {weatherWarnings.slice(0, 3).map((warning, index) => (
                  <p key={`${warning.message}-${index}`} className={`weather-panel__warning weather-panel__warning--${warning.level}`}>
                    <LuTriangleAlert aria-hidden="true" />
                    {warning.message}
                  </p>
                ))}
              </div>
            )}
          </>
        )}
      </section>

      {/* KPI Cards */}
      <div className="dashboard-stats__cards">
        {STAT_CARDS.map(({ key, label, icon: Icon, color }) => (
          <div key={key} className={`stat-card stat-card--${color}`}>
            <div className="stat-card__icon"><Icon aria-hidden="true" /></div>
            <div className="stat-card__info">
              <span className="stat-card__value">{dashboard?.[key] ?? '—'}</span>
              <span className="stat-card__label">{label}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-stats__charts">
        {/* Search Activity Line Chart */}
        <div className="chart-card">
          <h3 className="chart-card__title">
            <FaChartLine aria-hidden="true" />
            Lượt tìm kiếm 30 ngày gần nhất
          </h3>
          {activity.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={activity} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} tickFormatter={(v) => v?.slice(5)} />
                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                <Tooltip
                  formatter={(v) => [v, 'Lượt tìm']}
                  labelFormatter={(l) => `Ngày ${l}`}
                />
                <Line type="monotone" dataKey="count" stroke="#1e5c38" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : <p className="chart-card__empty">Chưa có dữ liệu</p>}
        </div>

        {/* Top Plants Bar Chart */}
        <div className="chart-card">
          <h3 className="chart-card__title">
            <LuLeaf aria-hidden="true" />
            Top cây trồng được xem nhiều nhất
          </h3>
          {topPlants.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={topPlants} layout="vertical" margin={{ top: 5, right: 20, left: 60, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis type="number" tick={{ fontSize: 11 }} allowDecimals={false} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={60} />
                <Tooltip formatter={(v) => [v, 'Lượt xem']} />
                <Bar dataKey="view_count" fill="#1e5c38" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : <p className="chart-card__empty">Chưa có dữ liệu</p>}
        </div>

        {/* Plants by Category Pie */}
        <div className="chart-card">
          <h3 className="chart-card__title">
            <LuFolderTree aria-hidden="true" />
            Phân bổ cây theo nhóm
          </h3>
          {byCategory.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={byCategory} dataKey="plant_count" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {byCategory.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => [v, 'Số cây']} />
              </PieChart>
            </ResponsiveContainer>
          ) : <p className="chart-card__empty">Chưa có dữ liệu</p>}
        </div>

        {/* Top Keywords */}
        <div className="chart-card">
          <h3 className="chart-card__title">
            <LuSearch aria-hidden="true" />
            Từ khóa tìm kiếm phổ biến
          </h3>
          {topKeywords.length > 0 ? (
            <div className="keyword-cloud">
              {topKeywords.map((kw, i) => (
                <span key={i} className="keyword-cloud__tag" style={{ fontSize: `${Math.max(0.75, Math.min(1.4, 0.75 + (kw.count / topKeywords[0].count) * 0.65))}rem` }}>
                  {kw.keyword}
                  <sup>{kw.count}</sup>
                </span>
              ))}
            </div>
          ) : <p className="chart-card__empty">Chưa có từ khóa nào</p>}
        </div>
      </div>
    </div>
  )
}

export default DashboardStats
