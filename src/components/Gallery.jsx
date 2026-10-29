/**
 * Gallery
 * Masonry photo grid with animated, accessible category filters.
 * Photos are placed into balanced columns using their aspect ratios (no DOM measuring),
 * filter buttons use aria-pressed, a live region announces results,
 * and clicking a photo opens the Lightbox.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { GALLERY_CATEGORIES, galleryImages } from '../data/images.js';
import { useMediaQuery, usePrefersReducedMotion } from '../hooks/useMediaQuery.js';
import Lightbox from './Lightbox.jsx';
import ResponsiveImage from './ResponsiveImage.jsx';
import SectionHeading from './SectionHeading.jsx';

const FADE_DURATION_MS = 220;
const GALLERY_SIZES = '(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw';

const CATEGORY_COUNTS = Object.fromEntries(
  GALLERY_CATEGORIES.map(({ id }) => [
    id,
    id === 'all' ? galleryImages.length : galleryImages.filter((image) => image.category === id).length,
  ]),
);

/** Puts each photo into the currently shortest column (height measured as height / width). */
function distributeIntoColumns(images, columnCount) {
  const columns = Array.from({ length: columnCount }, () => ({ height: 0, items: [] }));

  images.forEach((image, index) => {
    const shortest = columns.reduce((min, column) => (column.height < min.height ? column : min));
    shortest.items.push({ image, index });
    shortest.height += image.height / image.width;
  });

  return columns.map((column) => column.items);
}

export default function Gallery() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const isLarge = useMediaQuery('(min-width: 1024px)');
  const isMedium = useMediaQuery('(min-width: 640px)');
  const columnCount = isLarge ? 3 : isMedium ? 2 : 1;

  // activeFilter updates instantly (button state); renderedFilter updates after the fade-out.
  const [activeFilter, setActiveFilter] = useState('all');
  const [renderedFilter, setRenderedFilter] = useState('all');
  const [isFading, setIsFading] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const fadeTimerRef = useRef(0);
  const lastTriggerRef = useRef(null);

  useEffect(() => () => window.clearTimeout(fadeTimerRef.current), []);

  const visibleImages = useMemo(
    () =>
      renderedFilter === 'all'
        ? galleryImages
        : galleryImages.filter((image) => image.category === renderedFilter),
    [renderedFilter],
  );

  const columns = useMemo(
    () => distributeIntoColumns(visibleImages, columnCount),
    [visibleImages, columnCount],
  );

  function selectFilter(categoryId) {
    if (categoryId === activeFilter) return;
    setActiveFilter(categoryId);
    window.clearTimeout(fadeTimerRef.current);

    if (prefersReducedMotion) {
      setRenderedFilter(categoryId);
      return;
    }

    setIsFading(true);
    fadeTimerRef.current = window.setTimeout(() => {
      setRenderedFilter(categoryId);
      setIsFading(false);
    }, FADE_DURATION_MS);
  }

  function openLightbox(index, trigger) {
    lastTriggerRef.current = trigger;
    setLightboxIndex(index);
  }

  const closeLightbox = useCallback(() => setLightboxIndex(null), []);

  const renderedLabel = GALLERY_CATEGORIES.find((category) => category.id === renderedFilter).label;
  const statusMessage =
    renderedFilter === 'all'
      ? `Showing all ${visibleImages.length} photos`
      : `Showing ${visibleImages.length} ${renderedLabel.toLowerCase()} photos`;

  return (
    <section id="gallery" aria-labelledby="gallery-title" className="py-24 sm:py-32">
      <div className="page-container">
        <SectionHeading
          id="gallery-title"
          eyebrow="Selected work"
          title="Stories told in light"
          intro="A small selection from recent weddings, portrait sessions, journeys and city walks."
        />

        {galleryImages.length === 0 ? (
          <p className="mt-16 text-center text-mute">
            No photos yet. Add your images and run <code>npm run images</code>.
          </p>
        ) : (
          <>
            <div
              role="group"
              aria-label="Filter photos by category"
              className="mt-12 flex flex-wrap justify-center gap-x-2 gap-y-3"
            >
              {GALLERY_CATEGORIES.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  aria-pressed={category.id === activeFilter}
                  onClick={() => selectFilter(category.id)}
                  className="rounded-full border border-ink-line px-4 py-2.5 text-xs uppercase tracking-[0.15em] text-mute transition-colors hover:border-paper/40 hover:text-paper aria-pressed:border-brass aria-pressed:text-paper sm:px-5 sm:tracking-[0.2em]"
                >
                  {category.label}
                  <span aria-hidden="true" className="ml-2 text-[0.65rem] text-mute">
                    {CATEGORY_COUNTS[category.id]}
                  </span>
                  <span className="sr-only"> ({CATEGORY_COUNTS[category.id]} photos)</span>
                </button>
              ))}
            </div>

            <p className="sr-only" aria-live="polite">
              {statusMessage}
            </p>

            <div
              className={`mt-12 flex gap-4 transition-[opacity,transform] duration-200 ease-out sm:gap-6 ${
                isFading ? 'translate-y-2 opacity-0' : 'translate-y-0 opacity-100'
              }`}
            >
              {columns.map((column, columnIndex) => (
                <ul key={columnIndex} className="flex min-w-0 flex-1 flex-col gap-4 sm:gap-6">
                  {column.map(({ image, index }) => (
                    <li key={image.id}>
                      <button
                        type="button"
                        aria-haspopup="dialog"
                        data-cursor="view"
                        onClick={(event) => openLightbox(index, event.currentTarget)}
                        className="group relative block w-full overflow-hidden"
                      >
                        <ResponsiveImage
                          image={image}
                          sizes={GALLERY_SIZES}
                          imgClassName="h-auto w-full transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                        />
                        <span
                          aria-hidden="true"
                          className="pointer-events-none absolute inset-x-0 bottom-0 bg-linear-to-t from-black/75 to-transparent p-4 pt-12 text-left font-display text-lg italic opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
                        >
                          {image.caption}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              ))}
            </div>
          </>
        )}
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          images={visibleImages}
          index={lightboxIndex}
          onNavigate={setLightboxIndex}
          onClose={closeLightbox}
          returnFocusRef={lastTriggerRef}
        />
      )}
    </section>
  );
}
