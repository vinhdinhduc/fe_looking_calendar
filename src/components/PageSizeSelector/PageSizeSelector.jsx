import React from 'react'

const DEFAULT_OPTIONS = [10, 20, 50]

const PageSizeSelector = ({
  value,
  onChange,
  label = 'Mỗi trang',
  options = DEFAULT_OPTIONS,
  minWidth = 88,
  className = '',
}) => {
  return (
    <div
      className={className}
      style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}
    >
      <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{label}</span>
      <select
        className="admin-form__select"
        style={{ minWidth }}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      >
        {options.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </div>
  )
}

export default PageSizeSelector