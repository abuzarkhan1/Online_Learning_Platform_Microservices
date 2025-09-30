import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { courseApi, enrollApi } from '../../lib/api'
import { getUserFromToken } from '../../lib/auth'
import { toast } from '../../components/ui/Toast'
import { 
  BookOpenIcon, 
  StarIcon, 
  UserGroupIcon,
  ClockIcon,
  AcademicCapIcon,
  PlayIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  CurrencyDollarIcon,
  GlobeAltIcon,
  DevicePhoneMobileIcon,
  TrophyIcon,
  ShareIcon,
  HeartIcon
} from '@heroicons/react/24/outline'

export default function CourseDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const user = getUserFromToken()
  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [enrolling, setEnrolling] = useState(false)

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const { data } = await courseApi.get(`/courses/${id}`)
        setCourse(data)
      } catch (error) {
        console.error('Failed to fetch course:', error)
        toast.error('Failed to load course details')
      } finally {
        setLoading(false)
      }
    }
    fetchCourse()
  }, [id])

  const handleEnroll = async () => {
    if (!user) {
      navigate('/login')
      return
    }

    setEnrolling(true)
    try {
      const { data } = await enrollApi.post('/enrollments', { courseId: Number(id) })
      const enrollmentId = data?.enrollmentId ?? data?.id ?? data
      const amountCents = typeof course?.priceCents === 'number' 
        ? course.priceCents 
        : Math.round(Number(course?.price || 0) * 100)
      
      if (enrollmentId) {
        toast.success('Successfully enrolled! Redirecting to checkout...')
        setTimeout(() => {
          navigate(`/checkout/${enrollmentId}`, { 
            state: { amountCents, currency: 'usd' } 
          })
        }, 1500)
      } else {
        toast.error('Failed to create enrollment')
      }
    } catch (error) {
      toast.error(error?.response?.data?.error || 'Failed to enroll in course')
    } finally {
      setEnrolling(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading course details...</p>
        </div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <BookOpenIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Course Not Found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">The course you're looking for doesn't exist.</p>
          <button 
            onClick={() => navigate('/courses')}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
          >
            Browse All Courses
          </button>
        </div>
      </div>
    )
  }

  const features = [
    { icon: <GlobeAltIcon className="w-5 h-5" />, text: 'Lifetime Access' },
    { icon: <DevicePhoneMobileIcon className="w-5 h-5" />, text: 'Mobile Friendly' },
    { icon: <TrophyIcon className="w-5 h-5" />, text: 'Certificate of Completion' },
    { icon: <CheckCircleIcon className="w-5 h-5" />, text: '30-Day Money Back' }
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Course Info */}
        <div className="lg:col-span-2">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-6">
            <button onClick={() => navigate('/courses')} className="hover:text-blue-600 dark:hover:text-blue-400">
              Courses
            </button>
            <span>/</span>
            <span className="text-gray-900 dark:text-white">{course.title}</span>
          </nav>

          {/* Course Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white mb-8">
            <div className="flex items-center mb-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1 mr-4">
                <span className="text-sm font-medium">Course</span>
              </div>
              <div className="flex items-center">
                <StarIcon className="w-5 h-5 fill-current mr-1" />
                <span className="font-semibold mr-2">4.8</span>
                <span className="opacity-80">(1,234 reviews)</span>
              </div>
            </div>

            <h1 className="text-4xl font-bold mb-4 leading-tight">
              {course.title}
            </h1>

            <p className="text-xl opacity-90 mb-6 leading-relaxed">
              {course.description || 'Master new skills with this comprehensive course designed by industry experts.'}
            </p>

            <div className="flex flex-wrap items-center gap-6 text-sm">
              <div className="flex items-center">
                <UserGroupIcon className="w-5 h-5 mr-2" />
                <span>1,234 students enrolled</span>
              </div>
              <div className="flex items-center">
                <ClockIcon className="w-5 h-5 mr-2" />
                <span>12 hours of content</span>
              </div>
              <div className="flex items-center">
                <BookOpenIcon className="w-5 h-5 mr-2" />
                <span>{course.lessons?.length || 0} lessons</span>
              </div>
            </div>
          </div>

          {/* Course Content */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-700 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              What you'll learn
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                'Master the fundamentals and advanced concepts',
                'Build real-world projects from scratch',
                'Learn industry best practices and standards',
                'Get hands-on experience with modern tools',
                'Understand core principles and methodologies',
                'Develop problem-solving skills'
              ].map((item, index) => (
                <div key={index} className="flex items-start">
                  <CheckCircleIcon className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Course Curriculum */}
          {course.lessons && course.lessons.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Course Curriculum
              </h2>
              <div className="space-y-4">
                {course.lessons.map((lesson, index) => (
                  <div key={lesson.id} className="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mr-4">
                      <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm">
                        {index + 1}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {lesson.title}
                      </h3>
                      {lesson.content && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {lesson.content.substring(0, 100)}...
                        </p>
                      )}
                    </div>
                    <PlayIcon className="w-5 h-5 text-gray-400" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-8">
            {/* Course Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
              {/* Preview Image */}
              <div className="h-48 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 relative">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <button className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
                    <PlayIcon className="w-8 h-8 text-white ml-1" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                {/* Price */}
                <div className="text-center mb-6">
                  <div className="flex items-center justify-center mb-2">
                    <span className="text-4xl font-bold text-gray-900 dark:text-white">
                      ${course.price}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400 ml-2">USD</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    One-time payment • Lifetime access
                  </p>
                </div>

                {/* Enroll Button */}
                <button
                  onClick={handleEnroll}
                  disabled={enrolling}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:shadow-lg hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none mb-4"
                >
                  {enrolling ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Enrolling...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <CurrencyDollarIcon className="w-5 h-5 mr-2" />
                      Enroll Now
                    </div>
                  )}
                </button>

                {/* Features */}
                <div className="space-y-3 mb-6">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <div className="text-green-500 mr-3">
                        {feature.icon}
                      </div>
                      <span>{feature.text}</span>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex space-x-3">
                  <button className="flex-1 flex items-center justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <HeartIcon className="w-4 h-4 mr-2" />
                    Save
                  </button>
                  <button className="flex-1 flex items-center justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <ShareIcon className="w-4 h-4 mr-2" />
                    Share
                  </button>
                </div>
              </div>
            </div>

            {/* Instructor Info */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 mt-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Your Instructor
              </h3>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mr-4">
                  <AcademicCapIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Expert Instructor</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Industry Professional</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}