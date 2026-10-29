/**
 * Testimonials
 * Three short client quotes with name and shoot type.
 */
import { TESTIMONIALS } from '../data/testimonials.js';
import Reveal from './Reveal.jsx';
import SectionHeading from './SectionHeading.jsx';

export default function Testimonials() {
  return (
    <section
      id="testimonials"
      aria-labelledby="testimonials-title"
      className="border-t border-ink-line py-24 sm:py-32"
    >
      <div className="page-container">
        <SectionHeading id="testimonials-title" eyebrow="Kind words" title="From the people in the photographs" />

        <ul className="mt-16 grid gap-14 md:grid-cols-3 md:gap-8">
          {TESTIMONIALS.map((testimonial, index) => (
            <Reveal as="li" key={testimonial.name} delay={index * 120}>
              <figure className="flex h-full flex-col">
                <span aria-hidden="true" className="font-display text-6xl leading-none text-brass">
                  “
                </span>
                <blockquote className="mt-2 flex-1 font-display text-2xl font-light italic leading-snug">
                  <p>{testimonial.quote}</p>
                </blockquote>
                <figcaption className="mt-8 border-t border-ink-line pt-6">
                  <p className="text-sm">{testimonial.name}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.2em] text-mute">{testimonial.shoot}</p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
