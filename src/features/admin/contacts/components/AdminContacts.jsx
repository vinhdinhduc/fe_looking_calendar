import React, { useEffect, useState } from 'react'
import { adminContactService } from '../services/adminContactService'
import { useToast } from '../../../../context/ToastContext'
import Button from '../../../../components/Button/Button'
import PageSizeSelector from '../../../../components/PageSizeSelector/PageSizeSelector'
import Spinner from '../../../../components/Spinner/Spinner'
import Pagination from '../../../../components/Pagination/Pagination'
import '../../AdminTable.css'

const statusLabel = {
  new: 'Mới',
  in_progress: 'Đang xử lý',
  resolved: 'Đã xử lý',
}

const inquiryLabel = {
  technical: 'Kỹ thuật',
  seasonal: 'Thời vụ',
  pest: 'Sâu bệnh',
  fertilizer: 'Phân bón',
  other: 'Khác',
}

const formatDateTime = (value) => {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleString('vi-VN')
}

const AdminContacts = () => {
  const toast = useToast()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')

  const fetchData = async (p = 1, s = search, st = status, l = pageSize) => {
    setLoading(true)
    try {
      const res = await adminContactService.getAll({
        page: p,
        limit: l,
        search: s || undefined,
        status: st || undefined,
      })
      setItems(res.data || [])
      setTotalPages(res.meta?.totalPages || 1)
      setPage(res.meta?.page || p)
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <div className="admin-table-page">
      <div className="admin-table-page__toolbar">
        <form className="admin-table-page__search" onSubmit={(e) => { e.preventDefault(); fetchData(1, search, status) }}>
          <input
            type="search"
            placeholder="Tìm theo tên, SĐT, tiêu đề..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="admin-form__select"
            style={{ minWidth: 160, padding: '9px 12px', fontSize: '0.875rem' }}
            value={status}
            onChange={(e) => {
              setStatus(e.target.value)
              fetchData(1, search, e.target.value)
            }}
          >
            <option value="">Tất cả trạng thái</option>
            <option value="new">Mới</option>
            <option value="in_progress">Đang xử lý</option>
            <option value="resolved">Đã xử lý</option>
          </select>
          <Button type="submit" variant="outline" size="sm">Tìm</Button>
        </form>

        <PageSizeSelector
          value={pageSize}
          onChange={(next) => {
            setPageSize(next)
            fetchData(1, search, status, next)
          }}
        />
      </div>

      <div className="admin-table__wrapper">
        {loading ? <Spinner text="Đang tải yêu cầu liên hệ..." /> : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Người liên hệ</th>
                <th>Nội dung</th>
                <th>Phân loại</th>
                <th>Trạng thái</th>
                <th>Thời gian gửi</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan={5} className="admin-table__empty">Chưa có yêu cầu liên hệ nào</td>
                </tr>
              ) : items.map((item) => (
                <tr key={item.id}>
                  <td style={{ maxWidth: 220 }}>
                    <strong>{item.full_name}</strong>
                    <br />
                    <small style={{ color: 'var(--text-secondary)' }}>{item.phone}</small>
                    {item.email && (
                      <>
                        <br />
                        <small style={{ color: 'var(--text-muted)' }}>{item.email}</small>
                      </>
                    )}
                    {item.address && (
                      <>
                        <br />
                        <small style={{ color: 'var(--text-muted)' }}>{item.address}</small>
                      </>
                    )}
                  </td>
                  <td style={{ maxWidth: 360 }}>
                    <strong style={{ fontSize: '0.9rem' }}>{item.subject}</strong>
                    {item.crop_name && (
                      <>
                        <br />
                        <small style={{ color: 'var(--text-secondary)' }}>Cây: {item.crop_name}</small>
                      </>
                    )}
                    <br />
                    <small style={{ color: 'var(--text-secondary)' }}>
                      {item.message?.length > 120 ? `${item.message.slice(0, 120)}...` : item.message}
                    </small>
                  </td>
                  <td>
                    <span>{inquiryLabel[item.inquiry_type] || inquiryLabel.other}</span>
                    {item.preferred_contact_time && (
                      <>
                        <br />
                        <small style={{ color: 'var(--text-muted)' }}>{item.preferred_contact_time}</small>
                      </>
                    )}
                  </td>
                  <td>
                    <span className={`badge badge--${item.status === 'resolved' ? 'active' : 'inactive'}`}>
                      {statusLabel[item.status] || item.status}
                    </span>
                  </td>
                  <td>{formatDateTime(item.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Pagination page={page} totalPages={totalPages} onPageChange={(p) => fetchData(p)} />
    </div>
  )
}

export default AdminContacts
