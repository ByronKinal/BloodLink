import { Route, Routes } from 'react-router-dom'
import { HomePage } from '../../features/home/ui/HomePage.jsx'
import { NotFoundPage } from '../../features/not-found/ui/NotFoundPage.jsx'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
    </Routes>
  )
}