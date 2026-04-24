import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { FaRegCircleUser } from 'react-icons/fa6'
import {
  LuCalendarDays,
  LuCircleHelp,
  LuExternalLink,
  LuFolderTree,
  LuLeaf,
  LuLayoutDashboard,
  LuLogOut,
  LuMenu,
  LuPanelLeftClose,
  LuPanelLeftOpen,
  LuUsers,
  LuWrench,
} from 'react-icons/lu'
import { useAuthContext } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { authService } from '../features/auth/services/authService'
import { clearTokens } from '../utils/tokenHelper'
import { getRoleLabel } from '../utils/roleLabel'
import './AdminLayout.css'

const NAV_ITEMS = [
  { to: '/admin/dashboard',   label: 'Tổng quan',    icon: LuLayoutDashboard },
  { to: '/admin/plants',      label: 'Cây trồng',    icon: LuLeaf },
  { to: '/admin/categories',  label: 'Nhóm cây',     icon: LuFolderTree },
  { to: '/admin/calendar',    label: 'Lịch thời vụ', icon: LuCalendarDays },
  { to: '/admin/care-stages', label: 'Kỹ thuật',     icon: LuWrench },
  { to: '/admin/faqs',        label: 'Hỏi & Đáp',    icon: LuCircleHelp },
  { to: '/admin/users',       label: 'Người dùng',   icon: LuUsers, adminOnly: true },
]

const AdminLayout = ({ children }) => {
  const { user, isAdmin, logout } = useAuthContext()
  const toast    = useToast()
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = async () => {
    try { await authService.logout() } catch { /* ignore */ }
    clearTokens()
    logout()
    toast.info('Đã đăng xuất!')
    navigate('/login', { replace: true })
  }

  const visibleItems = NAV_ITEMS.filter((item) => !item.adminOnly || isAdmin)

  return (
    <div className={`admin-layout ${collapsed ? 'admin-layout--collapsed' : ''}`}>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="admin-layout__overlay" onClick={() => setMobileOpen(false)} aria-hidden="true" />
      )}

      {/* Sidebar */}
      <aside className={`admin-layout__sidebar ${mobileOpen ? 'admin-layout__sidebar--open' : ''}`}>
        <div className="admin-layout__sidebar-header">
          {!collapsed && (
            <div className="admin-layout__sidebar-brand">
              <LuLeaf className="admin-layout__sidebar-icon" aria-hidden="true" />
              <div>
                <div className="admin-layout__sidebar-title">Thuận Châu</div>
                <div className="admin-layout__sidebar-sub">Quản trị hệ thống</div>
              </div>
            </div>
          )}
          <button
            className="admin-layout__collapse-btn"
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? 'Mở rộng sidebar' : 'Thu gọn sidebar'}
            title={collapsed ? 'Mở rộng' : 'Thu gọn'}
          >
            {collapsed
              ? <LuPanelLeftOpen aria-hidden="true" />
              : <LuPanelLeftClose aria-hidden="true" />}
          </button>
        </div>

        <nav className="admin-layout__nav" aria-label="Điều hướng quản trị">
          {visibleItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `admin-layout__nav-item ${isActive ? 'admin-layout__nav-item--active' : ''}`
              }
              title={collapsed ? label : undefined}
              onClick={() => setMobileOpen(false)}
            >
              <Icon className="admin-layout__nav-icon" aria-hidden="true" />
              {!collapsed && <span className="admin-layout__nav-label">{label}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="admin-layout__sidebar-footer">
          {!collapsed && user && (
            <div className="admin-layout__user-info">
              <div className="admin-layout__user-avatar">
                {(user.full_name || user.username || 'U')[0].toUpperCase()}
              </div>
              <div className="admin-layout__user-details">
                <span className="admin-layout__user-name">{user.full_name || user.username}</span>
                <span className="admin-layout__user-role">{getRoleLabel(user.role)}</span>
              </div>
            </div>
          )}
          <button className="admin-layout__logout-btn" onClick={handleLogout} title="Đăng xuất">
            <LuLogOut className="admin-layout__nav-icon" aria-hidden="true" />
            {!collapsed && <span>Đăng xuất</span>}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="admin-layout__main">
        <header className="admin-layout__topbar">
          <button
            className="admin-layout__mobile-menu-btn"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Mở menu"
          >
            <LuMenu aria-hidden="true" />
          </button>
          <div className="admin-layout__topbar-right">
            <span className="admin-layout__topbar-user">
              <FaRegCircleUser className="admin-layout__topbar-user-icon" aria-hidden="true" />
              {user?.full_name || user?.username}
              <span className="admin-layout__topbar-role">{getRoleLabel(user?.role)}</span>
            </span>
            <a href="/" className="admin-layout__view-site" target="_blank" rel="noreferrer">
              <LuExternalLink className="admin-layout__view-site-icon" aria-hidden="true" />
              Xem trang
            </a>
          </div>
        </header>

        <main className="admin-layout__content">
          {children}
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
