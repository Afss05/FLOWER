import apiClient from './client'

export interface Notification {
  id: number
  userId: number
  type: string
  title: string
  body: string
  data: Record<string, unknown> | null
  readAt: string | null
  createdAt: string
}

export interface NotificationListResponse {
  success: boolean
  data: {
    notifications: Notification[]
    meta: {
      total: number
      page: number
      limit: number
      pages: number
    }
    unreadCount: number
  }
}

export interface PollResponse {
  success: boolean
  data: {
    notifications: Notification[]
    nextSince: string
    count: number
  }
}

export async function fetchNotifications(page = 1, limit = 20): Promise<NotificationListResponse> {
  const res = await apiClient.get('/notifications', { params: { page, limit } })
  return res.data
}

export async function fetchUnreadCount(): Promise<number> {
  const res = await apiClient.get('/notifications/count')
  return res.data?.data?.unreadCount ?? 0
}

export async function pollNotifications(since: string, timeout = 20): Promise<PollResponse> {
  const res = await apiClient.get('/notifications/poll', {
    params: { since, timeout },
    // Long-poll: override axios timeout to allow up to (timeout + 5) seconds
    timeout: (timeout + 5) * 1000,
  })
  return res.data
}

export async function markNotificationRead(id: number): Promise<void> {
  await apiClient.patch(`/notifications/${id}/read`)
}

export async function markAllNotificationsRead(): Promise<void> {
  await apiClient.patch('/notifications/read-all')
}

export async function deleteNotification(id: number): Promise<void> {
  await apiClient.delete(`/notifications/${id}`)
}
