import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

// Public pages
import HomePage        from '../pages/HomePage'
import PlantsPage      from '../pages/PlantsPage'
import PlantDetailPage from '../pages/PlantDetailPage'
import CalendarPage    from '../pages/CalendarPage'
import FaqsPage        from '../pages/FaqsPage'
import LoginPage       from '../pages/LoginPage'
import NotFoundPage    from '../pages/NotFoundPage'

// Admin pages (all from one barrel)
import {
  DashboardPage,
  AdminPlantsPage,
  AdminCategoriesPage,
  AdminCalendarPage,
  AdminCareStagesPage,
  AdminFaqsPage,
  AdminUsersPage,
} from '../pages/admin/AdminPages'

// Guards & providers
import ProtectedRoute  from '../components/ProtectedRoute'
import { AuthProvider }  from '../context/AuthContext'
import { ToastProvider } from '../context/ToastContext'

const AppRouter = () => (
  <BrowserRouter>
    <AuthProvider>
      <ToastProvider>
        <Routes>
          {/* ── Public ──────────────────────────────────────────── */}
          <Route path="/"          element={<HomePage />} />
          <Route path="/plants"    element={<PlantsPage />} />
          <Route path="/plants/:id" element={<PlantDetailPage />} />
          <Route path="/calendar"  element={<CalendarPage />} />
          <Route path="/faqs"      element={<FaqsPage />} />
          <Route path="/login"     element={<LoginPage />} />

          {/* ── Admin (requires auth) ────────────────────────────── */}
          <Route
            path="/admin"
            element={<Navigate to="/admin/dashboard" replace />}
          />
          <Route
            path="/admin/dashboard"
            element={<ProtectedRoute><DashboardPage /></ProtectedRoute>}
          />
          <Route
            path="/admin/plants"
            element={<ProtectedRoute><AdminPlantsPage /></ProtectedRoute>}
          />
          <Route
            path="/admin/categories"
            element={<ProtectedRoute><AdminCategoriesPage /></ProtectedRoute>}
          />
          <Route
            path="/admin/calendar"
            element={<ProtectedRoute><AdminCalendarPage /></ProtectedRoute>}
          />
          <Route
            path="/admin/care-stages"
            element={<ProtectedRoute><AdminCareStagesPage /></ProtectedRoute>}
          />
          <Route
            path="/admin/faqs"
            element={<ProtectedRoute><AdminFaqsPage /></ProtectedRoute>}
          />
          <Route
            path="/admin/users"
            element={<ProtectedRoute adminOnly><AdminUsersPage /></ProtectedRoute>}
          />

          {/* ── 404 ─────────────────────────────────────────────── */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </ToastProvider>
    </AuthProvider>
  </BrowserRouter>
)

export default AppRouter
