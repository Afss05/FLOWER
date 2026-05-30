import { useState } from 'react'
import { motion } from 'framer-motion'
import { Edit2, Heart, Gift, Award, Bell, LogOut } from 'lucide-react'

interface TabType {
  id: string
  icon: React.ReactNode
  label: string
}

const tabs: TabType[] = [
  { id: 'overview', icon: '👤', label: 'Overview' },
  { id: 'addresses', icon: '📍', label: 'Addresses' },
  { id: 'wishlist', icon: '❤️', label: 'Wishlist' },
  { id: 'subscriptions', icon: '🔄', label: 'Subscriptions' },
  { id: 'reminders', icon: '🎁', label: 'Reminders' },
  { id: 'rewards', icon: '⭐', label: 'Rewards' },
  { id: 'settings', icon: '⚙️', label: 'Settings' },
]

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('overview')

  const user = {
    name: 'Rajesh Kumar',
    email: 'rajesh@example.com',
    phone: '+91 98765 43210',
    avatar: '👨‍💼',
  }

  const stats = [
    { label: 'Total Orders', value: '12', icon: '🛍️' },
    { label: 'Wishlist Items', value: '8', icon: '❤️' },
    { label: 'Reward Points', value: '2,450', icon: '⭐' },
    { label: 'Active Subscriptions', value: '2', icon: '🔄' },
  ]

  const addresses = [
    { id: 1, name: 'Home', address: '123 Main St, Chennai', isDefault: true },
    { id: 2, name: 'Office', address: '456 Business Park, Chennai', isDefault: false },
  ]

  const wishlistItems = [
    { id: 1, name: 'Red Roses Bunch', price: '₹349', image: '🌹' },
    { id: 2, name: 'Mixed Pooja Flowers', price: '₹599', image: '🌸' },
  ]

  const subscriptions = [
    { id: 1, name: 'Weekly Flowers', frequency: 'Weekly', price: '₹399', nextDelivery: 'June 5' },
    { id: 2, name: 'Monthly Pooja Kit', frequency: 'Monthly', price: '₹999', nextDelivery: 'June 15' },
  ]

  const reminders = [
    { date: 'June 5', occasion: "Mother's Birthday", daysLeft: 5 },
    { date: 'June 15', occasion: 'Anniversary', daysLeft: 15 },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-4xl font-bold text-secondary-900">My Profile</h1>
        <p className="text-secondary-600 mt-2">Manage your account and preferences</p>
      </motion.div>

      {/* Tab Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-base overflow-x-auto"
      >
        <div className="flex gap-0">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-4 font-medium whitespace-nowrap border-b-2 transition ${
                activeTab === tab.id
                  ? 'border-primary-950 text-primary-950'
                  : 'border-transparent text-secondary-600 hover:text-secondary-900'
              }`}
            >
              <span className="text-lg mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Tab Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        key={activeTab}
      >
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Profile Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-xl shadow-base p-8"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-6">
                  <div className="text-6xl">{user.avatar}</div>
                  <div>
                    <h2 className="text-2xl font-bold text-secondary-900">{user.name}</h2>
                    <p className="text-secondary-600">{user.email}</p>
                    <p className="text-secondary-600">{user.phone}</p>
                  </div>
                </div>
                <button className="bg-primary-950 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary-900 transition">
                  <Edit2 className="w-4 h-4" />
                  Edit
                </button>
              </div>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white rounded-xl shadow-base p-6"
                >
                  <p className="text-3xl mb-2">{stat.icon}</p>
                  <p className="text-secondary-600 text-sm">{stat.label}</p>
                  <p className="text-3xl font-bold text-secondary-900 mt-2">{stat.value}</p>
                </motion.div>
              ))}
            </div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-base p-6"
            >
              <h3 className="text-lg font-bold text-secondary-900 mb-4">Recent Activity</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center pb-3 border-b">
                  <span className="text-secondary-600">Order #ORD-001 Delivered</span>
                  <span className="text-sm text-secondary-500">2 days ago</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-secondary-600">Subscription renewed</span>
                  <span className="text-sm text-secondary-500">5 days ago</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {activeTab === 'addresses' && (
          <div className="space-y-4">
            {addresses.map((addr, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-xl shadow-base p-6"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-bold text-secondary-900">{addr.name}</h3>
                      {addr.isDefault && <span className="bg-primary-100 text-primary-950 px-2 py-1 rounded text-xs font-semibold">Default</span>}
                    </div>
                    <p className="text-secondary-600">{addr.address}</p>
                  </div>
                  <button className="text-secondary-600 hover:text-secondary-900">✎</button>
                </div>
              </motion.div>
            ))}
            <button className="w-full bg-primary-950 text-white py-3 rounded-xl hover:bg-primary-900 transition font-semibold">
              + Add Address
            </button>
          </div>
        )}

        {activeTab === 'wishlist' && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistItems.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-xl shadow-base p-6 text-center"
              >
                <div className="text-5xl mb-4">{item.image}</div>
                <h3 className="font-bold text-secondary-900 mb-2">{item.name}</h3>
                <p className="text-primary-950 font-bold mb-4">{item.price}</p>
                <button className="w-full bg-primary-950 text-white py-2 rounded-lg hover:bg-primary-900 transition text-sm font-semibold">
                  Add to Cart
                </button>
              </motion.div>
            ))}
          </div>
        )}

        {activeTab === 'subscriptions' && (
          <div className="grid sm:grid-cols-2 gap-6">
            {subscriptions.map((sub, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-xl shadow-base p-6"
              >
                <h3 className="font-bold text-secondary-900 mb-2">{sub.name}</h3>
                <p className="text-secondary-600 text-sm mb-4">{sub.frequency}</p>
                <p className="text-primary-950 font-bold text-lg mb-4">{sub.price}</p>
                <p className="text-sm text-secondary-600 mb-4">Next delivery: {sub.nextDelivery}</p>
                <button className="w-full border border-secondary-200 py-2 rounded-lg hover:bg-secondary-50 transition font-semibold">
                  Manage
                </button>
              </motion.div>
            ))}
          </div>
        )}

        {activeTab === 'reminders' && (
          <div className="space-y-4">
            {reminders.map((reminder, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-xl shadow-base p-6 flex items-center justify-between"
              >
                <div>
                  <p className="font-bold text-secondary-900">{reminder.occasion}</p>
                  <p className="text-secondary-600 text-sm">{reminder.date}</p>
                </div>
                <div className="text-right">
                  <span className="bg-warning/20 text-warning px-3 py-1 rounded-full text-sm font-semibold">{reminder.daysLeft} days</span>
                  <button className="mt-2 w-full bg-primary-950 text-white py-2 rounded-lg hover:bg-primary-900 transition text-xs font-semibold">
                    Send Gift
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {activeTab === 'rewards' && (
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gradient-to-r from-primary-950 to-primary-900 text-white rounded-xl p-8"
            >
              <p className="text-sm opacity-90">Total Reward Points</p>
              <p className="text-5xl font-bold mt-2">2,450</p>
              <p className="text-sm opacity-90 mt-4">Gold Member • 450 points to Platinum</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-base p-6"
            >
              <h3 className="font-bold text-secondary-900 mb-4">How to Earn Points</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-4 bg-primary-50 rounded-lg">
                  <p className="text-sm text-secondary-600">Place an Order</p>
                  <p className="text-lg font-bold text-primary-950">10 points/₹100</p>
                </div>
                <div className="p-4 bg-primary-50 rounded-lg">
                  <p className="text-sm text-secondary-600">Write a Review</p>
                  <p className="text-lg font-bold text-primary-950">50 points</p>
                </div>
                <div className="p-4 bg-primary-50 rounded-lg">
                  <p className="text-sm text-secondary-600">Refer a Friend</p>
                  <p className="text-lg font-bold text-primary-950">100 points</p>
                </div>
                <div className="p-4 bg-primary-50 rounded-lg">
                  <p className="text-sm text-secondary-600">Subscribe</p>
                  <p className="text-lg font-bold text-primary-950">25 points</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-white rounded-xl shadow-base p-6 space-y-4">
            <div className="flex items-center justify-between pb-4 border-b">
              <span className="font-medium text-secondary-900">Email Notifications</span>
              <input type="checkbox" defaultChecked className="w-5 h-5" />
            </div>
            <div className="flex items-center justify-between pb-4 border-b">
              <span className="font-medium text-secondary-900">SMS Notifications</span>
              <input type="checkbox" defaultChecked className="w-5 h-5" />
            </div>
            <div className="flex items-center justify-between pb-4 border-b">
              <span className="font-medium text-secondary-900">Marketing Emails</span>
              <input type="checkbox" className="w-5 h-5" />
            </div>
            <button className="w-full mt-6 bg-error text-white py-3 rounded-lg hover:bg-error/90 transition font-semibold flex items-center justify-center gap-2">
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        )}
      </motion.div>
    </div>
  )
}
