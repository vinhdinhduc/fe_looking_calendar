import React, { useState } from 'react'
import { LuFileText, LuImage, LuTimer, LuWrench } from 'react-icons/lu'
import { getStageDisplay } from '../../../constants/stageConfig'
import './CareStages.css'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

const CareStages = ({ stages }) => {
  const [activeIdx, setActiveIdx] = useState(0)

  if (!stages || stages.length === 0) {
    return (
      <div className="care-stages care-stages--empty">
        <p>Chưa có dữ liệu kỹ thuật chăm sóc.</p>
      </div>
    )
  }

  const active = stages[activeIdx]
  const activeStage = getStageDisplay({ stageType: active.stage_type, stageName: active.stage_name })
  const ActiveIcon = activeStage.icon
  const durationText = active.duration || (active.duration_days ? `${active.duration_days} ngày` : active.time_period)
  const techniquesText = active.fertilizer_guide || active.techniques
  const notesText = active.pest_control || active.notes

  return (
    <div className="care-stages">
      {/* Tab navigation */}
      <div className="care-stages__tabs" role="tablist" aria-label="Giai đoạn chăm sóc">
        {stages.map((s, i) => {
          const stageDisplay = getStageDisplay({ stageType: s.stage_type, stageName: s.stage_name })
          const Icon = stageDisplay.icon
          return (
            <button
              key={s.id}
              role="tab"
              aria-selected={i === activeIdx}
              className={`care-stages__tab ${i === activeIdx ? 'care-stages__tab--active' : ''}`}
              onClick={() => setActiveIdx(i)}
              style={
                i === activeIdx
                  ? { background: stageDisplay.color, borderColor: stageDisplay.color, color: '#fff' }
                  : { background: stageDisplay.bg, borderColor: `${stageDisplay.color}33`, color: stageDisplay.color }
              }
            >
              <Icon className="care-stages__tab-icon" aria-hidden="true" />
              <span className="care-stages__tab-name">{s.stage_name}</span>
            </button>
          )
        })}
      </div>

      {/* Active stage content */}
      <div className="care-stages__content" role="tabpanel">
        <div className="care-stages__header">
          <ActiveIcon className="care-stages__header-icon" aria-hidden="true" />
          <div>
            <h3 className="care-stages__title">{active.stage_name}</h3>
            <span
              className="care-stages__stage-badge"
              style={{
                background: activeStage.bg,
                color: activeStage.color,
                borderColor: `${activeStage.color}40`,
              }}
            >
              <ActiveIcon aria-hidden="true" />
              {activeStage.label}
            </span>
            {durationText && (
              <p className="care-stages__duration">
                <LuTimer aria-hidden="true" />
                {durationText}
              </p>
            )}
          </div>
        </div>

        {active.description && (
          <div className="care-stages__desc">
            <h4>Mô tả</h4>
            <p>{active.description}</p>
          </div>
        )}

        {techniquesText && (
          <div className="care-stages__section">
            <h4>
              <LuWrench aria-hidden="true" />
              Kỹ thuật thực hiện
            </h4>
            <div className="care-stages__text" dangerouslySetInnerHTML={{ __html: techniquesText.replace(/\n/g, '<br/>') }} />
          </div>
        )}

        {notesText && (
          <div className="care-stages__notes">
            <h4>
              <LuFileText aria-hidden="true" />
              Lưu ý
            </h4>
            <p>{notesText}</p>
          </div>
        )}

        {active.images && active.images.length > 0 && (
          <div className="care-stages__images">
            <h4>
              <LuImage aria-hidden="true" />
              Ảnh minh họa
            </h4>
            <div className="care-stages__image-grid">
              {active.images.map((img) => (
                <figure key={img.id} className="care-stages__image-figure">
                  <img
                    src={`${BASE_URL}${img.image_url}`}
                    alt={img.caption || active.stage_name}
                    className="care-stages__image"
                    loading="lazy"
                    onError={(e) => { e.currentTarget.style.display = 'none' }}
                  />
                  {img.caption && <figcaption className="care-stages__image-caption">{img.caption}</figcaption>}
                </figure>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CareStages
