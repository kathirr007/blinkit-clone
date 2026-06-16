interface Notification {
  id: string
  message: string
  type: 'success' | 'error' | 'info'
}

const notifications = ref<Notification[]>([])

export function useNotification() {
  function show(message: string, type: 'success' | 'error' | 'info' = 'info') {
    const id = Date.now().toString() + Math.random().toString(36).slice(2)
    const notification: Notification = { id, message, type }
    notifications.value.push(notification)

    setTimeout(() => {
      dismiss(id)
    }, 3000)
  }

  function dismiss(id: string) {
    const index = notifications.value.findIndex((n) => n.id === id)
    if (index > -1) {
      notifications.value.splice(index, 1)
    }
  }

  function success(message: string) {
    show(message, 'success')
  }

  function error(message: string) {
    show(message, 'error')
  }

  function info(message: string) {
    show(message, 'info')
  }

  return {
    notifications,
    show,
    dismiss,
    success,
    error,
    info,
  }
}
