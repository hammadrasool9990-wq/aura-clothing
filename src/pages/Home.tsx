import { Link } from 'react-router-dom';
import { PRODUCTS } from '../data/products';
import { DualHeading, Marquee, Reveal, SectionLabel } from '../components/ui';
import ProductCard from '../components/ProductCard';
import StyleNotes from '../components/StyleNotes';
import DotField from '../components/DotField';
import SpaceHero from '../components/SpaceHero';
import Specialty from '../components/Specialty';
import Story from '../components/Story';
import Lookbook from '../components/Lookbook';
import { useSeo } from '../lib/useSeo';

import PhotoRing from '../components/PhotoRing';
import HomeContact from '../components/HomeContact';

export default function Home() {
  useSeo('Premium Menswear', 'AURA-CLOTHING — premium shirts for men in the USA and UK.');
  const featured = PRODUCTS.filter((p) => p.featured);

  return (
    <div className="relative">
      {/* dotted, cursor-reactive background for the whole home page */}
      <DotField />

      <div className="relative z-10">
        {/* ── 01 ARRIVAL: spaceship landing ─────────────── */}
        <SpaceHero />

        <Marquee text="AURA. — WEAR THE SIGNAL. —" />

        {/* ── 02 THE COLLECTION IN 3D ───────────────────── */}
        <section id="collection-3d" className="relative scroll-mt-20 pt-24">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 md:flex-row md:items-end md:justify-between md:px-8">
            <div>
              <SectionLabel num="02">The collection</SectionLabel>
              <DualHeading text="Spin the ring" className="mt-3 text-5xl md:text-8xl" />
            </div>
            <p className="max-w-xs text-sm text-mute">
              Ten shirts across formal, casual and statement. Drag to spin, tap a shirt to open it.
            </p>
          </div>
          <div className="relative">
            <PhotoRing items={PRODUCTS.filter((p) => p.look)} />
          </div>
        </section>

        {/* ── 03 THE SIGNAL: scroll-lit statement ───────── */}
        <Story />

        {/* ── 04 SPECIALTY ──────────────────────────────── */}
        <Specialty />

        {/* ── 05 LOOKBOOK: hover rows, photo follows cursor ─ */}
        <Lookbook />

        {/* ── 06 FEATURED ───────────────────────────────── */}
        <section className="mx-auto max-w-7xl px-4 py-24 md:px-8">
          <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <SectionLabel num="06">Featured</SectionLabel>
              <DualHeading text="New in" className="mt-3 text-6xl md:text-8xl" />
            </div>
            <Link to="/shop" className="link-underline font-mono text-xs uppercase tracking-[0.2em]">
              View all products →
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {featured.slice(0, 4).map((p, i) => (
              <Reveal key={p.id} delay={i * 90}>
                <ProductCard product={p} index={PRODUCTS.indexOf(p)} />
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── 07 STYLE NOTES ───────────────────────────── */}
        <StyleNotes />

        {/* ── 08 CONTACT ────────────────────────────────── */}
        <HomeContact />
      </div>
    </div>
  );
}
