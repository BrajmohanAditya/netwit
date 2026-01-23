"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModalContextType {
  isOpen: boolean;
  onClose: () => void;
}

const ModalContext = React.createContext<ModalContextType>({
  isOpen: false,
  onClose: () => {},
});

interface ModalProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  onBackdropClick?: () => void;
}

export function Modal({
  children,
  isOpen,
  onClose,
  onBackdropClick,
}: ModalProps) {
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  const handleBackdropClick = () => {
    onBackdropClick?.();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <ModalContext.Provider value={{ isOpen, onClose }}>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity duration-200",
          isOpen ? "opacity-100" : "opacity-0",
        )}
        onClick={handleBackdropClick}
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className={cn(
            "relative max-h-[calc(90vh-200px)] w-full max-w-[600px] rounded-xl bg-white shadow-lg transition-all duration-200",
            isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0",
          )}
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
        >
          {children}
        </div>
      </div>
    </ModalContext.Provider>
  );
}

interface ModalHeaderProps {
  title: string;
  onClose?: () => void;
  className?: string;
}

export function ModalHeader({ title, onClose, className }: ModalHeaderProps) {
  const { onClose: contextOnClose } = React.useContext(ModalContext);
  const handleClose = onClose || contextOnClose;

  return (
    <div
      className={cn(
        "flex items-center justify-between border-b border-gray-200 px-6 py-6",
        className,
      )}
    >
      <h2 className="text-2xl font-semibold text-gray-900">{title}</h2>
      <button
        onClick={handleClose}
        className="text-gray-500 hover:text-gray-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 rounded"
        aria-label="Close modal"
      >
        <X className="h-6 w-6" />
      </button>
    </div>
  );
}

interface ModalBodyProps {
  children: React.ReactNode;
  className?: string;
}

export function ModalBody({ children, className }: ModalBodyProps) {
  return (
    <div className={cn("overflow-y-auto px-6 py-6 text-gray-700", className)}>
      {children}
    </div>
  );
}

interface ModalFooterProps {
  children: React.ReactNode;
  className?: string;
}

export function ModalFooter({ children, className }: ModalFooterProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-end gap-3 border-t border-gray-200 bg-gray-50 px-6 py-4",
        className,
      )}
    >
      {children}
    </div>
  );
}

interface ModalSizeVariant {
  size?: "default" | "large";
}

export function ModalWithSize({
  size = "default",
  ...props
}: ModalProps & ModalSizeVariant) {
  return (
    <Modal {...props}>
      <div className={cn(size === "large" && "max-w-[900px]")}>
        {props.children}
      </div>
    </Modal>
  );
}

// Hook for easier modal state management
export function useModal(initialState = false) {
  const [isOpen, setIsOpen] = React.useState(initialState);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  const toggle = () => setIsOpen((prev) => !prev);

  return { isOpen, open, close, toggle };
}
