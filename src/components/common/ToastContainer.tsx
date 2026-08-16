import React, { useState, useEffect, useRef } from 'react';
import {
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Info,
  ShoppingBag,
  UserCheck,
  Package,
  FileCheck,
  X,
  ArrowRight,
  Sparkles,
  Layers
} from 'lucide-react';
import { useToast, ToastItem, ToastType } from '../../lib/toast';
import { useTranslation } from '../../lib/i18n';

const ToastCard: React.FC<{
  toast: ToastItem;
  onDismiss: (id: string) => void;
}> = ({ toast, onDismiss }) => {
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(100);
  const startTimeRef = useRef(Date.now());
  const remainingTimeRef = useRef(toast.duration);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (toast.duration <= 0) return;

    let lastTimestamp = performance.now();

    const step = (now: number) => {
      if (!isPaused) {
        const delta = now - lastTimestamp;
        remainingTimeRef.current = Math.max(0, remainingTimeRef.current - delta);
        const percent = (remainingTimeRef.current / toast.duration) * 100;
        setProgress(percent);

        if (remainingTimeRef.current <= 0) {
          onDismiss(toast.id);
          return;
        }
      }
      lastTimestamp = now;
      animationFrameRef.current = requestAnimationFrame(step);
    };

    animationFrameRef.current = requestAnimationFrame(step);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [toast.id, toast.duration, isPaused, onDismiss]);

  const getTypeStyles = (type: ToastType) => {
    switch (type) {
      case 'cart':
        return {
          border: 'border-emerald-500/50 hover:border-emerald-400',
          bg: 'bg-[#051311]/95',
          accentBg: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
          progressBar: 'bg-emerald-400',
          titleColor: 'text-emerald-300',
          icon: <ShoppingBag className="w-4 h-4 text-emerald-400" />,
        };
      case 'auth':
        return {
          border: 'border-cyan-500/50 hover:border-cyan-400',
          bg: 'bg-[#06141a]/95',
          accentBg: 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30',
          progressBar: 'bg-cyan-400',
          titleColor: 'text-cyan-300',
          icon: <UserCheck className="w-4 h-4 text-cyan-400" />,
        };
      case 'inventory':
        return {
          border: 'border-amber-500/60 hover:border-amber-400',
          bg: 'bg-[#181106]/95',
          accentBg: 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
          progressBar: 'bg-amber-400',
          titleColor: 'text-amber-300',
          icon: <AlertTriangle className="w-4 h-4 text-amber-400" />,
        };
      case 'order':
        return {
          border: 'border-indigo-500/50 hover:border-indigo-400',
          bg: 'bg-[#0d0d1e]/95',
          accentBg: 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30',
          progressBar: 'bg-indigo-400',
          titleColor: 'text-indigo-300',
          icon: <FileCheck className="w-4 h-4 text-indigo-400" />,
        };
      case 'success':
        return {
          border: 'border-emerald-500/50 hover:border-emerald-400',
          bg: 'bg-[#04120e]/95',
          accentBg: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
          progressBar: 'bg-emerald-400',
          titleColor: 'text-emerald-300',
          icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
        };
      case 'warning':
        return {
          border: 'border-amber-500/50 hover:border-amber-400',
          bg: 'bg-[#140e04]/95',
          accentBg: 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
          progressBar: 'bg-amber-400',
          titleColor: 'text-amber-300',
          icon: <AlertTriangle className="w-4 h-4 text-amber-400" />,
        };
      case 'error':
        return {
          border: 'border-red-500/60 hover:border-red-400',
          bg: 'bg-[#170606]/95',
          accentBg: 'bg-red-500/20 text-red-300 border border-red-500/30',
          progressBar: 'bg-red-500',
          titleColor: 'text-red-300',
          icon: <AlertCircle className="w-4 h-4 text-red-400" />,
        };
      case 'info':
      default:
        return {
          border: 'border-slate-600 hover:border-slate-500',
          bg: 'bg-[#0a0f0e]/95',
          accentBg: 'bg-slate-800 text-slate-300 border border-slate-700',
          progressBar: 'bg-emerald-500',
          titleColor: 'text-white',
          icon: <Info className="w-4 h-4 text-emerald-400" />,
        };
    }
  };

  const style = getTypeStyles(toast.type);

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className={`pointer-events-auto w-full max-w-sm sm:max-w-md ${style.bg} ${style.border} backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border transition-all duration-200 transform animate-in slide-in-from-top-3 fade-in relative group`}
      role="alert"
    >
      <div className="p-3.5 sm:p-4 flex items-start gap-3">
        {/* Thumbnail Image or Custom/Type Icon */}
        {toast.image ? (
          <img
            src={toast.image}
            alt=""
            className="w-10 h-10 rounded-xl object-cover border border-white/10 shrink-0 bg-black/40"
          />
        ) : (
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${style.accentBg}`}>
            {toast.icon || style.icon}
          </div>
        )}

        {/* Content area */}
        <div className="flex-1 min-w-0 pr-1">
          {toast.title && (
            <div className={`text-xs font-bold font-sans tracking-wide uppercase flex items-center gap-1.5 ${style.titleColor}`}>
              <span>{toast.title}</span>
            </div>
          )}
          <div className="text-xs text-slate-200 mt-0.5 leading-relaxed break-words font-medium">
            {toast.message}
          </div>

          {/* Optional Action Button */}
          {toast.action && (
            <div className="mt-2.5">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toast.action?.onClick();
                  onDismiss(toast.id);
                }}
                className="px-3 py-1 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 text-white text-[11px] font-bold uppercase tracking-wider rounded-xl transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 shadow-xs"
              >
                {toast.action.icon}
                <span>{toast.action.label}</span>
                <ArrowRight className="w-3 h-3 text-emerald-400" />
              </button>
            </div>
          )}
        </div>

        {/* Dismiss Button */}
        <button
          type="button"
          onClick={() => onDismiss(toast.id)}
          className="p-1 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors shrink-0 cursor-pointer"
          title="Dismiss"
          aria-label="Dismiss notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Countdown Progress Bar (only if duration > 0) */}
      {toast.duration > 0 && (
        <div className="h-0.5 w-full bg-white/5 overflow-hidden">
          <div
            className={`h-full ${style.progressBar} transition-all duration-75 ease-linear`}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
};

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast, dismissAll } = useToast();
  const { dir, t } = useTranslation();

  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="fixed top-4 right-4 z-[999999] pointer-events-none flex flex-col gap-2.5 max-w-sm sm:max-w-md w-full px-3 sm:px-0"
      style={{
        direction: dir,
      }}
    >
      {/* Quick Dismiss All if multiple toasts */}
      {toasts.length >= 3 && (
        <div className="flex justify-end pointer-events-auto animate-in fade-in">
          <button
            onClick={dismissAll}
            className="px-3 py-1 bg-black/80 hover:bg-black text-slate-300 hover:text-white text-[10px] font-bold uppercase tracking-wider rounded-full border border-white/20 backdrop-blur-md transition-all flex items-center gap-1 cursor-pointer shadow-lg"
          >
            <Layers className="w-3 h-3 text-emerald-400" />
            <span>{t('Dismiss All')} ({toasts.length})</span>
          </button>
        </div>
      )}

      {/* Render Active Toasts */}
      {toasts.map((toast) => (
        <ToastCard key={toast.id} toast={toast} onDismiss={dismissToast} />
      ))}
    </div>
  );
};
