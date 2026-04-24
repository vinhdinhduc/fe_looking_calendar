import React from 'react'
import { Link } from 'react-router-dom'
import { FaWheatAwn } from 'react-icons/fa6'
import { LuArrowRight, LuCalendarDays, LuCircleHelp, LuLeaf, LuWrench } from 'react-icons/lu'
import WeatherWidget from '../components/WeatherWidget'
import { SuggestionBanner } from '../features/plants'
import MainLayout from '../layouts/MainLayout'
import './HomePage.css'

const FEATURE_CARDS = [
  {
    icon: LuLeaf,
    tone: 'leaf',
    title: 'Tra cứu Cây trồng',
    desc: 'Tìm kiếm thông tin chi tiết về các loại cây trồng phổ biến tại Thuận Châu.',
    to: '/plants',
    cta: 'Xem cây trồng',
  },
  {
    icon: LuCalendarDays,
    tone: 'calendar',
    title: 'Lịch Thời vụ',
    desc: 'Xem lịch canh tác theo từng tháng để gieo trồng và thu hoạch đúng mùa vụ.',
    to: '/calendar',
    cta: 'Xem lịch',
  },
  {
    icon: LuWrench,
    tone: 'care',
    title: 'Kỹ thuật Chăm sóc',
    desc: 'Hướng dẫn kỹ thuật từng giai đoạn: làm đất, bón phân, phòng trừ sâu bệnh.',
    to: '/plants',
    cta: 'Xem kỹ thuật',
  },
  {
    icon: LuCircleHelp,
    tone: 'faq',
    title: 'Hỏi & Đáp',
    desc: 'Câu hỏi thường gặp về canh tác, giống cây và kỹ thuật nông nghiệp địa phương.',
    to: '/faqs',
    cta: 'Xem câu hỏi',
  },
]

const HomePage = () => {
  return (
    <MainLayout>
      {/* Hero */}
      <section className="home-hero">
        <div className="container home-hero__inner">
          <div className="home-hero__content">
            <span className="home-hero__badge">
              <FaWheatAwn aria-hidden="true" />
              Sơn La - Thuận Châu
            </span>
            <h1 className="home-hero__title">
              Tra cứu Lịch thời vụ<br />
              <span className="home-hero__title-accent">& Kỹ thuật Nông nghiệp</span>
            </h1>
            <p className="home-hero__desc">
              Hệ thống thông tin nông nghiệp cộng đồng dành cho bà con xã Thuận Châu.
              Tìm kiếm thông tin cây trồng, lịch canh tác và kỹ thuật chăm sóc ngay bây giờ.
            </p>
            <div className="home-hero__actions">
              <Link to="/plants" className="home-hero__btn home-hero__btn--primary">
                <LuLeaf aria-hidden="true" />
                Tra cứu cây trồng
              </Link>
              <Link to="/calendar" className="home-hero__btn home-hero__btn--secondary">
                <LuCalendarDays aria-hidden="true" />
                Xem lịch thời vụ
              </Link>
            </div>
          </div>
          <div className="home-hero__visual" aria-hidden="true">
            <div className="home-hero__illustration">
              <FaWheatAwn />
            </div>
          </div>
        </div>
      </section>

      {/* Month suggestion */}
      <section className="home-section">
        <div className="container">
          <WeatherWidget />
        </div>
      </section>

      {/* Month suggestion */}
      <section className="home-section">
        <div className="container">
          <SuggestionBanner />
        </div>
      </section>

      {/* Feature cards */}
      <section className="home-section home-features">
        <div className="container">
          <div className="home-features__header">
            <h2 className="home-features__title">Tính năng hệ thống</h2>
            <p className="home-features__sub">Công cụ hỗ trợ sản xuất nông nghiệp hiệu quả cho bà con</p>
          </div>
          <div className="home-features__grid">
            {FEATURE_CARDS.map(({ icon: Icon, tone, title, desc, to, cta }) => (
              <Link key={to + title} to={to} className="feature-card">
                <div className={`feature-card__icon feature-card__icon--${tone}`}>
                  <Icon aria-hidden="true" />
                </div>
                <h3 className="feature-card__title">{title}</h3>
                <p className="feature-card__desc">{desc}</p>
                <span className="feature-card__cta">
                  {cta}
                  <LuArrowRight aria-hidden="true" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="home-cta">
        <div className="container home-cta__inner">
          <div>
            <h2 className="home-cta__title">Bắt đầu tra cứu ngay</h2>
            <p className="home-cta__sub">Hàng chục loại cây trồng với đầy đủ thông tin kỹ thuật</p>
          </div>
          <Link to="/plants" className="home-cta__btn">
            Xem tất cả cây trồng
            <LuArrowRight aria-hidden="true" />
          </Link>
        </div>
      </section>
    </MainLayout>
  )
}

export default HomePage
