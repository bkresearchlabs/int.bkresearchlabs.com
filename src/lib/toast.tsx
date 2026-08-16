import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode } from 'react';
import { useTranslation } from './i18n';

export type ToastType = 'success' | 'info' | 'warning' | 'error' | 'cart' | 'auth' | 'inventory' | 'order';

export interface ToastAction {
  label: string;
  onClick: () => void;
  icon?: React.ReactNode;
}

export interface ToastOptions {
  id?: string;
  title?: string;
  type?: ToastType;
  duration?: number; // ms, default: 4500. 0 = persistent
  action?: ToastAction;
  icon?: React.ReactNode;
  image?: string;
  sound?: boolean;
}

export interface ToastItem {
  id: string;
  type: ToastType;
  title?: string;
  message: string | React.ReactNode;
  duration: number;
  action?: ToastAction;
  icon?: React.ReactNode;
  image?: string;
  sound?: boolean;
  createdAt: number;
}

export interface ToastContextType {
  toasts: ToastItem[];
  showToast: (message: string | React.ReactNode, options?: ToastOptions) => string;
  dismissToast: (id: string) => void;
  dismissAll: () => void;
  toast: {
    show: (message: string | React.ReactNode, options?: ToastOptions) => string;
    success: (message: string | React.ReactNode, options?: Omit<ToastOptions, 'type'>) => string;
    info: (message: string | React.ReactNode, options?: Omit<ToastOptions, 'type'>) => string;
    warning: (message: string | React.ReactNode, options?: Omit<ToastOptions, 'type'>) => string;
    error: (message: string | React.ReactNode, options?: Omit<ToastOptions, 'type'>) => string;
    cart: (data: {
      productName: string;
      quantity?: number;
      price?: number;
      image?: string;
      onViewCart?: () => void;
    }) => string;
    auth: (data: {
      message: string;
      userName?: string;
      role?: string;
      type?: 'login' | 'logout' | 'signup' | 'error';
    }) => string;
    inventory: (data: {
      productName: string;
      remainingQty: number;
      sku?: string;
      isOutOfStock?: boolean;
    }) => string;
    order: (data: {
      orderNumber: string;
      total?: number;
      message?: string;
      onViewOrder?: () => void;
    }) => string;
    dismiss: (id: string) => void;
    dismissAll: () => void;
  };
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

// Web Audio API non-intrusive sound feedback synthesizer
const playFeedbackChime = (type: ToastType) => {
  try {
    if (typeof window === 'undefined') return;
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;
    gain.gain.setValueAtTime(0.001, now);

    if (type === 'cart' || type === 'success') {
      // Pleasant rising high double chime
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.12); // A5
      gain.gain.linearRampToValueAtTime(0.04, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);
      osc.start(now);
      osc.stop(now + 0.35);
    } else if (type === 'auth') {
      // Soft gentle welcoming tone
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.15); // E5
      gain.gain.linearRampToValueAtTime(0.035, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);
      osc.start(now);
      osc.stop(now + 0.3);
    } else if (type === 'inventory' || type === 'warning') {
      // Gentle warning ping
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now); // A4
      osc.frequency.setValueAtTime(392, now + 0.1); // G4
      gain.gain.linearRampToValueAtTime(0.04, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);
      osc.start(now);
      osc.stop(now + 0.3);
    } else if (type === 'error') {
      // Low tone error ping
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.linearRampToValueAtTime(164.81, now + 0.2);
      gain.gain.linearRampToValueAtTime(0.03, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);
      osc.start(now);
      osc.stop(now + 0.3);
    } else {
      // Subtle standard info click
      osc.type = 'sine';
      osc.frequency.setValueAtTime(659.25, now);
      gain.gain.linearRampToValueAtTime(0.025, now + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.15);
      osc.start(now);
      osc.stop(now + 0.15);
    }

    setTimeout(() => {
      try {
        ctx.close().catch(() => {});
      } catch {}
    }, 500);
  } catch {
    // Audio is strictly optional and fails silently
  }
};

/**
 * Global helper to emit toast events from outside React hierarchy
 */
export const emitGlobalToast = (message: string | React.ReactNode, options?: ToastOptions) => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('bkrl_global_toast_event', {
        detail: { message, options },
      })
    );
  }
};

const MAX_VISIBLE_TOASTS = 5;

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const { t } = useTranslation();

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const dismissAll = useCallback(() => {
    setToasts([]);
  }, []);

  const showToast = useCallback(
    (message: string | React.ReactNode, options: ToastOptions = {}): string => {
      const id = options.id || `toast-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      const type: ToastType = options.type || 'info';
      const duration = options.duration !== undefined ? options.duration : 4500;

      const newToast: ToastItem = {
        id,
        type,
        title: options.title,
        message,
        duration,
        action: options.action,
        icon: options.icon,
        image: options.image,
        sound: options.sound ?? true,
        createdAt: Date.now(),
      };

      setToasts((prev) => {
        // Remove duplicate if same id exists
        const filtered = prev.filter((item) => item.id !== id);
        // Keep max visible toasts to prevent clutter
        const next = [newToast, ...filtered].slice(0, MAX_VISIBLE_TOASTS);
        return next;
      });

      if (options.sound !== false) {
        playFeedbackChime(type);
      }

      return id;
    },
    []
  );

  // Listen for global custom events from external listeners / services
  useEffect(() => {
    const handleGlobalEvent = (e: Event) => {
      const customEvent = e as CustomEvent<{ message: string | React.ReactNode; options?: ToastOptions }>;
      if (customEvent.detail) {
        showToast(customEvent.detail.message, customEvent.detail.options);
      }
    };

    window.addEventListener('bkrl_global_toast_event', handleGlobalEvent);
    return () => {
      window.removeEventListener('bkrl_global_toast_event', handleGlobalEvent);
    };
  }, [showToast]);

  const toastMethods = useMemo(
    () => ({
      show: (message: string | React.ReactNode, options?: ToastOptions) => showToast(message, options),
      success: (message: string | React.ReactNode, options?: Omit<ToastOptions, 'type'>) =>
        showToast(message, { ...options, type: 'success', title: options?.title || t('Operation Successful') }),
      info: (message: string | React.ReactNode, options?: Omit<ToastOptions, 'type'>) =>
        showToast(message, { ...options, type: 'info', title: options?.title || t('Notification') }),
      warning: (message: string | React.ReactNode, options?: Omit<ToastOptions, 'type'>) =>
        showToast(message, { ...options, type: 'warning', title: options?.title || t('Attention') }),
      error: (message: string | React.ReactNode, options?: Omit<ToastOptions, 'type'>) =>
        showToast(message, { ...options, type: 'error', duration: options?.duration || 6000, title: options?.title || t('Notice') }),
      cart: ({
        productName,
        quantity = 1,
        price,
        image,
        onViewCart,
      }: {
        productName: string;
        quantity?: number;
        price?: number;
        image?: string;
        onViewCart?: () => void;
      }) => {
        const qtyStr = quantity > 1 ? ` (${quantity}x)` : '';
        const priceStr = price !== undefined ? ` • $${(price * quantity).toFixed(2)}` : '';
        return showToast(`${productName}${qtyStr}${priceStr}`, {
          type: 'cart',
          title: t('Added to Research Cart'),
          image,
          action: onViewCart
            ? {
                label: t('View Cart'),
                onClick: onViewCart,
              }
            : undefined,
          duration: 4500,
        });
      },
      auth: ({
        message,
        userName,
        role,
        type = 'login',
      }: {
        message: string;
        userName?: string;
        role?: string;
        type?: 'login' | 'logout' | 'signup' | 'error';
      }) => {
        const title =
          type === 'login'
            ? t('Authentication Successful')
            : type === 'logout'
            ? t('Signed Out')
            : type === 'signup'
            ? t('Account Created')
            : t('Authentication Notice');

        const roleFormatted = role ? ` [${role.toUpperCase()}]` : '';
        const displayMsg = userName ? `${message} - ${userName}${roleFormatted}` : message;

        return showToast(displayMsg, {
          type: type === 'error' ? 'error' : 'auth',
          title,
          duration: 4000,
        });
      },
      inventory: ({
        productName,
        remainingQty,
        sku,
        isOutOfStock = false,
      }: {
        productName: string;
        remainingQty: number;
        sku?: string;
        isOutOfStock?: boolean;
      }) => {
        const title = isOutOfStock || remainingQty <= 0 ? t('Out of Stock') : t('Low Inventory Notice');
        const skuPrefix = sku ? `[${sku}] ` : '';
        const msg =
          isOutOfStock || remainingQty <= 0
            ? `${skuPrefix}${productName} ${t('is currently out of stock. Backorder may apply.')}`
            : `${skuPrefix}${productName} - ${t('Only {remainingQty} remaining in lot stock!', { remainingQty })}`;

        return showToast(msg, {
          type: 'inventory',
          title,
          duration: 5500,
        });
      },
      order: ({
        orderNumber,
        total,
        message,
        onViewOrder,
      }: {
        orderNumber: string;
        total?: number;
        message?: string;
        onViewOrder?: () => void;
      }) => {
        const totalStr = total !== undefined ? ` ($${total.toFixed(2)})` : '';
        const msg = message || `${t('Order #{orderNumber} confirmed successfully!{totalStr}', { orderNumber, totalStr })}`;
        return showToast(msg, {
          type: 'order',
          title: t('Order Confirmation'),
          duration: 6000,
          action: onViewOrder
            ? {
                label: t('View Order'),
                onClick: onViewOrder,
              }
            : undefined,
        });
      },
      dismiss: dismissToast,
      dismissAll: dismissAll,
    }),
    [showToast, dismissToast, dismissAll, t]
  );

  const contextValue = useMemo(
    () => ({
      toasts,
      showToast,
      dismissToast,
      dismissAll,
      toast: toastMethods,
    }),
    [toasts, showToast, dismissToast, dismissAll, toastMethods]
  );

  return <ToastContext.Provider value={contextValue}>{children}</ToastContext.Provider>;
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
