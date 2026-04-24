import React, { useState, useEffect } from 'react'
import { LuChevronDown, LuChevronUp, LuCircleHelp, LuLightbulb } from 'react-icons/lu'
import { faqService } from '../services/faqService'
import Spinner from '../../../components/Spinner/Spinner'
import Pagination from '../../../components/Pagination/Pagination'
import './FaqList.css'

const FaqItem = ({ faq }) => {
  const [open, setOpen] = useState(false)
  return (
    <div className={`faq-item ${open ? 'faq-item--open' : ''}`}>
      <button
        className="faq-item__question"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <LuCircleHelp className="faq-item__q-icon" aria-hidden="true" />
        <span className="faq-item__q-text">{faq.question}</span>
        {open
          ? <LuChevronUp className="faq-item__chevron" aria-hidden="true" />
          : <LuChevronDown className="faq-item__chevron" aria-hidden="true" />}
      </button>
      {open && (
        <div className="faq-item__answer">
          <LuLightbulb className="faq-item__a-icon" aria-hidden="true" />
          <p>{faq.answer}</p>
        </div>
      )}
    </div>
  )
}

const FaqList = ({ plantId }) => {
  const [faqs, setFaqs]       = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)
  const [page, setPage]       = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [search, setSearch]   = useState('')

  const fetchFaqs = async (p = 1, s = search) => {
    setLoading(true)
    setError(null)
    try {
      const res = await faqService.getAll({ page: p, limit: 10, search: s, plant_id: plantId })
      setFaqs(res.data || [])
      setTotalPages(res.meta?.totalPages || 1)
      setPage(p)
    } catch (err) {
      setError(err?.response?.data?.message || err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchFaqs(1) }, [plantId])

  const handleSearch = (e) => {
    e.preventDefault()
    fetchFaqs(1, search)
  }

  if (loading) return <Spinner text="Đang tải câu hỏi..." />
  if (error) return <p className="faq-list__error">Lỗi: {error}</p>

  return (
    <div className="faq-list">
      <form className="faq-list__search" onSubmit={handleSearch}>
        <input
          type="search"
          className="faq-list__search-input"
          placeholder="Tìm kiếm câu hỏi..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button type="submit" className="faq-list__search-btn">Tìm</button>
      </form>

      {faqs.length === 0 ? (
        <div className="faq-list__empty">
          <p>Không tìm thấy câu hỏi phù hợp.</p>
        </div>
      ) : (
        <div className="faq-list__items">
          {faqs.map((faq) => <FaqItem key={faq.id} faq={faq} />)}
        </div>
      )}

      <Pagination page={page} totalPages={totalPages} onPageChange={(p) => fetchFaqs(p)} />
    </div>
  )
}

export default FaqList
