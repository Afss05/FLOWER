import React, { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Bell, X, Check, CheckCheck, Trash2,
  ShoppingBag, AlertTriangle, CreditCard, Megaphone,
} from 'lucide-react'
import { useAdminNotificationStore } from '@/store/notificationStore'
import { useAdminAuthStore } from '@/store/authStore'
import type { AdminNotification } from '@/api/notifications'

// ── Type config — admin-specific labels & colours ────────────────────────────
interface TypeConfig {
  icon: React.ReactNode
  bg: string
  text: string
  ring: string
  label: string
}

function typeConfig(type: string): TypeConfig {
  const cls = 'w-4 h-4'
  if (type === 'new_order')
    return { icon: <ShoppingBag className={cls} />, bg: 'bg-emerald-100', text: 'text-emerald-700', ring: 'ring-emerald-200', label: 'New Order' }
  if (type === 'low_stock')
    return { icon: <AlertTriangle className={cls} />, bg: 'bg-amber-100', text: 'text-amber-700', ring: 'ring-amber-200', label: 'Low Stock' }
  if (type === 'payment_failed')
    return { icon: <CreditCard className={cls} />, bg: 'bg-red-100', text: 'text-red-600', ring: 'ring-red-200', label: 'Payment Failed' }
  return { icon: <Megaphone className={cls} />, bg: 'bg-slate-100', text: 'text-slate-600', ring: 'ring-slate-200', label: 'System' }
}

// ── Relative time ─────────────────────────────────────────────────────────────
function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const min = Math.floor(diff / 60000)
  if (min < 1) return 'Just now'
  if (min < 60) return `${min}m ago`
  const hr = Math.floor(min / 60)
  if (hr < 24) return `${hr}h ago`
  return `${Math.floor(hr / 24)}d ago`
}

// ── Single notification row ───────────────────────────────────────────────────
const NotifItem: React.FC<{ notif: AdminNotification }> = ({ notif }) => {
  const { markRead, remove } = useAdminNotificationStore()
  const cfg = typeConfig(notif.type)
  const isUnread = !notif.readAt

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -16, height: 0, marginBottom: 0 }}
      transition={{ duration: 0.18 }}
      className={`group relative flex gap-3 p-3 rounded-xl transition-colors cursor-pointer
        ${isUnread ? 'bg-rose-50 hover:bg-rose-100/70' : 'hover:bg-slate-50'}`}
      onClick={() => isUnread && markRead(notif.id)}
    >
      {/* Type badge */}
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ring-1
        ${cfg.bg} ${cfg.text} ${cfg.ring}`}>
        {cfg.icon}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-0.5">
          <span className={`text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded
            ${cfg.bg} ${cfg.text}`}>
            {cfg.label}
          </span>
        </div>
        <p className={`text-sm leading-snug ${isUnread ? 'font-semibold text-slate-900' : 'font-medium text-slate-600'}`}>
          {notif.title}
        </p>
        <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{notif.body}</p>
        <p className="text-xs text-slate-400 mt-1">{relativeTime(notif.createdAt)}</p>
      </div>

      {/* Unread indicator */}
      {isUnread && (
        <span className="flex-shrink-0 mt-1.5 w-2 h-2 rounded-full bg-rose-500" />
      )}

      {/* Hover actions */}
      <div className="absolute right-2 top-2 hidden group-hover:flex gap-1">
        {isUnread && (
          <motion.button
            whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
            onClick={(e) => { e.stopPropagation(); markRead(notif.id) }}
            className="p-1 rounded-md bg-white shadow-sm hover:bg-slate-100 text-slate-500"
            title="Mark as read"
          >
            <Check className="w-3.5 h-3.5" />
          </motion.button>
        )}
        <motion.button
          whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
          onClick={(e) => { e.stopPropagation(); remove(notif.id) }}
          className="p-1 rounded-md bg-white shadow-sm hover:bg-red-50 text-slate-500 hover:text-red-500"
          title="Dismiss"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </motion.button>
      </div>
    </motion.div>
  )
}

// ── Main bell ─────────────────────────────────────────────────────────────────
export const AdminNotificationBell: React.FC = () => {
  const { isAuthenticated } = useAdminAuthStore()
  const {
    notifications, unreadCount, isOpen, isLoading, hasMore,
    setOpen, loadMore, markAllRead, startPolling, stopPolling,
  } = useAdminNotificationStore()

  const panelRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Start / stop polling
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
      if (el.scrollTop + el.clientHeight >= el.scrollHeight - 50 && hasMore) {
        loadMore()
      }
    }
    el.addEventListener('scroll', handler)
    return () => el.removeEventListener('scroll', handler)
  }, [loadMore, hasMore])

  return (
    <div ref={panelRef} className="relative">
      {/* Bell button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(!isOpen)}
        className="relative p-2 rounded-xl hover:bg-slate-100 transition"
        title="Notifications"
      >
        <Bell className="w-5 h-5 text-slate-600" />

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
                bg-rose-500 text-white text-[10px] font-bold leading-none"
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
              ring-1 ring-slate-200 overflow-hidden z-50"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-slate-500" />
                <span className="font-semibold text-slate-900 text-sm">Notifications</span>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 text-xs font-semibold">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1">
                {unreadCount > 0 && (
                  <motion.button
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    onClick={markAllRead}
                    className="flex items-center gap-1 px-2 py-1 text-xs text-slate-500
                      hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    All read
                  </motion.button>
                )}
                <motion.button
                  whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
                  onClick={() => setOpen(false)}
                  className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors"
                >
                  <X className="w-4 h-4" />
                </motion.button>
              </div>
            </div>

            {/* List */}
            <div
              ref={scrollRef}
              className="overflow-y-auto max-h-[420px] p-2 space-y-1"
            >
              <AnimatePresence mode="popLayout">
                {/* Loading skeleton */}
                {isLoading && notifications.length === 0 && (
                  <motion.div
                    key="skeleton"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-2 py-1"
                  >
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex gap-3 p-3 rounded-xl">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-100 animate-pulse" />
                        <div className="flex-1 space-y-2 py-0.5">
                          <div className="h-2.5 bg-slate-100 rounded animate-pulse w-1/4" />
                          <div className="h-3 bg-slate-100 rounded animate-pulse w-3/4" />
                          <div className="h-2.5 bg-slate-100 rounded animate-pulse w-full" />
                          <div className="h-2 bg-slate-100 rounded animate-pulse w-1/3" />
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}

                {/* Empty state */}
                {!isLoading && notifications.length === 0 && (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center py-12 gap-3"
                  >
                    <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center">
                      <Bell className="w-6 h-6 text-slate-400" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-slate-600">All caught up</p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        New orders and stock alerts appear here
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* Items */}
                {notifications.map((n) => (
                  <NotifItem key={n.id} notif={n} />
                ))}
              </AnimatePresence>

              {/* Pagination spinner */}
              {isLoading && notifications.length > 0 && (
                <div className="flex justify-center py-4">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-5 h-5 border-2 border-slate-200 border-t-rose-500 rounded-full"
                  />
                </div>
              )}

              {!isLoading && !hasMore && notifications.length > 0 && (
                <p className="text-center text-xs text-slate-400 py-3">No more notifications</p>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center gap-1.5 px-4 py-2 border-t border-slate-100 bg-slate-50">
              <motion.span
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-1.5 h-1.5 rounded-full bg-emerald-500"
              />
              <span className="text-xs text-slate-400">
                {isAuthenticated ? 'Live updates active' : 'Log in to receive alerts'}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
