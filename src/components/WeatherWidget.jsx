import React, { useEffect, useState } from 'react'
import { LuDroplets, LuMapPin, LuWind } from 'react-icons/lu'
import { getCurrentWeather, getWeekForecast } from '../services/weatherService'
import './WeatherWidget.css'

const formatTemperature = (value) => (value === null || value === undefined ? '--' : `${Math.round(value)}°C`)
const formatRain = (value) => (value === null || value === undefined ? '--' : `${Math.round(value)}mm`)
const formatWind = (value) => (value === null || value === undefined ? '--' : `${Math.round(value)}km/h`)

const WeatherSkeleton = () => (
  <div className="weather-widget weather-widget--skeleton" aria-hidden="true">
    <div className="weather-widget__current weather-widget__current--skeleton">
      <div className="weather-widget__skeleton weather-widget__skeleton--icon" />
      <div className="weather-widget__skeleton-lines">
        <div className="weather-widget__skeleton weather-widget__skeleton--title" />
        <div className="weather-widget__skeleton weather-widget__skeleton--line" />
        <div className="weather-widget__skeleton weather-widget__skeleton--line weather-widget__skeleton--line-short" />
      </div>
    </div>
    <div className="weather-widget__forecast-grid">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="weather-widget__forecast-card weather-widget__forecast-card--skeleton">
          <div className="weather-widget__skeleton weather-widget__skeleton--small" />
          <div className="weather-widget__skeleton weather-widget__skeleton--medium" />
          <div className="weather-widget__skeleton weather-widget__skeleton--small" />
        </div>
      ))}
    </div>
  </div>
)

const WeatherWidget = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [currentWeather, setCurrentWeather] = useState(null)
  const [forecast, setForecast] = useState([])

  useEffect(() => {
    let mounted = true

    const load = async () => {
      setLoading(true)
      setError('')
      try {
        const [current, weekForecast] = await Promise.all([
          getCurrentWeather(),
          getWeekForecast(),
        ])

        if (!mounted) return
        setCurrentWeather(current)
        setForecast(weekForecast.slice(1, 7))
      } catch (err) {
        if (!mounted) return
        setError(err?.message || 'Không thể tải thông tin thời tiết.')
      } finally {
        if (mounted) setLoading(false)
      }
    }

    load()
    return () => { mounted = false }
  }, [])

  if (loading) return <WeatherSkeleton />

  if (error) {
    return (
      <section className="weather-widget weather-widget--error" aria-label="Thời tiết">
        <div className="weather-widget__current">
          <div className="weather-widget__current-main">
            <div className="weather-widget__current-icon">🌦️</div>
            <div>
              <h3 className="weather-widget__title">Thời tiết hôm nay</h3>
              <p className="weather-widget__error-text">{error}. Dữ liệu thời tiết tạm thời không khả dụng.</p>
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (!currentWeather) return null

  return (
    <section className="weather-widget" aria-label="Thời tiết Thuận Châu">
      <div className="weather-widget__current">
        <div className="weather-widget__current-main">
          <div className="weather-widget__current-icon" aria-hidden="true">
            {currentWeather.weatherIcon}
          </div>
          <div className="weather-widget__current-copy">
            <div className="weather-widget__eyebrow">Thời tiết hôm nay</div>
            <h3 className="weather-widget__temperature">
              {formatTemperature(currentWeather.temperatureMax)} / {formatTemperature(currentWeather.temperatureMin)}
            </h3>
            <p className="weather-widget__meta">
              <span>{currentWeather.weatherIcon} {currentWeather.weatherLabel}</span>
              <span><LuDroplets aria-hidden="true" /> Mưa: {formatRain(currentWeather.precipitationSum)}</span>
              <span><LuWind aria-hidden="true" /> Gió: {formatWind(currentWeather.windspeedMax)}</span>
            </p>
            <p className="weather-widget__location">
              <LuMapPin aria-hidden="true" /> Thuận Châu, Sơn La
            </p>
          </div>
        </div>
      </div>

      <div className="weather-widget__forecast-grid">
        {forecast.map((day) => (
          <article key={day.date} className="weather-widget__forecast-card">
            <div className="weather-widget__forecast-day">{day.dayLabel}</div>
            <div className="weather-widget__forecast-icon" aria-hidden="true">{day.weatherIcon}</div>
            <div className="weather-widget__forecast-temp">{formatTemperature(day.temperatureMax)}</div>
            <div className="weather-widget__forecast-label">{day.weatherLabel}</div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default WeatherWidget