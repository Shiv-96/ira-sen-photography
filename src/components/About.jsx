/**
 * About
 * Photographer portrait, short story, approach and equipment lists, and key numbers.
 */
import { aboutImage } from '../data/images.js';
import { ABOUT } from '../data/site.js';
import ResponsiveImage from './ResponsiveImage.jsx';
import Reveal from './Reveal.jsx';
import SectionHeading from './SectionHeading.jsx';

function DetailList({ title, items }) {
  return (
    <div>
      <h3 className="text-xs uppercase tracking-[0.3em] text-paper">{title}</h3>
      <ul className="mt-5 space-y-3 text-sm leading-relaxed text-mute">
        {items.map((item) => (
          <li key={item} className="flex gap-3">
            <span aria-hidden="true" className="mt-2.5 h-px w-4 shrink-0 bg-brass" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="border-t border-ink-line py-24 sm:py-32">
      <div className="page-container grid items-center gap-14 lg:grid-cols-12 lg:gap-20">
        <Reveal className="lg:col-span-5">
          {aboutImage ? (
            <ResponsiveImage
              image={aboutImage}
              sizes="(min-width: 1024px) 38vw, 100vw"
              imgClassName="h-auto w-full"
            />
          ) : (
            <div aria-hidden="true" className="aspect-[4/5] bg-ink-soft" />
          )}
        </Reveal>

        <div className="lg:col-span-7">
          <SectionHeading id="about-title" eyebrow="About" title={ABOUT.title} align="left" />

          <Reveal delay={100} className="mt-8 max-w-xl space-y-5 leading-relaxed text-mute">
            {ABOUT.story.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </Reveal>

          <Reveal delay={150} className="mt-12 grid gap-10 sm:grid-cols-2">
            <DetailList title="Approach" items={ABOUT.approach} />
            <DetailList title="Equipment" items={ABOUT.equipment} />
          </Reveal>

          <Reveal delay={200}>
            <dl className="mt-14 grid grid-cols-3 gap-6 border-t border-ink-line pt-10">
              {ABOUT.stats.map((stat) => (
                <div key={stat.label} className="flex flex-col-reverse gap-2">
                  <dt className="text-[0.7rem] uppercase leading-snug tracking-[0.2em] text-mute">{stat.label}</dt>
                  <dd className="font-display text-4xl font-light sm:text-5xl">{stat.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
