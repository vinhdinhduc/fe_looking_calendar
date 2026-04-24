import React from 'react'
import { Link } from 'react-router-dom'
import { LuArrowRight, LuEye } from 'react-icons/lu'
import './PlantCard.css'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

const PlantCard = ({ plant }) => {
  const imageUrl = plant.image_url
    ? `${BASE_URL}${plant.image_url}`
    : '/placeholder-plant.svg'

  return (
    <Link to={`/plants/${plant.id}`} className="plant-card" aria-label={plant.name}>
      <div className="plant-card__image-wrapper">
        <img
          className="plant-card__image"
          src={imageUrl}
          alt={plant.name}
          loading="lazy"
          onError={(e) => { e.target.src = '/placeholder-plant.svg' }}
        />
        {plant.category && (
          <span className="plant-card__category">{plant.category.name}</span>
        )}
      </div>
      <div className="plant-card__body">
        <h3 className="plant-card__name">{plant.name}</h3>
        {plant.scientific_name && (
          <p className="plant-card__sci">{plant.scientific_name}</p>
        )}
        <p className="plant-card__desc">{plant.description || 'Xem chi tiết về loài cây này...'}</p>
        <div className="plant-card__footer">
          <span className="plant-card__views">
            <LuEye aria-hidden="true" />
            {plant.view_count || 0} lượt xem
          </span>
          <span className="plant-card__arrow">
            Xem chi tiết
            <LuArrowRight aria-hidden="true" />
          </span>
        </div>
      </div>
    </Link>
  )
}

export default PlantCard
