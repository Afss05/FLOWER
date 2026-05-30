import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, Eye, Edit2, Trash2, Download } from 'lucide-react'
import { allOrders, orderStatusConfig, orderFilters } from '@/data'

export default function OrdersPage() {
  const [activeFilter, setActiveFilter] = useState('All')
  const [search, setSearch] = useState('')

  const filtered = allOrders.filter(o =>
    (activeFilter === 'All' || o.status === activeFilter) &&
    (o.customer.toLowerCase().includes(search.toLowerCase()) || o.id.includes(search))
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Orders</h2>
          <p className="text-slate-500 text-sm mt-0.5">{allOrders.length} total orders</p>
        </div>
        <button className="flex items-center gap-2 bg-rose-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-rose-700 transition shadow-sm shadow-rose-200">
          <Download className="w-4 h-4" />
          Export
        </button>
      </motion.div>

      {/* Search & Filter */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-4 py-2.5 flex-1 min-w-48">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search orders or customers..."
            className="bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400 w-full"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-4 h-4 text-slate-400" />
          {orderFilters.map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                activeFilter === f
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Order ID</th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Customer</th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Product</th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">City</th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Amount</th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((order, i) => {
                const cfg = orderStatusConfig[order.status]
                const StatusIcon = cfg.icon
                return (
                  <motion.tr
                    key={order.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="hover:bg-slate-50/70 transition-colors"
                  >
                    <td className="px-6 py-4 font-mono text-sm font-bold text-slate-700">{order.id}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {order.customer[0]}
                        </div>
                        <span className="font-medium text-slate-900 text-sm">{order.customer}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 max-w-[160px] truncate">{order.product}</td>
                    <td className="px-6 py-4 text-sm text-slate-500">{order.city}</td>
                    <td className="px-6 py-4 font-bold text-slate-900">{order.amount}</td>
                    <td className="px-6 py-4">
                      <span
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
                        style={{ color: cfg.color, background: cfg.bg }}
                      >
                        <StatusIcon className="w-3 h-3" />
                        {cfg.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-400">{order.date}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <button className="p-1.5 rounded-lg hover:bg-slate-100 transition text-slate-500 hover:text-slate-700">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 rounded-lg hover:bg-blue-50 transition text-slate-500 hover:text-blue-600">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 rounded-lg hover:bg-red-50 transition text-slate-500 hover:text-red-600">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                )
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="py-16 text-center">
            <p className="text-slate-400 text-sm">No orders found</p>
          </div>
        )}
      </motion.div>
    </div>
  )
}
