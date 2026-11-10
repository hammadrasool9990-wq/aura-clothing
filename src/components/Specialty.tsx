import type { ReactNode } from 'react';
import { DualHeading, Reveal, SectionLabel } from './ui';

// What makes AURA-CLOTHING special. The first five describe things this
// website really does. The last one is yours to write — only promise
// what you can deliver (fabric, stitching, returns…).
const ITEMS: { title: string; text: string; icon: ReactNode }[] = [
  {
    title: 'See it worn',
    text: 'Every shirt is shown on a person, with a fabric close-up you can zoom into before you buy.',
    icon: (
      <path d="M12 3 4 7.5v9L12 21l8-4.5v-9L12 3Zm0 0v18M4 7.5l8 4.5 8-4.5" />
    ),
  },
  {
    title: 'Three shirt lines',
    text: 'Formal, casual and statement shirts, each with its own page, so you find your style fast.',
    icon: <path d="M4 4h16v16H4zM4 10h16M4 15h16M10 4v16M15 4v16" />,
  },
  {
    title: 'Sized for USA & UK',
    text: 'Every size shows its US and UK label, and prices switch between USD and GBP in one tap.',
    icon: <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18Z" />,
  },
  {
    title: 'Prints & embroidery',
    text: 'Houndstooth, gingham, tropical prints and embroidered bands, beyond the plain white shirt.',
    icon: <path d="M8 3 4 6l2 4 2-1v12h8V9l2 1 2-4-4-3c-1 2-2.5 3-4 3S9 5 8 3Z" />,
  },
  {
    title: 'Talk to us directly',
    text: 'Questions about fit or an order go straight to the AURA inbox. No call centre in between.',
    icon: <path d="M4 5h16v11H8l-4 4V5Z" />,
  },
  {
    title: '[Your fabric standard]',
    text: '[Write the quality you guarantee — e.g. the cotton you use, how it is stitched, your returns promise.]',
    icon: <path d="M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.4 6.8 19.1l1-5.8L3.5 9.2l5.9-.9L12 3Z" />,
  },
];

export default function Specialty() {
  return (
    <section className="relative z-10 mx-auto max-w-7xl px-4 py-24 md:px-8" aria-labelledby="specialty-title">
      <div className="grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <SectionLabel num="04">Specialty</SectionLabel>
            <DualHeading as="h2" text="Why AURA" className="mt-3 text-6xl md:text-8xl" />
            <p id="specialty-title" className="mt-6 max-w-xs text-mute">
              What makes AURA-CLOTHING different from every other shirt you scroll past.
            </p>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:col-span-8">
          {ITEMS.map((it, i) => (
            <Reveal key={it.title} delay={(i % 2) * 110}>
              <article
                className="spot-card group h-full rounded-2xl border border-line p-7 transition-colors duration-500 hover:border-aura/50"
                onPointerMove={(e) => {
                  const r = e.currentTarget.getBoundingClientRect();
                  e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`);
                  e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`);
                }}
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-9 w-9 text-aura transition-transform duration-500 group-hover:-translate-y-1 group-hover:rotate-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.3"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  {it.icon}
                </svg>
                <h3 className="mt-8 font-display text-2xl font-bold uppercase leading-tight">{it.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-mute">{it.text}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
