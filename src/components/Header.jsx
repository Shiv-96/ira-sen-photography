/**
 * Header
 * Fixed site header: transparent over the hero, solid after scrolling.
 * On small screens it shows a full-screen menu with focus trap, Esc to close
 * and scroll lock.
 */
import { useEffect, useRef, useState } from 'react';
import { NAV_LINKS, SITE } from '../data/site.js';
import { useFocusTrap } from '../hooks/useFocusTrap.js';
import { useMediaQuery } from '../hooks/useMediaQuery.js';
import { useScrolled } from '../hooks/useScrolled.js';
import { useScrollLock } from '../hooks/useScrollLock.js';

const MOBILE_LINKS = [...NAV_LINKS, { href: '#contact', label: 'Book a shoot' }];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isScrolled = useScrolled(24);
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const headerRef = useRef(null);
  const toggleRef = useRef(null);
  const firstMobileLinkRef = useRef(null);

  useScrollLock(isMenuOpen);
  useFocusTrap(headerRef, isMenuOpen);

  // The mobile menu makes no sense on desktop widths, so close it on resize.
  useEffect(() => {
    if (isDesktop) setIsMenuOpen(false);
  }, [isDesktop]);

  useEffect(() => {
    if (!isMenuOpen) return undefined;

    firstMobileLinkRef.current?.focus();

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
        toggleRef.current?.focus();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isMenuOpen]);

  const closeMenu = () => setIsMenuOpen(false);
  const isSolid = isScrolled || isMenuOpen;

  return (
    <header
      ref={headerRef}
      className={`fixed inset-x-0 top-0 z-40 border-b transition-colors duration-500 ${
        isSolid ? 'border-ink-line bg-ink/95' : 'border-transparent bg-transparent'
      }`}
    >
      <div className="page-container relative z-10 flex h-18 items-center justify-between">
        <a href="#top" onClick={closeMenu} className="font-display text-2xl tracking-wide">
          {SITE.name}
          <span className="sr-only"> Photography, back to top</span>
        </a>

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-10">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="text-xs uppercase tracking-[0.25em] text-paper/80 transition-colors hover:text-paper"
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li>
              <a href="#contact" className="btn-outline">
                Book a shoot
              </a>
            </li>
          </ul>
        </nav>

        <button
          ref={toggleRef}
          type="button"
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu"
          onClick={() => setIsMenuOpen((open) => !open)}
          className="inline-flex size-11 items-center justify-center lg:hidden"
        >
          <span className="sr-only">{isMenuOpen ? 'Close menu' : 'Open menu'}</span>
          <span aria-hidden="true" className="relative block h-2 w-6">
            <span
              className={`absolute left-0 top-0 h-px w-full bg-paper transition-transform duration-300 ${
                isMenuOpen ? 'translate-y-[3.5px] rotate-45' : ''
              }`}
            />
            <span
              className={`absolute bottom-0 left-0 h-px w-full bg-paper transition-transform duration-300 ${
                isMenuOpen ? '-translate-y-[3.5px] -rotate-45' : ''
              }`}
            />
          </span>
        </button>
      </div>

      <div
        id="mobile-menu"
        className={`fixed inset-0 bg-ink transition-[opacity,visibility] duration-300 lg:hidden ${
          isMenuOpen ? 'visible opacity-100' : 'invisible opacity-0'
        }`}
      >
        <nav aria-label="Main" className="page-container flex h-full flex-col justify-center">
          <ul className="space-y-6">
            {MOBILE_LINKS.map((link, index) => (
              <li key={link.href + link.label}>
                <a
                  ref={index === 0 ? firstMobileLinkRef : undefined}
                  href={link.href}
                  onClick={closeMenu}
                  className="font-display text-5xl font-light transition-colors hover:text-brass"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <a href={`mailto:${SITE.email}`} className="mt-12 text-sm text-mute hover:text-paper">
            {SITE.email}
          </a>
        </nav>
      </div>
    </header>
  );
}
