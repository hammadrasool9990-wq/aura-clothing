import { Link } from 'react-router-dom';
import { DualHeading, Marquee, Reveal, SectionLabel } from '../components/ui';
import { SITE } from '../data/site';
import { useSeo } from '../lib/useSeo';
import portrait from '../assets/founder-portrait.webp';
import casual from '../assets/founder-casual.webp';

// What the brand promises the customer, in plain words.
const VALUES = [
  {
    n: '01',
    t: 'Look sharp, feel easy',
    d: 'Every shirt is picked to look right at the office, at dinner and on the weekend, so getting dressed is the easy part of your day.',
  },
  {
    n: '02',
    t: 'Sizing made simple',
    d: 'US and UK sizes are shown side by side on every shirt. Not sure which one? Send us a message and we will help you choose.',
  },
  {
    n: '03',
    t: 'A real person behind it',
    d: 'Every message goes straight to the founder. You talk to the person who chose the shirt, not a call centre.',
  },
];

export default function About() {
  useSeo('About', 'The story behind AURA-CLOTHING.');
  return (
    <>
      <section className="mx-auto max-w-7xl px-4 pb-20 pt-32 md:px-8 md:pt-40">
        <SectionLabel num="03">About</SectionLabel>
        <DualHeading as="h1" text="The Story" className="mt-3 text-6xl md:text-[10rem]" />

        <div className="mt-16 grid gap-12 md:grid-cols-12">
          <Reveal className="md:col-span-5">
            <p className="font-display text-2xl font-medium leading-snug md:text-4xl">
              {SITE.name} is built for men who want their shirts to say something before they do.
            </p>
          </Reveal>
          <Reveal className="space-y-5 text-mute md:col-span-6 md:col-start-7" delay={120}>
            <p>
              AURA-CLOTHING started with a simple idea: the right shirt changes how a man walks into a room. Hammad Rasool
              built the brand for men in the USA and UK who want to look put-together without trying too hard.
            </p>
            <p>
              The collection is split into four lines (formal, casual, statement and old money) so you can find your style in
              seconds. Every shirt is one simple price: $250.
            </p>
            <p>This is only the beginning. New designs will join the collection, and every message from you helps decide what comes next.</p>
          </Reveal>
        </div>
      </section>

      {/* ── Founder ─────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 pb-24 md:px-8">
        <SectionLabel num="04">The founder</SectionLabel>
        <div className="mt-10 grid items-end gap-6 md:grid-cols-12">
          <Reveal className="md:col-span-5">
            <figure className="group overflow-hidden rounded-2xl border border-line">
              <img
                src={portrait}
                alt="Hammad Rasool in a navy blazer and white shirt, holding an open book"
                className="aspect-[3/4] w-full object-cover transition duration-1000 ease-out group-hover:scale-105"
                loading="lazy"
              />
            </figure>
          </Reveal>
          <Reveal className="md:col-span-4" delay={120}>
            <figure className="group overflow-hidden rounded-2xl border border-line md:-mb-16">
              <img
                src={casual}
                alt="Hammad Rasool in a beige and navy check shirt, reading"
                className="aspect-[3/4] w-full object-cover transition duration-1000 ease-out group-hover:scale-105"
                loading="lazy"
              />
            </figure>
          </Reveal>
          <Reveal className="md:col-span-3" delay={220}>
            <p className="font-display text-3xl font-bold uppercase leading-none">Hammad Rasool</p>
            <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.25em] text-mute">
              Founder · {SITE.name}
            </p>
            <p className="mt-6 text-sm text-mute">
              Hammad started AURA-CLOTHING to help men feel confident in what they wear, every day of the week.
            </p>
          </Reveal>
        </div>
      </section>

      <Marquee text="BUILT TO BE SEEN. —" />

      <section className="mx-auto max-w-7xl px-4 py-24 md:px-8">
        <SectionLabel num="05">What we stand for</SectionLabel>
        <div className="mt-10 divide-y divide-line border-y border-line">
          {VALUES.map((v, i) => (
            <Reveal key={v.n} delay={i * 100} className="group grid items-baseline gap-4 py-10 md:grid-cols-12">
              <span className="font-mono text-xs text-aura md:col-span-1">{v.n}/</span>
              <h2 className="font-display text-3xl font-bold uppercase transition group-hover:translate-x-2 md:col-span-5 md:text-5xl">
                {v.t}
              </h2>
              <p className="text-mute md:col-span-5 md:col-start-8">{v.d}</p>
            </Reveal>
          ))}
        </div>

        <div className="mt-20 flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
          <DualHeading text="See the collection" className="text-4xl md:text-7xl" />
          <Link to="/shop" className="btn-primary">
            Shop now
          </Link>
        </div>
      </section>
    </>
  );
}
