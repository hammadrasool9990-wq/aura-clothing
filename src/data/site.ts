// ─────────────────────────────────────────────────────────────
// SITE SETTINGS — the only file you need for brand + contact info.
// Contact details below are copied exactly from the brief / portfolio.
// ─────────────────────────────────────────────────────────────

export const SITE = {
  name: 'AURA-CLOTHING',
  short: 'AURA',
  tagline: 'Wear the signal.',
  emails: ['hammadrasool9990@gmail.com', 'aurevon9990@gmail.com'],
  // Contact-form messages are delivered to this inbox (via Formspree).
  inboxEmail: 'aurevon9990@gmail.com',
  instagram: 'https://www.instagram.com/aurevon9990/',
  instagramHandle: '@aurevon9990',
  linkedin: 'https://www.linkedin.com/in/hammad-rasool6767/',
  portfolio: 'https://hammadrasool.vercel.app/',
};

export const NAV = [
  { to: '/', label: 'Home', num: '01' },
  { to: '/shirts/formal', label: 'Formal', num: '02' },
  { to: '/shirts/casual', label: 'Casual', num: '03' },
  { to: '/shirts/statement', label: 'Statement', num: '04' },
  { to: '/shirts/old-money', label: 'Old Money', num: '05' },
  { to: '/shop', label: 'Shop', num: '06' },
  { to: '/about', label: 'About', num: '07' },
  { to: '/contact', label: 'Contact', num: '08' },
];

// Social / profile links shown in the contact areas and footer
export const SOCIAL = [
  { label: 'Instagram', handle: SITE.instagramHandle, href: SITE.instagram },
  { label: 'LinkedIn', handle: 'Hammad Rasool', href: SITE.linkedin },
  { label: 'Portfolio', handle: 'hammadrasool.vercel.app', href: SITE.portfolio },
];
