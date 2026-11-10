import { Link } from 'react-router-dom';
import { DualHeading, Marquee, Reveal, SectionLabel } from '../components/ui';
import { SITE } from '../data/site';
import { useSeo } from '../lib/useSeo';
import portrait from '../assets/founder-portrait.webp';
import casual from '../assets/founder-casual.webp';

// Everything in [BRACKETS] is yours to write. Nothing here is invented as fact.
const VALUES = [
  { n: '01', t: '[VALUE ONE]', d: '[One sentence about something your brand stands for.]' },
  { n: '02', t: '[VALUE TWO]', d: '[One sentence about how you choose fabrics or makers.]' },
  { n: '03', t: '[VALUE THREE]', d: '[One sentence about the customer you design for.]' },
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
            <p>[YOUR BRAND STORY — paragraph 1: why you started AURA-CLOTHING.]</p>
            <p>[Paragraph 2: what makes your shirts different — only claims you can back up.]</p>
            <p>[Paragraph 3: where you're heading next.]</p>
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
              Founder · {SITE.name} · Lahore, Pakistan
            </p>
            <p className="mt-6 text-sm text-mute">[A line from you about why you started the brand.]</p>
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
