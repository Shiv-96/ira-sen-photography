/**
 * NotFound
 * Content of the 404 page with a clear way back to the homepage.
 */
import { SITE } from '../data/site.js';

export default function NotFound() {
  return (
    <div className="flex min-h-svh flex-col">
      <header className="page-container flex h-18 items-center">
        <a href="/" className="font-display text-2xl tracking-wide">
          {SITE.name}
          <span className="sr-only"> Photography, homepage</span>
        </a>
      </header>

      <main className="page-container flex flex-1 flex-col items-center justify-center pb-24 text-center motion-safe:animate-page-in">
        <p className="text-xs uppercase tracking-[0.3em] text-mute">Error 404</p>
        <h1 className="mt-6 font-display text-5xl font-light leading-tight sm:text-7xl">
          This frame is out of focus.
        </h1>
        <p className="mt-6 max-w-md leading-relaxed text-mute">
          The page you are looking for has moved or never existed. Let us take you back to the photographs.
        </p>
        <a href="/" className="btn-primary mt-10">
          Back to the homepage
        </a>
      </main>
    </div>
  );
}
