/**
 * Returns true once the page has been scrolled past `threshold` pixels.
 */
import { useEffect, useState } from 'react';

export function useScrolled(threshold = 0) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    function update() {
      setIsScrolled(window.scrollY > threshold);
    }

    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, [threshold]);

  return isScrolled;
}
