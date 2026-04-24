import React, { useState, useEffect } from 'react'
import { LuLeaf } from 'react-icons/lu'
import { categoryService } from '../services/categoryService'
import './CategoryFilter.css'

const CategoryFilter = ({ selected, onChange }) => {
  const [categories, setCategories] = useState([])

  useEffect(() => {
    categoryService.getActiveWithCount().then(setCategories).catch(() => {})
  }, [])

  return (
    <div className="category-filter" role="group" aria-label="Lọc theo nhóm cây">
      <button
        className={`category-filter__btn ${!selected ? 'category-filter__btn--active' : ''}`}
        onClick={() => onChange(null)}
      >
        <LuLeaf aria-hidden="true" />
        Tất cả
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          className={`category-filter__btn ${selected === cat.id ? 'category-filter__btn--active' : ''}`}
          onClick={() => onChange(cat.id)}
        >
          {cat.icon_url && <img src={cat.icon_url} alt="" width={18} height={18} />}
          {cat.name}
          {cat.plant_count !== undefined && (
            <span className="category-filter__count">{cat.plant_count}</span>
          )}
        </button>
      ))}
    </div>
  )
}

export default CategoryFilter
