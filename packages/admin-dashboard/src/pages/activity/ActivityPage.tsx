import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  Activity, Monitor, Globe, Clock, User, Search, Filter,
  LogIn, LogOut, ShieldAlert, Eye, Trash2, RefreshCw
} from 'lucide-react'

type ActivityEvent = 'login' | 'logout' | 'page_view' | 'failed_login' | 'data_export' | 'profile_update'

interface ActivityLog {
  id: string
  userId: string
  userName: string
  userEmail: string
  event: ActivityEvent
  ipAddress: string
  browser: string
  os: string
  device: string
  country: string
  city: string
  timestamp: string
  duration?: string
  status: 'success' | 'failed' | 'warning'
}

const eventMeta: Record<ActivityEvent, { label: string; color: string; bg: string; Icon: React.ElementType }> = {
  login:          { label: 'Login',          color: '#059669', bg: '#ecfdf5', Icon: LogIn },
  logout:         { label: 'Logout',         color: '#64748b', bg: '#f1f5f9', Icon: LogOut },
  page_view:      { label: 'Page View',      color: '#2563eb', bg: '#eff6ff', Icon: Eye },
  failed_login:   { label: 'Failed Login',   color: '#dc2626', bg: '#fef2f2', Icon: ShieldAlert },
  data_export:    { label: 'Data Export',    color: '#d97706', bg: '#fffbeb', Icon: Trash2 },
  profile_update: { label: 'Profile Update', color: '#7c3aed', bg: '#f5f3ff', Icon: RefreshCw },
}

const SAMPLE_LOGS: ActivityLog[] = [
  { id: 'ACT-001', userId: 'USR-101', userName: 'Priya Sharma',   userEmail: 'priya@example.com',   event: 'login',          ipAddress: '103.21.58.14',  browser: 'Chrome 124',   os: 'Windows 11', device: 'Desktop', country: 'India',    city: 'Mumbai',    timestamp: '2026-05-30 09:14:22', duration: '2h 18m', status: 'success' },
  { id: 'ACT-002', userId: 'USR-204', userName: 'Arjun Mehta',    userEmail: 'arjun@example.com',   event: 'failed_login',   ipAddress: '45.87.213.9',   browser: 'Firefox 125',  os: 'Ubuntu 22',  device: 'Desktop', country: 'India',    city: 'Delhi',     timestamp: '2026-05-30 09:10:05', status: 'failed' },
  { id: 'ACT-003', userId: 'USR-305', userName: 'Sneha Reddy',    userEmail: 'sneha@example.com',   event: 'page_view',      ipAddress: '49.36.172.200', browser: 'Safari 17',    os: 'macOS 14',   device: 'MacBook', country: 'India',    city: 'Hyderabad', timestamp: '2026-05-30 09:08:47', status: 'success' },
  { id: 'ACT-004', userId: 'USR-101', userName: 'Priya Sharma',   userEmail: 'priya@example.com',   event: 'data_export',    ipAddress: '103.21.58.14',  browser: 'Chrome 124',   os: 'Windows 11', device: 'Desktop', country: 'India',    city: 'Mumbai',    timestamp: '2026-05-30 09:05:31', status: 'warning' },
  { id: 'ACT-005', userId: 'USR-407', userName: 'Rahul Nair',     userEmail: 'rahul@example.com',   event: 'login',          ipAddress: '182.74.98.3',   browser: 'Edge 124',     os: 'Windows 10', device: 'Desktop', country: 'India',    city: 'Kochi',     timestamp: '2026-05-30 08:55:10', duration: '45m',    status: 'success' },
  { id: 'ACT-006', userId: 'USR-502', userName: 'Kavya Iyer',     userEmail: 'kavya@example.com',   event: 'profile_update', ipAddress: '117.196.44.21', browser: 'Chrome 124',   os: 'Android 14', device: 'Mobile',  country: 'India',    city: 'Chennai',   timestamp: '2026-05-30 08:47:02', status: 'success' },
  { id: 'ACT-007', userId: 'USR-609', userName: 'Vivek Gupta',    userEmail: 'vivek@example.com',   event: 'logout',         ipAddress: '59.88.210.7',   browser: 'Chrome 123',   os: 'Windows 11', device: 'Desktop', country: 'India',    city: 'Pune',      timestamp: '2026-05-30 08:30:55', status: 'success' },
  { id: 'ACT-008', userId: 'USR-204', userName: 'Arjun Mehta',    userEmail: 'arjun@example.com',   event: 'failed_login',   ipAddress: '45.87.213.9',   browser: 'Firefox 125',  os: 'Ubuntu 22',  device: 'Desktop', country: 'India',    city: 'Delhi',     timestamp: '2026-05-30 08:28:33', status: 'failed' },
  { id: 'ACT-009', userId: 'USR-711', userName: 'Ananya Das',     userEmail: 'ananya@example.com',  event: 'login',          ipAddress: '27.56.130.88',  browser: 'Samsung Browser', os: 'Android 13', device: 'Mobile', country: 'India',   city: 'Kolkata',   timestamp: '2026-05-30 08:15:22', duration: '1h 02m', status: 'success' },
  { id: 'ACT-010', userId: 'USR-815', userName: 'Rohan Singh',    userEmail: 'rohan@example.com',   event: 'page_view',      ipAddress: '14.139.50.4',   browser: 'Chrome 124',   os: 'iOS 17',     device: 'iPhone',  country: 'India',    city: 'Jaipur',    timestamp: '2026-05-30 07:58:11', status: 'success' },
  { id: 'ACT-011', userId: 'USR-902', userName: 'Meera Pillai',   userEmail: 'meera@example.com',   event: 'login',          ipAddress: '103.59.75.100', browser: 'Firefox 125',  os: 'Windows 10', device: 'Desktop', country: 'India',    city: 'Trivandrum', timestamp: '2026-05-30 07:45:09', duration: '3h 10m', status: 'success' },
  { id: 'ACT-012', userId: 'USR-101', userName: 'Priya Sharma',   userEmail: 'priya@example.com',   event: 'page_view',      ipAddress: '103.21.58.14',  browser: 'Chrome 124',   os: 'Windows 11', device: 'Desktop', country: 'India',    city: 'Mumbai',    timestamp: '2026-05-30 07:22:44', status: 'success' },
]

const STATUS_COLORS = {
  success: { color: '#059669', bg: '#ecfdf5', label: 'Success' },
  failed:  { color: '#dc2626', bg: '#fef2f2', label: 'Failed'  },
  warning: { color: '#d97706', bg: '#fffbeb', label: 'Warning' },
}

const STATS = [
  { icon: LogIn,      label: 'Logins Today',    value: '284',  color: '#059669', bg: '#ecfdf5' },
  { icon: ShieldAlert,label: 'Failed Attempts', value: '17',   color: '#dc2626', bg: '#fef2f2' },
  { icon: User,       label: 'Active Users',    value: '138',  color: '#2563eb', bg: '#eff6ff' },
  { icon: Globe,      label: 'Unique IPs',      value: '201',  color: '#7c3aed', bg: '#f5f3ff' },
]

export default function ActivityPage() {
  const [search, setSearch] = useState('')
  const [eventFilter, setEventFilter] = useState<ActivityEvent | 'all'>('all')
  const [statusFilter, setStatusFilter] = useState<'all' | 'success' | 'failed' | 'warning'>('all')

  const filtered = useMemo(() => {
    return SAMPLE_LOGS.filter(log => {
      const matchSearch =
        log.userName.toLowerCase().includes(search.toLowerCase()) ||
        log.userId.toLowerCase().includes(search.toLowerCase()) ||
        log.ipAddress.includes(search) ||
        log.userEmail.toLowerCase().includes(search.toLowerCase())
      const matchEvent  = eventFilter  === 'all' || log.event  === eventFilter
      const matchStatus = statusFilter === 'all' || log.status === statusFilter
      return matchSearch && matchEvent && matchStatus
    })
  }, [search, eventFilter, statusFilter])

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">User Activity</h2>
          <p className="text-slate-500 text-sm mt-0.5">Track login sessions, IP addresses, and browser details</p>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {STATS.map((s, i) => {
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

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex flex-wrap gap-3 items-center"
      >
        {/* Search */}
        <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-4 py-2.5 flex-1 min-w-52">
          <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by user, email, IP…"
            className="bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400 w-full"
          />
        </div>

        {/* Event filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={eventFilter}
            onChange={e => setEventFilter(e.target.value as ActivityEvent | 'all')}
            className="text-sm text-slate-700 bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 outline-none"
          >
            <option value="all">All Events</option>
            {(Object.keys(eventMeta) as ActivityEvent[]).map(k => (
              <option key={k} value={k}>{eventMeta[k].label}</option>
            ))}
          </select>
        </div>

        {/* Status filter */}
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value as typeof statusFilter)}
          className="text-sm text-slate-700 bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 outline-none"
        >
          <option value="all">All Statuses</option>
          <option value="success">Success</option>
          <option value="failed">Failed</option>
          <option value="warning">Warning</option>
        </select>

        <span className="ml-auto text-xs text-slate-400">{filtered.length} records</span>
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">User</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">User ID</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Event</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">IP Address</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Browser / OS</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Device</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Location</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Time</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-16 text-slate-400 text-sm">
                    <Activity className="w-10 h-10 mx-auto mb-3 opacity-30" />
                    No activity records match your filters.
                  </td>
                </tr>
              ) : filtered.map((log, i) => {
                const ev = eventMeta[log.event]
                const EvIcon = ev.Icon
                const st = STATUS_COLORS[log.status]
                return (
                  <motion.tr
                    key={log.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.04 }}
                    className="hover:bg-slate-50/70 transition-colors"
                  >
                    {/* User */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-rose-400 to-pink-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {log.userName[0]}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 text-sm leading-tight">{log.userName}</p>
                          <p className="text-slate-400 text-xs">{log.userEmail}</p>
                        </div>
                      </div>
                    </td>

                    {/* User ID */}
                    <td className="px-5 py-3.5">
                      <span className="font-mono text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">{log.userId}</span>
                    </td>

                    {/* Event */}
                    <td className="px-5 py-3.5">
                      <span
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
                        style={{ color: ev.color, background: ev.bg }}
                      >
                        <EvIcon className="w-3 h-3" />
                        {ev.label}
                      </span>
                    </td>

                    {/* IP */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <Globe className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-mono text-xs text-slate-700">{log.ipAddress}</span>
                      </div>
                    </td>

                    {/* Browser / OS */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <Monitor className="w-3.5 h-3.5 text-slate-400" />
                        <div>
                          <p className="text-sm text-slate-700 leading-tight">{log.browser}</p>
                          <p className="text-xs text-slate-400">{log.os}</p>
                        </div>
                      </div>
                    </td>

                    {/* Device */}
                    <td className="px-5 py-3.5 text-sm text-slate-600">{log.device}</td>

                    {/* Location */}
                    <td className="px-5 py-3.5">
                      <p className="text-sm text-slate-700 leading-tight">{log.city}</p>
                      <p className="text-xs text-slate-400">{log.country}</p>
                    </td>

                    {/* Time */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <div>
                          <p className="text-xs text-slate-700 leading-tight whitespace-nowrap">{log.timestamp.split(' ')[1]}</p>
                          <p className="text-xs text-slate-400">{log.timestamp.split(' ')[0]}</p>
                        </div>
                      </div>
                      {log.duration && (
                        <p className="text-xs text-slate-400 mt-0.5 pl-5">Session: {log.duration}</p>
                      )}
                    </td>

                    {/* Status */}
                    <td className="px-5 py-3.5">
                      <span
                        className="px-2.5 py-1 rounded-full text-xs font-bold"
                        style={{ color: st.color, background: st.bg }}
                      >
                        {st.label}
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
