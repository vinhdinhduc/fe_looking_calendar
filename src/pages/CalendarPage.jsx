import React, { useState, useEffect } from 'react'
import { FaDroplet, FaRegMoon, FaWheatAwn } from 'react-icons/fa6'
import { GiSpade } from 'react-icons/gi'
import { LuArrowRight, LuCalendarDays, LuLeaf, LuPackage, LuShieldCheck, LuSprout, LuTriangleAlert } from 'react-icons/lu'
import MainLayout from '../layouts/MainLayout'
import { plantService } from '../features/plants/services/plantService'
import { getCurrentMonth, MONTHS_VI, MONTH_ABBR } from '../utils/formatDate'
import Spinner from '../components/Spinner/Spinner'
import { Link } from 'react-router-dom'
import './CalendarPage.css'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

const ACTIVITY_COLORS = {
  'lam_dat':    { color: '#7f56d9', label: 'Làm đất',    icon: GiSpade },
  'gieo_trong': { color: '#1a8f4b', label: 'Gieo trồng', icon: LuSprout },
  'cham_soc':   { color: '#1274b6', label: 'Chăm sóc',   icon: FaDroplet },
  'phong_tru':  { color: '#be3d2c', label: 'Phòng trừ',  icon: LuShieldCheck },
  'thu_hoach':  { color: '#d07a17', label: 'Thu hoạch',  icon: FaWheatAwn },
  'bao_quan':   { color: '#5f6b7a', label: 'Bảo quản',   icon: LuPackage },
}

const CalendarPage = () => {
  const currentMonth = getCurrentMonth()
  const [selectedMonth, setSelectedMonth] = useState(currentMonth)
  const [plants, setPlants]   = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await plantService.getSuggestions(selectedMonth)
        setPlants(data || [])
      } catch (err) {
        setError(err?.response?.data?.message || err.message)
      } finally { setLoading(false) }
    }
    load()
  }, [selectedMonth])

  return (
    <MainLayout>
      <div className="calendar-page">
        {/* Hero */}
        <div className="calendar-page__hero">
          <div className="container">
            <h1 className="calendar-page__title">
              <LuCalendarDays aria-hidden="true" />
              Lịch thời vụ
            </h1>
            <p className="calendar-page__sub">Xem hoạt động nông nghiệp theo từng tháng trong năm</p>
          </div>
        </div>

        <div className="container calendar-page__body">
          {/* Month Selector */}
          <div className="calendar-page__months">
            {MONTH_ABBR.map((m, i) => {
              const mn = i + 1
              return (
                <button
                  key={mn}
                  className={`calendar-page__month-btn ${mn === selectedMonth ? 'calendar-page__month-btn--active' : ''} ${mn === currentMonth ? 'calendar-page__month-btn--current' : ''}`}
                  onClick={() => setSelectedMonth(mn)}
                  aria-label={MONTHS_VI[i]}
                >
                  {m}
                  {mn === currentMonth && <span className="calendar-page__current-dot" />}
                </button>
              )
            })}
          </div>

          <div className="calendar-page__month-label">
            <h2>{MONTHS_VI[selectedMonth - 1]}{selectedMonth === currentMonth ? ' (Tháng hiện tại)' : ''}</h2>
          </div>

          {/* Legend */}
          <div className="calendar-page__legend">
            {Object.entries(ACTIVITY_COLORS).map(([key, { color, label, icon: Icon }]) => (
              <div key={key} className="calendar-page__legend-item">
                <span className="calendar-page__legend-dot" style={{ background: color }} />
                <span className="calendar-page__legend-text">
                  <Icon aria-hidden="true" />
                  {label}
                </span>
              </div>
            ))}
          </div>

          {/* Plant cards */}
          {loading ? (
            <Spinner text="Đang tải lịch..." />
          ) : error ? (
            <div className="calendar-page__error">
              <LuTriangleAlert aria-hidden="true" />
              {error}
            </div>
          ) : plants.length === 0 ? (
            <div className="calendar-page__empty">
              <div className="calendar-page__empty-icon" aria-hidden="true">
                <FaRegMoon />
              </div>
              <p>Không có hoạt động nông nghiệp đặc biệt trong tháng này.</p>
            </div>
          ) : (
            <div className="calendar-page__plants">
              {plants.map((plant) => {
                const activities = (plant.activity_types || '')
                  .split(',').map((a) => a.trim()).filter(Boolean)
                return (
                  <Link key={plant.id} to={`/plants/${plant.id}`} className="calendar-plant-card">
                    <div className="calendar-plant-card__img">
                      <img
                        src={plant.image_url ? `${BASE_URL}${plant.image_url}` : '/placeholder-plant.svg'}
                        alt={plant.name}
                        onError={(e) => { e.target.src = '/placeholder-plant.svg' }}
                      />
                    </div>
                    <div className="calendar-plant-card__body">
                      <h3 className="calendar-plant-card__name">{plant.name}</h3>
                      {plant.category && (
                        <span className="calendar-plant-card__cat">{plant.category}</span>
                      )}
                      <div className="calendar-plant-card__activities">
                        {activities.map((act) => {
                          const info = ACTIVITY_COLORS[act] || { color: '#5f6b7a', icon: LuLeaf, label: act }
                          const Icon = info.icon
                          return (
                            <span
                              key={act}
                              className="calendar-plant-card__activity"
                              style={{ background: info.color + '20', color: info.color, borderColor: info.color + '60' }}
                            >
                              <Icon aria-hidden="true" />
                              {info.label}
                            </span>
                          )
                        })}
                      </div>
                    </div>
                    <LuArrowRight className="calendar-plant-card__arrow" aria-hidden="true" />
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  )
}

export default CalendarPage
