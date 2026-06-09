import { Route, Routes } from 'react-router-dom'
import { HomePage }    from '../../features/home/ui/HomePage.jsx'
import { LoginPage }   from '../../features/auth/ui/LoginPage.jsx'
import { RegisterPage } from '../../features/auth/ui/RegisterPage.jsx'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/"         element={<HomePage />} />
      <Route path="/login"    element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
    </Routes>
  )
}