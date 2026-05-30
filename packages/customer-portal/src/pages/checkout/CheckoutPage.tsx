import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { usePageTitle } from '@/hooks/usePageTitle'
import { motion } from 'framer-motion'
import { CheckCircle, MapPin, User, Clock, CreditCard } from 'lucide-react'
import { Button, Card } from '@/components/common'
import { Confetti } from '@/components/common'

export default function CheckoutPage() {
  const { t } = useTranslation()
  usePageTitle('Checkout')

  const [currentStep, setCurrentStep] = useState(1)
  const [showConfetti, setShowConfetti] = useState(false)
  const [formData, setFormData] = useState({
    address: ''
, addressType: 'home',
    recipient: '',
    phone: '',
    deliveryDate: '',
    deliverySlot: '',
    paymentMethod: 'upi',
  })

  const steps = [
    { id: 1, title: 'Delivery', icon: MapPin },
    { id: 2, title: 'Recipient', icon: User },
    { id: 3, title: 'Date & Time', icon: Clock },
    { id: 4, title: 'Payment', icon: CreditCard },
  ]

  const deliverySlots = [
    '9:00 AM - 11:00 AM',
    '11:00 AM - 1:00 PM',
    '2:00 PM - 4:00 PM',
    '4:00 PM - 6:00 PM',
    '6:00 PM - 8:00 PM',
  ]

  const handleNext = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1)
  }

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  const handleSubmit = () => {
    setShowConfetti(true)
    setTimeout(() => {
      alert('Order placed successfully!')
    }, 500)
  }

  const subtotal = 698
  const tax = subtotal * 0.05
  const delivery = 50
  const total = subtotal + tax + delivery

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white py-8 px-4">
      {showConfetti && <Confetti count={40} duration={2500} />}

      <div className="max-w-4xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex justify-between mb-8">
            {steps.map((step, idx) => {
              const isCompleted = step.id < currentStep
              const isActive = step.id === currentStep
              const Icon = step.icon

              return (
                <motion.div
                  key={step.id}
                  className="flex flex-col items-center flex-1"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <motion.button
                    onClick={() => step.id < currentStep && setCurrentStep(step.id)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold mb-2 transition ${
                      isCompleted
                        ? 'bg-accent-950 text-white'
                        : isActive
                        ? 'bg-primary-950 text-white ring-4 ring-primary-200'
                        : 'bg-secondary-200 text-secondary-600'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : (
                      <Icon className="w-6 h-6" />
                    )}
                  </motion.button>
                  <p className="text-xs font-semibold text-secondary-700 whitespace-nowrap">
                    {step.title}
                  </p>
                </motion.div>
              )
            })}
          </div>
          <div className="h-1 bg-secondary-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary-950 to-accent-950"
              initial={{ width: '0%' }}
              animate={{ width: `${(currentStep / 4) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              key={currentStep}
            >
              {/* Step 1: Delivery Address */}
              {currentStep === 1 && (
                <Card className="p-8 space-y-6">
                  <h2 className="text-2xl font-bold text-secondary-900">Delivery Address</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-secondary-900 mb-2">
                        Address
                      </label>
                      <textarea
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        placeholder="Enter your delivery address"
                        className="w-full px-4 py-3 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-950"
                        rows={3}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-secondary-900 mb-2">
                        Address Type
                      </label>
                      <div className="flex gap-3">
                        {['home', 'office', 'other'].map(type => (
                          <button
                            key={type}
                            onClick={() => setFormData({ ...formData, addressType: type })}
                            className={`px-4 py-2 rounded-lg border-2 capitalize transition ${
                              formData.addressType === type
                                ? 'border-primary-950 bg-primary-950 text-white'
                                : 'border-secondary-200 text-secondary-700 hover:border-primary-950'
                            }`}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              )}

              {/* Step 2: Recipient Details */}
              {currentStep === 2 && (
                <Card className="p-8 space-y-6">
                  <h2 className="text-2xl font-bold text-secondary-900">Recipient Details</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-secondary-900 mb-2">
                        Recipient Name
                      </label>
                      <input
                        type="text"
                        value={formData.recipient}
                        onChange={(e) => setFormData({ ...formData, recipient: e.target.value })}
                        placeholder="Enter recipient's name"
                        className="w-full px-4 py-3 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-950"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-secondary-900 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="10-digit mobile number"
                        className="w-full px-4 py-3 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-950"
                      />
                    </div>
                  </div>
                </Card>
              )}

              {/* Step 3: Date & Time Slot */}
              {currentStep === 3 && (
                <Card className="p-8 space-y-6">
                  <h2 className="text-2xl font-bold text-secondary-900">Delivery Date & Time</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-secondary-900 mb-2">
                        Delivery Date
                      </label>
                      <input
                        type="date"
                        value={formData.deliveryDate}
                        onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
                        className="w-full px-4 py-3 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-950"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-secondary-900 mb-3">
                        Delivery Slot
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {deliverySlots.map(slot => (
                          <button
                            key={slot}
                            onClick={() => setFormData({ ...formData, deliverySlot: slot })}
                            className={`px-4 py-2 rounded-lg border-2 transition text-sm ${
                              formData.deliverySlot === slot
                                ? 'border-primary-950 bg-primary-950 text-white'
                                : 'border-secondary-200 text-secondary-700 hover:border-primary-950'
                            }`}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              )}

              {/* Step 4: Payment Method */}
              {currentStep === 4 && (
                <Card className="p-8 space-y-6">
                  <h2 className="text-2xl font-bold text-secondary-900">Payment Method</h2>
                  <div className="space-y-3">
                    {['upi', 'card', 'wallet', 'cod'].map(method => (
                      <label
                        key={method}
                        className="flex items-center p-4 border-2 rounded-lg cursor-pointer transition hover:bg-secondary-50"
                        style={{
                          borderColor:
                            formData.paymentMethod === method ? 'rgb(15, 23, 42)' : 'rgb(226, 232, 240)',
                          backgroundColor:
                            formData.paymentMethod === method ? 'rgb(243, 244, 246)' : 'transparent',
                        }}
                      >
                        <input
                          type="radio"
                          value={method}
                          checked={formData.paymentMethod === method}
                          onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                          className="w-4 h-4"
                        />
                        <span className="ml-3 font-semibold text-secondary-900 capitalize">
                          {method === 'upi'
                            ? 'UPI'
                            : method === 'card'
                            ? 'Credit/Debit Card'
                            : method === 'wallet'
                            ? 'Mobile Wallet'
                            : 'Cash on Delivery'}
                        </span>
                      </label>
                    ))}
                  </div>
                </Card>
              )}

              {/* Navigation Buttons */}
              <div className="flex gap-4 mt-8">
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={handlePrev}
                  disabled={currentStep === 1}
                  className="disabled:opacity-50"
                >
                  Back
                </Button>
                {currentStep < 4 ? (
                  <Button variant="primary" size="lg" onClick={handleNext} className="flex-1">
                    Next
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={handleSubmit}
                    className="flex-1 bg-accent-950 hover:bg-rose-700"
                  >
                    Place Order
                  </Button>
                )}
              </div>
            </motion.div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="sticky top-24"
            >
              <Card className="p-6 space-y-6">
                <h3 className="font-bold text-lg text-secondary-900">Order Summary</h3>

                {/* Items */}
                <div className="space-y-3 pb-4 border-b border-secondary-200">
                  <div className="flex justify-between">
                    <span className="text-secondary-600">Red Roses Bunch × 2</span>
                    <span className="font-semibold text-secondary-900">₹698</span>
                  </div>
                </div>

                {/* Pricing */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-secondary-600">
                    <span>Subtotal</span>
                    <span>₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between text-secondary-600">
                    <span>Tax (5%)</span>
                    <span>₹{tax.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between text-secondary-600">
                    <span>Delivery</span>
                    <span>₹{delivery}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-secondary-200 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-accent-950">₹{total.toFixed(0)}</span>
                </div>

                <div className="bg-secondary-50 p-4 rounded-lg text-xs text-secondary-600 space-y-1">
                  <p>✓ Same day delivery available</p>
                  <p>✓ Fresh flowers guaranteed</p>
                  <p>✓ Free greeting card</p>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
