import React, { useState, useEffect } from 'react'
import { adminCategoryService } from '../services/adminCategoryService'
import { useToast } from '../../../../context/ToastContext'
import Button from '../../../../components/Button/Button'
import PageSizeSelector from '../../../../components/PageSizeSelector/PageSizeSelector'
import Modal from '../../../../components/Modal/Modal'
import Pagination from '../../../../components/Pagination/Pagination'
import Spinner from '../../../../components/Spinner/Spinner'
import '../../AdminTable.css'

const EMPTY = { name: '', description: '', icon_url: '', is_active: 1 }

const validate = (f) => {
  const e = {}
  if (!f.name?.trim()) e.name = 'Tên nhóm là bắt buộc'
  return e
}

const CategoryForm = ({ initial, onSave, onCancel, saving }) => {
  const [form, setForm]   = useState(initial || EMPTY)
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
      <div className="admin-form__field">
        <label className="admin-form__label admin-form__label--required">Tên nhóm cây</label>
        <input className={`admin-form__input ${errors.name ? 'admin-form__input--error' : ''}`}
          value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Cây lương thực, Cây ăn quả..." />
        {errors.name && <span className="admin-form__error-msg">{errors.name}</span>}
      </div>

      <div className="admin-form__field">
        <label className="admin-form__label">Mô tả</label>
        <textarea className="admin-form__textarea" rows={3} value={form.description}
          onChange={(e) => set('description', e.target.value)} placeholder="Mô tả về nhóm cây..." />
      </div>

      <div className="admin-form__row">
        <div className="admin-form__field">
          <label className="admin-form__label">URL biểu tượng (icon)</label>
          <input className="admin-form__input" value={form.icon_url}
            onChange={(e) => set('icon_url', e.target.value)} placeholder="https://..." />
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

      <div className="admin-form__actions">
        <Button variant="ghost" onClick={onCancel} type="button">Hủy</Button>
        <Button variant="primary" type="submit" loading={saving}>
          {initial ? 'Cập nhật' : 'Thêm nhóm cây'}
        </Button>
      </div>
    </form>
  )
}

const AdminCategories = () => {
  const toast = useToast()
  const [categories, setCategories] = useState([])
  const [loading, setLoading]       = useState(true)
  const [saving, setSaving]         = useState(false)
  const [modalOpen, setModalOpen]   = useState(false)
  const [editing, setEditing]       = useState(null)
  const [page, setPage]             = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [pageSize, setPageSize]     = useState(10)
  const [total, setTotal]           = useState(0)

  const fetchAll = async (p = 1, l = pageSize) => {
    setLoading(true)
    try {
      const res = await adminCategoryService.getAll({ page: p, limit: l })
      setCategories(res.data || [])
      setTotalPages(res.meta?.totalPages || 1)
      setTotal(res.meta?.total || 0)
      setPage(res.meta?.page || p)
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message)
    } finally { setLoading(false) }
  }

  useEffect(() => { fetchAll() }, [])

  const openCreate = () => { setEditing(null); setModalOpen(true) }
  const openEdit   = (cat) => { setEditing(cat); setModalOpen(true) }
  const closeModal = () => { setModalOpen(false); setEditing(null) }

  const handleSave = async (data) => {
    setSaving(true)
    try {
      if (editing) {
        await adminCategoryService.update(editing.id, data)
        toast.success('Cập nhật nhóm cây thành công!')
      } else {
        await adminCategoryService.create(data)
        toast.success('Thêm nhóm cây thành công!')
      }
      closeModal()
      fetchAll(page)
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message)
    } finally { setSaving(false) }
  }

  const handleDelete = async (cat) => {
    if (!window.confirm(`Xóa nhóm "${cat.name}"?`)) return
    try {
      await adminCategoryService.remove(cat.id)
      toast.success('Đã xóa nhóm cây!')
      if (categories.length === 1 && page > 1) fetchAll(page - 1)
      else fetchAll(page)
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message)
    }
  }

  return (
    <div className="admin-table-page">
      <div className="admin-table-page__toolbar">
        <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{total} nhóm cây</span>
        <PageSizeSelector
          value={pageSize}
          onChange={(next) => {
            setPageSize(next)
            fetchAll(1, next)
          }}
        />
        <Button variant="primary" onClick={openCreate}>+ Thêm nhóm cây</Button>
      </div>

      <div className="admin-table__wrapper">
        {loading ? <Spinner text="Đang tải..." /> : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Tên nhóm</th>
                <th>Mô tả</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {categories.length === 0 ? (
                <tr><td colSpan={4} className="admin-table__empty">Chưa có nhóm cây nào</td></tr>
              ) : categories.map((cat) => (
                <tr key={cat.id}>
                  <td><strong>{cat.name}</strong></td>
                  <td style={{ maxWidth: 280, color: 'var(--text-secondary)' }}>
                    {cat.description || '—'}
                  </td>
                  <td>
                    <span className={`badge badge--${cat.is_active ? 'active' : 'inactive'}`}>
                      {cat.is_active ? 'Hiển thị' : 'Ẩn'}
                    </span>
                  </td>
                  <td>
                    <div className="admin-table__actions">
                      <button className="admin-table__action-btn admin-table__action-btn--edit" onClick={() => openEdit(cat)}>Sửa</button>
                      <button className="admin-table__action-btn admin-table__action-btn--delete" onClick={() => handleDelete(cat)}>Xóa</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Pagination page={page} totalPages={totalPages} onPageChange={(p) => fetchAll(p)} />

      <Modal isOpen={modalOpen} onClose={closeModal} title={editing ? 'Sửa nhóm cây' : 'Thêm nhóm cây mới'} size="md">
        <CategoryForm initial={editing} onSave={handleSave} onCancel={closeModal} saving={saving} />
      </Modal>
    </div>
  )
}

export default AdminCategories
