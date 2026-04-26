import React from 'react'
import { LuCircleAlert, LuCircleCheckBig, LuCircleX, LuInfo, LuX } from 'react-icons/lu'
import './Toast.css'

const ICONS = {
  success: LuCircleCheckBig,
  error:   LuCircleX,
  warning: LuCircleAlert,
  info:    LuInfo,
}

const Toast = ({ toasts, onRemove }) => {
  if (!toasts.length) return null

  return (
    <div className="toast-container" role="alert" aria-live="polite" >
      {toasts.map((t) => {
        const Icon = ICONS[t.type] || LuInfo
        return (
          <div key={t.id} className={`toast toast--${t.type}`}>
            <Icon className="toast__icon" aria-hidden="true" />
            <span className="toast__message">{t.message}</span>
            <button className="toast__close" onClick={() => onRemove(t.id)} aria-label="Đóng">
              <LuX aria-hidden="true" />
            </button>
          </div>
        )
      })}
    </div>
  )
}

export default Toast
