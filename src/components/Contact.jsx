/**
 * Contact
 * Booking form submitted to Netlify Forms with fetch.
 * Features client-side validation with inline errors, focus on the first invalid field,
 * a honeypot field against spam bots and an accessible success message.
 * In local development the submission is simulated, because Netlify Forms only work on Netlify.
 */
import { useEffect, useRef, useState } from 'react';
import { SHOOT_TYPES, SITE } from '../data/site.js';
import {
  BOOKING_FIELDS,
  SHOOT_TYPE_EVENT,
  encodeFormData,
  getTodayISO,
  validateBooking,
} from '../lib/booking.js';
import Reveal from './Reveal.jsx';
import SectionHeading from './SectionHeading.jsx';

const FORM_NAME = 'booking';
const INITIAL_VALUES = { name: '', email: '', shootType: '', date: '', location: '', message: '' };
const INPUT_CLASS =
  'mt-2 block w-full border-0 border-b border-ink-line bg-transparent px-0 py-3 text-base text-paper placeholder:text-mute transition-colors focus:border-brass aria-[invalid=true]:border-red-300';

function Field({ id, label, error, className = '', children }) {
  return (
    <div className={className}>
      <label htmlFor={id} className="block text-xs uppercase tracking-[0.2em] text-mute">
        {label}
      </label>
      {children}
      <p id={`${id}-error`} className="mt-2 min-h-5 text-sm text-red-300">
        {error}
      </p>
    </div>
  );
}

export default function Contact() {
  const [values, setValues] = useState(INITIAL_VALUES);
  const [touched, setTouched] = useState({});
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [honeypot, setHoneypot] = useState('');
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error
  const [formMessage, setFormMessage] = useState('');
  const successRef = useRef(null);

  const today = getTodayISO();
  const errors = validateBooking(values, today);
  const getError = (field) => (hasSubmitted || touched[field] ? errors[field] : undefined);

  // Lets the "Enquire" buttons in Services preselect a shoot type.
  useEffect(() => {
    function handleSelect(event) {
      setValues((previous) => ({ ...previous, shootType: event.detail }));
    }

    window.addEventListener(SHOOT_TYPE_EVENT, handleSelect);
    return () => window.removeEventListener(SHOOT_TYPE_EVENT, handleSelect);
  }, []);

  useEffect(() => {
    if (status === 'success') successRef.current?.focus();
  }, [status]);

  function handleChange(event) {
    const { name, value } = event.target;
    setValues((previous) => ({ ...previous, [name]: value }));
  }

  function handleBlur(event) {
    const { name } = event.target;
    setTouched((previous) => ({ ...previous, [name]: true }));
  }

  function fieldProps(field) {
    const error = getError(field);
    return {
      id: `booking-${field}`,
      name: field,
      value: values[field],
      onChange: handleChange,
      onBlur: handleBlur,
      'aria-invalid': Boolean(error),
      'aria-describedby': error ? `booking-${field}-error` : undefined,
    };
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setHasSubmitted(true);

    const invalidFields = BOOKING_FIELDS.filter((field) => errors[field]);
    if (invalidFields.length > 0) {
      const count = invalidFields.length;
      setFormMessage(`Please correct ${count} ${count === 1 ? 'field' : 'fields'} before sending.`);
      document.getElementById(`booking-${invalidFields[0]}`)?.focus();
      return;
    }

    setFormMessage('');

    // Bots fill in the hidden field; pretend it worked and send nothing.
    if (honeypot) {
      setStatus('success');
      return;
    }

    setStatus('submitting');
    try {
      if (import.meta.env.DEV) {
        await new Promise((resolve) => setTimeout(resolve, 600));
      } else {
        const response = await fetch('/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: encodeFormData({ 'form-name': FORM_NAME, 'bot-field': honeypot, ...values }),
        });
        if (!response.ok) throw new Error(`Request failed with status ${response.status}`);
      }
      setStatus('success');
    } catch {
      setStatus('error');
    }
  }

  function resetForm() {
    setValues(INITIAL_VALUES);
    setTouched({});
    setHasSubmitted(false);
    setStatus('idle');
  }

  const firstName = values.name.trim().split(' ')[0];

  return (
    <section id="contact" aria-labelledby="contact-title" className="border-t border-ink-line py-24 sm:py-32">
      <div className="page-container grid gap-16 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <SectionHeading
            id="contact-title"
            eyebrow="Booking"
            title="Tell me about your day"
            intro="Share a few details and I will get back to you with availability, ideas and a tailored quote."
            align="left"
          />
          <Reveal delay={100} className="mt-10 space-y-2 text-sm">
            <p className="text-mute">Prefer email?</p>
            <a
              href={`mailto:${SITE.email}`}
              className="inline-block text-lg underline decoration-ink-line underline-offset-8 transition-colors hover:decoration-brass"
            >
              {SITE.email}
            </a>
            <p className="pt-2 text-mute">{SITE.responseTime}</p>
          </Reveal>
        </div>

        <Reveal delay={150} className="lg:col-span-7">
          {status === 'success' ? (
            <div
              ref={successRef}
              tabIndex={-1}
              role="status"
              className="border border-ink-line p-8 focus:outline-none sm:p-12"
            >
              <p className="font-display text-4xl font-light">Thank you{firstName ? `, ${firstName}` : ''}.</p>
              <p className="mt-4 leading-relaxed text-mute">
                Your enquiry has arrived. I will reply within two working days with availability and next steps.
              </p>
              <button type="button" onClick={resetForm} className="btn-outline mt-8">
                Send another enquiry
              </button>
            </div>
          ) : (
            <form
              name={FORM_NAME}
              method="POST"
              data-netlify="true"
              netlify-honeypot="bot-field"
              noValidate
              onSubmit={handleSubmit}
              className="grid gap-x-8 gap-y-4 sm:grid-cols-2"
            >
              <input type="hidden" name="form-name" value={FORM_NAME} />

              {/* Honeypot: hidden from people and screen readers, but visible to simple bots. */}
              <p hidden>
                <label>
                  Leave this field empty
                  <input
                    name="bot-field"
                    value={honeypot}
                    onChange={(event) => setHoneypot(event.target.value)}
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </label>
              </p>

              <Field id="booking-name" label="Name" error={getError('name')}>
                <input type="text" autoComplete="name" required className={INPUT_CLASS} {...fieldProps('name')} />
              </Field>

              <Field id="booking-email" label="Email" error={getError('email')}>
                <input
                  type="email"
                  autoComplete="email"
                  required
                  className={INPUT_CLASS}
                  {...fieldProps('email')}
                />
              </Field>

              <Field id="booking-shootType" label="Shoot type" error={getError('shootType')}>
                <select required className={INPUT_CLASS} {...fieldProps('shootType')}>
                  <option value="" className="bg-ink">
                    Choose one
                  </option>
                  {SHOOT_TYPES.map((type) => (
                    <option key={type.value} value={type.value} className="bg-ink">
                      {type.label}
                    </option>
                  ))}
                </select>
              </Field>

              <Field id="booking-date" label="Preferred date" error={getError('date')}>
                <input type="date" min={today} required className={INPUT_CLASS} {...fieldProps('date')} />
              </Field>

              <Field id="booking-location" label="Location" error={getError('location')} className="sm:col-span-2">
                <input
                  type="text"
                  placeholder="City or venue"
                  required
                  className={INPUT_CLASS}
                  {...fieldProps('location')}
                />
              </Field>

              <Field id="booking-message" label="Your plans" error={getError('message')} className="sm:col-span-2">
                <textarea
                  rows={5}
                  placeholder="Tell me about the people, the place and the feeling you want to remember."
                  required
                  className={`${INPUT_CLASS} resize-y`}
                  {...fieldProps('message')}
                />
              </Field>

              <div className="flex flex-col gap-4 pt-4 sm:col-span-2 sm:flex-row sm:items-center">
                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="btn-primary shrink-0 whitespace-nowrap"
                >
                  {status === 'submitting' ? 'Sending…' : 'Send enquiry'}
                </button>
                <p role="alert" className="text-sm text-red-300">
                  {formMessage}
                  {status === 'error' &&
                    `Something went wrong while sending. Please try again or email ${SITE.email}.`}
                </p>
              </div>
            </form>
          )}
        </Reveal>
      </div>
    </section>
  );
}
