import { useState } from 'react'
import { Link } from 'react-router-dom'
import { userApi } from '../../lib/api'
import { EnvelopeIcon, CheckCircleIcon } from '@heroicons/react/24/outline'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await userApi.post('/forgot-password', { email })
      setSuccess(true)
    } catch (error) {
      setError(error?.response?.data?.message || 'Failed to send reset email')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-[calc(100vh-140px)] flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-100 dark:border-gray-700 text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircleIcon className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Check Your Email
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              We've sent a password reset link to <strong>{email}</strong>
            </p>
            <Link 
              to="/login" 
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-200"
            >
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-140px)] flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-100 dark:border-gray-700">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Forgot Password?
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Enter your email address and we'll send you a link to reset your password
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
                <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-xl font-semibold hover:shadow-lg hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Sending...
                </div>
              ) : (
                'Send Reset Link'
              )}
            </button>
          </form>

          {/* Footer Links */}
          <div className="mt-8 text-center">
            <Link 
              to="/login" 
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium"
            >
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}