import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, AlertTriangle, Clock, Package } from 'lucide-react'
import { dashboardStats, recentOrders, dashboardStatusConfig, barHeights, months } from '@/data'

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-slate-500 text-sm">Friday, 30 May 2026</p>
        <h2 className="text-2xl font-bold text-slate-900 mt-0.5">Good morning, Admin 👋</h2>
      </motion.div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {dashboardStats.map((stat, i) => {
          const Icon = stat.icon
          const Trend = stat.up ? TrendingUp : TrendingDown
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              whileHover={{ y: -2, boxShadow: '0 12px 40px rgba(0,0,0,0.10)' }}
              className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm cursor-default"
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center"
                  style={{ background: stat.bg }}
                >
                  <Icon className="w-5 h-5" style={{ color: stat.color }} />
                </div>
                <span
                  className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full"
                  style={{ color: stat.color, background: stat.bg }}
                >
                  <Trend className="w-3 h-3" />
                  {stat.change}%
                </span>
              </div>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
              <p className="text-slate-500 text-sm mt-1">{stat.label}</p>
            </motion.div>
          )
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="xl:col-span-2 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-slate-900 text-lg">Revenue Overview</h3>
              <p className="text-slate-500 text-sm">Monthly revenue for 2026</p>
            </div>
            <div className="flex items-center gap-2 text-emerald-600 text-sm font-semibold bg-emerald-50 px-3 py-1.5 rounded-full">
              <TrendingUp className="w-4 h-4" />
              +18.4% YoY
            </div>
          </div>

          <div className="flex items-end gap-2 h-44">
            {barHeights.map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  transition={{ delay: 0.4 + i * 0.04, duration: 0.5 }}
                  className="w-full rounded-t-lg"
                  style={{
                    background: i === 4
                      ? 'linear-gradient(180deg, #f43f5e, #e11d48)'
                      : 'linear-gradient(180deg, #cbd5e1, #94a3b8)',
                    minHeight: 4
                  }}
                />
                <span className="text-slate-400 text-[10px] leading-none">{months[i]}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Alerts / Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col gap-4"
        >
          <h3 className="font-bold text-slate-900 text-lg">Needs Attention</h3>

          {[
            { icon: AlertTriangle, color: '#d97706', bg: '#fffbeb', title: 'Low Stock', desc: '5 products below threshold' },
            { icon: Clock, color: '#7c3aed', bg: '#f5f3ff', title: 'Pending Orders', desc: '3 orders awaiting confirmation' },
            { icon: Package, color: '#2563eb', bg: '#eff6ff', title: 'New Returns', desc: '1 return request open' },
          ].map((item, i) => {
            const Icon = item.icon
            return (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl" style={{ background: item.bg }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: item.bg }}>
                  <Icon className="w-4 h-4" style={{ color: item.color }} />
                </div>
                <div>
                  <p className="font-semibold text-slate-900 text-sm">{item.title}</p>
                  <p className="text-slate-500 text-xs mt-0.5">{item.desc}</p>
                </div>
              </div>
            )
          })}

          {/* Mini donut legend */}
          <div className="mt-auto pt-4 border-t border-slate-100">
            <p className="text-slate-500 text-xs mb-3">Order Status Split</p>
            {[
              { label: 'Delivered', pct: 62, color: '#059669' },
              { label: 'In Transit', pct: 24, color: '#2563eb' },
              { label: 'Pending', pct: 14, color: '#d97706' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full" style={{ background: item.color }} />
                <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.pct}%` }}
                    transition={{ delay: 0.6 + i * 0.1, duration: 0.7 }}
                    className="h-full rounded-full"
                    style={{ background: item.color }}
                  />
                </div>
                <span className="text-slate-500 text-xs w-8 text-right">{item.pct}%</span>
                <span className="text-slate-700 text-xs w-16">{item.label}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent Orders */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="font-bold text-slate-900 text-lg">Recent Orders</h3>
          <button className="text-sm text-rose-600 font-semibold hover:text-rose-700 transition">View all →</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50">
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Order</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Customer</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Product</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Amount</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {recentOrders.map((order, i) => {
                const cfg = dashboardStatusConfig[order.status]
                const StatusIcon = cfg.icon
                return (
                  <motion.tr
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 + i * 0.06 }}
                    className="hover:bg-slate-50/70 transition-colors"
                  >
                    <td className="px-6 py-4 font-mono text-sm font-semibold text-slate-700">{order.id}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {order.customer[0]}
                        </div>
                        <span className="font-medium text-slate-900 text-sm">{order.customer}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{order.product}</td>
                    <td className="px-6 py-4 font-bold text-slate-900">{order.amount}</td>
                    <td className="px-6 py-4">
                      <span
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
                        style={{ color: cfg.color, background: cfg.bg }}
                      >
                        <StatusIcon className="w-3 h-3" />
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-400">{order.time}</td>
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
