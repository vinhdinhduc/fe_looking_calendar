import React, { useState, useEffect } from 'react'
import { LuPlus, LuSprout } from 'react-icons/lu'
import { adminCareStageService } from '../services/adminCareStageService'
import { adminPlantService } from '../../plants/services/adminPlantService'
import { useToast } from '../../../../context/ToastContext'
import Button from '../../../../components/Button/Button'
import PageSizeSelector from '../../../../components/PageSizeSelector/PageSizeSelector'
import Modal from '../../../../components/Modal/Modal'
import Pagination from '../../../../components/Pagination/Pagination'
import Spinner from '../../../../components/Spinner/Spinner'
import { STAGE_TYPE_OPTIONS } from '../../../../constants/stageConfig'
import '../../AdminTable.css'
import './AdminCareStages.css'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

const EMPTY_FORM = {
  plant_id: '', stage_name: '', description: '',
  stage_type: '', fertilizer_guide: '', pest_control: '', duration: '', stage_order: 1,
}

const validate = (f) => {
  const e = {}
  if (!f.plant_id)        e.plant_id   = 'Chọn cây trồng'
  if (!f.stage_name?.trim()) e.stage_name = 'Tên giai đoạn là bắt buộc'
  return e
}

const StageForm = ({ initial, plants, existingImages = [], onSave, onCancel, saving }) => {
  const [form, setForm]   = useState(initial || EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [pendingImages, setPendingImages] = useState([])

  useEffect(() => {
    setForm(initial || EMPTY_FORM)
    setErrors({})
    setPendingImages([])
  }, [initial])

  const set = (k, v) => {
    setForm((p) => ({ ...p, [k]: v }))
    if (errors[k]) setErrors((p) => ({ ...p, [k]: undefined }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validate(form)
    if (Object.keys(errs).length) { setErrors(errs); return }
    onSave({ ...form, images: pendingImages })
  }

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    const nextImages = files.map((file, index) => ({
      id: `${file.name}-${file.size}-${Date.now()}-${index}`,
      file,
      caption: '',
      sort_order: pendingImages.length + index + 1,
      previewUrl: URL.createObjectURL(file),
    }))

    setPendingImages((prev) => [...prev, ...nextImages])
    e.target.value = ''
  }

  const updatePendingImage = (id, field, value) => {
    setPendingImages((prev) => prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)))
  }

  const removePendingImage = (id) => {
    setPendingImages((prev) => {
      const target = prev.find((item) => item.id === id)
      if (target?.previewUrl) URL.revokeObjectURL(target.previewUrl)
      return prev.filter((item) => item.id !== id)
    })
  }

  return (
    <form className="admin-form" onSubmit={handleSubmit} noValidate>
      <div className="admin-form__row">
        <div className="admin-form__field">
          <label className="admin-form__label admin-form__label--required">Cây trồng</label>
          <select
            className={`admin-form__select ${errors.plant_id ? 'admin-form__input--error' : ''}`}
            value={form.plant_id}
            onChange={(e) => set('plant_id', e.target.value)}
          >
            <option value="">-- Chọn cây --</option>
            {plants.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          {errors.plant_id && <span className="admin-form__error-msg">{errors.plant_id}</span>}
        </div>

        <div className="admin-form__field">
          <label className="admin-form__label admin-form__label--required">Tên giai đoạn</label>
          <input
            className={`admin-form__input ${errors.stage_name ? 'admin-form__input--error' : ''}`}
            value={form.stage_name}
            onChange={(e) => set('stage_name', e.target.value)}
            placeholder="Làm đất, Gieo hạt, Chăm sóc..."
          />
          {errors.stage_name && <span className="admin-form__error-msg">{errors.stage_name}</span>}
        </div>
      </div>

      <div className="admin-form__field">
        <label className="admin-form__label">Loại giai đoạn (để hiển thị màu)</label>
        <select
          className="admin-form__select"
          value={form.stage_type || ''}
          onChange={(e) => set('stage_type', e.target.value)}
        >
          <option value="">-- Không chọn (tự suy luận từ tên) --</option>
          {STAGE_TYPE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      <div className="admin-form__row">
        <div className="admin-form__field">
          <label className="admin-form__label">Thời gian</label>
          <input
            className="admin-form__input"
            value={form.duration}
            onChange={(e) => set('duration', e.target.value)}
            placeholder="VD: 7-10 ngày"
          />
        </div>
        <div className="admin-form__field">
          <label className="admin-form__label">Thứ tự hiển thị</label>
          <input
            type="number"
            className="admin-form__input"
            value={form.stage_order}
            onChange={(e) => set('stage_order', Number(e.target.value))}
            min={1}
          />
        </div>
      </div>

      <div className="admin-form__field">
        <label className="admin-form__label">Mô tả giai đoạn</label>
        <textarea
          className="admin-form__textarea"
          rows={2}
          value={form.description}
          onChange={(e) => set('description', e.target.value)}
          placeholder="Mô tả ngắn về giai đoạn này..."
        />
      </div>

      <div className="admin-form__field">
        <label className="admin-form__label">Hướng dẫn kỹ thuật</label>
        <textarea
          className="admin-form__textarea"
          rows={5}
          value={form.fertilizer_guide}
          onChange={(e) => set('fertilizer_guide', e.target.value)}
          placeholder="Hướng dẫn kỹ thuật chi tiết..."
        />
      </div>

      <div className="admin-form__field">
        <label className="admin-form__label">Phòng trừ sâu bệnh / Lưu ý</label>
        <textarea
          className="admin-form__textarea"
          rows={2}
          value={form.pest_control}
          onChange={(e) => set('pest_control', e.target.value)}
          placeholder="Những điều cần lưu ý trong giai đoạn này..."
        />
      </div>

      {existingImages.length > 0 && (
        <div className="admin-form__field">
          <label className="admin-form__label">Ảnh hiện có</label>
          <div className="admin-care__existing-images">
            {existingImages.map((img) => (
              <figure key={img.id} className="admin-care__image-card">
                <img
                  src={`${BASE_URL}${img.image_url}`}
                  alt={img.caption || form.stage_name || 'Ảnh minh họa'}
                  className="admin-care__image-preview"
                  onError={(e) => { e.currentTarget.style.display = 'none' }}
                />
                {img.caption && <figcaption>{img.caption}</figcaption>}
              </figure>
            ))}
          </div>
        </div>
      )}

      <div className="admin-form__field">
        <label className="admin-form__label">Thêm ảnh minh họa</label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageSelect}
          className="admin-form__input"
        />
        <p className="admin-care__hint">Chọn một hoặc nhiều ảnh. Ảnh sẽ được tải lên sau khi lưu giai đoạn.</p>

        {pendingImages.length > 0 && (
          <div className="admin-care__pending-images">
            {pendingImages.map((image, index) => (
              <div key={image.id} className="admin-care__pending-image-item">
                <img
                  src={image.previewUrl}
                  alt={image.caption || image.file.name}
                  className="admin-care__pending-thumb"
                />
                <div className="admin-care__pending-meta">
                  <div className="admin-care__pending-filename">{index + 1}. {image.file.name}</div>
                  <input
                    className="admin-form__input"
                    value={image.caption}
                    onChange={(e) => updatePendingImage(image.id, 'caption', e.target.value)}
                    placeholder="Chú thích ảnh (tuỳ chọn)"
                  />
                  <div className="admin-form__row admin-care__pending-row">
                    <input
                      type="number"
                      className="admin-form__input"
                      min={0}
                      value={image.sort_order}
                      onChange={(e) => updatePendingImage(image.id, 'sort_order', Number(e.target.value) || 0)}
                    />
                    <Button variant="ghost" size="sm" type="button" onClick={() => removePendingImage(image.id)}>
                      Xóa
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="admin-form__actions">
        <Button variant="ghost" onClick={onCancel} type="button">Hủy</Button>
        <Button variant="primary" type="submit" loading={saving}>
          {initial ? 'Cập nhật' : 'Thêm giai đoạn'}
        </Button>
      </div>
    </form>
  )
}

const AdminCareStages = () => {
  const toast = useToast()
  const [stages, setStages]             = useState([])
  const [plants, setPlants]             = useState([])
  const [selectedPlant, setSelectedPlant] = useState('')
  const [loading, setLoading]           = useState(false)
  const [saving, setSaving]             = useState(false)
  const [modalOpen, setModalOpen]       = useState(false)
  const [editing, setEditing]           = useState(null)
  const [page, setPage]                 = useState(1)
  const [totalPages, setTotalPages]     = useState(1)
  const [pageSize, setPageSize]         = useState(10)

  const limit = pageSize

  const fetchPlants = async () => {
    try {
      const res = await adminPlantService.getAll({ limit: 200 })
      setPlants(res.data || [])
    } catch { /* ignore */ }
  }

  const fetchStages = async (plantId, nextPage = page, nextLimit = limit) => {
    if (!plantId) { setStages([]); return }
    setLoading(true)
    try {
      const res = await adminCareStageService.getByPlant(plantId, { page: nextPage, limit: nextLimit })
      setStages(res.data || [])
      setTotalPages(res.meta?.totalPages || 1)
      setPage(res.meta?.page || nextPage)
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message)
    } finally { setLoading(false) }
  }

  useEffect(() => { fetchPlants() }, [])
  useEffect(() => {
    if (selectedPlant) fetchStages(selectedPlant, 1, limit)
  }, [selectedPlant])

  const openCreate = () => { setEditing(null); setModalOpen(true) }
  const openEdit   = (stage) => { setEditing(stage); setModalOpen(true) }
  const closeModal = () => { setModalOpen(false); setEditing(null) }

  const handleSave = async (data) => {
    const pendingImages = Array.isArray(data.images) ? data.images : []
    const payload = {
      plant_id: Number(data.plant_id),
      stage_name: data.stage_name?.trim(),
      stage_type: data.stage_type || null,
      description: data.description?.trim() || null,
      duration: data.duration?.trim() || null,
      stage_order: Number(data.stage_order) || 1,
      fertilizer_guide: data.fertilizer_guide?.trim() || null,
      pest_control: data.pest_control?.trim() || null,
    }

    setSaving(true)
    let savedStage = null
    try {
      if (editing) {
        savedStage = await adminCareStageService.update(editing.id, payload)
      } else {
        savedStage = await adminCareStageService.create(payload)
      }

      const stageId = savedStage?.id || editing?.id
      const uploads = pendingImages.filter((image) => image?.file)

      for (const image of uploads) {
        const formData = new FormData()
        formData.append('image', image.file)
        formData.append('caption', image.caption || '')
        formData.append('sort_order', String(image.sort_order ?? 0))
        await adminCareStageService.addImage(stageId, formData)
      }

      toast.success(editing ? 'Cập nhật giai đoạn thành công!' : 'Thêm giai đoạn thành công!')
      closeModal()
      if (selectedPlant) fetchStages(selectedPlant, page, limit)
    } catch (err) {
      if (savedStage) {
        closeModal()
        if (selectedPlant) fetchStages(selectedPlant, page, limit)
      }
      toast.error(err?.response?.data?.message || err.message)
    } finally { setSaving(false) }
  }

  const handleDelete = async (stage) => {
    if (!window.confirm(`Xóa giai đoạn "${stage.stage_name}"?`)) return
    try {
      await adminCareStageService.remove(stage.id)
      toast.success('Đã xóa giai đoạn!')
      const nextPage = stages.length === 1 && page > 1 ? page - 1 : page
      fetchStages(selectedPlant, nextPage, limit)
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message)
    }
  }

  return (
    <div className="admin-table-page">
      <div className="admin-table-page__toolbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <label style={{ fontWeight: 600, fontSize: '0.9rem' }}>Chọn cây trồng:</label>
          <select
            className="admin-form__select"
            style={{ minWidth: 220 }}
            value={selectedPlant}
            onChange={(e) => setSelectedPlant(e.target.value)}
          >
            <option value="">-- Chọn cây --</option>
            {plants.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
        <PageSizeSelector
          value={pageSize}
          onChange={(next) => {
            setPageSize(next)
            setPage(1)
            if (selectedPlant) fetchStages(selectedPlant, 1, next)
          }}
        />
        <Button variant="primary" onClick={openCreate}>
          <LuPlus aria-hidden="true" />
          Thêm giai đoạn
        </Button>
      </div>

      {!selectedPlant ? (
        <div className="admin-care__empty">
          <div className="admin-care__empty-icon" aria-hidden="true">
            <LuSprout />
          </div>
          <p>Chọn một cây trồng để xem và quản lý các giai đoạn chăm sóc</p>
        </div>
      ) : (
        <div className="admin-table__wrapper">
          {loading ? <Spinner text="Đang tải..." /> : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Tên giai đoạn</th>
                  <th>Thời gian</th>
                  <th>Mô tả</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {stages.length === 0 ? (
                  <tr><td colSpan={5} className="admin-table__empty">Chưa có giai đoạn nào</td></tr>
                ) : stages.map((s, i) => (
                  <tr key={s.id}>
                    <td style={{ color: 'var(--text-muted)' }}>{(page - 1) * limit + i + 1}</td>
                    <td><strong>{s.stage_name}</strong></td>
                    <td>{s.duration || (s.duration_days ? `${s.duration_days} ngày` : '—')}</td>
                    <td style={{ maxWidth: 240, color: 'var(--text-secondary)' }}>
                      {s.description ? s.description.slice(0, 80) + (s.description.length > 80 ? '...' : '') : '—'}
                    </td>
                    <td>
                      <div className="admin-table__actions">
                        <button className="admin-table__action-btn admin-table__action-btn--edit" onClick={() => openEdit(s)}>Sửa</button>
                        <button className="admin-table__action-btn admin-table__action-btn--delete" onClick={() => handleDelete(s)}>Xóa</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {selectedPlant && stages.length > 0 && (
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={(p) => {
            setPage(p)
            fetchStages(selectedPlant, p, limit)
          }}
        />
      )}

      <Modal isOpen={modalOpen} onClose={closeModal} title={editing ? 'Sửa giai đoạn chăm sóc' : 'Thêm giai đoạn chăm sóc'} size="lg">
        <StageForm
          initial={editing
            ? {
                plant_id: editing.plant_id || selectedPlant,
                stage_name: editing.stage_name || '',
                stage_type: editing.stage_type || '',
                description: editing.description || '',
                duration: editing.duration || (editing.duration_days ? `${editing.duration_days} ngày` : editing.time_period || ''),
                stage_order: editing.stage_order ?? editing.sort_order ?? 1,
                fertilizer_guide: editing.fertilizer_guide || editing.techniques || '',
                pest_control: editing.pest_control || editing.notes || '',
              }
            : { ...EMPTY_FORM, plant_id: selectedPlant }}
          plants={plants}
          existingImages={editing?.images || []}
          onSave={handleSave}
          onCancel={closeModal}
          saving={saving}
        />
      </Modal>
    </div>
  )
}

export default AdminCareStages
