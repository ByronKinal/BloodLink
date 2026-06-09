import { Route, Routes } from 'react-router-dom'
import { HomePage } from '../../features/home/ui/HomePage.jsx'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
    </Routes>
  )
}