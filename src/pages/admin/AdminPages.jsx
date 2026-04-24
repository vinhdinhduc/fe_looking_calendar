 
import React from 'react'
import { LuCalendarDays, LuCircleHelp, LuFolderTree, LuLayoutDashboard, LuLeaf, LuUsers, LuWrench } from 'react-icons/lu'
import AdminLayout from '../../layouts/AdminLayout'
import DashboardStats from '../../features/admin/dashboard/components/DashboardStats'
import './AdminPage.css'

export const DashboardPage = () => (
  <AdminLayout>
    <div className="admin-page">
      <div className="admin-page__header">
        <h1 className="admin-page__title">
          <LuLayoutDashboard aria-hidden="true" />
          Tổng quan hệ thống
        </h1>
        <p className="admin-page__sub">Thống kê và biểu đồ tổng hợp</p>
      </div>
      <DashboardStats />
    </div>
  </AdminLayout>
)

 
import AdminPlants from '../../features/admin/plants/components/AdminPlants'

export const AdminPlantsPage = () => (
  <AdminLayout>
    <div className="admin-page">
      <div className="admin-page__header">
        <h1 className="admin-page__title">
          <LuLeaf aria-hidden="true" />
          Quản lý Cây trồng
        </h1>
        <p className="admin-page__sub">Thêm, sửa, xóa thông tin cây trồng</p>
      </div>
      <AdminPlants />
    </div>
  </AdminLayout>
)

 
import AdminCategories from '../../features/admin/categories/components/AdminCategories'

export const AdminCategoriesPage = () => (
  <AdminLayout>
    <div className="admin-page">
      <div className="admin-page__header">
        <h1 className="admin-page__title">
          <LuFolderTree aria-hidden="true" />
          Quản lý Nhóm cây
        </h1>
        <p className="admin-page__sub">Phân loại cây trồng theo nhóm</p>
      </div>
      <AdminCategories />
    </div>
  </AdminLayout>
)

 
import AdminCalendar from '../../features/admin/calendar/components/AdminCalendar'

export const AdminCalendarPage = () => (
  <AdminLayout>
    <div className="admin-page">
      <div className="admin-page__header">
        <h1 className="admin-page__title">
          <LuCalendarDays aria-hidden="true" />
          Quản lý Lịch thời vụ
        </h1>
        <p className="admin-page__sub">Cập nhật lịch canh tác theo tháng cho từng cây</p>
      </div>
      <AdminCalendar />
    </div>
  </AdminLayout>
)

 
import AdminCareStages from '../../features/admin/careStages/components/AdminCareStages'

export const AdminCareStagesPage = () => (
  <AdminLayout>
    <div className="admin-page">
      <div className="admin-page__header">
        <h1 className="admin-page__title">
          <LuWrench aria-hidden="true" />
          Quản lý Kỹ thuật Chăm sóc
        </h1>
        <p className="admin-page__sub">Các giai đoạn chăm sóc và hướng dẫn kỹ thuật</p>
      </div>
      <AdminCareStages />
    </div>
  </AdminLayout>
)

 
import AdminFaqs from '../../features/admin/faqs/components/AdminFaqs'

export const AdminFaqsPage = () => (
  <AdminLayout>
    <div className="admin-page">
      <div className="admin-page__header">
        <h1 className="admin-page__title">
          <LuCircleHelp aria-hidden="true" />
          Quản lý Hỏi &amp; Đáp
        </h1>
        <p className="admin-page__sub">Thêm và cập nhật câu hỏi thường gặp</p>
      </div>
      <AdminFaqs />
    </div>
  </AdminLayout>
)

 
import AdminUsers from '../../features/admin/users/components/AdminUsers'

export const AdminUsersPage = () => (
  <AdminLayout>
    <div className="admin-page">
      <div className="admin-page__header">
        <h1 className="admin-page__title">
          <LuUsers aria-hidden="true" />
          Quản lý Người dùng
        </h1>
        <p className="admin-page__sub">Tài khoản quản trị viên và nhân viên hệ thống</p>
      </div>
      <AdminUsers />
    </div>
  </AdminLayout>
)
