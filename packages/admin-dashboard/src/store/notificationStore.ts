import { create } from 'zustand'
import {
  type AdminNotification,
  fetchAdminNotifications,
  pollAdminNotifications,
  markAdminNotificationRead,
  markAllAdminNotificationsRead,
  deleteAdminNotification,
} from '../api/notifications'

interface AdminNotificationStore {
  notifications: AdminNotification[]
  unreadCount: number
  isOpen: boolean
  isLoading: boolean
  hasMore: boolean
  page: number

  // Polling internals
  _pollingSince: string
  _abortController: AbortController | null

  // Actions
  setOpen: (open: boolean) => void
  loadMore: () => Promise<void>
  markRead: (id: number) => Promise<void>
  markAllRead: () => Promise<void>
  remove: (id: number) => Promise<void>
  startPolling: () => void
  stopPolling: () => void
  _onNewNotifications: (incoming: AdminNotification[]) => void
}

export const useAdminNotificationStore = create<AdminNotificationStore>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isOpen: false,
  isLoading: false,
  hasMore: true,
  page: 1,
  _pollingSince: new Date().toISOString(),
  _abortController: null,

  setOpen: (open) => {
    set({ isOpen: open })
    if (open) {
      set({ page: 1, hasMore: true, notifications: [] })
      get().loadMore()
    }
  },

  loadMore: async () => {
    const { isLoading, hasMore, page } = get()
    if (isLoading || !hasMore) return
    set({ isLoading: true })
    try {
      const res = await fetchAdminNotifications(page, 20)
      const incoming = res.data?.notifications ?? []
      set((state) => ({
        notifications: page === 1 ? incoming : [...state.notifications, ...incoming],
        unreadCount: res.data?.unreadCount ?? 0,
        page: state.page + 1,
        hasMore: incoming.length === 20,
        isLoading: false,
      }))
    } catch {
      set({ isLoading: false })
    }
  },

  markRead: async (id) => {
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, readAt: new Date().toISOString() } : n,
      ),
      unreadCount: Math.max(0, state.unreadCount - 1),
    }))
    try {
      await markAdminNotificationRead(id)
    } catch {
      get().loadMore()
    }
  },

  markAllRead: async () => {
    set((state) => ({
      notifications: state.notifications.map((n) => ({
        ...n,
        readAt: n.readAt ?? new Date().toISOString(),
      })),
      unreadCount: 0,
    }))
    try {
      await markAllAdminNotificationsRead()
    } catch {
      get().loadMore()
    }
  },

  remove: async (id) => {
    const removed = get().notifications.find((n) => n.id === id)
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
      unreadCount:
        removed && !removed.readAt
          ? Math.max(0, state.unreadCount - 1)
          : state.unreadCount,
    }))
    try {
      await deleteAdminNotification(id)
    } catch {
      if (removed) {
        set((state) => ({ notifications: [removed, ...state.notifications] }))
      }
    }
  },

  _onNewNotifications: (incoming) => {
    if (incoming.length === 0) return
    const newUnread = incoming.filter((n) => !n.readAt).length
    set((state) => ({
      notifications: [
        ...incoming.filter((n) => !state.notifications.find((e) => e.id === n.id)),
        ...state.notifications,
      ],
      unreadCount: state.unreadCount + newUnread,
      _pollingSince: incoming[incoming.length - 1].createdAt,
    }))
  },

  startPolling: () => {
    const { _abortController } = get()
    if (_abortController) return
    const controller = new AbortController()
    set({ _abortController: controller })

    const loop = async () => {
      while (!controller.signal.aborted) {
        try {
          const since = get()._pollingSince
          const res = await pollAdminNotifications(since, 20)
          if (!controller.signal.aborted) {
            get()._onNewNotifications(res.data?.notifications ?? [])
            if (res.data?.nextSince) set({ _pollingSince: res.data.nextSince })
          }
        } catch {
          if (controller.signal.aborted) break
          await new Promise((r) => setTimeout(r, 5000))
        }
        await new Promise((r) => setTimeout(r, 300))
      }
    }
    loop()
  },

  stopPolling: () => {
    get()._abortController?.abort()
    set({ _abortController: null })
  },
}))
