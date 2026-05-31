import React, { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, X, Check, CheckCheck, Trash2, Package, CreditCard, AlertTriangle, Star, Megaphone } from 'lucide-react'
import { useNotificationStore } from '@/store/notificationStore'
import { useAuthStore } from '@/store/authStore'
import type { Notification } from '@/api/notifications'

// ── Type icon map ────────────────────────────────────────────────────────────
function NotifIcon({ type }: { type: string }) {
  const base = 'w-4 h-4'
  if (type.startsWith('order_'))    return <Package className={base} />
  if (type.startsWith('payment_'))  return <CreditCard className={base} />
  if (type === 'low_stock')         return <AlertTriangle className={base} />
  if (type === 'new_order')         return <Star className={base} />
  return <Megaphone className={base} />
}

// ── Type color map ────────────────────────────────────────────────────────────
function typeColors(type: string): { bg: string; text: string; ring: string } {
  if (type === 'order_delivered')   return { bg: 'bg-emerald-100', text: 'text-emerald-700', ring: 'ring-emerald-200' }
  if (type === 'order_cancelled')   return { bg: 'bg-red-100',     text: 'text-red-600',     ring: 'ring-red-200' }
  if (type.startsWith('order_'))    return { bg: 'bg-blue-100',    text: 'text-blue-700',    ring: 'ring-blue-200' }
  if (type === 'payment_success')   return { bg: 'bg-emerald-100', text: 'text-emerald-700', ring: 'ring-emerald-200' }
  if (type === 'payment_failed')    return { bg: 'bg-red-100',     text: 'text-red-600',     ring: 'ring-red-200' }
  if (type === 'low_stock')         return { bg: 'bg-amber-100',   text: 'text-amber-700',   ring: 'ring-amber-200' }
  return { bg: 'bg-primary-100',  text: 'text-primary-700',  ring: 'ring-primary-200' }
}

// ── Relative time ─────────────────────────────────────────────────────────────
function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const min  = Math.floor(diff / 60000)
  if (min < 1)   return 'Just now'
  if (min < 60)  return `${min}m ago`
  const hr = Math.floor(min / 60)
  if (hr < 24)   return `${hr}h ago`
  const d = Math.floor(hr / 24)
  return `${d}d ago`
}

// ── Single notification row ───────────────────────────────────────────────────
const NotifItem: React.FC<{ notif: Notification }> = ({ notif }) => {
  const { markRead, remove } = useNotificationStore()
  const colors = typeColors(notif.type)
  const isUnread = !notif.readAt

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20, height: 0, marginBottom: 0 }}
      transition={{ duration: 0.2 }}
      className={`group relative flex gap-3 p-3 rounded-xl transition-colors cursor-pointer
        ${isUnread ? 'bg-accent-50 hover:bg-accent-100' : 'hover:bg-secondary-50'}`}
      onClick={() => isUnread && markRead(notif.id)}
    >
      {/* Type icon */}
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ring-1
        ${colors.bg} ${colors.text} ${colors.ring}`}>
        <NotifIcon type={notif.type} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className={`text-sm leading-snug ${isUnread ? 'font-semibold text-secondary-900' : 'font-medium text-secondary-700'}`}>
          {notif.title}
        </p>
        <p className="text-xs text-secondary-500 mt-0.5 line-clamp-2">{notif.body}</p>
        <p className="text-xs text-secondary-400 mt-1">{relativeTime(notif.createdAt)}</p>
      </div>

      {/* Unread dot */}
      {isUnread && (
        <span className="flex-shrink-0 mt-1 w-2 h-2 rounded-full bg-accent-950" />
      )}

      {/* Hover actions */}
      <div className="absolute right-2 top-2 hidden group-hover:flex gap-1">
        {isUnread && (
          <motion.button
            whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
            onClick={(e) => { e.stopPropagation(); markRead(notif.id) }}
            className="p-1 rounded-md bg-white shadow-sm hover:bg-secondary-100 text-secondary-500"
            title="Mark as read"
          >
            <Check className="w-3.5 h-3.5" />
          </motion.button>
        )}
        <motion.button
          whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
          onClick={(e) => { e.stopPropagation(); remove(notif.id) }}
          className="p-1 rounded-md bg-white shadow-sm hover:bg-red-100 text-secondary-500 hover:text-red-500"
          title="Delete"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </motion.button>
      </div>
    </motion.div>
  )
}

// ── Main bell + panel ─────────────────────────────────────────────────────────
export const NotificationBell: React.FC = () => {
  const { isAuthenticated } = useAuthStore()
  const {
    notifications, unreadCount, isOpen, isLoading, hasMore,
    setOpen, loadMore, markAllRead, startPolling, stopPolling,
  } = useNotificationStore()

  const panelRef  = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Start / stop polling when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      startPolling()
    } else {
      stopPolling()
    }
    return () => stopPolling()
  }, [isAuthenticated, startPolling, stopPolling])

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [isOpen, setOpen])

  // Infinite scroll
  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const handler = () => {
      if (el.scrollTop + el.clientHeight >= el.scrollHeight - 50) {
        loadMore()
      }
    }
    el.addEventListener('scroll', handler)
    return () => el.removeEventListener('scroll', handler)
  }, [loadMore])

  return (
    <div ref={panelRef} className="relative">
      {/* Bell button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(!isOpen)}
        className="relative p-2 hover:bg-secondary-100 rounded-lg transition-colors"
        title="Notifications"
      >
        <Bell className="w-5 h-5 text-secondary-700" />

        {/* Badge */}
        <AnimatePresence>
          {unreadCount > 0 && (
            <motion.span
              key="badge"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 25 }}
              className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1
                flex items-center justify-center rounded-full
                bg-accent-950 text-white text-[10px] font-bold leading-none"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Dropdown panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ type: 'spring', damping: 22, stiffness: 350 }}
            className="absolute right-0 top-12 w-96 bg-white rounded-2xl shadow-2xl
              ring-1 ring-secondary-100 overflow-hidden z-50"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-secondary-100">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-secondary-600" />
                <span className="font-heading font-semibold text-secondary-900">Notifications</span>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-accent-50 text-accent-950 text-xs font-semibold">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1">
                {unreadCount > 0 && (
                  <motion.button
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    onClick={markAllRead}
                    className="flex items-center gap-1 px-2 py-1 text-xs text-secondary-500
                      hover:text-secondary-900 hover:bg-secondary-100 rounded-lg transition-colors"
                    title="Mark all as read"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    All read
                  </motion.button>
                )}
                <motion.button
                  whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
                  onClick={() => setOpen(false)}
                  className="p-1.5 hover:bg-secondary-100 rounded-lg text-secondary-400 transition-colors"
                >
                  <X className="w-4 h-4" />
                </motion.button>
              </div>
            </div>

            {/* List */}
            <div
              ref={scrollRef}
              className="overflow-y-auto max-h-[420px] p-2 space-y-1 custom-scrollbar"
            >
              <AnimatePresence mode="popLayout">
                {notifications.length === 0 && !isLoading ? (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center py-12 gap-3"
                  >
                    <div className="w-14 h-14 rounded-full bg-secondary-100 flex items-center justify-center">
                      <Bell className="w-6 h-6 text-secondary-400" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-secondary-600">No notifications yet</p>
                      <p className="text-xs text-secondary-400 mt-0.5">
                        Order updates and alerts will appear here
                      </p>
                    </div>
                  </motion.div>
                ) : (
                  notifications.map((n) => <NotifItem key={n.id} notif={n} />)
                )}
              </AnimatePresence>

              {/* Load more / loading */}
              {isLoading && (
                <div className="flex justify-center py-4">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-5 h-5 border-2 border-secondary-200 border-t-accent-950 rounded-full"
                  />
                </div>
              )}

              {!isLoading && !hasMore && notifications.length > 0 && (
                <p className="text-center text-xs text-secondary-400 py-3">
                  You're all caught up 🌸
                </p>
              )}
            </div>

            {/* Footer: live indicator */}
            <div className="flex items-center gap-1.5 px-4 py-2 border-t border-secondary-100 bg-secondary-50">
              <motion.span
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-1.5 h-1.5 rounded-full bg-emerald-500"
              />
              <span className="text-xs text-secondary-400">Live updates active</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
