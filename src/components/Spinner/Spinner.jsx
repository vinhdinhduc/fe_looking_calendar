import React from 'react'
import './Spinner.css'

const Spinner = ({ size = 'md', text = 'Đang tải...' }) => (
  <div className={`spinner-wrapper spinner-wrapper--${size}`} role="status" aria-label={text}>
    <div className="spinner">
      <div className="spinner__leaf" />
      <div className="spinner__leaf" />
      <div className="spinner__leaf" />
      <div className="spinner__leaf" />
    </div>
    {text && <p className="spinner__text">{text}</p>}
  </div>
)

export default Spinner
