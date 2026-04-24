import React, { useState } from 'react'
import { FaDroplet, FaWheatAwn } from 'react-icons/fa6'
import { GiSpade } from 'react-icons/gi'
import { LuClipboardList, LuFileText, LuImage, LuLeaf, LuPackage, LuShieldCheck, LuSprout, LuTimer, LuWrench } from 'react-icons/lu'
import './CareStages.css'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

const STAGE_ICONS = {
  'lam_dat':      GiSpade,
  'gieo_hat':     LuSprout,
  'cham_soc':     FaDroplet,
  'phong_tru':    LuShieldCheck,
  'thu_hoach':    FaWheatAwn,
  'bao_quan':     LuPackage,
}

const getIcon = (name = '') => {
  const lower = name.toLowerCase()
  if (lower.includes('đất') || lower.includes('dat'))      return STAGE_ICONS.lam_dat
  if (lower.includes('gieo') || lower.includes('hạt'))    return STAGE_ICONS.gieo_hat
  if (lower.includes('tưới') || lower.includes('tuoi'))   return STAGE_ICONS.cham_soc
  if (lower.includes('sâu') || lower.includes('bệnh'))    return STAGE_ICONS.phong_tru
  if (lower.includes('thu hoạch'))                        return STAGE_ICONS.thu_hoach
  if (lower.includes('bảo quản'))                         return STAGE_ICONS.bao_quan
  if (lower.includes('bón') || lower.includes('phân'))    return LuLeaf
  return LuClipboardList
}

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
  const ActiveIcon = getIcon(active.stage_name)
  const durationText = active.duration || (active.duration_days ? `${active.duration_days} ngày` : active.time_period)
  const techniquesText = active.fertilizer_guide || active.techniques
  const notesText = active.pest_control || active.notes

  return (
    <div className="care-stages">
      {/* Tab navigation */}
      <div className="care-stages__tabs" role="tablist" aria-label="Giai đoạn chăm sóc">
        {stages.map((s, i) => {
          const Icon = getIcon(s.stage_name)
          return (
            <button
              key={s.id}
              role="tab"
              aria-selected={i === activeIdx}
              className={`care-stages__tab ${i === activeIdx ? 'care-stages__tab--active' : ''}`}
              onClick={() => setActiveIdx(i)}
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
                <img
                  key={img.id}
                  src={`${BASE_URL}${img.image_url}`}
                  alt={img.caption || active.stage_name}
                  className="care-stages__image"
                  loading="lazy"
                  onError={(e) => { e.target.style.display = 'none' }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CareStages
