/**
 * Site-wide content: identity, navigation, social links, about-section copy
 * and the shoot types offered in the booking form.
 */
export const SITE = {
  name: 'Ira Sen',
  brand: 'Ira Sen Photography',
  role: 'Wedding, portrait & travel photographer',
  location: 'Jaipur, India',
  tagline: 'Quiet, honest photographs of people and the places they love.',
  email: 'hello@irasen.example',
  responseTime: 'I reply to every enquiry within two working days.',
};

export const NAV_LINKS = [
  { href: '#gallery', label: 'Work' },
  { href: '#about', label: 'About' },
  { href: '#services', label: 'Services' },
  { href: '#testimonials', label: 'Kind words' },
];

export const SOCIAL_LINKS = [
  { label: 'Instagram', href: 'https://www.instagram.com/' },
  { label: 'Pinterest', href: 'https://www.pinterest.com/' },
  { label: 'Behance', href: 'https://www.behance.net/' },
];

export const ABOUT = {
  title: 'Patience, light and real moments',
  story: [
    "I grew up in Jaipur's old city, where every doorway has a story and the light changes the colour of the walls every hour. I picked up my father's film camera at sixteen and never really put it down.",
    'Today I photograph weddings, portraits and journeys across India and abroad. My work is quiet and observational: I would rather wait for a real moment than stage a perfect one.',
    'Whether it is a three-day wedding or a one-hour portrait, the goal is the same: photographs that still feel true in thirty years.',
  ],
  approach: [
    'Documentary first: I guide gently, then step back.',
    'Natural light whenever possible.',
    'A small footprint, so people forget the camera.',
    'Honest editing with true skin tones and no heavy filters.',
  ],
  equipment: [
    'Two full-frame mirrorless bodies with silent shutters',
    '35mm, 50mm and 85mm prime lenses',
    'One small off-camera flash for evening receptions',
    'Colour-calibrated editing on a wide-gamut display',
  ],
  stats: [
    { value: '9', label: 'Years behind the camera' },
    { value: '420+', label: 'Shoots delivered' },
    { value: '23', label: 'Countries photographed' },
  ],
};

export const SHOOT_TYPES = [
  { value: 'wedding', label: 'Wedding' },
  { value: 'portrait', label: 'Portrait' },
  { value: 'commercial', label: 'Travel / Commercial' },
  { value: 'street', label: 'Street / Editorial' },
  { value: 'other', label: 'Something else' },
];
