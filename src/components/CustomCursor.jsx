/**
 * CustomCursor
 * A soft ring that follows the mouse on desktop and grows over links and photos.
 * Purely decorative: the native cursor stays visible, it never blocks clicks,
 * and it is disabled on touch devices and when reduced motion is preferred.
 */
import { useEffect, useRef } from 'react';
import { useMediaQuery, usePrefersReducedMotion } from '../hooks/useMediaQuery.js';

const EASING = 0.2;

export default function CustomCursor() {
  const hasFinePointer = useMediaQuery('(hover: hover) and (pointer: fine)');
  const prefersReducedMotion = usePrefersReducedMotion();
  const isEnabled = hasFinePointer && !prefersReducedMotion;
  const ringRef = useRef(null);

  useEffect(() => {
    const ring = ringRef.current;
    if (!isEnabled || !ring) return undefined;

    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };
    let frameId = 0;
    let isVisible = false;

    // Animation frames only run while the ring is still catching up with the mouse.
    function render() {
      current.x += (target.x - current.x) * EASING;
      current.y += (target.y - current.y) * EASING;
      ring.style.transform = `translate3d(${current.x}px, ${current.y}px, 0) translate(-50%, -50%)`;

      const isSettled = Math.abs(target.x - current.x) < 0.1 && Math.abs(target.y - current.y) < 0.1;
      frameId = isSettled ? 0 : requestAnimationFrame(render);
    }

    function updateState(element) {
      const interactive = element instanceof Element ? element.closest('a, button, [data-cursor]') : null;
      ring.dataset.state = interactive ? (interactive.dataset.cursor ?? 'link') : 'default';
    }

    function handlePointerMove(event) {
      if (event.pointerType !== 'mouse') return;

      target.x = event.clientX;
      target.y = event.clientY;
      if (!isVisible) {
        current.x = target.x;
        current.y = target.y;
        isVisible = true;
        ring.style.opacity = '1';
      }

      updateState(event.target);
      if (!frameId) frameId = requestAnimationFrame(render);
    }

    // Scrolling moves content under a still mouse, so re-check what is under the pointer.
    function handleScroll() {
      if (isVisible) updateState(document.elementFromPoint(target.x, target.y));
    }

    function handlePointerLeave() {
      isVisible = false;
      ring.style.opacity = '0';
    }

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    document.documentElement.addEventListener('pointerleave', handlePointerLeave);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('scroll', handleScroll);
      document.documentElement.removeEventListener('pointerleave', handlePointerLeave);
    };
  }, [isEnabled]);

  if (!isEnabled) return null;

  return (
    <div ref={ringRef} aria-hidden="true" className="cursor-ring" data-state="default">
      <span>View</span>
    </div>
  );
}
