/**
 * Service packages shown in the Services section.
 * Each `id` matches a value in SHOOT_TYPES so the "Enquire" button can preselect it in the form.
 */
export const SERVICES = [
  {
    id: 'portrait',
    name: 'Portrait Session',
    price: '₹18,000',
    priceNote: 'per session',
    description: 'For individuals, couples and families who want calm, natural portraits.',
    features: [
      'Up to 2 hours at one or two locations',
      'Pre-shoot call to plan outfits and light',
      '40 fully edited, high-resolution images',
      'Private online gallery for 12 months',
      'Delivery within 10 days',
    ],
    featured: false,
  },
  {
    id: 'wedding',
    name: 'Wedding Story',
    price: '₹1,85,000',
    priceNote: 'per wedding',
    description: 'Unhurried coverage of your celebrations, from the first haldi to the last dance.',
    features: [
      'Up to 10 hours of coverage per day',
      'Two photographers for every key moment',
      '500+ edited images in a curated story',
      'Pre-wedding session included',
      'Hand-bound 30-page fine-art album',
      'Delivery within 6 weeks',
    ],
    featured: true,
  },
  {
    id: 'commercial',
    name: 'Travel & Commercial',
    price: '₹45,000',
    priceNote: 'per day',
    description: 'Editorial and brand imagery for hotels, travel companies and magazines.',
    features: [
      'Half-day or full-day bookings',
      'Shot list and location scouting',
      'Commercial usage licence included',
      'Web and print-ready exports',
      'Delivery within 2 weeks',
    ],
    featured: false,
  },
];
