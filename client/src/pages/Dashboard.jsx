import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getUserFromToken } from '../lib/auth'
import { courseApi, enrollApi, paymentApi } from '../lib/api'
import { 
  BookOpenIcon, 
  AcademicCapIcon, 
  CreditCardIcon,
  PlusIcon,
  ChartBarIcon,
  UserGroupIcon,
  TrophyIcon,
  ClockIcon
} from '@heroicons/react/24/outline'

export default function Dashboard() {
  const user = getUserFromToken()
  const [stats, setStats] = useState({
    enrollments: 0,
    completedCourses: 0,
    totalSpent: 0,
    createdCourses: 0
  })
  const [recentEnrollments, setRecentEnrollments] = useState([])
  const [recentPayments, setRecentPayments] = useState([])
  const [myCourses, setMyCourses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch enrollments
        const enrollmentsRes = await enrollApi.get('/enrollments/me')
        const enrollments = enrollmentsRes.data || []
        setRecentEnrollments(enrollments.slice(0, 3))

        // Fetch payments
        const paymentsRes = await paymentApi.get('/api/payments/user/me?limit=3')
        const payments = paymentsRes.data || []
        setRecentPayments(payments)

        // Calculate total spent
        const totalSpent = payments.reduce((sum, payment) => 
          sum + (payment.amountCents / 100), 0
        )

        // If instructor, fetch created courses
        let createdCourses = []
        if (user?.role === 'instructor') {
          const coursesRes = await courseApi.get('/courses')
          createdCourses = coursesRes.data || []
          setMyCourses(createdCourses.slice(0, 3))
        }

        setStats({
          enrollments: enrollments.length,
          completedCourses: enrollments.filter(e => e.status === 'COMPLETED').length,
          totalSpent,
          createdCourses: createdCourses.length
        })
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [user?.role])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Here's what's happening with your learning journey
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Enrolled Courses</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.enrollments}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
              <BookOpenIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.completedCourses}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
              <TrophyIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Spent</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">${stats.totalSpent.toFixed(2)}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
              <CreditCardIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>

        {user?.role === 'instructor' && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Created Courses</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.createdCourses}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center">
                <AcademicCapIcon className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Enrollments */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Enrollments</h2>
            <Link 
              to="/my-enrollments" 
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium"
            >
              View All
            </Link>
          </div>
          
          <div className="space-y-4">
            {recentEnrollments.length > 0 ? (
              recentEnrollments.map((enrollment) => (
                <div key={enrollment.enrollmentId} className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                    <BookOpenIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white">Course #{enrollment.courseId}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Status: <span className="capitalize">{enrollment.status.toLowerCase()}</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(enrollment.enrolledAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <BookOpenIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">No enrollments yet</p>
                <Link 
                  to="/courses" 
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium"
                >
                  Browse Courses
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Recent Payments or Created Courses */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {user?.role === 'instructor' ? 'My Courses' : 'Recent Payments'}
            </h2>
            <Link 
              to={user?.role === 'instructor' ? '/courses' : '/my-payments'} 
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium"
            >
              View All
            </Link>
          </div>
          
          <div className="space-y-4">
            {user?.role === 'instructor' ? (
              myCourses.length > 0 ? (
                myCourses.map((course) => (
                  <div key={course.id} className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                      <AcademicCapIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-white">{course.title}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">${course.price}</p>
                    </div>
                    <Link 
                      to={`/edit-course/${course.id}`}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium"
                    >
                      Edit
                    </Link>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <AcademicCapIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400 mb-2">No courses created yet</p>
                  <Link 
                    to="/create-course" 
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Create Course
                  </Link>
                </div>
              )
            ) : (
              recentPayments.length > 0 ? (
                recentPayments.map((payment) => (
                  <div key={payment.id} className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                      <CreditCardIcon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-white">
                        ${(payment.amountCents / 100).toFixed(2)} {payment.currency.toUpperCase()}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Status: <span className="capitalize">{payment.status}</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(payment.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <CreditCardIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">No payments yet</p>
                </div>
              )
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link 
            to="/courses" 
            className="flex items-center space-x-3 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-200"
          >
            <BookOpenIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            <span className="font-medium text-gray-900 dark:text-white">Browse Courses</span>
          </Link>
          
          <Link 
            to="/my-enrollments" 
            className="flex items-center space-x-3 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-200"
          >
            <AcademicCapIcon className="w-8 h-8 text-green-600 dark:text-green-400" />
            <span className="font-medium text-gray-900 dark:text-white">My Learning</span>
          </Link>
          
          {user?.role === 'instructor' && (
            <Link 
              to="/create-course" 
              className="flex items-center space-x-3 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-200"
            >
              <PlusIcon className="w-8 h-8 text-orange-600 dark:text-orange-400" />
              <span className="font-medium text-gray-900 dark:text-white">Create Course</span>
            </Link>
          )}
          
          <Link 
            to="/profile" 
            className="flex items-center space-x-3 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-200"
          >
            <UserGroupIcon className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            <span className="font-medium text-gray-900 dark:text-white">Profile Settings</span>
          </Link>
        </div>
      </div>
    </div>
  )
}