import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}

// Export notify functions for compatibility
export const notify = {
  success: (message: string) => {
    // This would typically use the toast hook
    console.log('Success:', message);
  },
  error: (message: string) => {
    // This would typically use the toast hook
    console.log('Error:', message);
  },
  info: (message: string) => {
    // This would typically use the toast hook
    console.log('Info:', message);
  },
  warning: (message: string) => {
    // This would typically use the toast hook
    console.log('Warning:', message);
  },
};
