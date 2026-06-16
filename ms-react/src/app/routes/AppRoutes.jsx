import { Route, Routes } from 'react-router-dom'
import { HomePage }              from '../../features/home/pages/HomePage.jsx'
import { LoginPage }             from '../../features/auth/pages/LoginPage.jsx'
import { RegisterPage }          from '../../features/auth/pages/RegisterPage.jsx'
import { VerifyEmailPage }       from '../../features/auth/pages/VerifyEmailPage.jsx'
import { ForgotPasswordPage }    from '../../features/auth/pages/ForgotPasswordPage.jsx'
import { ResetPasswordPage }     from '../../features/auth/pages/ResetPasswordPage.jsx'
import { ClientDashboardPage }    from '../../features/client/pages/ClientDashboardPage.jsx'
import { AdminDashboardPage }     from '../../features/admin/pages/AdminDashboardPage.jsx'
import { EmployeeDashboardPage }  from '../../features/employee/pages/EmployeeDashboardPage.jsx'
import { ProtectedRoute }         from '../../shared/components/ProtectedRoute.jsx'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/"                element={<HomePage />} />
      <Route path="/login"           element={<LoginPage />} />
      <Route path="/register"        element={<RegisterPage />} />
      <Route path="/verify-email"    element={<VerifyEmailPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password"  element={<ResetPasswordPage />} />

      <Route path="/dashboard" element={
        <ProtectedRoute clientOnly>
          <ClientDashboardPage />
        </ProtectedRoute>
      } />

      <Route path="/admin" element={
        <ProtectedRoute adminOnly>
          <AdminDashboardPage />
        </ProtectedRoute>
      } />

      <Route path="/employee" element={
        <ProtectedRoute employeeOnly>
          <EmployeeDashboardPage />
        </ProtectedRoute>
      } />
    </Routes>
  )
}
