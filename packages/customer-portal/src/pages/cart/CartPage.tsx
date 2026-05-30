import { useTranslation } from 'react-i18next'
import { usePageTitle } from '@/hooks/usePageTitle'
import { ShoppingCart, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function CartPage() {
  const { t } = useTranslation()
  usePageTitle('Cart')

  const cartItems = [
    {
      id: 1,
      name: 'Red Roses Bunch',
      image: 'https://images.unsplash.com/photo-1519915212116-7cfef71f910d?w=300&h=300&fit=crop',
      price: 349,
      quantity: 2,
      subtotal: 698,
    },
  ]

  const subtotal = cartItems.reduce((sum, item) => sum + item.subtotal, 0)
  const tax = subtotal * 0.05
  const delivery = 50
  const total = subtotal + tax + delivery

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">{t('common.cart')}</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            {cartItems.length > 0 ? (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="card p-4 flex gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-bold">{item.name}</h3>
                      <p className="text-gray-600">₹{item.price}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="flex items-center border border-gray-300 rounded-lg">
                        <button className="px-2 py-1 text-gray-600">−</button>
                        <span className="px-3 py-1">{item.quantity}</span>
                        <button className="px-2 py-1 text-gray-600">+</button>
                      </div>
                      <p className="font-bold">₹{item.subtotal}</p>
                      <button className="text-red-700 hover:text-red-800">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <ShoppingCart size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 mb-4">Your cart is empty</p>
                <Link to="/products" className="btn btn-primary">
                  {t('common.continue_shopping')}
                </Link>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-4 space-y-4">
              <h2 className="text-xl font-bold">Order Summary</h2>

              <div className="space-y-3 pb-3 border-b">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (5%)</span>
                  <span>₹{tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span>₹{delivery.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>

              <button className="btn btn-primary w-full py-3">
                {t('common.proceed_checkout')}
              </button>

              <Link to="/products" className="btn btn-secondary w-full text-center">
                {t('common.continue_shopping')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
