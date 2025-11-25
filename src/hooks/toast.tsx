'use client'

import { toast } from 'sonner'
import { useCallback } from 'react'

type ToastType = 'success' | 'error' | 'info' | 'warning' | 'default'

interface ToastOptions {
  title?: string
  description?: string
  action?: React.ReactNode
  duration?: number
}

export function useToast() {
  const showToast = useCallback(
    (type: ToastType, options: ToastOptions) => {
      const { title, description, action, duration } = options

      switch (type) {
        case 'success':
          toast.success(title || 'Sucesso!', { description, action, duration })
          break
        case 'error':
          toast.error(title || 'Erro!', { description, action, duration })
          break
        case 'info':
          toast.info(title || 'Informação', { description, action, duration })
          break
        case 'warning':
          toast.warning(title || 'Atenção', { description, action, duration })
          break
        default:
          toast(title || 'Notificação', { description, action, duration })
          break
      }
    },
    []
  )

  return { showToast }
}
