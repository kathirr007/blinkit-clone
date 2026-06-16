import { defineStore } from 'pinia'

interface Notification {
  id: string
  message: string
  type: 'success' | 'error' | 'info'
  duration: number
}

interface NotificationState {
  notifications: Notification[]
}

export const useNotificationStore = defineStore('notification', {
  state: (): NotificationState => ({
    notifications: [],
  }),

  actions: {
    show(message: string, type: 'success' | 'error' | 'info' = 'info', duration = 3000) {
      const id = Date.now().toString() + Math.random().toString(36).slice(2)
      this.notifications.push({ id, message, type, duration })

      setTimeout(() => {
        this.dismiss(id)
      }, duration)
    },

    dismiss(id: string) {
      const index = this.notifications.findIndex((n) => n.id === id)
      if (index > -1) {
        this.notifications.splice(index, 1)
      }
    },

    success(message: string) {
      this.show(message, 'success')
    },

    error(message: string) {
      this.show(message, 'error')
    },

    info(message: string) {
      this.show(message, 'info')
    },
  },
})
