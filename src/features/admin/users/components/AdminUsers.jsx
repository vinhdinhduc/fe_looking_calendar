import React, { useState, useEffect } from 'react'
import { LuEye, LuEyeOff } from 'react-icons/lu'
import { adminUserService } from '../services/adminUserService'
import { useToast } from '../../../../context/ToastContext'
import { useAuthContext } from '../../../../context/AuthContext'
import Button from '../../../../components/Button/Button'
import Modal from '../../../../components/Modal/Modal'
import Spinner from '../../../../components/Spinner/Spinner'
import Pagination from '../../../../components/Pagination/Pagination'
import { formatDateTime } from '../../../../utils/formatDate'
import { getRoleLabel } from '../../../../utils/roleLabel'
import '../../AdminTable.css'

const EMPTY_FORM = { username: '', full_name: '', email: '', password: '', role: 'staff' }

const validate = (f, isEdit) => {
  const e = {}
  if (!f.username?.trim())  e.username  = 'Tên đăng nhập là bắt buộc'
  if (!f.full_name?.trim()) e.full_name = 'Họ tên là bắt buộc'
  if (!isEdit && !f.password) e.password = 'Mật khẩu là bắt buộc'
  if (!isEdit && f.password && f.password.length < 6) e.password = 'Mật khẩu ít nhất 6 ký tự'
  if (f.email && !/\S+@\S+\.\S+/.test(f.email)) e.email = 'Email không hợp lệ'
  return e
}

const UserForm = ({ initial, onSave, onCancel, saving }) => {
  const isEdit = !!initial
  const [form, setForm]   = useState(initial || EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [showPass, setShowPass] = useState(false)

  const set = (k, v) => {
    setForm((p) => ({ ...p, [k]: v }))
    if (errors[k]) setErrors((p) => ({ ...p, [k]: undefined }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validate(form, isEdit)
    if (Object.keys(errs).length) { setErrors(errs); return }
    onSave(form)
  }

  return (
    <form className="admin-form" onSubmit={handleSubmit} noValidate>
      <div className="admin-form__row">
        <div className="admin-form__field">
          <label className="admin-form__label admin-form__label--required">Tên đăng nhập</label>
          <input
            className={`admin-form__input ${errors.username ? 'admin-form__input--error' : ''}`}
            value={form.username}
            onChange={(e) => set('username', e.target.value)}
            disabled={isEdit}
            placeholder="admin_user"
            autoComplete="off"
          />
          {errors.username && <span className="admin-form__error-msg">{errors.username}</span>}
        </div>

        <div className="admin-form__field">
          <label className="admin-form__label admin-form__label--required">Họ và tên</label>
          <input
            className={`admin-form__input ${errors.full_name ? 'admin-form__input--error' : ''}`}
            value={form.full_name}
            onChange={(e) => set('full_name', e.target.value)}
            placeholder="Nguyễn Văn A"
          />
          {errors.full_name && <span className="admin-form__error-msg">{errors.full_name}</span>}
        </div>
      </div>

      <div className="admin-form__row">
        <div className="admin-form__field">
          <label className="admin-form__label">Email</label>
          <input
            type="email"
            className={`admin-form__input ${errors.email ? 'admin-form__input--error' : ''}`}
            value={form.email}
            onChange={(e) => set('email', e.target.value)}
            placeholder="user@example.com"
          />
          {errors.email && <span className="admin-form__error-msg">{errors.email}</span>}
        </div>

        <div className="admin-form__field">
          <label className="admin-form__label">Vai trò</label>
          <select className="admin-form__select" value={form.role} onChange={(e) => set('role', e.target.value)}>
            <option value="staff">Nhân viên</option>
            <option value="admin">Quản trị viên</option>
          </select>
        </div>
      </div>

      {!isEdit && (
        <div className="admin-form__field">
          <label className="admin-form__label admin-form__label--required">Mật khẩu</label>
          <div style={{ position: 'relative' }}>
            <input
              type={showPass ? 'text' : 'password'}
              className={`admin-form__input ${errors.password ? 'admin-form__input--error' : ''}`}
              value={form.password}
              onChange={(e) => set('password', e.target.value)}
              style={{ paddingRight: 44 }}
              placeholder="Tối thiểu 6 ký tự"
              autoComplete="new-password"
            />
            <button
              type="button"
              style={{
                position: 'absolute',
                right: 12,
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: '1.1rem',
                opacity: 0.6,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onClick={() => setShowPass(!showPass)}
            >
              {showPass ? <LuEyeOff aria-hidden="true" /> : <LuEye aria-hidden="true" />}
            </button>
          </div>
          {errors.password && <span className="admin-form__error-msg">{errors.password}</span>}
        </div>
      )}

      <div className="admin-form__actions">
        <Button variant="ghost" onClick={onCancel} type="button">Hủy</Button>
        <Button variant="primary" type="submit" loading={saving}>
          {isEdit ? 'Cập nhật' : 'Tạo tài khoản'}
        </Button>
      </div>
    </form>
  )
}

const AdminUsers = () => {
  const toast = useToast()
  const { user: currentUser } = useAuthContext()
  const [users, setUsers]         = useState([])
  const [loading, setLoading]     = useState(true)
  const [saving, setSaving]       = useState(false)
  const [page, setPage]           = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [search, setSearch]       = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing]     = useState(null)
  const [resetTarget, setResetTarget] = useState(null)
  const [newPassword, setNewPassword] = useState('')

  const fetchUsers = async (p = 1, s = search) => {
    setLoading(true)
    try {
      const res = await adminUserService.getAll({ page: p, limit: 10, search: s })
      setUsers(res.data || [])
      setTotalPages(res.meta?.totalPages || 1)
      setPage(p)
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message)
    } finally { setLoading(false) }
  }

  useEffect(() => { fetchUsers() }, [])

  const openCreate = () => { setEditing(null); setModalOpen(true) }
  const openEdit   = (u) => { setEditing(u); setModalOpen(true) }
  const closeModal = () => { setModalOpen(false); setEditing(null) }

  const handleSave = async (data) => {
    setSaving(true)
    try {
      if (editing) {
        await adminUserService.update(editing.id, data)
        toast.success('Cập nhật người dùng thành công!')
      } else {
        await adminUserService.create(data)
        toast.success('Tạo tài khoản thành công!')
      }
      closeModal()
      fetchUsers()
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message)
    } finally { setSaving(false) }
  }

  const handleToggle = async (u) => {
    if (u.id === currentUser?.id) { toast.error('Không thể vô hiệu hoá tài khoản của chính bạn!'); return }
    try {
      await adminUserService.toggleStatus(u.id)
      toast.success(`Đã ${u.is_active ? 'vô hiệu hoá' : 'kích hoạt'} tài khoản!`)
      fetchUsers()
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message)
    }
  }

  const handleResetPassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      toast.error('Mật khẩu mới ít nhất 6 ký tự')
      return
    }
    try {
      await adminUserService.resetPassword(resetTarget.id, newPassword)
      toast.success('Đặt lại mật khẩu thành công!')
      setResetTarget(null)
      setNewPassword('')
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message)
    }
  }

  return (
    <div className="admin-table-page">
      <div className="admin-table-page__toolbar">
        <form className="admin-table-page__search" onSubmit={(e) => { e.preventDefault(); fetchUsers(1, search) }}>
          <input type="search" placeholder="Tìm người dùng..." value={search} onChange={(e) => setSearch(e.target.value)} />
          <Button type="submit" variant="outline" size="sm">Tìm</Button>
        </form>
        <Button variant="primary" onClick={openCreate}>+ Tạo tài khoản</Button>
      </div>

      <div className="admin-table__wrapper">
        {loading ? <Spinner text="Đang tải..." /> : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Tên đăng nhập</th>
                <th>Họ tên</th>
                <th>Email</th>
                <th>Vai trò</th>
                <th>Trạng thái</th>
                <th>Tạo lúc</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr><td colSpan={7} className="admin-table__empty">Không có tài khoản nào</td></tr>
              ) : users.map((u) => (
                <tr key={u.id}>
                  <td>
                    <strong>{u.username}</strong>
                    {u.id === currentUser?.id && (
                      <span style={{ fontSize: '0.7rem', color: 'var(--color-primary)', marginLeft: 6 }}>(Bạn)</span>
                    )}
                  </td>
                  <td>{u.full_name || '—'}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{u.email || '—'}</td>
                  <td>
                    <span className={`badge badge--${u.role}`}>{getRoleLabel(u.role)}</span>
                  </td>
                  <td>
                    <span className={`badge badge--${u.is_active ? 'active' : 'inactive'}`}>
                      {u.is_active ? 'Hoạt động' : 'Vô hiệu'}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{formatDateTime(u.created_at)}</td>
                  <td>
                    <div className="admin-table__actions">
                      <button className="admin-table__action-btn admin-table__action-btn--edit" onClick={() => openEdit(u)}>Sửa</button>
                      <button
                        className={`admin-table__action-btn admin-table__action-btn--toggle`}
                        onClick={() => handleToggle(u)}
                      >{u.is_active ? 'Khoá' : 'Mở'}</button>
                      <button
                        className="admin-table__action-btn"
                        style={{ background: 'var(--color-accent-pale)', color: 'var(--color-accent)', borderColor: 'var(--color-accent)' }}
                        onClick={() => { setResetTarget(u); setNewPassword('') }}
                      >Reset PW</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Pagination page={page} totalPages={totalPages} onPageChange={(p) => fetchUsers(p)} />

      {/* Create / Edit modal */}
      <Modal isOpen={modalOpen} onClose={closeModal} title={editing ? 'Sửa tài khoản' : 'Tạo tài khoản mới'} size="md">
        <UserForm initial={editing} onSave={handleSave} onCancel={closeModal} saving={saving} />
      </Modal>

      {/* Reset password modal */}
      <Modal isOpen={!!resetTarget} onClose={() => setResetTarget(null)} title={`Đặt lại mật khẩu – ${resetTarget?.username}`} size="sm">
        <div className="admin-form">
          <div className="admin-form__field">
            <label className="admin-form__label admin-form__label--required">Mật khẩu mới</label>
            <input
              type="password"
              className="admin-form__input"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Tối thiểu 6 ký tự"
              autoComplete="new-password"
            />
          </div>
          <div className="admin-form__actions">
            <Button variant="ghost" onClick={() => setResetTarget(null)} type="button">Hủy</Button>
            <Button variant="danger" onClick={handleResetPassword}>Đặt lại mật khẩu</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default AdminUsers
