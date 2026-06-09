import { Route, Routes } from 'react-router-dom'
import { HomePage }  from '../../features/home/ui/HomePage.jsx'
import { LoginPage } from '../../features/auth/ui/LoginPage.jsx'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/"      element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
    </Routes>
  )
}