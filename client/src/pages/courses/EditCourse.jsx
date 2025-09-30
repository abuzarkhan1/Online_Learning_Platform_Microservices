import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { courseApi } from '../../lib/api'
import { toast } from '../../components/ui/Toast'
import { 
  BookOpenIcon, 
  PlusIcon, 
  XMarkIcon,
  AcademicCapIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  PlayIcon,
  PencilIcon
} from '@heroicons/react/24/outline'

export default function EditCourse() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    lessons: []
  })

  const [currentLesson, setCurrentLesson] = useState({
    title: '',
    content: ''
  })

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const { data } = await courseApi.get(`/courses/${id}`)
        setFormData({
          title: data.title || '',
          description: data.description || '',
          price: data.price?.toString() || '',
          lessons: data.lessons || []
        })
      } catch (error) {
        toast.error('Failed to load course details')
        navigate('/dashboard')
      } finally {
        setInitialLoading(false)
      }
    }
    fetchCourse()
  }, [id, navigate])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleLessonChange = (e) => {
    setCurrentLesson({
      ...currentLesson,
      [e.target.name]: e.target.value
    })
  }

  const addLesson = () => {
    if (currentLesson.title.trim()) {
      setFormData({
        ...formData,
        lessons: [...formData.lessons, { ...currentLesson }]
      })
      setCurrentLesson({ title: '', content: '' })
      toast.success('Lesson added successfully!')
    }
  }

  const removeLesson = (index) => {
    setFormData({
      ...formData,
      lessons: formData.lessons.filter((_, i) => i !== index)
    })
    toast.success('Lesson removed')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const courseData = {
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price)
      }
      
      await courseApi.put(`/courses/${id}`, courseData)
      toast.success('Course updated successfully!')
      navigate('/dashboard')
    } catch (error) {
      toast.error(error?.response?.data?.detail || 'Failed to update course')
    } finally {
      setLoading(false)
    }
  }

  if (initialLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading course details...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <PencilIcon className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Edit Course
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Update your course information and content
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Course Basic Info */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <BookOpenIcon className="w-6 h-6 mr-2 text-blue-600 dark:text-blue-400" />
            Course Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Course Title */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Course Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter an engaging course title"
                required
              />
            </div>

            {/* Course Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Price (USD) *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <CurrencyDollarIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="99.00"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
            </div>

            {/* Course Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Course Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Describe what students will learn in this course..."
                required
              />
            </div>
          </div>
        </div>

        {/* Existing Lessons */}
        {formData.lessons.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
              <PlayIcon className="w-6 h-6 mr-2 text-blue-600 dark:text-blue-400" />
              Current Lessons ({formData.lessons.length})
            </h2>
            
            <div className="space-y-4">
              {formData.lessons.map((lesson, index) => (
                <div key={index} className="flex items-start p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mr-4 mt-1">
                    <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm">
                      {index + 1}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                      {lesson.title}
                    </h4>
                    {lesson.content && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {lesson.content}
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeLesson(index)}
                    className="ml-4 p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add New Lesson */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <PlusIcon className="w-6 h-6 mr-2 text-blue-600 dark:text-blue-400" />
            Add New Lesson
          </h2>

          <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Lesson Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={currentLesson.title}
                  onChange={handleLessonChange}
                  className="block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter lesson title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Lesson Content
                </label>
                <textarea
                  name="content"
                  value={currentLesson.content}
                  onChange={handleLessonChange}
                  rows={3}
                  className="block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Describe the lesson content..."
                />
              </div>
            </div>
            <button
              type="button"
              onClick={addLesson}
              className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              <PlusIcon className="w-4 h-4 mr-2" />
              Add Lesson
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Updating Course...
              </div>
            ) : (
              <div className="flex items-center">
                <DocumentTextIcon className="w-5 h-5 mr-2" />
                Update Course
              </div>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}