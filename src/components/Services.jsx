/**
 * Services
 * Three package cards. "Enquire" scrolls to the booking form and preselects the shoot type.
 */
import { SERVICES } from '../data/services.js';
import { selectShootType } from '../lib/booking.js';
import Reveal from './Reveal.jsx';
import SectionHeading from './SectionHeading.jsx';

export default function Services() {
  return (
    <section id="services" aria-labelledby="services-title" className="border-t border-ink-line py-24 sm:py-32">
      <div className="page-container">
        <SectionHeading
          id="services-title"
          eyebrow="Services"
          title="Ways to work together"
          intro="Every package starts with a conversation about your story, timeline and budget. Custom quotes are always welcome."
        />

        <ul className="mt-16 grid gap-6 lg:grid-cols-3">
          {SERVICES.map((service, index) => (
            <Reveal
              as="li"
              key={service.id}
              delay={index * 100}
              className={`relative flex flex-col border p-8 sm:p-10 ${
                service.featured ? 'border-brass/60 bg-ink-soft' : 'border-ink-line'
              }`}
            >
              {service.featured && (
                <p className="absolute -top-2.5 left-8 bg-ink px-3 text-[0.65rem] uppercase tracking-[0.3em] text-brass">
                  Most booked
                </p>
              )}

              <h3 className="font-display text-3xl font-light">{service.name}</h3>
              <p className="mt-3 text-sm leading-relaxed text-mute">{service.description}</p>

              <p className="mt-8 flex flex-wrap items-baseline gap-x-2">
                <span className="text-xs uppercase tracking-[0.2em] text-mute">From</span>
                <span className="font-display text-4xl">{service.price}</span>
                <span className="text-xs uppercase tracking-[0.2em] text-mute">{service.priceNote}</span>
              </p>

              <h4 className="sr-only">What is included</h4>
              <ul className="mt-8 flex-1 space-y-3 border-t border-ink-line pt-8 text-sm">
                {service.features.map((feature) => (
                  <li key={feature} className="flex gap-3">
                    <span aria-hidden="true" className="mt-2.5 h-px w-4 shrink-0 bg-brass" />
                    {feature}
                  </li>
                ))}
              </ul>

              <a
                href="#contact"
                onClick={() => selectShootType(service.id)}
                className={`mt-10 ${service.featured ? 'btn-primary' : 'btn-outline'}`}
              >
                Enquire<span className="sr-only"> about the {service.name} package</span>
              </a>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
