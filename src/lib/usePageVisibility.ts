import { useState, useEffect } from 'react';

/**
 * Hook to track tab visibility via Page Visibility API.
 * Helps optimize background tabs by lowering polling frequencies,
 * reducing resource consumption, and resuming active data fetching when focused.
 */
export function usePageVisibility(): { isVisible: boolean; isHidden: boolean } {
  const [isVisible, setIsVisible] = useState<boolean>(() => {
    if (typeof document !== 'undefined') {
      return document.visibilityState === 'visible';
    }
    return true;
  });

  useEffect(() => {
    if (typeof document === 'undefined') return;

    const handleVisibilityChange = () => {
      setIsVisible(document.visibilityState === 'visible');
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return {
    isVisible,
    isHidden: !isVisible,
  };
}
