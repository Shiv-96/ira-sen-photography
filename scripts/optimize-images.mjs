/**
 * optimize-images.mjs
 *
 * Turns the original photos in /images-src into small, responsive files for the website.
 * For every entry in scripts/photos.json it:
 *   1. creates AVIF and WebP versions at several widths (never upscaling),
 *   2. adds a short content hash to each file name so the files can be cached forever,
 *   3. builds a tiny blurred placeholder (LQIP) and a dominant colour,
 *   4. writes everything the React app needs to src/data/images.generated.json.
 *
 * It also creates public/og-image.jpg from the first hero photo, writes CREDITS.md,
 * and deletes old files in public/images that are no longer used.
 *
 * Run with: npm run images
 */
import { createHash } from 'node:crypto';
import { access, mkdir, readdir, readFile, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SOURCE_DIR = path.join(ROOT_DIR, 'images-src');
const CONFIG_PATH = path.join(ROOT_DIR, 'scripts', 'photos.json');
const OUTPUT_DIR = path.join(ROOT_DIR, 'public', 'images');
const MANIFEST_PATH = path.join(ROOT_DIR, 'src', 'data', 'images.generated.json');
const CREDITS_PATH = path.join(ROOT_DIR, 'CREDITS.md');
const OG_IMAGE_PATH = path.join(ROOT_DIR, 'public', 'og-image.jpg');
const PUBLIC_URL_PREFIX = '/images';

/** Output widths per usage. They match the `sizes` attributes used in the components. */
const WIDTHS_BY_USE = {
  hero: [960, 1600, 2400],
  gallery: [480, 800, 1200, 1800],
  about: [600, 900, 1200],
};

/** Encoder settings: visually clean results at small file sizes. */
const ENCODERS = {
  avif: { quality: 50, effort: 4 },
  webp: { quality: 72, effort: 5 },
};

const GALLERY_CATEGORIES = ['wedding', 'portrait', 'travel', 'street'];
const REQUIRED_FIELDS = ['id', 'file', 'use', 'alt', 'caption', 'photographer', 'sourceUrl'];

async function fileExists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

function validatePhoto(photo, index, seenIds) {
  const label = photo.id ?? `entry #${index + 1}`;
  const missing = REQUIRED_FIELDS.filter(
    (field) => typeof photo[field] !== 'string' || photo[field].trim() === '',
  );

  if (missing.length > 0) throw new Error(`${label}: missing ${missing.join(', ')}`);
  if (!/^[a-z0-9-]+$/.test(photo.id)) {
    throw new Error(`${label}: id may only contain lowercase letters, numbers and dashes`);
  }
  if (seenIds.has(photo.id)) throw new Error(`${label}: duplicate id`);
  if (!WIDTHS_BY_USE[photo.use]) {
    throw new Error(`${label}: "use" must be one of ${Object.keys(WIDTHS_BY_USE).join(', ')}`);
  }
  if (photo.use === 'gallery' && !GALLERY_CATEGORIES.includes(photo.category)) {
    throw new Error(`${label}: gallery photos need a category (${GALLERY_CATEGORIES.join(', ')})`);
  }

  seenIds.add(photo.id);
}

/** Width and height after applying EXIF orientation (values 5 to 8 mean a 90° rotation). */
function getOrientedSize(metadata) {
  const isRotated = (metadata.orientation ?? 1) >= 5;
  return isRotated
    ? { width: metadata.height, height: metadata.width }
    : { width: metadata.width, height: metadata.height };
}

function pickWidths(use, sourceWidth) {
  const widths = WIDTHS_BY_USE[use].filter((width) => width <= sourceWidth);
  return widths.length > 0 ? widths : [sourceWidth];
}

function toHex({ r, g, b }) {
  return `#${[r, g, b].map((value) => value.toString(16).padStart(2, '0')).join('')}`;
}

async function processPhoto(photo, keepFiles) {
  const sourcePath = path.join(SOURCE_DIR, photo.file);
  if (!(await fileExists(sourcePath))) {
    console.warn(`  skipped ${photo.id}: images-src/${photo.file} not found`);
    return null;
  }

  const buffer = await readFile(sourcePath);
  const size = getOrientedSize(await sharp(buffer).metadata());
  const widths = pickWidths(photo.use, size.width);

  // The hash changes whenever the source photo or the encoder settings change,
  // which gives every new version a new URL and makes long-term caching safe.
  const hash = createHash('sha1')
    .update(buffer)
    .update(JSON.stringify({ widths, ENCODERS }))
    .digest('hex')
    .slice(0, 8);
  const baseName = `${photo.id}-${hash}`;

  let createdCount = 0;
  for (const width of widths) {
    for (const [format, options] of Object.entries(ENCODERS)) {
      const fileName = `${baseName}-${width}.${format}`;
      const outputPath = path.join(OUTPUT_DIR, fileName);
      keepFiles.add(fileName);

      if (await fileExists(outputPath)) continue;

      // rotate() applies EXIF orientation; sharp strips EXIF data (including GPS) by default.
      await sharp(buffer)
        .rotate()
        .resize({ width, withoutEnlargement: true })
        .toFormat(format, options)
        .toFile(outputPath);
      createdCount += 1;
    }
  }

  const placeholder = await sharp(buffer).rotate().resize({ width: 24 }).webp({ quality: 40 }).toBuffer();
  const { dominant } = await sharp(buffer).stats();
  const largestWidth = widths[widths.length - 1];

  return {
    buffer,
    createdCount,
    entry: {
      id: photo.id,
      use: photo.use,
      category: photo.category ?? null,
      alt: photo.alt,
      caption: photo.caption,
      width: largestWidth,
      height: Math.round((size.height / size.width) * largestWidth),
      color: toHex(dominant),
      lqip: `data:image/webp;base64,${placeholder.toString('base64')}`,
      src: `${PUBLIC_URL_PREFIX}/${baseName}`,
      widths,
    },
  };
}

async function writeOgImage(buffer) {
  await sharp(buffer)
    .rotate()
    .resize(1200, 630, { fit: 'cover', position: sharp.strategy.attention })
    .jpeg({ quality: 78, mozjpeg: true })
    .toFile(OG_IMAGE_PATH);
}

function buildCredits(photos) {
  const rows = photos.map(
    (photo) => `| ${photo.id} | ${photo.caption} | ${photo.photographer} | [View source](${photo.sourceUrl}) |`,
  );

  return [
    '# Image credits',
    '',
    'All photographs are used under the Unsplash License or the Pexels License.',
    'This file is generated by `npm run images` from `scripts/photos.json`.',
    '',
    '| Image | Caption | Photographer | Source |',
    '| --- | --- | --- | --- |',
    ...rows,
    '',
  ].join('\n');
}

async function removeStaleFiles(keepFiles) {
  const files = await readdir(OUTPUT_DIR);
  const staleFiles = files.filter((file) => !keepFiles.has(file));
  await Promise.all(staleFiles.map((file) => unlink(path.join(OUTPUT_DIR, file))));
  return staleFiles.length;
}

async function main() {
  if (!(await fileExists(SOURCE_DIR))) {
    throw new Error('Folder images-src/ not found. Create it and add your original photos.');
  }

  const config = JSON.parse(await readFile(CONFIG_PATH, 'utf8'));
  const photos = config.photos ?? [];
  const seenIds = new Set();
  photos.forEach((photo, index) => validatePhoto(photo, index, seenIds));

  const missingCredits = photos.filter((photo) =>
    [photo.photographer, photo.sourceUrl].some((value) => value.trim().toUpperCase() === 'TODO'),
  );
  if (missingCredits.length > 0) {
    console.warn(`Warning: add photographer credits for ${missingCredits.map((photo) => photo.id).join(', ')}\n`);
  }

  await mkdir(OUTPUT_DIR, { recursive: true });

  const keepFiles = new Set();
  const images = [];
  const processedPhotos = [];
  let createdTotal = 0;
  let hasOgImage = false;

  for (const photo of photos) {
    const result = await processPhoto(photo, keepFiles);
    if (!result) continue;

    images.push(result.entry);
    processedPhotos.push(photo);
    createdTotal += result.createdCount;

    if (photo.use === 'hero' && !hasOgImage) {
      await writeOgImage(result.buffer);
      hasOgImage = true;
    }

    const status = result.createdCount > 0 ? `${result.createdCount} new files` : 'up to date';
    console.log(`  ${photo.id}: ${result.entry.widths.join(', ')}px (${status})`);
  }

  const removedCount = await removeStaleFiles(keepFiles);
  await writeFile(MANIFEST_PATH, `${JSON.stringify({ images }, null, 2)}\n`);
  await writeFile(CREDITS_PATH, buildCredits(processedPhotos));

  console.log(
    `\nDone: ${images.length} photos, ${createdTotal} files created, ${removedCount} old files removed.`,
  );
  if (!hasOgImage) console.warn('Warning: no hero photo found, so public/og-image.jpg was not created.');
}

main().catch((error) => {
  console.error(`\nImage optimization failed: ${error.message}`);
  process.exitCode = 1;
});
