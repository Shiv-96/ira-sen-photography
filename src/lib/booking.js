/**
 * Booking form helpers: validation rules, Netlify Forms encoding and a small event
 * that lets the Services section preselect a shoot type in the Contact form.
 */
export const BOOKING_FIELDS = ['name', 'email', 'shootType', 'date', 'location', 'message'];
export const SHOOT_TYPE_EVENT = 'booking:select-shoot-type';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MIN_MESSAGE_LENGTH = 20;

/** Today's date as YYYY-MM-DD in the visitor's time zone (the format used by <input type="date">). */
export function getTodayISO() {
  return new Date().toLocaleDateString('en-CA');
}

/** Returns an object of error messages keyed by field name. An empty object means valid. */
export function validateBooking(values, today) {
  const errors = {};

  if (values.name.trim().length < 2) {
    errors.name = 'Please enter your full name.';
  }
  if (!EMAIL_PATTERN.test(values.email.trim())) {
    errors.email = 'Please enter a valid email address, for example name@example.com.';
  }
  if (!values.shootType) {
    errors.shootType = 'Please choose a shoot type.';
  }
  if (!values.date) {
    errors.date = 'Please choose a preferred date.';
  } else if (values.date < today) {
    // ISO date strings compare correctly as plain strings.
    errors.date = 'Please choose a date from today onwards.';
  }
  if (values.location.trim().length < 2) {
    errors.location = 'Please tell me where the shoot will take place.';
  }
  if (values.message.trim().length < MIN_MESSAGE_LENGTH) {
    errors.message = `Please write at least ${MIN_MESSAGE_LENGTH} characters about your plans.`;
  }

  return errors;
}

export function encodeFormData(data) {
  return new URLSearchParams(data).toString();
}

export function selectShootType(value) {
  window.dispatchEvent(new CustomEvent(SHOOT_TYPE_EVENT, { detail: value }));
}
