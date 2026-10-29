/**
 * Lightbox
 * Full-screen photo viewer built on the native <dialog> element.
 * Supports arrow keys, Esc, swipe on touch, a focus trap, caption and counter,
 * preloads the neighbouring photos and returns focus to the clicked thumbnail on close.
 */
import { useCallback, useEffect, useRef } from 'react';
import { useFocusTrap } from '../hooks/useFocusTrap.js';
import { useScrollLock } from '../hooks/useScrollLock.js';
import { buildSrcSet, getFallbackSrc } from '../lib/image.js';
import ResponsiveImage from './ResponsiveImage.jsx';

const SWIPE_THRESHOLD_PX = 50;
const LIGHTBOX_SIZES = '100vw';
// Vertical space reserved for the top bar and the caption.
const RESERVED_HEIGHT = '11rem';

const iconButtonClass =
  'inline-flex size-11 items-center justify-center rounded-full border border-paper/20 bg-ink/60 text-paper/80 transition-colors hover:border-paper hover:text-paper';

export default function Lightbox({ images, index, onNavigate, onClose, returnFocusRef }) {
  const dialogRef = useRef(null);
  const closeButtonRef = useRef(null);
  const touchStartRef = useRef(null);

  const total = images.length;
  const image = images[index];
  const hasMultiple = total > 1;

  const showNext = useCallback(() => onNavigate((index + 1) % total), [index, total, onNavigate]);
  const showPrevious = useCallback(
    () => onNavigate((index - 1 + total) % total),
    [index, total, onNavigate],
  );

  useScrollLock(true);
  useFocusTrap(dialogRef, true);

  // Open as a modal on mount; on unmount close it and return focus to the thumbnail.
  useEffect(() => {
    const dialog = dialogRef.current;
    const returnTarget = returnFocusRef?.current;

    if (!dialog.open) dialog.showModal();
    closeButtonRef.current?.focus();

    return () => {
      if (dialog.open) dialog.close();
      returnTarget?.focus({ preventScroll: true });
    };
  }, [returnFocusRef]);

  // Esc fires a "cancel" event on dialogs; route it through React state instead.
  useEffect(() => {
    const dialog = dialogRef.current;

    function handleCancel(event) {
      event.preventDefault();
      onClose();
    }

    dialog.addEventListener('cancel', handleCancel);
    return () => dialog.removeEventListener('cancel', handleCancel);
  }, [onClose]);

  function handleKeyDown(event) {
    if (!hasMultiple) return;
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      showNext();
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      showPrevious();
    }
  }

  // Clicking the empty area around the photo closes the viewer.
  function handleClick(event) {
    if (event.target === event.currentTarget || event.target.hasAttribute('data-lightbox-backdrop')) {
      onClose();
    }
  }

  function handleTouchStart(event) {
    const touch = event.changedTouches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  }

  function handleTouchEnd(event) {
    const start = touchStartRef.current;
    touchStartRef.current = null;
    if (!start || !hasMultiple) return;

    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - start.x;
    const deltaY = touch.clientY - start.y;

    // Only treat clearly horizontal gestures as swipes.
    if (Math.abs(deltaX) < SWIPE_THRESHOLD_PX || Math.abs(deltaX) < Math.abs(deltaY)) return;
    if (deltaX < 0) showNext();
    else showPrevious();
  }

  const neighbours = hasMultiple
    ? [images[(index + 1) % total], images[(index - 1 + total) % total]].filter(
        (item, position, list) => item !== image && list.indexOf(item) === position,
      )
    : [];

  const ratio = image.width / image.height;
  const frameStyle = {
    aspectRatio: `${image.width} / ${image.height}`,
    width: `min(100%, calc((100dvh - ${RESERVED_HEIGHT}) * ${ratio}))`,
  };

  return (
    <dialog
      ref={dialogRef}
      aria-label="Photo viewer"
      onKeyDown={handleKeyDown}
      onClick={handleClick}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="fixed inset-0 m-0 h-full max-h-none w-full max-w-none border-0 bg-ink p-0 text-paper backdrop:bg-black/70 open:animate-fade-in"
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between px-4 py-4 sm:px-8">
          <p aria-hidden="true" className="text-xs tracking-[0.3em] text-mute">
            {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </p>
          <p className="sr-only" aria-live="polite">
            Photo {index + 1} of {total}: {image.caption}
          </p>
          <button ref={closeButtonRef} type="button" onClick={onClose} className={iconButtonClass}>
            <span className="sr-only">Close viewer</span>
            <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <div
          data-lightbox-backdrop=""
          className="relative flex min-h-0 flex-1 items-center justify-center px-4 pb-6 sm:px-20"
        >
          <figure data-lightbox-backdrop="" className="flex w-full flex-col items-center">
            <ResponsiveImage
              key={image.id}
              image={image}
              sizes={LIGHTBOX_SIZES}
              priority
              style={frameStyle}
              imgClassName="h-full w-full object-contain"
            />
            <figcaption className="mt-5 text-center">
              <p className="font-display text-xl italic">{image.caption}</p>
              <p className="mt-1 text-[0.7rem] uppercase tracking-[0.3em] text-mute">{image.category}</p>
            </figcaption>
          </figure>

          {hasMultiple && (
            <>
              <button
                type="button"
                onClick={showPrevious}
                className={`${iconButtonClass} absolute left-2 top-1/2 -translate-y-1/2 sm:left-6`}
              >
                <span className="sr-only">Previous photo</span>
                <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M15 5l-7 7 7 7" />
                </svg>
              </button>
              <button
                type="button"
                onClick={showNext}
                className={`${iconButtonClass} absolute right-2 top-1/2 -translate-y-1/2 sm:right-6`}
              >
                <span className="sr-only">Next photo</span>
                <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Hidden copies of the next and previous photos so the browser downloads them in advance,
          picking the same AVIF/WebP source and width it will use when they are shown. */}
      <div aria-hidden="true" className="pointer-events-none absolute size-px overflow-hidden opacity-0">
        {neighbours.map((item) => (
          <picture key={item.id}>
            <source type="image/avif" srcSet={buildSrcSet(item, 'avif')} sizes={LIGHTBOX_SIZES} />
            <source type="image/webp" srcSet={buildSrcSet(item, 'webp')} sizes={LIGHTBOX_SIZES} />
            <img src={getFallbackSrc(item)} alt="" loading="eager" decoding="async" />
          </picture>
        ))}
      </div>
    </dialog>
  );
}
