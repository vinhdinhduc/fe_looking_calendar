import React, { useState, useRef } from 'react'
import { LuSearch, LuX } from 'react-icons/lu'
import './PlantSearch.css'

const PlantSearch = ({ value, onChange, onSearch }) => {
  const [focused, setFocused] = useState(false)
  const inputRef = useRef(null)

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') onSearch?.(value)
  }

  const handleClear = () => {
    onChange('')
    onSearch?.('')
    inputRef.current?.focus()
  }

  return (
    <div className={`plant-search ${focused ? 'plant-search--focused' : ''}`}>
      <LuSearch className="plant-search__icon" aria-hidden="true" />
      <input
        ref={inputRef}
        type="search"
        className="plant-search__input"
        placeholder="Tìm kiếm cây trồng... (ngô, lúa, cà phê...)"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        aria-label="Tìm kiếm cây trồng"
      />
      {value && (
        <button className="plant-search__clear" onClick={handleClear} aria-label="Xóa tìm kiếm">
          <LuX aria-hidden="true" />
        </button>
      )}
      <button
        className="plant-search__btn"
        onClick={() => onSearch?.(value)}
        aria-label="Tìm kiếm"
      >
        Tìm
      </button>
    </div>
  )
}

export default PlantSearch
