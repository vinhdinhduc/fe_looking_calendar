import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { LuArrowLeft, LuCalendarDays, LuCircleHelp, LuClipboardList, LuEye, LuFlaskConical, LuLeaf, LuShovel, LuTriangleAlert, LuWrench } from 'react-icons/lu'
import MainLayout from '../layouts/MainLayout'
import { usePlantDetail, CropCalendar, CareStages } from '../features/plants'
import { FaqList } from '../features/faqs'
import Spinner from '../components/Spinner/Spinner'
import './PlantDetailPage.css'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

const TABS = [
  { id: 'overview',  label: 'Tổng quan', Icon: LuClipboardList },
  { id: 'calendar',  label: 'Lịch thời vụ', Icon: LuCalendarDays },
  { id: 'care',      label: 'Kỹ thuật chăm sóc', Icon: LuWrench },
  { id: 'faq',       label: 'Hỏi & Đáp', Icon: LuCircleHelp },
]

const PlantDetailPage = () => {
  const { id }   = useParams()
  const [tab, setTab] = useState('overview')
  const { plant, calendar, stages, loading, error } = usePlantDetail(id)

  if (loading) return <MainLayout><Spinner size="lg" text="Đang tải thông tin cây trồng..." /></MainLayout>

  if (error || !plant) {
    return (
      <MainLayout>
        <div className="plant-detail-page__error">
          <p>
            <LuTriangleAlert aria-hidden="true" />
            {error || 'Không tìm thấy cây trồng'}
          </p>
          <Link to="/plants" className="plant-detail-page__back">
            <LuArrowLeft aria-hidden="true" />
            Quay lại danh sách
          </Link>
        </div>
      </MainLayout>
    )
  }

  const imageUrl = plant.image_url ? `${BASE_URL}${plant.image_url}` : null

  return (
    <MainLayout>
      <div className="plant-detail-page">
        {/* Breadcrumb */}
        <div className="container plant-detail-page__breadcrumb">
          <Link to="/">Trang chủ</Link>
          <span>›</span>
          <Link to="/plants">Cây trồng</Link>
          <span>›</span>
          <span>{plant.name}</span>
        </div>

        {/* Hero */}
        <div className="plant-detail-page__hero">
          {imageUrl && (
            <div className="plant-detail-page__hero-image">
              <img src={imageUrl} alt={plant.name} onError={(e) => { e.target.parentElement.style.display = 'none' }} />
            </div>
          )}
          <div className="container plant-detail-page__hero-content">
            {plant.category && (
              <span className="plant-detail-page__category">{plant.category.name}</span>
            )}
            <h1 className="plant-detail-page__title">{plant.name}</h1>
            {plant.scientific_name && (
              <p className="plant-detail-page__sci">
                <LuFlaskConical aria-hidden="true" />
                {plant.scientific_name}
              </p>
            )}
            <p className="plant-detail-page__views">
              <LuEye aria-hidden="true" />
              {plant.view_count || 0} lượt xem
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="plant-detail-page__tabs-bar">
          <div className="container">
            <div className="plant-detail-page__tabs" role="tablist">
              {TABS.map(({ id: tid, label, Icon }) => (
                <button
                  key={tid}
                  role="tab"
                  aria-selected={tab === tid}
                  className={`plant-detail-page__tab ${tab === tid ? 'plant-detail-page__tab--active' : ''}`}
                  onClick={() => setTab(tid)}
                >
                  <Icon aria-hidden="true" />
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="container plant-detail-page__content">
          {tab === 'overview' && (
            <div className="plant-detail-page__overview">
              <div className="plant-detail-page__section">
                <h2>Mô tả</h2>
                <p>{plant.description || 'Chưa có mô tả.'}</p>
              </div>
              {plant.soil_condition && (
                <div className="plant-detail-page__section">
                  <h2>
                    <LuShovel aria-hidden="true" />
                    Điều kiện đất đai
                  </h2>
                  <p>{plant.soil_condition}</p>
                </div>
              )}
              {plant.weather_condition && (
                <div className="plant-detail-page__section">
                  <h2>☁ Điều kiện thời tiết</h2>
                  <p>{plant.weather_condition}</p>
                </div>
              )}
              {plant.local_varieties && (
                <div className="plant-detail-page__section">
                  <h2>
                    <LuLeaf aria-hidden="true" />
                    Giống phổ biến tại địa phương
                  </h2>
                  <p>{plant.local_varieties}</p>
                </div>
              )}
            </div>
          )}

          {tab === 'calendar' && (
            <div className="plant-detail-page__section">
              <h2>
                <LuCalendarDays aria-hidden="true" />
                Lịch thời vụ theo tháng
              </h2>
              <CropCalendar calendar={calendar} />
            </div>
          )}

          {tab === 'care' && (
            <div className="plant-detail-page__section">
              <h2>
                <LuWrench aria-hidden="true" />
                Các giai đoạn chăm sóc
              </h2>
              <CareStages stages={stages} />
            </div>
          )}

          {tab === 'faq' && (
            <div className="plant-detail-page__section">
              <h2>
                <LuCircleHelp aria-hidden="true" />
                Câu hỏi thường gặp
              </h2>
              <FaqList plantId={id} />
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  )
}

export default PlantDetailPage
