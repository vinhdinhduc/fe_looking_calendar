import React, { useState, useEffect, useRef } from 'react'
import { adminPlantService } from '../services/adminPlantService'
import { categoryService } from '../../../categories/services/categoryService'
import { useToast } from '../../../../context/ToastContext'
import Button from '../../../../components/Button/Button'
import Modal from '../../../../components/Modal/Modal'
import Pagination from '../../../../components/Pagination/Pagination'
import Spinner from '../../../../components/Spinner/Spinner'
import '../../AdminTable.css'
import './AdminPlants.css'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

const EMPTY_FORM = {
  name: '', scientific_name: '', description: '', soil_condition: '',
  weather_condition: '', local_varieties: '', category_id: '', is_active: 1,
}

const validate = (f) => {
  const e = {}
  if (!f.name?.trim())        e.name = 'Tên cây là bắt buộc'
  if (!f.category_id)         e.category_id = 'Chọn nhóm cây'
  if (!f.description?.trim()) e.description = 'Mô tả là bắt buộc'
  return e
}

const PlantForm = ({ initial, categories, onSave, onCancel, saving }) => {
  const [form, setForm]         = useState(() => initial ? {...initial, category_id: initial.category?.id} : {EMPTY_FORM})
  const [errors, setErrors]     = useState({})
  const [imageFile, setImageFile] = useState(null)

  const [preview, setPreview]   = useState(initial?.image_url ? `${BASE_URL}${initial.image_url}` : null)
 

  const set = (field, val) => {
    setForm((p) => ({ ...p, [field]: val }))
    if (errors[field]) setErrors((p) => ({ ...p, [field]: undefined }))
  }

  const handleImage = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setImageFile(file)
    setPreview(URL.createObjectURL(file))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validate(form)
    if (Object.keys(errs).length) { setErrors(errs); return }
    const fd = new FormData()
    Object.entries(form).forEach(([k, v]) => fd.append(k, v ?? ''))
    if (imageFile) fd.append('image', imageFile)
    onSave(fd)
  }

  return (
    <form className="admin-form" onSubmit={handleSubmit} noValidate>
      <div className="admin-form__row">
        <div className="admin-form__field">
          <label className="admin-form__label admin-form__label--required">Tên cây trồng</label>
          <input className={`admin-form__input ${errors.name ? 'admin-form__input--error' : ''}`}
            value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Ngô, Lúa, Cà phê..." />
          {errors.name && <span className="admin-form__error-msg">{errors.name}</span>}
        </div>
        <div className="admin-form__field">
          <label className="admin-form__label">Tên khoa học</label>
          <input className="admin-form__input" value={form.scientific_name}
            onChange={(e) => set('scientific_name', e.target.value)} placeholder="Zea mays L." />
        </div>
      </div>

      <div className="admin-form__row">
        <div className="admin-form__field">
          <label className="admin-form__label admin-form__label--required">Nhóm cây</label>
          <select className={`admin-form__select ${errors.category_id ? 'admin-form__input--error' : ''}`}
            value={form.category_id} onChange={(e) => set('category_id', e.target.value)}>
            <option value="">-- Chọn nhóm cây --</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          {errors.category_id && <span className="admin-form__error-msg">{errors.category_id}</span>}
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
        <label className="admin-form__label admin-form__label--required">Mô tả</label>
        <textarea className={`admin-form__textarea ${errors.description ? 'admin-form__input--error' : ''}`}
          rows={3} value={form.description} onChange={(e) => set('description', e.target.value)}
          placeholder="Mô tả chung về cây trồng..." />
        {errors.description && <span className="admin-form__error-msg">{errors.description}</span>}
      </div>

      <div className="admin-form__row">
        <div className="admin-form__field">
          <label className="admin-form__label">Điều kiện đất đai</label>
          <textarea className="admin-form__textarea" rows={2} value={form.soil_condition}
            onChange={(e) => set('soil_condition', e.target.value)} placeholder="Đất tơi xốp, thoát nước tốt..." />
        </div>
        <div className="admin-form__field">
          <label className="admin-form__label">Điều kiện thời tiết</label>
          <textarea className="admin-form__textarea" rows={2} value={form.weather_condition}
            onChange={(e) => set('weather_condition', e.target.value)} placeholder="Nhiệt độ 20-30°C, lượng mưa..." />
        </div>
      </div>

      <div className="admin-form__field">
        <label className="admin-form__label">Giống phổ biến tại địa phương</label>
        <input className="admin-form__input" value={form.local_varieties}
          onChange={(e) => set('local_varieties', e.target.value)} placeholder="Ngô nếp, ngô tẻ, ngô lai..." />
      </div>

      <div className="admin-form__field">
        <label className="admin-form__label">Ảnh minh họa</label>
        <input type="file" accept="image/*" onChange={handleImage} className="admin-form__input" />
        {preview && <img src={preview} alt="preview" className="admin-form__image-preview" />}
      </div>

      <div className="admin-form__actions">
        <Button variant="ghost" onClick={onCancel} type="button">Hủy</Button>
        <Button variant="primary" type="submit" loading={saving}>
          {initial ? 'Cập nhật' : 'Thêm cây trồng'}
        </Button>
      </div>
    </form>
  )
}

const AdminPlants = () => {
  const toast = useToast()
  const [plants, setPlants]         = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading]       = useState(true)
  const [saving, setSaving]         = useState(false)
  const [deleting, setDeleting]     = useState(null)
  const [page, setPage]             = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [search, setSearch]         = useState('')
  const [catFilter, setCatFilter]   = useState('')
  const [modalOpen, setModalOpen]   = useState(false)
  const [editing, setEditing]       = useState(null)
  const searchRef = useRef(search)

  const fetchPlants = async (p = page, s = search, cat = catFilter) => {
    setLoading(true)
    try {
      const res = await adminPlantService.getAll({ page: p, limit: 12, search: s, category_id: cat || undefined })
      setPlants(res.data || [])
      setTotalPages(res.meta?.totalPages || 1)
      setPage(p)
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    categoryService.getActiveWithCount().then(setCategories).catch(() => {})
    fetchPlants()
  }, [])

  const openCreate = () => { setEditing(null); setModalOpen(true) }
  const openEdit   = (plant) => { setEditing(plant) ; console.log("check plant",plant); setModalOpen(true) }
  const closeModal = () => { setModalOpen(false); setEditing(null) }
 
  

  const handleSave = async (fd) => {
    setSaving(true)
    try {
      if (editing) {
        await adminPlantService.update(editing.id, fd)
        toast.success('Cập nhật cây trồng thành công!')
      } else {
        await adminPlantService.create(fd)
        toast.success('Thêm cây trồng thành công!')
      }
      closeModal()
      fetchPlants()
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (plant) => {
    if (!window.confirm(`Xóa cây "${plant.name}"? Hành động không thể hoàn tác!`)) return
    setDeleting(plant.id)
    try {
      await adminPlantService.remove(plant.id)
      toast.success('Đã xóa cây trồng!')
      fetchPlants()
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message)
    } finally {
      setDeleting(null)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    fetchPlants(1, search, catFilter)
  }

  return (
    <div className="admin-table-page">
      <div className="admin-table-page__toolbar">
        <form className="admin-table-page__search" onSubmit={handleSearch}>
          <input
            type="search"
            placeholder="Tìm cây trồng..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="admin-form__select"
            style={{ minWidth: 140, padding: '9px 12px', fontSize: '0.875rem' }}
            value={catFilter}
            onChange={(e) => { setCatFilter(e.target.value); fetchPlants(1, search, e.target.value) }}
          >
            <option value="">Tất cả nhóm</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <Button type="submit" variant="outline" size="sm">Tìm</Button>
        </form>
        <Button variant="primary" onClick={openCreate}>+ Thêm cây trồng</Button>
      </div>

      <div className="admin-table__wrapper">
        {loading ? <Spinner text="Đang tải..." /> : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Ảnh</th>
                <th>Tên cây</th>
                <th>Nhóm cây</th>
                <th>Lượt xem</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {plants.length === 0 ? (
                <tr><td colSpan={6} className="admin-table__empty">Không có dữ liệu</td></tr>
              ) : plants.map((p) => (
                <tr key={p.id}>
                  <td>
                    <img
                      src={p.image_url ? `${BASE_URL}${p.image_url}` : '/placeholder-plant.svg'}
                      alt={p.name}
                      className="admin-plants__thumb"
                      onError={(e) => { e.target.src = '/placeholder-plant.svg' }}
                    />
                  </td>
                  <td>
                    <strong>{p.name}</strong>
                    {p.scientific_name && <br />}
                    {p.scientific_name && <small style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>{p.scientific_name}</small>}
                  </td>
                  <td>{p.category?.name || '—'}</td>
                  <td>{p.view_count ?? 0}</td>
                  <td>
                    <span className={`badge badge--${p.is_active ? 'active' : 'inactive'}`}>
                      {p.is_active ? 'Hiển thị' : 'Ẩn'}
                    </span>
                  </td>
                  <td>
                    <div className="admin-table__actions">
                      <button className="admin-table__action-btn admin-table__action-btn--edit" onClick={() => openEdit(p)}>Sửa</button>
                      <button
                        className="admin-table__action-btn admin-table__action-btn--delete"
                        onClick={() => handleDelete(p)}
                        disabled={deleting === p.id}
                      >{deleting === p.id ? '...' : 'Xóa'}</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Pagination page={page} totalPages={totalPages} onPageChange={(p) => fetchPlants(p)} />

      <Modal isOpen={modalOpen} onClose={closeModal} title={editing ? 'Sửa cây trồng' : 'Thêm cây trồng mới'} size="lg">
        <PlantForm initial={editing} categories={categories} onSave={handleSave} onCancel={closeModal} saving={saving} />
      </Modal>
    </div>
  )
}

export default AdminPlants
