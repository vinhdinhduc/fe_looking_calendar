import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { LuLeaf } from 'react-icons/lu'
import { plantService } from '../services/plantService'
import { getCurrentMonth, MONTHS_VI } from '../../../utils/formatDate'
import { getStageDisplay } from '../../../constants/stageConfig'
import './SuggestionBanner.css'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

const formatActivityTypes = (activityTypes = '') =>
  String(activityTypes)
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean)
    .map((type) => getStageDisplay({ stageType: type, stageName: type }).label)
    .join(', ')

const SuggestionBanner = () => {
  const [plants, setPlants] = useState([])
  const month = getCurrentMonth()

  useEffect(() => {
    plantService.getSuggestions(month, { limit: 6 }).then(setPlants).catch(() => {})
  }, [month])

  if (!plants.length) return null

  return (
    <section className="suggestion-banner">
      <div className="suggestion-banner__header">
        <div className="suggestion-banner__title-group">
          <span className="suggestion-banner__badge">
            <LuLeaf aria-hidden="true" />
            Mùa vụ tháng {month}
          </span>
          <h2 className="suggestion-banner__title">Cây trồng phù hợp trong {MONTHS_VI[month - 1]}</h2>
        </div>
      </div>

      <div className="suggestion-banner__list">
        {plants.map((p) => (
          <Link key={p.id} to={`/plants/${p.id}`} className="suggestion-banner__item">
            <div className="suggestion-banner__item-img">
              <img
                src={p.image_url ? `${BASE_URL}${p.image_url}` : '/placeholder-plant.svg'}
                alt={p.name}
                onError={(e) => { e.target.src = '/placeholder-plant.svg' }}
              />
            </div>
            <div className="suggestion-banner__item-info">
              <span className="suggestion-banner__item-name">{p.name}</span>
              {p.activity_types && (
                <span className="suggestion-banner__item-activity">{formatActivityTypes(p.activity_types)}</span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default SuggestionBanner
