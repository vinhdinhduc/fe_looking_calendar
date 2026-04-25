import React from 'react'
import { getCurrentMonth, MONTH_ABBR } from '../../../utils/formatDate'
import { getStageDisplay, normalizeStageType, STAGE_LEGEND_KEYS } from '../../../constants/stageConfig'
import './CropCalendar.css'

const monthLabel = (month) => `Tháng ${month}`

const GANTT_ACTIVITY_KEYS = [...STAGE_LEGEND_KEYS, 'planting', 'caring', 'harvesting']

const normalizeCalendar = (calendar) => {
  if (Array.isArray(calendar)) {
    return {
      mode: 'legacy',
      entries: calendar,
    }
  }

  if (calendar && Array.isArray(calendar.gantt)) {
    const entries = []
    const seen = new Set()

    for (const monthItem of calendar.gantt) {
      GANTT_ACTIVITY_KEYS.forEach((activity_type) => {
        const normalizedType = normalizeStageType(activity_type)
        const entryKey = `${monthItem?.month}-${normalizedType}`

        if (monthItem?.[activity_type] && !seen.has(entryKey)) {
          seen.add(entryKey)
          entries.push({
            activity_type: normalizedType,
            month: monthItem.month,
            activity_label: getStageDisplay({ stageType: normalizedType, stageName: normalizedType }).label,
            note:
              monthItem.notes?.find((n) => normalizeStageType(n.stage) === normalizedType)?.note || '',
          })
        }
      })
    }

    return {
      mode: 'gantt',
      entries,
    }
  }

  return { mode: 'empty', entries: [] }
}

const CropCalendar = ({ calendar }) => {
  const currentMonth = getCurrentMonth()
  const { entries } = normalizeCalendar(calendar)

  if (entries.length === 0) {
    return (
      <div className="crop-calendar crop-calendar--empty">
        <p>Chưa có dữ liệu lịch thời vụ cho cây này.</p>
      </div>
    )
  }

  // Group by activity type
  const activityTypes = [...new Set(entries.map((c) => c.activity_type))]

  // Build a map: activityType → Set of months
  const activityMap = {}
  const monthSummary = {}
  for (const entry of entries) {
    if (!activityMap[entry.activity_type]) activityMap[entry.activity_type] = new Set()
    activityMap[entry.activity_type].add(entry.month)

    if (!monthSummary[entry.month]) monthSummary[entry.month] = []
    monthSummary[entry.month].push(entry.activity_label || getStageDisplay({ stageType: entry.activity_type, stageName: entry.activity_type }).label)
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
                  title={`Tháng ${i + 1}${monthSummary[i + 1]?.length ? `: ${monthSummary[i + 1].join(', ')}` : ''}`}
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
              const { label, color, icon: Icon } = getStageDisplay({ stageType: type, stageName: type })
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
                    const tooltip = isActive
                      ? `${label} - ${monthLabel(month)}${monthSummary[month]?.length ? `\nCác hoạt động tháng này: ${monthSummary[month].join(', ')}` : ''}`
                      : `${monthLabel(month)} - Không có ${label.toLowerCase()}`
                    return (
                      <td
                        key={month}
                        className={`crop-calendar__cell ${isCurrent ? 'crop-calendar__cell--current' : ''}`}
                        title={tooltip}
                        aria-label={tooltip.replaceAll('\n', ' ')}
                      >
                        {isActive && (
                          <div className="crop-calendar__cell-content">
                            <span
                              className="crop-calendar__bar"
                              style={{ backgroundColor: color }}
                              aria-hidden="true"
                            />
                            <span className="crop-calendar__cell-label" style={{ color }}>
                              {label.replace(' / ', '\n')}
                            </span>
                          </div>
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
          const { label, color, icon: Icon } = getStageDisplay({ stageType: type, stageName: type })
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
