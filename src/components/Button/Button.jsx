import React from 'react'
import './Button.css'

/**
 * Button – global reusable component
 * variant: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline'
 * size: 'sm' | 'md' | 'lg'
 */
const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  type = 'button',
  onClick,
  className = '',
  ...rest
}) => {
  return (
    <button
      type={type}
      className={`btn btn--${variant} btn--${size} ${loading ? 'btn--loading' : ''} ${className}`}
      disabled={disabled || loading}
      onClick={onClick}
      {...rest}
    >
      {loading && <span className="btn__spinner" aria-hidden="true" />}
      <span className={`btn__label ${loading ? 'btn__label--hidden' : ''}`}>{children}</span>
    </button>
  )
}

export default Button
