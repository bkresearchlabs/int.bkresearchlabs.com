import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

export type AutoScaleMode = 'auto' | 'fit-width' | 'fit-screen' | 'manual';

export interface AutoScaleContextType {
  enabled: boolean;
  setEnabled: (val: boolean) => void;
  scaleMode: AutoScaleMode;
  setScaleMode: (mode: AutoScaleMode) => void;
  scalePercent: number; // e.g. 100, 85, 92
  scaleRatio: number; // e.g. 1.0, 0.85, 0.92
  manualPercent: number;
  setManualPercent: (percent: number) => void;
  windowSize: { width: number; height: number };
  referenceWidth: number;
  referenceHeight: number;
  zoomIn: () => void;
  zoomOut: () => void;
  resetScale: () => void;
  toggleEnabled: () => void;
}

const AutoScaleContext = createContext<AutoScaleContextType | undefined>(undefined);

const REFERENCE_WIDTH = 1440;
const REFERENCE_HEIGHT = 900;
const MIN_SCALE_PERCENT = 60; // minimum percentage scale to prevent microscopic controls
const MAX_SCALE_PERCENT = 140; // maximum percentage scale for ultra-wide 4K displays
const STORAGE_KEY_ENABLED = 'bkrl_auto_scale_enabled';
const STORAGE_KEY_MODE = 'bkrl_auto_scale_mode';
const STORAGE_KEY_PERCENT = 'bkrl_auto_scale_manual_percent';

export const AutoScaleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load saved preferences
  const [enabled, setEnabledState] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ENABLED);
      return saved !== null ? saved === 'true' : true; // Default to ON for true auto-scale
    } catch {
      return true;
    }
  });

  const [scaleMode, setScaleModeState] = useState<AutoScaleMode>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_MODE);
      if (saved === 'auto' || saved === 'fit-width' || saved === 'fit-screen' || saved === 'manual') {
        return saved;
      }
      return 'auto';
    } catch {
      return 'auto';
    }
  });

  const [manualPercent, setManualPercentState] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PERCENT);
      const parsed = saved ? parseInt(saved, 10) : 100;
      return isNaN(parsed) ? 100 : Math.min(MAX_SCALE_PERCENT, Math.max(MIN_SCALE_PERCENT, parsed));
    } catch {
      return 100;
    }
  });

  const [windowSize, setWindowSize] = useState<{ width: number; height: number }>(() => ({
    width: typeof window !== 'undefined' ? window.innerWidth : REFERENCE_WIDTH,
    height: typeof window !== 'undefined' ? window.innerHeight : REFERENCE_HEIGHT,
  }));

  // Track window resize in real-time as user drags desktop window
  useEffect(() => {
    let resizeTimer: number;

    const handleResize = () => {
      // Immediate update for fluid responsiveness
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('orientationchange', handleResize, { passive: true });

    // Initial check
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
      if (resizeTimer) clearTimeout(resizeTimer);
    };
  }, []);

  const setEnabled = useCallback((val: boolean) => {
    setEnabledState(val);
    try {
      localStorage.setItem(STORAGE_KEY_ENABLED, String(val));
    } catch {}
  }, []);

  const setScaleMode = useCallback((mode: AutoScaleMode) => {
    setScaleModeState(mode);
    try {
      localStorage.setItem(STORAGE_KEY_MODE, mode);
    } catch {}
  }, []);

  const setManualPercent = useCallback((percent: number) => {
    const clamped = Math.min(MAX_SCALE_PERCENT, Math.max(MIN_SCALE_PERCENT, Math.round(percent)));
    setManualPercentState(clamped);
    try {
      localStorage.setItem(STORAGE_KEY_PERCENT, String(clamped));
    } catch {}
  }, []);

  const toggleEnabled = useCallback(() => {
    setEnabled(!enabled);
  }, [enabled, setEnabled]);

  // Calculate the active scale percentage dynamically
  const calculatedPercent = useMemo(() => {
    if (!enabled) return 100;

    if (scaleMode === 'manual') {
      return manualPercent;
    }

    const { width, height } = windowSize;

    // Mobile / Narrow mobile viewports (< 640px) shouldn't be shrunk into oblivion;
    // they follow fluid percentage layout with 100% base
    if (width < 640) {
      return 100;
    }

    if (scaleMode === 'fit-width') {
      // Scale proportionally to reference width (1440px)
      const ratio = width / REFERENCE_WIDTH;
      const rawPercent = Math.round(ratio * 100);
      return Math.min(MAX_SCALE_PERCENT, Math.max(MIN_SCALE_PERCENT, rawPercent));
    }

    if (scaleMode === 'fit-screen') {
      // Fit both width and height percentage
      const widthRatio = width / REFERENCE_WIDTH;
      const heightRatio = height / REFERENCE_HEIGHT;
      const minRatio = Math.min(widthRatio, heightRatio);
      const rawPercent = Math.round(minRatio * 100);
      return Math.min(MAX_SCALE_PERCENT, Math.max(MIN_SCALE_PERCENT, rawPercent));
    }

    // Default 'auto' mode:
    // Seamless percentage scaling when desktop window is resized/dragged
    if (width >= 1600) {
      // Ultra-wide screens: gentle scaling up or standard 100-110%
      const raw = Math.round((width / REFERENCE_WIDTH) * 100);
      return Math.min(115, raw);
    } else if (width >= 1024 && width < 1440) {
      // Medium to standard desktop dragged sizes: smooth percentage ratio
      const raw = Math.round((width / REFERENCE_WIDTH) * 100);
      return Math.min(100, Math.max(75, raw));
    } else if (width >= 640 && width < 1024) {
      // Tablet / Small desktop window drag:
      const raw = Math.round((width / 1100) * 100);
      return Math.min(100, Math.max(70, raw));
    }

    return 100;
  }, [enabled, scaleMode, manualPercent, windowSize]);

  const scaleRatio = calculatedPercent / 100;

  // Apply CSS custom properties to document root for global CSS consumption
  useEffect(() => {
    const root = document.documentElement;
    if (enabled) {
      root.style.setProperty('--app-scale', String(scaleRatio));
      root.style.setProperty('--app-scale-percent', `${calculatedPercent}%`);
      root.style.setProperty('--app-viewport-w', `${windowSize.width}px`);
      root.style.setProperty('--app-viewport-h', `${windowSize.height}px`);
      root.style.setProperty('--overlap-safety-factor', scaleRatio < 0.85 ? '0.85' : '1');
      root.classList.add('auto-scale-active');
    } else {
      root.style.setProperty('--app-scale', '1');
      root.style.setProperty('--app-scale-percent', '100%');
      root.style.removeProperty('--overlap-safety-factor');
      root.classList.remove('auto-scale-active');
    }
  }, [enabled, scaleRatio, calculatedPercent, windowSize]);

  const zoomIn = useCallback(() => {
    setScaleMode('manual');
    setManualPercent(manualPercent + 5);
  }, [manualPercent, setManualPercent, setScaleMode]);

  const zoomOut = useCallback(() => {
    setScaleMode('manual');
    setManualPercent(manualPercent - 5);
  }, [manualPercent, setManualPercent, setScaleMode]);

  const resetScale = useCallback(() => {
    setScaleMode('auto');
    setManualPercent(100);
    setEnabled(true);
  }, [setScaleMode, setManualPercent, setEnabled]);

  const value = useMemo(
    () => ({
      enabled,
      setEnabled,
      scaleMode,
      setScaleMode,
      scalePercent: calculatedPercent,
      scaleRatio,
      manualPercent,
      setManualPercent,
      windowSize,
      referenceWidth: REFERENCE_WIDTH,
      referenceHeight: REFERENCE_HEIGHT,
      zoomIn,
      zoomOut,
      resetScale,
      toggleEnabled,
    }),
    [
      enabled,
      setEnabled,
      scaleMode,
      setScaleMode,
      calculatedPercent,
      scaleRatio,
      manualPercent,
      setManualPercent,
      windowSize,
      zoomIn,
      zoomOut,
      resetScale,
      toggleEnabled,
    ]
  );

  return <AutoScaleContext.Provider value={value}>{children}</AutoScaleContext.Provider>;
};

export const useAutoScale = (): AutoScaleContextType => {
  const context = useContext(AutoScaleContext);
  if (!context) {
    throw new Error('useAutoScale must be used within an AutoScaleProvider');
  }
  return context;
};
