import { create } from 'zustand'
import {
  type Notification,
  pollNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
  fetchNotifications,
} from '@/api/notifications'

interface NotificationStore {
  // State
  notifications: Notification[]
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
  _onNewNotifications: (incoming: Notification[]) => void
}

export const useNotificationStore = create<NotificationStore>((set, get) => ({
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
    // Load first page when opening for the first time
    if (open && get().notifications.length === 0) {
      get().loadMore()
    }
  },

  loadMore: async () => {
    const { isLoading, hasMore, page } = get()
    if (isLoading || !hasMore) return
    set({ isLoading: true })
    try {
      const res = await fetchNotifications(page, 20)
      const incoming = res.data ?? []
      set((state) => ({
        notifications: page === 1 ? incoming : [...state.notifications, ...incoming],
        unreadCount: res.unreadCount ?? 0,
        page: state.page + 1,
        hasMore: incoming.length === 20,
        isLoading: false,
      }))
    } catch {
      set({ isLoading: false })
    }
  },

  markRead: async (id) => {
    // Optimistic
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, readAt: new Date().toISOString() } : n
      ),
      unreadCount: Math.max(0, state.unreadCount - 1),
    }))
    try {
      await markNotificationRead(id)
    } catch {
      // revert: refetch
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
      await markAllNotificationsRead()
    } catch {
      get().loadMore()
    }
  },

  remove: async (id) => {
    const removed = get().notifications.find((n) => n.id === id)
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
      unreadCount: removed && !removed.readAt
        ? Math.max(0, state.unreadCount - 1)
        : state.unreadCount,
    }))
    try {
      await deleteNotification(id)
    } catch {
      // restore
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
    const { _abortController, _pollingSince } = get()
    if (_abortController) return // already polling

    const controller = new AbortController()
    set({ _abortController: controller })

    const loop = async () => {
      while (!controller.signal.aborted) {
        try {
          const since = get()._pollingSince
          const res = await pollNotifications(since, 20)
          if (!controller.signal.aborted) {
            get()._onNewNotifications(res.data?.notifications ?? [])
            if (res.data?.nextSince) {
              set({ _pollingSince: res.data.nextSince })
            }
          }
        } catch {
          if (controller.signal.aborted) break
          // Back-off on error: wait 5 s before retrying
          await new Promise((r) => setTimeout(r, 5000))
        }
        // Small gap between re-connects to avoid thundering herd
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
