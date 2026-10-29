/**
 * Keeps keyboard focus inside `containerRef` while `isActive` is true:
 * Tab on the last element wraps to the first, and Shift+Tab on the first wraps to the last.
 */
import { useEffect } from 'react';

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

export function useFocusTrap(containerRef, isActive) {
  useEffect(() => {
    const container = containerRef.current;
    if (!isActive || !container) return undefined;

    function handleKeyDown(event) {
      if (event.key !== 'Tab') return;

      // Ignore elements that are not rendered (display: none or hidden).
      const focusable = [...container.querySelectorAll(FOCUSABLE_SELECTOR)].filter(
        (element) => element.getClientRects().length > 0,
      );
      if (focusable.length === 0) {
        event.preventDefault();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    container.addEventListener('keydown', handleKeyDown);
    return () => container.removeEventListener('keydown', handleKeyDown);
  }, [containerRef, isActive]);
}
