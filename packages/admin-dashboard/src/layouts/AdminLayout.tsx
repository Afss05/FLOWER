import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, ShoppingCart, Package, Users, BarChart3,
  Settings, LogOut, Search, ChevronLeft, ChevronRight, Menu, X, Activity
} from 'lucide-react'
import { AdminNotificationBell } from '@/components/NotificationBell'
import { useAdminAuthStore } from '@/store/authStore'
import adminApiClient from '@/api/client'

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: ShoppingCart, label: 'Orders', path: '/orders' },
  { icon: Package, label: 'Products', path: '/products' },
  { icon: Users, label: 'Customers', path: '/customers' },
  { icon: BarChart3, label: 'Analytics', path: '/analytics' },
  { icon: Activity, label: 'Activity', path: '/activity' },
  { icon: Settings, label: 'Settings', path: '/settings' },
]

const pageTitles: Record<string, string> = {
  '/': 'Dashboard',
  '/orders': 'Orders',
  '/products': 'Products',
  '/customers': 'Customers',
  '/analytics': 'Analytics',
  '/activity': 'User Activity',
  '/settings': 'Settings',
}

export default function AdminLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { isAuthenticated, setToken } = useAdminAuthStore()

  // Auto-login as admin so the notification bell can poll.
  // In a real app this would be a proper login page.
  useEffect(() => {
    if (isAuthenticated) return
    adminApiClient
      .post('/auth/login', { email: 'admin@flowershop.com', password: 'Admin@12345' })
      .then((res) => {
        const token = res.data?.data?.token
        if (token) setToken(token)
      })
      .catch(() => { /* silent — bell shows "Log in to receive alerts" */ })
  }, [isAuthenticated, setToken])

  const sidebarW = collapsed ? 72 : 256

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10">
        <div className="w-9 h-9 rounded-xl bg-rose-500 flex items-center justify-center flex-shrink-0 shadow-lg">
          <span className="text-white text-lg">🌸</span>
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              className="font-bold text-white text-lg whitespace-nowrap overflow-hidden"
            >
              FlowerShop
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {menuItems.map(item => {
          const Icon = item.icon
          const isActive = location.pathname === item.path
          return (
            <button
              key={item.path}
              onClick={() => { navigate(item.path); setMobileOpen(false) }}
              title={collapsed ? item.label : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 group relative ${
                isActive
                  ? 'bg-white/15 text-white'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute inset-0 bg-white/15 rounded-xl"
                  transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                />
              )}
              <Icon className="w-5 h-5 flex-shrink-0 relative z-10" />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    className="text-sm font-medium whitespace-nowrap overflow-hidden relative z-10"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
              {isActive && !collapsed && (
                <motion.div
                  className="ml-auto w-1.5 h-1.5 rounded-full bg-rose-400 flex-shrink-0 relative z-10"
                  layoutId="dot"
                />
              )}
            </button>
          )
        })}
      </nav>

      {/* User */}
      <div className="px-3 py-4 border-t border-white/10">
        <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/5 ${collapsed ? 'justify-center' : ''}`}>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-rose-400 to-pink-600 flex items-center justify-center flex-shrink-0 text-white text-sm font-bold">
            A
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="overflow-hidden"
              >
                <p className="text-white text-sm font-semibold whitespace-nowrap">Admin</p>
                <p className="text-white/50 text-xs whitespace-nowrap">admin@flowershop.in</p>
              </motion.div>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {!collapsed && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => navigate('/')}
                className="ml-auto text-white/40 hover:text-white/80 transition"
              >
                <LogOut className="w-4 h-4" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Desktop Sidebar */}
      <motion.aside
        animate={{ width: sidebarW }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="hidden md:flex flex-col flex-shrink-0 bg-[#0F172A] relative overflow-hidden"
        style={{ width: sidebarW }}
      >
        <SidebarContent />

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-white border border-slate-200 shadow-md flex items-center justify-center hover:bg-slate-50 transition z-50"
        >
          {collapsed
            ? <ChevronRight className="w-3 h-3 text-slate-600" />
            : <ChevronLeft className="w-3 h-3 text-slate-600" />
          }
        </button>
      </motion.aside>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
            />
            <motion.aside
              initial={{ x: -256 }}
              animate={{ x: 0 }}
              exit={{ x: -256 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 h-full w-64 bg-[#0F172A] z-50 md:hidden"
            >
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute top-4 right-4 text-white/60 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Bar */}
        <header className="flex-shrink-0 h-16 bg-white border-b border-slate-200 flex items-center gap-4 px-6 shadow-sm">
          <button
            onClick={() => setMobileOpen(true)}
            className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition"
          >
            <Menu className="w-5 h-5 text-slate-600" />
          </button>

          <div>
            <h1 className="text-xl font-bold text-slate-900">
              {pageTitles[location.pathname] ?? 'Admin'}
            </h1>
          </div>

          <div className="ml-auto flex items-center gap-3">
            {/* Search */}
            <div className="hidden sm:flex items-center gap-2 bg-slate-100 rounded-xl px-4 py-2 w-56">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent text-sm text-slate-600 outline-none placeholder:text-slate-400 w-full"
              />
            </div>

            {/* Notifications */}
            <AdminNotificationBell />

            {/* Avatar */}
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-400 to-pink-600 flex items-center justify-center text-white text-sm font-bold shadow cursor-pointer">
              A
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-slate-50">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
