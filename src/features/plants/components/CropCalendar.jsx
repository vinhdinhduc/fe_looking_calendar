import React from 'react'
import { FaDroplet, FaWheatAwn } from 'react-icons/fa6'
import { GiSpade } from 'react-icons/gi'
import { LuLeaf, LuPackage, LuSprout } from 'react-icons/lu'
import { getCurrentMonth, MONTH_ABBR } from '../../../utils/formatDate'
import './CropCalendar.css'

const ACTIVITY_COLORS = {
  'gieo_trong':  { label: 'Gieo trồng',  color: '#1a8f4b', icon: LuSprout },
  'cham_soc':    { label: 'Chăm sóc',    color: '#1274b6', icon: FaDroplet },
  'thu_hoach':   { label: 'Thu hoạch',   color: '#d07a17', icon: FaWheatAwn },
  'lam_dat':     { label: 'Làm đất',     color: '#7f56d9', icon: GiSpade },
  'bao_quan':    { label: 'Bảo quản',    color: '#be3d2c', icon: LuPackage },
}

const getActivityInfo = (type) =>
  ACTIVITY_COLORS[type] || { label: type, color: '#5f6b7a', icon: LuLeaf }

const CropCalendar = ({ calendar }) => {
  const currentMonth = getCurrentMonth()

  if (!calendar || calendar.length === 0) {
    return (
      <div className="crop-calendar crop-calendar--empty">
        <p>Chưa có dữ liệu lịch thời vụ cho cây này.</p>
      </div>
    )
  }

  // Group by activity type
  const activityTypes = [...new Set(calendar.map((c) => c.activity_type))]

  // Build a map: activityType → Set of months
  const activityMap = {}
  for (const entry of calendar) {
    if (!activityMap[entry.activity_type]) activityMap[entry.activity_type] = new Set()
    activityMap[entry.activity_type].add(entry.month)
  }

  return (
    <div className="crop-calendar">
      <div className="crop-calendar__table-wrapper">
        <table className="crop-calendar__table">
          <thead>
            <tr>
              <th className="crop-calendar__activity-col">Hoạt động</th>
              {MONTH_ABBR.map((m, i) => (
                <th
                  key={i}
                  className={`crop-calendar__month-th ${i + 1 === currentMonth ? 'crop-calendar__month-th--current' : ''}`}
                >
                  {m}
                  {i + 1 === currentMonth && (
                    <span className="crop-calendar__current-dot" aria-label="Tháng hiện tại" />
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {activityTypes.map((type) => {
              const { label, color, icon: Icon } = getActivityInfo(type)
              const months = activityMap[type]

              return (
                <tr key={type} className="crop-calendar__row">
                  <td className="crop-calendar__activity-label">
                    <Icon className="crop-calendar__emoji" aria-hidden="true" />
                    <span className="crop-calendar__label-text">{label}</span>
                  </td>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => {
                    const isActive  = months.has(month)
                    const isCurrent = month === currentMonth
                    return (
                      <td
                        key={month}
                        className={`crop-calendar__cell ${isCurrent ? 'crop-calendar__cell--current' : ''}`}
                      >
                        {isActive && (
                          <span
                            className="crop-calendar__bar"
                            style={{ backgroundColor: color }}
                            title={`${label} tháng ${month}`}
                            aria-label={`${label} tháng ${month}`}
                          />
                        )}
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="crop-calendar__legend">
        {activityTypes.map((type) => {
          const { label, color, icon: Icon } = getActivityInfo(type)
          return (
            <div key={type} className="crop-calendar__legend-item">
              <span className="crop-calendar__legend-color" style={{ backgroundColor: color }} />
              <span className="crop-calendar__legend-label">
                <Icon aria-hidden="true" />
                {label}
              </span>
            </div>
          )
        })}
        <div className="crop-calendar__legend-item">
          <span className="crop-calendar__legend-current" />
          <span>Tháng hiện tại</span>
        </div>
      </div>
    </div>
  )
}

export default CropCalendar
