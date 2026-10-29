/**
 * Hero
 * Full-screen opening section with a slow crossfade between hero photos.
 * Only the first photo loads immediately; the others load a few seconds later.
 * With reduced motion enabled, a single still photo is shown.
 */
import { useEffect, useState } from 'react';
import { heroImages } from '../data/images.js';
import { SITE } from '../data/site.js';
import { usePrefersReducedMotion } from '../hooks/useMediaQuery.js';
import ResponsiveImage from './ResponsiveImage.jsx';

const SLIDE_INTERVAL_MS = 7000;
const SECONDARY_LOAD_DELAY_MS = 2500;

export default function Hero() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const [canLoadRest, setCanLoadRest] = useState(false);

  const slides = prefersReducedMotion ? heroImages.slice(0, 1) : heroImages;
  const currentIndex = prefersReducedMotion ? 0 : activeIndex;

  useEffect(() => {
    if (prefersReducedMotion || heroImages.length < 2) return undefined;

    const loadTimer = window.setTimeout(() => setCanLoadRest(true), SECONDARY_LOAD_DELAY_MS);
    const slideTimer = window.setInterval(() => {
      // Do not advance while the tab is in the background.
      if (!document.hidden) setActiveIndex((index) => (index + 1) % heroImages.length);
    }, SLIDE_INTERVAL_MS);

    return () => {
      window.clearTimeout(loadTimer);
      window.clearInterval(slideTimer);
    };
  }, [prefersReducedMotion]);

  return (
    <section
      id="top"
      aria-label="Introduction"
      className="relative flex min-h-svh items-center justify-center overflow-hidden bg-ink-soft"
    >
      <div className="absolute inset-0">
        {slides.map((image, index) => {
          if (index > 0 && !canLoadRest) return null;
          const isActive = index === currentIndex;

          return (
            <div
              key={image.id}
              aria-hidden={!isActive}
              className={`absolute inset-0 transition-opacity duration-[2000ms] ease-in-out ${
                isActive ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <ResponsiveImage
                image={image}
                sizes="100vw"
                priority={index === 0}
                className="h-full"
                imgClassName="h-full w-full object-cover"
              />
            </div>
          );
        })}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-linear-to-b from-black/55 via-black/25 to-black/70"
        />
      </div>

      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center px-5 text-center motion-safe:animate-page-in">
        <p className="text-[0.65rem] uppercase tracking-[0.25em] text-paper/85 sm:text-[0.7rem] sm:tracking-[0.35em]">
          Wedding · Portrait · Travel · Street
        </p>
        <h1 className="mt-6 font-display text-6xl font-light leading-none tracking-tight sm:text-8xl lg:text-9xl">
          {SITE.name}
          <span className="sr-only">, {SITE.role} in {SITE.location}</span>
        </h1>
        <p className="mt-6 max-w-xl font-display text-xl italic text-paper/90 sm:text-2xl">{SITE.tagline}</p>
      </div>

      <a
        href="#gallery"
        className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-3 text-[0.7rem] uppercase tracking-[0.3em] text-paper/80 transition-colors hover:text-paper"
      >
        <span>
          Scroll<span className="sr-only"> to the gallery</span>
        </span>
        <span aria-hidden="true" className="relative h-12 w-px overflow-hidden bg-paper/20">
          <span className="absolute inset-x-0 top-0 h-1/2 bg-paper motion-safe:animate-scroll-cue" />
        </span>
      </a>
    </section>
  );
}
