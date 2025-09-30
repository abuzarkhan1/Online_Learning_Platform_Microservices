import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { courseApi } from '../lib/api'
import { getToken } from '../lib/auth'
import { 
  BookOpenIcon, 
  UserGroupIcon, 
  AcademicCapIcon,
  StarIcon,
  PlayIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  SparklesIcon
} from '@heroicons/react/24/outline'

export default function Landing() {
  const [featuredCourses, setFeaturedCourses] = useState([])
  const [stats, setStats] = useState({ courses: 0, students: 0, instructors: 0 })
  const isAuthenticated = !!getToken()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await courseApi.get('/courses?limit=3')
        setFeaturedCourses(data || [])
        setStats({
          courses: data?.length || 0,
          students: 1250,
          instructors: 89
        })
      } catch (error) {
        console.error('Failed to fetch courses:', error)
      }
    }
    fetchData()
  }, [])

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative py-20 px-4 text-center">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 dark:from-blue-400/10 dark:to-purple-400/10"></div>
        <div className="relative max-w-6xl mx-auto">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-sm font-medium mb-8">
            <SparklesIcon className="w-4 h-4 mr-2" />
            Welcome to the Future of Learning
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent leading-tight">
            Master New Skills
            <br />
            <span className="text-gray-900 dark:text-white">Transform Your Future</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed">
            Join thousands of learners worldwide. Access premium courses, learn from industry experts, 
            and advance your career with our cutting-edge learning platform.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {isAuthenticated ? (
              <Link 
                to="/dashboard" 
                className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center"
              >
                Go to Dashboard
                <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            ) : (
              <>
                <Link 
                  to="/register" 
                  className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center"
                >
                  Start Learning Today
                  <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link 
                  to="/courses" 
                  className="group px-8 py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-semibold text-lg hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 flex items-center"
                >
                  <PlayIcon className="w-5 h-5 mr-2" />
                  Explore Courses
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="group">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <BookOpenIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{stats.courses}+</h3>
              <p className="text-gray-600 dark:text-gray-400">Premium Courses</p>
            </div>
            <div className="group">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <UserGroupIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{stats.students.toLocaleString()}+</h3>
              <p className="text-gray-600 dark:text-gray-400">Active Students</p>
            </div>
            <div className="group">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <AcademicCapIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{stats.instructors}+</h3>
              <p className="text-gray-600 dark:text-gray-400">Expert Instructors</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
              Featured Courses
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Discover our most popular courses designed by industry experts
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCourses.map((course) => (
              <div key={course.id} className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700">
                <div className="h-48 bg-gradient-to-br from-blue-400 to-purple-500 relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center text-white text-sm">
                      <StarIcon className="w-4 h-4 fill-current mr-1" />
                      <span>4.8</span>
                      <span className="ml-2 opacity-80">• 1,234 students</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                    {course.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      ${course.price}
                    </span>
                    <Link 
                      to={`/courses/${course.id}`}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center"
                    >
                      View Course
                      <ArrowRightIcon className="w-4 h-4 ml-1" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link 
              to="/courses" 
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold text-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              View All Courses
              <ArrowRightIcon className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
              Why Choose Our Platform?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Experience learning like never before with our advanced features
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <BookOpenIcon className="w-8 h-8" />,
                title: "Premium Content",
                description: "Access high-quality courses created by industry experts and thought leaders."
              },
              {
                icon: <CheckCircleIcon className="w-8 h-8" />,
                title: "Progress Tracking",
                description: "Monitor your learning journey with detailed progress analytics and achievements."
              },
              {
                icon: <AcademicCapIcon className="w-8 h-8" />,
                title: "Certificates",
                description: "Earn verified certificates upon course completion to showcase your skills."
              },
              {
                icon: <UserGroupIcon className="w-8 h-8" />,
                title: "Community",
                description: "Connect with fellow learners and instructors in our vibrant community."
              },
              {
                icon: <PlayIcon className="w-8 h-8" />,
                title: "Interactive Learning",
                description: "Engage with interactive content, quizzes, and hands-on projects."
              },
              {
                icon: <SparklesIcon className="w-8 h-8" />,
                title: "AI-Powered",
                description: "Get personalized recommendations and adaptive learning paths."
              }
            ].map((feature, index) => (
              <div key={index} className="group p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Ready to Start Your Learning Journey?
              </h2>
              <p className="text-xl mb-8 opacity-90">
                Join thousands of students already learning on our platform
              </p>
              {!isAuthenticated && (
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link 
                    to="/register" 
                    className="px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-colors duration-200"
                  >
                    Get Started Free
                  </Link>
                  <Link 
                    to="/courses" 
                    className="px-8 py-4 border-2 border-white text-white rounded-xl font-semibold text-lg hover:bg-white hover:text-blue-600 transition-all duration-200"
                  >
                    Browse Courses
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}