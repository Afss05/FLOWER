import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Mail, Phone, MapPin, ShoppingBag, TrendingUp, Users, Star } from 'lucide-react'
import { customers, customerStatusColors } from '@/data'

export default function CustomersPage() {
  const [search, setSearch] = useState('')

  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Customers</h2>
          <p className="text-slate-500 text-sm mt-0.5">{customers.length} registered customers</p>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { icon: Users,       label: 'Total',       value: '892',  color: '#2563eb', bg: '#eff6ff' },
          { icon: TrendingUp,  label: 'New This Month', value: '45', color: '#059669', bg: '#ecfdf5' },
          { icon: Star,        label: 'VIP Members', value: '38',   color: '#7c3aed', bg: '#f5f3ff' },
          { icon: ShoppingBag, label: 'Avg. Orders', value: '6.4',  color: '#d97706', bg: '#fffbeb' },
        ].map((s, i) => {
          const Icon = s.icon
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex items-center gap-4"
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: s.bg }}>
                <Icon className="w-5 h-5" style={{ color: s.color }} />
              </div>
              <div>
                <p className="text-xl font-bold text-slate-900">{s.value}</p>
                <p className="text-slate-500 text-xs">{s.label}</p>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Search */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
        <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-4 py-2.5 max-w-sm">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search customers..."
            className="bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400 w-full"
          />
        </div>
      </motion.div>

      {/* Table */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Customer</th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Email</th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Phone</th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">City</th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Orders</th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Spent</th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((c, i) => {
                const sc = customerStatusColors[c.status]
                return (
                  <motion.tr
                    key={c.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="hover:bg-slate-50/70 transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-rose-400 to-pink-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                          {c.name[0]}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 text-sm">{c.name}</p>
                          <p className="text-slate-400 text-xs">Joined {c.joined}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-slate-600 text-sm">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        {c.email}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-slate-600 text-sm">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        {c.phone}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-slate-500 text-sm">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {c.city}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-900">{c.orders}</td>
                    <td className="px-6 py-4 font-bold text-slate-900">{c.spent}</td>
                    <td className="px-6 py-4">
                      <span
                        className="px-3 py-1 rounded-full text-xs font-bold"
                        style={{ color: sc.color, background: sc.bg }}
                      >
                        {c.status}
                      </span>
                    </td>
                  </motion.tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  )
}
