import { apiFetch } from './client'
import type { Notification } from '@/types'

export function getNotifications(): Promise<Notification[]> {
  return apiFetch<Notification[]>('/notifications')
}

export function markNotificationRead(id: string): Promise<Notification> {
  return apiFetch<Notification>(`/notifications/${id}/read`, { method: 'PATCH' })
}

export function markAllNotificationsRead(): Promise<{ success: boolean }> {
  return apiFetch<{ success: boolean }>('/notifications/read-all', { method: 'PATCH' })
}
