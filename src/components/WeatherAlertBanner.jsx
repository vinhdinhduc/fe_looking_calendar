import React from 'react'
import { LuCloudSun, LuTriangleAlert } from 'react-icons/lu'
import './WeatherAlertBanner.css'

const toneClass = (level) => {
  if (level === 'danger') return 'weather-alert-banner--danger'
  if (level === 'warning') return 'weather-alert-banner--warning'
  return 'weather-alert-banner--success'
}

const WeatherAlertBanner = ({ warnings = [], loading = false, error = '' }) => {
  if (loading) {
    return (
      <div className="weather-alert-banner weather-alert-banner--loading" aria-live="polite">
        <span className="weather-alert-banner__icon">⏳</span>
        <div>
          <strong>Đang tải dự báo thời tiết...</strong>
          <p>Vui lòng chờ trong giây lát.</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="weather-alert-banner weather-alert-banner--info" aria-live="polite">
        <span className="weather-alert-banner__icon"><LuTriangleAlert aria-hidden="true" /></span>
        <div>
          <strong>Không tải được dữ liệu thời tiết</strong>
          <p>{error}</p>
        </div>
      </div>
    )
  }

  if (!warnings.length) {
    return (
      <div className="weather-alert-banner weather-alert-banner--success" aria-live="polite">
        <span className="weather-alert-banner__icon"><LuCloudSun aria-hidden="true" /></span>
        <div>
          <strong>Thời tiết thuận lợi để canh tác</strong>
          <p>Tuần này tương đối ổn định, bà con có thể chủ động gieo trồng và chăm sóc.</p>
        </div>
      </div>
    )
  }

  const primaryWarning = warnings[0]

  return (
    <div className={`weather-alert-banner ${toneClass(primaryWarning.level)}`} aria-live="polite">
      <span className="weather-alert-banner__icon">{primaryWarning.icon}</span>
      <div className="weather-alert-banner__content">
        <strong>Dự báo tuần này</strong>
        <p>{primaryWarning.message}</p>
        {warnings.length > 1 && (
          <ul className="weather-alert-banner__list">
            {warnings.slice(1, 3).map((warning) => (
              <li key={warning.message}>{warning.icon} {warning.message}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default WeatherAlertBanner