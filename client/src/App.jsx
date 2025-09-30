import { Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Landing from './pages/Landing'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import ForgotPassword from './pages/auth/ForgotPassword'
import Courses from './pages/courses/Courses'
import CourseDetail from './pages/courses/CourseDetail'
import CreateCourse from './pages/courses/CreateCourse'
import EditCourse from './pages/courses/EditCourse'
import Checkout from './pages/payments/Checkout'
import MyEnrollments from './pages/enrollments/MyEnrollments'
import MyPayments from './pages/payments/MyPayments'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import { getToken, getUserFromToken } from './lib/auth'
import { Toaster } from './components/ui/Toast'

function RequireAuth({ children, roles = [] }) {
  const token = getToken()
  const user = getUserFromToken()
  
  if (!token) return <Navigate to="/login" replace />
  if (roles.length > 0 && !roles.includes(user?.role)) {
    return <Navigate to="/dashboard" replace />
  }
  return children
}

export default function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light')
  
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('theme', theme)
  }, [theme])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <Navbar theme={theme} setTheme={setTheme} />
      <main className="min-h-[calc(100vh-140px)]">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:id" element={<CourseDetail />} />
          <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
          <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
          <Route path="/create-course" element={<RequireAuth roles={['instructor']}><CreateCourse /></RequireAuth>} />
          <Route path="/edit-course/:id" element={<RequireAuth roles={['instructor']}><EditCourse /></RequireAuth>} />
          <Route path="/checkout/:enrollmentId" element={<RequireAuth><Checkout /></RequireAuth>} />
          <Route path="/my-enrollments" element={<RequireAuth><MyEnrollments /></RequireAuth>} />
          <Route path="/my-payments" element={<RequireAuth><MyPayments /></RequireAuth>} />
        </Routes>
      </main>
      <Footer />
      <Toaster />
    </div>
  )
}