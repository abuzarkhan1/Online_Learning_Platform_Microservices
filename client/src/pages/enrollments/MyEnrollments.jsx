import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { enrollApi } from '../../lib/api'
import { toast } from '../../components/ui/Toast'
import { 
  BookOpenIcon, 
  AcademicCapIcon,
  ClockIcon,
  CheckCircleIcon,
  PlayIcon,
  TrophyIcon,
  CalendarIcon,
  ArrowRightIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline'

export default function MyEnrollments() {
  const [enrollments, setEnrollments] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const { data } = await enrollApi.get('/enrollments/me')
        setEnrollments(data || [])
      } catch (error) {
        console.error('Failed to fetch enrollments:', error)
        toast.error('Failed to load your enrollments')
      } finally {
        setLoading(false)
      }
    }
    fetchEnrollments()
  }, [])

  const filteredEnrollments = enrollments.filter(enrollment => {
    if (filter === 'all') return true
    return enrollment.status.toLowerCase() === filter.toLowerCase()
  })

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
      case 'in_progress':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200'
      case 'cancelled':
        return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'
      default:
        return 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-200'
    }
  }

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return <TrophyIcon className="w-5 h-5" />
      case 'in_progress':
        return <PlayIcon className="w-5 h-5" />
      case 'cancelled':
        return <ClockIcon className="w-5 h-5" />
      default:
        return <BookOpenIcon className="w-5 h-5" />
    }
  }

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading your enrollments...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <AcademicCapIcon className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          My Learning Journey
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Track your progress and continue learning
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Enrolled</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{enrollments.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
              <BookOpenIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">In Progress</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {enrollments.filter(e => e.status.toLowerCase() === 'in_progress').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center">
              <ChartBarIcon className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {enrollments.filter(e => e.status.toLowerCase() === 'completed').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
              <TrophyIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 mb-8">
        <div className="flex flex-wrap gap-2">
          {[
            { key: 'all', label: 'All Courses' },
            { key: 'in_progress', label: 'In Progress' },
            { key: 'completed', label: 'Completed' },
            { key: 'cancelled', label: 'Cancelled' }
          ].map((filterOption) => (
            <button
              key={filterOption.key}
              onClick={() => setFilter(filterOption.key)}
              className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                filter === filterOption.key
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {filterOption.label}
            </button>
          ))}
        </div>
      </div>

      {/* Enrollments List */}
      {filteredEnrollments.length === 0 ? (
        <div className="text-center py-16">
          <AcademicCapIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {filter === 'all' ? 'No enrollments yet' : `No ${filter.replace('_', ' ')} courses`}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {filter === 'all' 
              ? 'Start your learning journey by enrolling in a course'
              : `You don't have any ${filter.replace('_', ' ')} courses yet`
            }
          </p>
          <Link 
            to="/courses" 
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200"
          >
            <BookOpenIcon className="w-5 h-5 mr-2" />
            Browse Courses
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEnrollments.map((enrollment) => (
            <div key={enrollment.enrollmentId} className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700">
              {/* Course Header */}
              <div className="h-32 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 relative overflow-hidden">
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300"></div>
                <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                  <div className={`px-3 py-1 rounded-lg text-sm font-medium ${getStatusColor(enrollment.status)}`}>
                    <div className="flex items-center">
                      {getStatusIcon(enrollment.status)}
                      <span className="ml-1 capitalize">{enrollment.status.replace('_', ' ')}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Course Content */}
              <div className="p-6">
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mr-3">
                    <BookOpenIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Course #{enrollment.courseId}
                  </span>
                </div>

                <h3 className="text-lg font-bold mb-3 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  Course Enrollment #{enrollment.enrollmentId}
                </h3>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Progress</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {enrollment.status.toLowerCase() === 'completed' ? '100%' : '45%'}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: enrollment.status.toLowerCase() === 'completed' ? '100%' : '45%' 
                      }}
                    ></div>
                  </div>
                </div>

                {/* Enrollment Date */}
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  <span>Enrolled {new Date(enrollment.enrolledAt).toLocaleDateString()}</span>
                </div>

                {/* Action Button */}
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {enrollment.status.toLowerCase() === 'completed' ? (
                      <span className="flex items-center text-green-600 dark:text-green-400">
                        <CheckCircleIcon className="w-4 h-4 mr-1" />
                        Completed
                      </span>
                    ) : (
                      <span>Continue Learning</span>
                    )}
                  </div>
                  <Link 
                    to={`/courses/${enrollment.courseId}`}
                    className="group/btn inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    {enrollment.status.toLowerCase() === 'completed' ? 'Review' : 'Continue'}
                    <ArrowRightIcon className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Call to Action */}
      {enrollments.length > 0 && (
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-white">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Learn More?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Discover new courses and expand your skills
            </p>
            <Link 
              to="/courses"
              className="inline-flex items-center px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold hover:bg-gray-100 transition-colors duration-200"
            >
              <BookOpenIcon className="w-5 h-5 mr-2" />
              Browse More Courses
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}