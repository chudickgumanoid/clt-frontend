
import { inject } from 'vue'

/**
 * @typedef {'success' | 'error' | 'info'} NotifyType
 * @typedef {Object} NotifyOptions
 * @property {string} message
 * @property {NotifyType} [type]
 * @property {number} [duration]
 * @property {boolean} [sticky]
 */
export const useNotification = () => {
  const notify = inject('notify')
  if (!notify) throw new Error('NotificationProvider is missing.')
  return { notify }
}
