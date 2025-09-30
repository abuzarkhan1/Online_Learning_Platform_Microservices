import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { useParams, useNavigate, useLocation } from "react-router-dom"
import { useState } from "react"
import { paymentApi } from "../../lib/api"
import { toast } from "../../components/ui/Toast"
import { 
  CreditCardIcon, 
  ShieldCheckIcon, 
  LockClosedIcon,
  CheckCircleIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline'

export default function Checkout() {
  const { enrollmentId } = useParams()
  const location = useLocation()
  const amountFromState = location.state?.amount || location.state?.amountCents || 0
  const currencyFromState = location.state?.currency || "usd"
  const stripe = useStripe()
  const elements = useElements()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const amountCents = Math.round(amountFromState)
  const displayAmount = (amountCents / 100).toFixed(2)

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#374151',
        '::placeholder': {
          color: '#9CA3AF',
        },
        iconColor: '#6B7280',
      },
      invalid: {
        color: '#EF4444',
        iconColor: '#EF4444',
      },
    },
    hidePostalCode: false,
  }

  const handlePayment = async () => {
    if (!stripe || !elements) return
    
    setLoading(true)
    setError("")
    
    try {
      const { paymentMethod, error: pmErr } = await stripe.createPaymentMethod({
        type: "card",
        card: elements.getElement(CardElement),
      })
      
      if (pmErr) throw pmErr
      
      const body = {
        enrollmentId: String(enrollmentId),
        amountCents: amountCents,
        currency: currencyFromState,
        description: "Course purchase",
        paymentMethodId: paymentMethod.id,
      }
      
      await paymentApi.post("/api/payments/", body)
      toast.success("Payment successful! Welcome to your new course!")
      
      setTimeout(() => {
        navigate("/my-enrollments")
      }, 2000)
    } catch (e) {
      const errorMessage = e?.message || e?.response?.data?.error || "Payment failed"
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Payment Form */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-700">
          {/* Header */}
          <div className="flex items-center mb-8">
            <button
              onClick={() => navigate(-1)}
              className="mr-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Complete Your Purchase
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Secure checkout powered by Stripe
              </p>
            </div>
          </div>

          {/* Payment Method */}
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <CreditCardIcon className="w-6 h-6 text-blue-600 dark:text-blue-400 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Payment Method
              </h2>
            </div>
            
            <div className="border border-gray-300 dark:border-gray-600 rounded-xl p-4 bg-gray-50 dark:bg-gray-700">
              <CardElement options={cardElementOptions} />
            </div>
            
            {error && (
              <div className="mt-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
                <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
              </div>
            )}
          </div>

          {/* Security Features */}
          <div className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                <ShieldCheckIcon className="w-6 h-6 text-green-600 dark:text-green-400 mr-3" />
                <div>
                  <p className="font-medium text-green-800 dark:text-green-200">SSL Encrypted</p>
                  <p className="text-sm text-green-600 dark:text-green-400">Your data is secure</p>
                </div>
              </div>
              <div className="flex items-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                <LockClosedIcon className="w-6 h-6 text-blue-600 dark:text-blue-400 mr-3" />
                <div>
                  <p className="font-medium text-blue-800 dark:text-blue-200">PCI Compliant</p>
                  <p className="text-sm text-blue-600 dark:text-blue-400">Industry standard</p>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Button */}
          <button
            disabled={loading || !stripe}
            onClick={handlePayment}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:shadow-lg hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Processing Payment...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <LockClosedIcon className="w-5 h-5 mr-2" />
                Pay ${displayAmount} {currencyFromState.toUpperCase()}
              </div>
            )}
          </button>

          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
            By completing this purchase, you agree to our Terms of Service
          </p>
        </div>

        {/* Order Summary */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
            Order Summary
          </h2>

          {/* Course Preview */}
          <div className="bg-gradient-to-r from-blue-400 to-purple-500 rounded-xl p-6 text-white mb-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center mr-4">
                <CreditCardIcon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold">Course Purchase</h3>
                <p className="text-sm opacity-80">Enrollment ID: {enrollmentId}</p>
              </div>
            </div>
          </div>

          {/* Pricing Breakdown */}
          <div className="space-y-4 mb-6">
            <div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-700">
              <span className="text-gray-600 dark:text-gray-400">Course Price</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                ${displayAmount}
              </span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-700">
              <span className="text-gray-600 dark:text-gray-400">Processing Fee</span>
              <span className="font-semibold text-gray-900 dark:text-white">$0.00</span>
            </div>
            <div className="flex justify-between items-center py-3 text-lg font-bold">
              <span className="text-gray-900 dark:text-white">Total</span>
              <span className="text-blue-600 dark:text-blue-400">
                ${displayAmount} {currencyFromState.toUpperCase()}
              </span>
            </div>
          </div>

          {/* What's Included */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
              What's Included
            </h3>
            <div className="space-y-3">
              {[
                'Lifetime access to course content',
                'All course materials and resources',
                'Certificate of completion',
                'Mobile and desktop access',
                '30-day money-back guarantee'
              ].map((item, index) => (
                <div key={index} className="flex items-center">
                  <CheckCircleIcon className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}