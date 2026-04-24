import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { LuArrowLeft, LuHouse, LuLeaf } from 'react-icons/lu'
import './NotFoundPage.css'

const NotFoundPage = () => {
  const navigate = useNavigate()
  return (
    <div className="not-found">
      <div className="not-found__content">
        <div className="not-found__illustration" aria-hidden="true">
          <LuLeaf />
        </div>
        <h1 className="not-found__code">404</h1>
        <h2 className="not-found__title">Trang không tồn tại</h2>
        <p className="not-found__desc">
          Trang bạn đang tìm kiếm đã bị xóa hoặc chưa bao giờ tồn tại.
        </p>
        <div className="not-found__actions">
          <button className="not-found__btn not-found__btn--ghost" onClick={() => navigate(-1)}>
            <LuArrowLeft aria-hidden="true" />
            Quay lại
          </button>
          <Link to="/" className="not-found__btn not-found__btn--primary">
            <LuHouse aria-hidden="true" />
            Về trang chủ
          </Link>
        </div>
      </div>
    </div>
  )
}

export default NotFoundPage
