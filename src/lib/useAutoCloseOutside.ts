import { useEffect, useRef, RefObject } from 'react';

export interface AutoCloseOptions {
  enabled?: boolean;
  onClose: () => void;
  closeOnEsc?: boolean;
  ignoreSelectors?: string[];
}

/**
 * Hook to automatically close a pop up, window, modal, or dropdown when the user
 * clicks outside of its container element, ensuring the clicked target outside
 * immediately receives the event and takes over.
 */
export function useAutoCloseOutside<T extends HTMLElement = HTMLDivElement>(
  options: AutoCloseOptions
): RefObject<T> {
  const ref = useRef<T>(null);
  const { enabled = true, onClose, closeOnEsc = true, ignoreSelectors = [] } = options;

  useEffect(() => {
    if (!enabled) return;

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      // If clicked element or any ancestor matches an ignore selector, skip
      if (ignoreSelectors.length > 0) {
        for (const selector of ignoreSelectors) {
          if (target.closest && target.closest(selector)) {
            return;
          }
        }
      }

      // If click occurred outside the container ref
      if (ref.current && !ref.current.contains(target)) {
        onClose();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (closeOnEsc && e.key === 'Escape') {
        onClose();
      }
    };

    // Use capture phase to ensure outside click triggers modal close immediately
    // while allowing the event to proceed to the clicked underlying target
    window.addEventListener('mousedown', handlePointerDown, { capture: true });
    window.addEventListener('touchstart', handlePointerDown, { capture: true });
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('mousedown', handlePointerDown, { capture: true });
      window.removeEventListener('touchstart', handlePointerDown, { capture: true });
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [enabled, onClose, closeOnEsc, ignoreSelectors]);

  return ref;
}
