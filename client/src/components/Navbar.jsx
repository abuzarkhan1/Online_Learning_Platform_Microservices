import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { getToken, clearToken, getUserFromToken } from '../lib/auth'
import { 
  SunIcon, 
  MoonIcon, 
  UserIcon, 
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  AcademicCapIcon,
  BookOpenIcon,
  CreditCardIcon,
  PlusIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline'

export default function Navbar({ theme, setTheme }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  
  const token = getToken()
  const user = getUserFromToken()
  const isAuthenticated = !!token

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark')
  
  const handleLogout = () => {
    clearToken()
    navigate('/login')
    setIsProfileOpen(false)
  }

  const isActive = (path) => location.pathname === path

  const navLinks = [
    { path: '/courses', label: 'Courses', icon: <BookOpenIcon className="w-4 h-4" /> },
  ]

  const authenticatedLinks = [
    { path: '/dashboard', label: 'Dashboard', icon: <AcademicCapIcon className="w-4 h-4" /> },
    { path: '/my-enrollments', label: 'My Learning', icon: <BookOpenIcon className="w-4 h-4" /> },
    { path: '/my-payments', label: 'Payments', icon: <CreditCardIcon className="w-4 h-4" /> },
  ]

  const instructorLinks = [
    { path: '/create-course', label: 'Create Course', icon: <PlusIcon className="w-4 h-4" /> },
  ]

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
              <AcademicCapIcon className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              LearnHub
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(link.path)
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
            ))}

            {isAuthenticated && authenticatedLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(link.path)
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
            ))}

            {user?.role === 'instructor' && instructorLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(link.path)
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
            ))}
          </div>

          {/* Right side controls */}
          <div className="flex items-center space-x-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              {theme === 'dark' ? (
                <SunIcon className="w-5 h-5" />
              ) : (
                <MoonIcon className="w-5 h-5" />
              )}
            </button>

            {/* Authentication */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2 p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  <UserIcon className="w-5 h-5" />
                  <span className="hidden sm:block text-sm font-medium">{user?.name}</span>
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1">
                    <Link
                      to="/profile"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <Cog6ToothIcon className="w-4 h-4" />
                      <span>Profile Settings</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <ArrowRightOnRectangleIcon className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium rounded-lg hover:shadow-lg transition-all duration-200"
                >
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
            >
              {isMenuOpen ? (
                <XMarkIcon className="w-5 h-5" />
              ) : (
                <Bars3Icon className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700">
            <div className="space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium ${
                    isActive(link.path)
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                      : 'text-gray-600 dark:text-gray-300'
                  }`}
                >
                  {link.icon}
                  <span>{link.label}</span>
                </Link>
              ))}

              {isAuthenticated && authenticatedLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium ${
                    isActive(link.path)
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                      : 'text-gray-600 dark:text-gray-300'
                  }`}
                >
                  {link.icon}
                  <span>{link.label}</span>
                </Link>
              ))}

              {user?.role === 'instructor' && instructorLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium ${
                    isActive(link.path)
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                      : 'text-gray-600 dark:text-gray-300'
                  }`}
                >
                  {link.icon}
                  <span>{link.label}</span>
                </Link>
              ))}

              {!isAuthenticated && (
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium rounded-lg"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}