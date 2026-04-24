import React, { useState, useEffect } from 'react'
import { LuCalendarDays, LuPlus } from 'react-icons/lu'
import { adminCalendarService } from '../services/adminCalendarService'
import { adminPlantService } from '../../plants/services/adminPlantService'
import { useToast } from '../../../../context/ToastContext'
import Button from '../../../../components/Button/Button'
import Modal from '../../../../components/Modal/Modal'
import Spinner from '../../../../components/Spinner/Spinner'
import '../../AdminTable.css'
import './AdminCalendar.css'

const ACTIVITY_TYPES = [
  { value: 'lam_dat',   label: 'Làm đất' },
  { value: 'gieo_trong', label: 'Gieo trồng' },
  { value: 'cham_soc',  label: 'Chăm sóc' },
  { value: 'phong_tru', label: 'Phòng trừ sâu bệnh' },
  { value: 'thu_hoach', label: 'Thu hoạch' },
  { value: 'bao_quan',  label: 'Bảo quản' },
]

const MONTHS = Array.from({ length: 12 }, (_, i) => ({ value: i + 1, label: `Tháng ${i + 1}` }))

const EMPTY_FORM = { plant_id: '', month: '', activity_type: '', notes: '' }

const validate = (f) => {
  const e = {}
  if (!f.plant_id)      e.plant_id = 'Chọn cây trồng'
  if (!f.month)         e.month    = 'Chọn tháng'
  if (!f.activity_type) e.activity_type = 'Chọn loại hoạt động'
  return e
}

const CalendarForm = ({ initial, plants, onSave, onCancel, saving }) => {
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
          <label className="admin-form__label admin-form__label--required">Tháng</label>
          <select
            className={`admin-form__select ${errors.month ? 'admin-form__input--error' : ''}`}
            value={form.month}
            onChange={(e) => set('month', e.target.value)}
          >
            <option value="">-- Chọn tháng --</option>
            {MONTHS.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
          </select>
          {errors.month && <span className="admin-form__error-msg">{errors.month}</span>}
        </div>
      </div>

      <div className="admin-form__field">
        <label className="admin-form__label admin-form__label--required">Loại hoạt động</label>
        <select
          className={`admin-form__select ${errors.activity_type ? 'admin-form__input--error' : ''}`}
          value={form.activity_type}
          onChange={(e) => set('activity_type', e.target.value)}
        >
          <option value="">-- Chọn hoạt động --</option>
          {ACTIVITY_TYPES.map((a) => <option key={a.value} value={a.value}>{a.label}</option>)}
        </select>
        {errors.activity_type && <span className="admin-form__error-msg">{errors.activity_type}</span>}
      </div>

      <div className="admin-form__field">
        <label className="admin-form__label">Ghi chú</label>
        <textarea
          className="admin-form__textarea"
          rows={3}
          value={form.notes}
          onChange={(e) => set('notes', e.target.value)}
          placeholder="Ghi chú thêm về hoạt động này..."
        />
      </div>

      <div className="admin-form__actions">
        <Button variant="ghost" onClick={onCancel} type="button">Hủy</Button>
        <Button variant="primary" type="submit" loading={saving}>
          {initial ? 'Cập nhật' : 'Thêm lịch'}
        </Button>
      </div>
    </form>
  )
}

const AdminCalendar = () => {
  const toast = useToast()
  const [entries, setEntries]       = useState([])
  const [plants, setPlants]         = useState([])
  const [selectedPlant, setSelectedPlant] = useState('')
  const [loading, setLoading]       = useState(false)
  const [saving, setSaving]         = useState(false)
  const [modalOpen, setModalOpen]   = useState(false)
  const [editing, setEditing]       = useState(null)

  const fetchPlants = async () => {
    try {
      const res = await adminPlantService.getAll({ limit: 200 })
      setPlants(res.data || [])
    } catch { /* ignore */ }
  }

  const fetchCalendar = async (plantId) => {
    if (!plantId) { setEntries([]); return }
    setLoading(true)
    try {
      const data = await adminCalendarService.getByPlant(plantId)
      setEntries(data)
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message)
    } finally { setLoading(false) }
  }

  useEffect(() => { fetchPlants() }, [])
  useEffect(() => { fetchCalendar(selectedPlant) }, [selectedPlant])

  const openCreate = () => { setEditing(null); setModalOpen(true) }
  const openEdit   = (entry) => { setEditing(entry); setModalOpen(true) }
  const closeModal = () => { setModalOpen(false); setEditing(null) }

  const handleSave = async (data) => {
    setSaving(true)
    try {
      if (editing) {
        await adminCalendarService.update(editing.id, data)
        toast.success('Cập nhật lịch thành công!')
      } else {
        await adminCalendarService.create(data)
        toast.success('Thêm lịch thành công!')
      }
      closeModal()
      if (selectedPlant) fetchCalendar(selectedPlant)
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message)
    } finally { setSaving(false) }
  }

  const handleDelete = async (entry) => {
    if (!window.confirm('Xóa mục lịch này?')) return
    try {
      await adminCalendarService.remove(entry.id)
      toast.success('Đã xóa!')
      fetchCalendar(selectedPlant)
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message)
    }
  }

  const getActivityLabel = (type) =>
    ACTIVITY_TYPES.find((a) => a.value === type)?.label || type

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
            <option value="">-- Chọn cây để xem lịch --</option>
            {plants.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
        <Button variant="primary" onClick={openCreate}>
          <LuPlus aria-hidden="true" />
          Thêm lịch
        </Button>
      </div>

      {!selectedPlant ? (
        <div className="admin-calendar__empty">
          <div className="admin-calendar__empty-icon" aria-hidden="true">
            <LuCalendarDays />
          </div>
          <p>Chọn một cây trồng để xem và quản lý lịch thời vụ</p>
        </div>
      ) : (
        <div className="admin-table__wrapper">
          {loading ? <Spinner text="Đang tải lịch..." /> : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Cây trồng</th>
                  <th>Tháng</th>
                  <th>Hoạt động</th>
                  <th>Ghi chú</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {entries.length === 0 ? (
                  <tr><td colSpan={5} className="admin-table__empty">Chưa có lịch nào cho cây này</td></tr>
                ) : entries.map((e) => (
                  <tr key={e.id}>
                    <td>{e.plant?.name || '—'}</td>
                    <td><span className="admin-calendar__month-badge">Tháng {e.month}</span></td>
                    <td>{getActivityLabel(e.activity_type)}</td>
                    <td style={{ color: 'var(--text-secondary)', maxWidth: 200 }}>{e.notes || '—'}</td>
                    <td>
                      <div className="admin-table__actions">
                        <button className="admin-table__action-btn admin-table__action-btn--edit" onClick={() => openEdit(e)}>Sửa</button>
                        <button className="admin-table__action-btn admin-table__action-btn--delete" onClick={() => handleDelete(e)}>Xóa</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={closeModal} title={editing ? 'Sửa lịch thời vụ' : 'Thêm lịch thời vụ'} size="md">
        <CalendarForm
          initial={editing ? { ...editing, plant_id: editing.plant_id || editing.plant?.id } : { plant_id: selectedPlant }}
          plants={plants}
          onSave={handleSave}
          onCancel={closeModal}
          saving={saving}
        />
      </Modal>
    </div>
  )
}

export default AdminCalendar
