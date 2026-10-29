/**
 * ResponsiveImage
 * Renders a photo from the image manifest as <picture> with AVIF and WebP sources.
 * Explicit width/height prevent layout shift, and a dominant colour plus a blurred
 * tiny preview are shown until the real image has loaded.
 * Uses <span> elements so it can live inside buttons.
 */
import { useEffect, useRef, useState } from 'react';
import { buildSrcSet, getFallbackSrc } from '../lib/image.js';

export default function ResponsiveImage({
  image,
  sizes,
  alt = image.alt,
  priority = false,
  className = '',
  imgClassName = '',
  style,
}) {
  const imgRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Images from the browser cache can finish loading before React attaches onLoad.
  useEffect(() => {
    const img = imgRef.current;
    if (img?.complete && img.naturalWidth > 0) setIsLoaded(true);
  }, []);

  return (
    <span
      className={`relative block overflow-hidden ${className}`}
      style={{ backgroundColor: image.color, ...style }}
    >
      <span
        aria-hidden="true"
        className={`absolute inset-0 scale-110 bg-cover bg-center blur-xl transition-opacity duration-700 ${
          isLoaded ? 'opacity-0' : 'opacity-100'
        }`}
        style={{ backgroundImage: `url("${image.lqip}")` }}
      />
      <picture>
        <source type="image/avif" srcSet={buildSrcSet(image, 'avif')} sizes={sizes} />
        <source type="image/webp" srcSet={buildSrcSet(image, 'webp')} sizes={sizes} />
        <img
          ref={imgRef}
          src={getFallbackSrc(image)}
          alt={alt}
          width={image.width}
          height={image.height}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
          decoding="async"
          onLoad={() => setIsLoaded(true)}
          className={`relative block transition-opacity duration-700 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          } ${imgClassName}`}
        />
      </picture>
    </span>
  );
}
