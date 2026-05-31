import adminApiClient from '../api/client'

// ── Admin-relevant notification types ────────────────────────────────────────
// Admin should only see: new orders, low-stock alerts, and payment failures.
// Customer-side events (order_placed by customer, order_delivered, etc.) are
// stored against the customer's user_id, NOT the admin's — so they never
// reach this bell naturally. But as an extra safety filter we whitelist types.
export const ADMIN_NOTIFICATION_TYPES = [
  'new_order',
  'low_stock',
  'payment_failed',
  'promo',          // system-wide announcements may be sent to admin too
] as const

export interface AdminNotification {
  id: number
  userId: number
  type: string
  title: string
  body: string
  data: Record<string, unknown> | null
  readAt: string | null
  createdAt: string
}

export async function fetchAdminNotifications(page = 1, limit = 20) {
  const res = await adminApiClient.get('/notifications', { params: { page, limit } })
  return res.data as {
    success: boolean
    data: {
      notifications: AdminNotification[]
      meta: { total: number; page: number; limit: number; pages: number }
      unreadCount: number
    }
  }
}

export async function pollAdminNotifications(since: string, timeout = 20) {
  const res = await adminApiClient.get('/notifications/poll', {
    params: { since, timeout },
    timeout: (timeout + 5) * 1000,
  })
  return res.data as {
    success: boolean
    data: { notifications: AdminNotification[]; nextSince: string; count: number }
  }
}

export async function markAdminNotificationRead(id: number) {
  await adminApiClient.patch(`/notifications/${id}/read`)
}

export async function markAllAdminNotificationsRead() {
  await adminApiClient.patch('/notifications/read-all')
}

export async function deleteAdminNotification(id: number) {
  await adminApiClient.delete(`/notifications/${id}`)
}
