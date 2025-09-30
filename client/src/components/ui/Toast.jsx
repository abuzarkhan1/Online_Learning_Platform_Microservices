import { useState, useEffect } from 'react'
import { 
  CheckCircleIcon, 
  ExclamationTriangleIcon, 
  InformationCircleIcon,
  XCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'

let toastId = 0
const toasts = new Map()
const listeners = new Set()

export const toast = {
  success: (message, options = {}) => showToast('success', message, options),
  error: (message, options = {}) => showToast('error', message, options),
  warning: (message, options = {}) => showToast('warning', message, options),
  info: (message, options = {}) => showToast('info', message, options),
}

function showToast(type, message, options) {
  const id = ++toastId
  const toast = {
    id,
    type,
    message,
    duration: options.duration || 5000,
    ...options
  }
  
  toasts.set(id, toast)
  notifyListeners()
  
  if (toast.duration > 0) {
    setTimeout(() => {
      toasts.delete(id)
      notifyListeners()
    }, toast.duration)
  }
  
  return id
}

function notifyListeners() {
  listeners.forEach(listener => listener(Array.from(toasts.values())))
}

export function Toaster() {
  const [toastList, setToastList] = useState([])

  useEffect(() => {
    const listener = (toasts) => setToastList(toasts)
    listeners.add(listener)
    return () => listeners.delete(listener)
  }, [])

  const removeToast = (id) => {
    toasts.delete(id)
    notifyListeners()
  }

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />
      case 'error':
        return <XCircleIcon className="w-5 h-5 text-red-500" />
      case 'warning':
        return <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500" />
      case 'info':
        return <InformationCircleIcon className="w-5 h-5 text-blue-500" />
      default:
        return <InformationCircleIcon className="w-5 h-5 text-blue-500" />
    }
  }

  const getStyles = (type) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
      case 'error':
        return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
      case 'warning':
        return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
      case 'info':
        return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
      default:
        return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
    }
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toastList.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center p-4 rounded-xl border shadow-lg backdrop-blur-sm max-w-sm animate-in slide-in-from-right duration-300 ${getStyles(toast.type)}`}
        >
          <div className="flex-shrink-0">
            {getIcon(toast.type)}
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {toast.message}
            </p>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="ml-4 flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <XMarkIcon className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  )
}