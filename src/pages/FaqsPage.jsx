import React from 'react'
import { LuCircleHelp } from 'react-icons/lu'
import MainLayout from '../layouts/MainLayout'
import { FaqList } from '../features/faqs'
import './FaqsPage.css'

const FaqsPage = () => (
  <MainLayout>
    <div className="faqs-page">
      <div className="faqs-page__hero">
        <div className="container">
          <h1 className="faqs-page__title">
            <LuCircleHelp aria-hidden="true" />
            Hỏi &amp; Đáp
          </h1>
          <p className="faqs-page__sub">
            Câu hỏi thường gặp về kỹ thuật canh tác, giống cây trồng và nông nghiệp địa phương
          </p>
        </div>
      </div>
      <div className="container faqs-page__body">
        <FaqList />
      </div>
    </div>
  </MainLayout>
)

export default FaqsPage
