import { Link } from 'react-router-dom'
import { 
  AcademicCapIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon
} from '@heroicons/react/24/outline'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <AcademicCapIcon className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold">LearnHub</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Empowering learners worldwide with premium courses and expert instruction. 
              Transform your career with our cutting-edge learning platform.
            </p>
            <div className="flex space-x-4">
              {/* Social Media Icons */}
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors duration-200">
                <span className="text-sm font-bold">f</span>
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors duration-200">
                <span className="text-sm font-bold">t</span>
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors duration-200">
                <span className="text-sm font-bold">in</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/courses" className="text-gray-400 hover:text-white transition-colors duration-200">Browse Courses</Link></li>
              <li><Link to="/register" className="text-gray-400 hover:text-white transition-colors duration-200">Sign Up</Link></li>
              <li><Link to="/login" className="text-gray-400 hover:text-white transition-colors duration-200">Sign In</Link></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">About Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Contact</a></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Web Development</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Data Science</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Mobile Development</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Design</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Business</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3">
                <EnvelopeIcon className="w-5 h-5 text-gray-400" />
                <span className="text-gray-400">support@learnhub.com</span>
              </li>
              <li className="flex items-center space-x-3">
                <PhoneIcon className="w-5 h-5 text-gray-400" />
                <span className="text-gray-400">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-start space-x-3">
                <MapPinIcon className="w-5 h-5 text-gray-400 mt-0.5" />
                <span className="text-gray-400">123 Learning Street<br />Education City, EC 12345</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 LearnHub. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors duration-200">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors duration-200">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors duration-200">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}