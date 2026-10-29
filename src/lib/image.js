/**
 * Helpers for building image URLs.
 * File names follow the pattern created by scripts/optimize-images.mjs:
 *   /images/<id>-<hash>-<width>.<format>
 */
export function buildSrcSet(image, format) {
  return image.widths.map((width) => `${image.src}-${width}.${format} ${width}w`).join(', ');
}

/** Largest WebP file, used as the <img> fallback for browsers that ignore <source>. */
export function getFallbackSrc(image) {
  return `${image.src}-${image.widths[image.widths.length - 1]}.webp`;
}
