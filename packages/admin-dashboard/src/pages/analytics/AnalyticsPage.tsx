import { useState } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Calendar, Download } from 'lucide-react'
import { months, revenueData, ordersChartData, topProducts, periods } from '@/data'

export default function AnalyticsPage() {
  const [period, setPeriod] = useState('30 days')
  const [chartType, setChartType] = useState<'revenue' | 'orders'>('revenue')

  const data = chartType === 'revenue' ? revenueData : ordersChartData
  const maxVal = Math.max(...data)

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Analytics</h2>
          <p className="text-slate-500 text-sm mt-0.5">Track your business performance</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-4 py-2.5 shadow-sm">
            <Calendar className="w-4 h-4 text-slate-400" />
            <select
              value={period}
              onChange={e => setPeriod(e.target.value)}
              className="text-sm text-slate-700 outline-none bg-transparent"
            >
              {periods.map(p => <option key={p}>{p}</option>)}
            </select>
          </div>
          <button className="flex items-center gap-2 bg-rose-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-rose-700 transition shadow-sm shadow-rose-200">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue', value: '₹4,52,350', change: 12.5, up: true, sub: 'vs last period' },
          { label: 'Avg. Order Value', value: '₹367', change: 3.2, up: true, sub: 'per order' },
          { label: 'Conversion Rate', value: '3.2%', change: 0.5, up: true, sub: 'store visitors' },
          { label: 'Customer LTV', value: '₹2,451', change: 8.1, up: true, sub: 'lifetime value' },
        ].map((kpi, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5"
          >
            <p className="text-slate-500 text-xs font-medium uppercase tracking-wide">{kpi.label}</p>
            <p className="text-2xl font-bold text-slate-900 mt-2">{kpi.value}</p>
            <div className="flex items-center gap-1.5 mt-2">
              {kpi.up
                ? <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                : <TrendingDown className="w-3.5 h-3.5 text-red-500" />
              }
              <span className={`text-xs font-semibold ${kpi.up ? 'text-emerald-600' : 'text-red-500'}`}>
                {kpi.up ? '+' : '-'}{kpi.change}%
              </span>
              <span className="text-slate-400 text-xs">{kpi.sub}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Chart */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-bold text-slate-900 text-lg">Performance Trend</h3>
            <p className="text-slate-500 text-sm">Monthly breakdown</p>
          </div>
          <div className="flex gap-2">
            {(['revenue', 'orders'] as const).map(t => (
              <button
                key={t}
                onClick={() => setChartType(t)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition ${
                  chartType === t ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Bar chart */}
        <div className="flex items-end gap-2 h-52">
          {data.map((val, i) => {
            const heightPct = (val / maxVal) * 100
            const isCurrentMonth = i === 4
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1.5 group">
                <div className="relative w-full flex items-end justify-center" style={{ height: '180px' }}>
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${heightPct}%` }}
                    transition={{ delay: 0.35 + i * 0.04, duration: 0.5 }}
                    className="w-full rounded-t-lg transition-all group-hover:opacity-80"
                    style={{
                      background: isCurrentMonth
                        ? 'linear-gradient(180deg, #fb7185, #e11d48)'
                        : 'linear-gradient(180deg, #e2e8f0, #cbd5e1)',
                      minHeight: 4,
                      position: 'absolute',
                      bottom: 0
                    }}
                  />
                </div>
                <span className="text-slate-400 text-[10px]">{months[i]}</span>
              </div>
            )
          })}
        </div>
      </motion.div>

      {/* Bottom Row */}
      <div className="grid xl:grid-cols-2 gap-4">
        {/* Top Products */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6"
        >
          <h3 className="font-bold text-slate-900 text-lg mb-5">Top Products by Sales</h3>
          <div className="space-y-4">
            {topProducts.map((p, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-sm font-medium text-slate-900">{p.name}</p>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-500">{p.sales} sold</span>
                    <span className="text-sm font-bold text-slate-900">{p.revenue}</span>
                  </div>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${p.pct}%` }}
                    transition={{ delay: 0.5 + i * 0.08, duration: 0.7 }}
                    className="h-full rounded-full bg-gradient-to-r from-rose-400 to-rose-600"
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Customer Segments */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6"
        >
          <h3 className="font-bold text-slate-900 text-lg mb-5">Customer Segments</h3>
          <div className="space-y-3">
            {[
              { label: 'Repeat Customers',   value: '234', pct: 62, color: '#7c3aed' },
              { label: 'New Customers',       value: '408', pct: 45, color: '#2563eb' },
              { label: 'VIP (10+ orders)',    value: '38',  pct: 28, color: '#d97706' },
              { label: 'Dormant (3mo+)',      value: '142', pct: 16, color: '#94a3b8' },
            ].map((seg, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-24 text-sm text-slate-600 flex-shrink-0">{seg.label}</div>
                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${seg.pct}%` }}
                    transition={{ delay: 0.55 + i * 0.08, duration: 0.7 }}
                    className="h-full rounded-full"
                    style={{ background: seg.color }}
                  />
                </div>
                <span className="w-8 text-sm font-bold text-slate-900 text-right">{seg.value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
