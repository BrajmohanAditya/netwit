"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from "lucide-react";

type ToastType = "success" | "error" | "warning" | "info";

interface ToastProps {
  id: string;
  type?: ToastType;
  title: string;
  message: string;
  duration?: number; // milliseconds, default 5000
  onClose: (id: string) => void;
}

interface ToastContextType {
  toasts: ToastProps[];
  addToast: (toast: Omit<ToastProps, "id" | "onClose">) => void;
  removeToast: (id: string) => void;
}

// Toast Context
const ToastContext = React.createContext<ToastContextType | undefined>(
  undefined,
);

// Toast Type Styles
const typeStyles: Record<
  ToastType,
  { border: string; bg: string; title: string; icon: React.ReactNode }
> = {
  success: {
    border: "border-l-4 border-green-500",
    bg: "bg-white",
    title: "text-gray-900",
    icon: <CheckCircle className="w-5 h-5 text-green-500" />,
  },
  error: {
    border: "border-l-4 border-red-500",
    bg: "bg-white",
    title: "text-gray-900",
    icon: <AlertCircle className="w-5 h-5 text-red-500" />,
  },
  warning: {
    border: "border-l-4 border-yellow-500",
    bg: "bg-white",
    title: "text-gray-900",
    icon: <AlertTriangle className="w-5 h-5 text-yellow-500" />,
  },
  info: {
    border: "border-l-4 border-blue-500",
    bg: "bg-white",
    title: "text-gray-900",
    icon: <Info className="w-5 h-5 text-blue-500" />,
  },
};

/**
 * Toast Component - Individual toast notification
 *
 * Position: Top-right, 16px from edge
 * Size: 360px wide
 * Layout: Icon, Title, Message, Close button
 * Types: Success (Green), Error (Red), Warning (Yellow), Info (Blue)
 * Behavior: Slide in from right, auto-dismiss 5 seconds, stack max 3
 *
 * @example
 * const { addToast } = useToast();
 * addToast({
 *   type: "success",
 *   title: "Success",
 *   message: "Operation completed successfully"
 * });
 */
function Toast({
  id,
  type = "info",
  title,
  message,
  duration = 5000,
  onClose,
}: ToastProps) {
  const [isHovering, setIsHovering] = React.useState(false);
  const [timeLeft, setTimeLeft] = React.useState(duration);
  const timerRef = React.useRef<NodeJS.Timeout>();

  const style = typeStyles[type];

  React.useEffect(() => {
    if (isHovering || timeLeft <= 0) return;

    timerRef.current = setTimeout(() => {
      setTimeLeft((prev) => Math.max(prev - 100, 0));
    }, 100);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [timeLeft, isHovering]);

  React.useEffect(() => {
    if (timeLeft === 0 && !isHovering) {
      onClose(id);
    }
  }, [timeLeft, isHovering, id, onClose]);

  return (
    <div
      className={cn(
        "fixed right-4 top-4",
        "w-[360px]",
        "flex items-start gap-3",
        "p-4 rounded-lg shadow-lg",
        "animate-slide-in",
        "transition-all duration-300",
        style.border,
        style.bg,
      )}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Icon */}
      <div className="flex-shrink-0 pt-0.5">{style.icon}</div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h3 className={cn("font-semibold text-sm mb-1", style.title)}>
          {title}
        </h3>
        <p className="text-sm text-gray-600 line-clamp-2">{message}</p>
      </div>

      {/* Close Button */}
      <button
        onClick={() => onClose(id)}
        className={cn(
          "flex-shrink-0 p-1",
          "text-gray-400 hover:text-gray-600",
          "transition-colors",
          "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",
        )}
        aria-label="Close toast"
      >
        <X className="w-4 h-4" />
      </button>

      {/* Progress Bar */}
      <div
        className={cn(
          "absolute bottom-0 left-0 h-1 bg-gradient-to-r",
          type === "success" && "from-green-500 to-green-400",
          type === "error" && "from-red-500 to-red-400",
          type === "warning" && "from-yellow-500 to-yellow-400",
          type === "info" && "from-blue-500 to-blue-400",
          "rounded-b-lg",
        )}
        style={{
          width: `${(timeLeft / duration) * 100}%`,
          transition: "width 100ms linear",
        }}
      />
    </div>
  );
}

/**
 * Toast Provider - Manages toast notifications
 *
 * Wrap your app with this provider to enable toast notifications
 *
 * @example
 * <ToastProvider>
 *   <App />
 * </ToastProvider>
 */
function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastProps[]>([]);

  const addToast = React.useCallback(
    (toast: Omit<ToastProps, "id" | "onClose">) => {
      const id = `toast-${Date.now()}-${Math.random()}`;

      // Limit to 3 toasts max
      setToasts((prev) => {
        const newToasts = [...prev];
        if (newToasts.length >= 3) {
          newToasts.shift();
        }
        return [...newToasts, { ...toast, id, onClose: removeToast }];
      });
    },
    [],
  );

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <div className="fixed inset-0 pointer-events-none">
        <div className="fixed right-4 top-4 pointer-events-auto flex flex-col gap-3">
          {toasts.slice(-3).map((toast) => (
            <Toast key={toast.id} {...toast} />
          ))}
        </div>
      </div>
    </ToastContext.Provider>
  );
}

/**
 * useToast Hook - Use in components to add toasts
 *
 * @example
 * const { addToast } = useToast();
 * addToast({
 *   type: "success",
 *   title: "Success",
 *   message: "Operation completed"
 * });
 */
function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
}

export { Toast, ToastProvider, useToast };
export type { ToastProps, ToastType };
