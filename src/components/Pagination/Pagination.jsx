import React from 'react'
import './Pagination.css'

const Pagination = ({ page, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null

  const pages = []
  const delta = 2
  const left  = Math.max(1, page - delta)
  const right = Math.min(totalPages, page + delta)

  if (left > 1) { pages.push(1); if (left > 2) pages.push('...') }
  for (let i = left; i <= right; i++) pages.push(i)
  if (right < totalPages) { if (right < totalPages - 1) pages.push('...'); pages.push(totalPages) }

  return (
    <nav className="pagination" aria-label="Phân trang">
      <button
        className="pagination__btn pagination__btn--prev"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        aria-label="Trang trước"
      >‹</button>

      {pages.map((p, i) =>
        p === '...'
          ? <span key={`dot-${i}`} className="pagination__dots">…</span>
          : <button
              key={p}
              className={`pagination__btn ${p === page ? 'pagination__btn--active' : ''}`}
              onClick={() => onPageChange(p)}
              aria-current={p === page ? 'page' : undefined}
            >{p}</button>
      )}

      <button
        className="pagination__btn pagination__btn--next"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        aria-label="Trang sau"
      >›</button>
    </nav>
  )
}

export default Pagination
