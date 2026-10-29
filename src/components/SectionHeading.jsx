/**
 * SectionHeading
 * Shared eyebrow + title + intro block used at the top of each section.
 * The `id` goes on the <h2> so sections can use aria-labelledby.
 */
import Reveal from './Reveal.jsx';

export default function SectionHeading({ id, eyebrow, title, intro, align = 'center' }) {
  const isCentered = align === 'center';

  return (
    <Reveal className={`max-w-2xl ${isCentered ? 'mx-auto text-center' : ''}`}>
      <p
        className={`flex items-center gap-4 text-xs uppercase tracking-[0.3em] text-mute ${
          isCentered ? 'justify-center' : ''
        }`}
      >
        <span aria-hidden="true" className="h-px w-10 bg-brass" />
        {eyebrow}
        {isCentered && <span aria-hidden="true" className="h-px w-10 bg-brass" />}
      </p>
      <h2 id={id} className="mt-6 font-display text-4xl font-light leading-[1.05] sm:text-5xl lg:text-6xl">
        {title}
      </h2>
      {intro && <p className="mt-6 text-base leading-relaxed text-mute sm:text-lg">{intro}</p>}
    </Reveal>
  );
}
