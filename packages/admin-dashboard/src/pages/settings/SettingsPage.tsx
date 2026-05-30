import { useState } from 'react'
import { motion } from 'framer-motion'
import { Building2, Bell, Shield, CreditCard, Save, Check } from 'lucide-react'

const tabs = [
  { id: 'general',       icon: Building2,    label: 'General' },
  { id: 'notifications', icon: Bell,         label: 'Notifications' },
  { id: 'security',      icon: Shield,       label: 'Security' },
  { id: 'payment',       icon: CreditCard,   label: 'Payment' },
]

function ToggleSwitch({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 flex-shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${
        checked ? 'bg-rose-600' : 'bg-slate-200'
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform transition-transform duration-200 ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  )
}

function Field({ label, type = 'text', defaultValue, placeholder }: { label: string; type?: string; defaultValue?: string; placeholder?: string }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-2">{label}</label>
      <input
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-400 transition placeholder:text-slate-400"
      />
    </div>
  )
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general')
  const [saved, setSaved] = useState(false)
  const [notifs, setNotifs] = useState({ orders: true, stock: true, reviews: false, marketing: true })

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-2xl font-bold text-slate-900">Settings</h2>
        <p className="text-slate-500 text-sm mt-0.5">Manage your business configuration</p>
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Tab List */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:w-56 flex-shrink-0"
        >
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-2 flex lg:flex-col gap-1">
            {tabs.map(tab => {
              const Icon = tab.icon
              const active = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all w-full text-left ${
                    active
                      ? 'bg-rose-50 text-rose-700'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Icon className={`w-4 h-4 flex-shrink-0 ${active ? 'text-rose-600' : 'text-slate-400'}`} />
                  {tab.label}
                </button>
              )
            })}
          </div>
        </motion.div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-1"
        >
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            {activeTab === 'general' && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-slate-900 pb-4 border-b border-slate-100">Business Information</h3>
                <div className="grid sm:grid-cols-2 gap-5">
                  <Field label="Business Name" defaultValue="FlowerShop" />
                  <Field label="Email Address" type="email" defaultValue="contact@flowershop.in" />
                  <Field label="Phone Number" type="tel" defaultValue="+91 98765 43210" />
                  <Field label="GST Number" defaultValue="27AAACF0000A1Z5" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Business Address</label>
                  <textarea
                    defaultValue="123 Flower Street, Anna Nagar, Chennai, Tamil Nadu - 600040"
                    rows={3}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-400 transition resize-none"
                  />
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-slate-900 pb-4 border-b border-slate-100">Notification Preferences</h3>
                <div className="space-y-4">
                  {[
                    { key: 'orders',    label: 'New Orders', desc: 'Get notified when a new order is placed' },
                    { key: 'stock',     label: 'Low Stock Alerts', desc: 'Alert when product stock falls below threshold' },
                    { key: 'reviews',   label: 'Customer Reviews', desc: 'Notify when a new review is submitted' },
                    { key: 'marketing', label: 'Marketing Reports', desc: 'Weekly campaign performance summaries' },
                  ].map(item => (
                    <div key={item.key} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                      <div>
                        <p className="font-semibold text-slate-900 text-sm">{item.label}</p>
                        <p className="text-slate-500 text-xs mt-0.5">{item.desc}</p>
                      </div>
                      <ToggleSwitch
                        checked={notifs[item.key as keyof typeof notifs]}
                        onChange={v => setNotifs(n => ({ ...n, [item.key]: v }))}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-slate-900 pb-4 border-b border-slate-100">Security Settings</h3>
                <div className="space-y-4">
                  <Field label="Current Password" type="password" placeholder="Enter current password" />
                  <Field label="New Password" type="password" placeholder="Enter new password" />
                  <Field label="Confirm Password" type="password" placeholder="Confirm new password" />
                </div>
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                  <p className="text-sm font-semibold text-amber-800">Two-Factor Authentication</p>
                  <p className="text-xs text-amber-700 mt-1">Add an extra layer of security to your account</p>
                  <button className="mt-3 text-sm font-semibold text-amber-700 underline">Enable 2FA →</button>
                </div>
              </div>
            )}

            {activeTab === 'payment' && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-slate-900 pb-4 border-b border-slate-100">Payment Gateway</h3>
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-start gap-3 mb-2">
                  <CreditCard className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-blue-700">Your Razorpay keys are encrypted and stored securely.</p>
                </div>
                <div className="space-y-4">
                  <Field label="Razorpay Key ID" placeholder="rzp_live_xxxxxxxxxxxx" />
                  <Field label="Razorpay Secret" type="password" placeholder="••••••••••••••••" />
                </div>
                <div className="pt-4 border-t border-slate-100">
                  <p className="text-sm font-semibold text-slate-700 mb-3">Delivery Fee Settings</p>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Field label="Base Delivery Fee (₹)" defaultValue="50" type="number" />
                    <Field label="Free Delivery Above (₹)" defaultValue="999" type="number" />
                  </div>
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="mt-8 pt-6 border-t border-slate-100">
              <button
                onClick={handleSave}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                  saved
                    ? 'bg-emerald-600 text-white'
                    : 'bg-rose-600 text-white hover:bg-rose-700 shadow-sm shadow-rose-200'
                }`}
              >
                {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                {saved ? 'Saved!' : 'Save Changes'}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
