import React, { useState, useEffect } from 'react'
import { adminFaqService } from '../services/adminFaqService'
import { adminPlantService } from '../../plants/services/adminPlantService'
import { useToast } from '../../../../context/ToastContext'
import Button from '../../../../components/Button/Button'
import Modal from '../../../../components/Modal/Modal'
import Spinner from '../../../../components/Spinner/Spinner'
import Pagination from '../../../../components/Pagination/Pagination'
import '../../AdminTable.css'

const EMPTY_FORM = { question: '', answer: '', plant_id: '', is_active: 1 }

const validate = (f) => {
  const e = {}
  if (!f.question?.trim()) e.question = 'Câu hỏi là bắt buộc'
  if (!f.answer?.trim())   e.answer   = 'Câu trả lời là bắt buộc'
  return e
}

const FaqForm = ({ initial, plants, onSave, onCancel, saving }) => {
  const [form, setForm]   = useState(initial || EMPTY_FORM)
  const [errors, setErrors] = useState({})

  const set = (k, v) => {
    setForm((p) => ({ ...p, [k]: v }))
    if (errors[k]) setErrors((p) => ({ ...p, [k]: undefined }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validate(form)
    if (Object.keys(errs).length) { setErrors(errs); return }
    onSave(form)
  }

  return (
    <form className="admin-form" onSubmit={handleSubmit} noValidate>
      <div className="admin-form__row">
        <div className="admin-form__field">
          <label className="admin-form__label">Cây trồng liên quan (tuỳ chọn)</label>
          <select
            className="admin-form__select"
            value={form.plant_id}
            onChange={(e) => set('plant_id', e.target.value)}
          >
            <option value="">-- Câu hỏi chung --</option>
            {plants.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
        <div className="admin-form__field">
          <label className="admin-form__label">Trạng thái</label>
          <select className="admin-form__select" value={form.is_active}
            onChange={(e) => set('is_active', Number(e.target.value))}>
            <option value={1}>Hiển thị</option>
            <option value={0}>Ẩn</option>
          </select>
        </div>
      </div>

      <div className="admin-form__field">
        <label className="admin-form__label admin-form__label--required">Câu hỏi</label>
        <textarea
          className={`admin-form__textarea ${errors.question ? 'admin-form__input--error' : ''}`}
          rows={2}
          value={form.question}
          onChange={(e) => set('question', e.target.value)}
          placeholder="Nhập câu hỏi..."
        />
        {errors.question && <span className="admin-form__error-msg">{errors.question}</span>}
      </div>

      <div className="admin-form__field">
        <label className="admin-form__label admin-form__label--required">Câu trả lời</label>
        <textarea
          className={`admin-form__textarea ${errors.answer ? 'admin-form__input--error' : ''}`}
          rows={5}
          value={form.answer}
          onChange={(e) => set('answer', e.target.value)}
          placeholder="Nhập câu trả lời chi tiết..."
        />
        {errors.answer && <span className="admin-form__error-msg">{errors.answer}</span>}
      </div>

      <div className="admin-form__actions">
        <Button variant="ghost" onClick={onCancel} type="button">Hủy</Button>
        <Button variant="primary" type="submit" loading={saving}>
          {initial ? 'Cập nhật' : 'Thêm câu hỏi'}
        </Button>
      </div>
    </form>
  )
}

const AdminFaqs = () => {
  const toast = useToast()
  const [faqs, setFaqs]         = useState([])
  const [plants, setPlants]     = useState([])
  const [loading, setLoading]   = useState(true)
  const [saving, setSaving]     = useState(false)
  const [page, setPage]         = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [search, setSearch]     = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing]   = useState(null)

  const fetchFaqs = async (p = 1, s = search) => {
    setLoading(true)
    try {
      const res = await adminFaqService.getAll({ page: p, limit: 10, search: s })
      setFaqs(res.data || [])
      setTotalPages(res.meta?.totalPages || 1)
      setPage(p)
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message)
    } finally { setLoading(false) }
  }

  useEffect(() => {
    adminPlantService.getAll({ limit: 200 }).then((r) => setPlants(r.data || [])).catch(() => {})
    fetchFaqs()
  }, [])

  const openCreate = () => { setEditing(null); setModalOpen(true) }
  const openEdit   = (faq) => { setEditing(faq); setModalOpen(true) }
  const closeModal = () => { setModalOpen(false); setEditing(null) }

  const handleSave = async (data) => {
    setSaving(true)
    try {
      if (editing) {
        await adminFaqService.update(editing.id, data)
        toast.success('Cập nhật câu hỏi thành công!')
      } else {
        await adminFaqService.create(data)
        toast.success('Thêm câu hỏi thành công!')
      }
      closeModal()
      fetchFaqs()
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message)
    } finally { setSaving(false) }
  }

  const handleDelete = async (faq) => {
    if (!window.confirm('Xóa câu hỏi này?')) return
    try {
      await adminFaqService.remove(faq.id)
      toast.success('Đã xóa câu hỏi!')
      fetchFaqs()
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message)
    }
  }

  return (
    <div className="admin-table-page">
      <div className="admin-table-page__toolbar">
        <form className="admin-table-page__search" onSubmit={(e) => { e.preventDefault(); fetchFaqs(1, search) }}>
          <input type="search" placeholder="Tìm câu hỏi..." value={search} onChange={(e) => setSearch(e.target.value)} />
          <Button type="submit" variant="outline" size="sm">Tìm</Button>
        </form>
        <Button variant="primary" onClick={openCreate}>+ Thêm câu hỏi</Button>
      </div>

      <div className="admin-table__wrapper">
        {loading ? <Spinner text="Đang tải..." /> : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Câu hỏi</th>
                <th>Câu trả lời</th>
                <th>Cây liên quan</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {faqs.length === 0 ? (
                <tr><td colSpan={5} className="admin-table__empty">Không có câu hỏi nào</td></tr>
              ) : faqs.map((faq) => (
                <tr key={faq.id}>
                  <td style={{ maxWidth: 220 }}>
                    <strong style={{ fontSize: '0.875rem' }}>
                      {faq.question.slice(0, 60)}{faq.question.length > 60 ? '...' : ''}
                    </strong>
                  </td>
                  <td style={{ maxWidth: 260, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                    {faq.answer.slice(0, 80)}{faq.answer.length > 80 ? '...' : ''}
                  </td>
                  <td>{faq.plant?.name || <span style={{ color: 'var(--text-muted)' }}>Chung</span>}</td>
                  <td>
                    <span className={`badge badge--${faq.is_active ? 'active' : 'inactive'}`}>
                      {faq.is_active ? 'Hiển thị' : 'Ẩn'}
                    </span>
                  </td>
                  <td>
                    <div className="admin-table__actions">
                      <button className="admin-table__action-btn admin-table__action-btn--edit" onClick={() => openEdit(faq)}>Sửa</button>
                      <button className="admin-table__action-btn admin-table__action-btn--delete" onClick={() => handleDelete(faq)}>Xóa</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Pagination page={page} totalPages={totalPages} onPageChange={(p) => fetchFaqs(p)} />

      <Modal isOpen={modalOpen} onClose={closeModal} title={editing ? 'Sửa câu hỏi' : 'Thêm câu hỏi mới'} size="lg">
        <FaqForm initial={editing} plants={plants} onSave={handleSave} onCancel={closeModal} saving={saving} />
      </Modal>
    </div>
  )
}

export default AdminFaqs
