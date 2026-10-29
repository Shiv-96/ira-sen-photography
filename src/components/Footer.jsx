/**
 * Footer
 * Contact email, social links, copyright and the demo-site note.
 */
import { SITE, SOCIAL_LINKS } from '../data/site.js';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-ink-line pb-10 pt-16">
      <div className="page-container flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
        <div>
          <a href="#top" className="font-display text-3xl">
            {SITE.name}
            <span className="sr-only"> Photography, back to top</span>
          </a>
          <p className="mt-3 text-sm text-mute">
            {SITE.role} · {SITE.location}
          </p>
          <a
            href={`mailto:${SITE.email}`}
            className="mt-6 inline-block underline decoration-ink-line underline-offset-8 transition-colors hover:decoration-brass"
          >
            {SITE.email}
          </a>
        </div>

        <nav aria-label="Social media">
          <ul className="flex flex-wrap gap-6 text-xs uppercase tracking-[0.2em]">
            {SOCIAL_LINKS.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-mute transition-colors hover:text-paper"
                >
                  {link.label}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="page-container mt-12">
        <div className="flex flex-col gap-3 border-t border-ink-line pt-8 text-xs text-mute sm:flex-row sm:justify-between">
          <p>
            © {year} {SITE.brand}. All rights reserved.
          </p>
          <p>Sample website for demonstration purposes. Photos by Unsplash and Pexels contributors.</p>
        </div>
      </div>
    </footer>
  );
}
