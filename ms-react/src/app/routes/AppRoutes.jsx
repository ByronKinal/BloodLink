import { Route, Routes } from 'react-router-dom'
import { HomePage }           from '../../features/home/pages/HomePage.jsx'
import { LoginPage }          from '../../features/auth/pages/LoginPage.jsx'
import { RegisterPage }       from '../../features/auth/pages/RegisterPage.jsx'
import { VerifyEmailPage }    from '../../features/auth/pages/VerifyEmailPage.jsx'
import { ForgotPasswordPage } from '../../features/auth/pages/ForgotPasswordPage.jsx'
import { ResetPasswordPage }  from '../../features/auth/pages/ResetPasswordPage.jsx'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/"                element={<HomePage />} />
      <Route path="/login"           element={<LoginPage />} />
      <Route path="/register"        element={<RegisterPage />} />
      <Route path="/verify-email"    element={<VerifyEmailPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password"  element={<ResetPasswordPage />} />
    </Routes>
  )
}
