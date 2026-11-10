import { Link, Navigate, useParams } from 'react-router-dom';
import { LINES, PRODUCTS } from '../data/products';
import ProductCard from '../components/ProductCard';
import { DualHeading, Reveal, SectionLabel } from '../components/ui';
import { useSeo } from '../lib/useSeo';

// One page per shirt line: /shirts/formal, /shirts/casual, /shirts/statement
export default function ShirtLine() {
  const { line: slug } = useParams();
  const line = LINES.find((l) => l.slug === slug);
  useSeo(line ? line.title : 'Shirts', line ? `${line.title} by AURA-CLOTHING. ${line.intro}` : 'Shirts by AURA-CLOTHING.');
  if (!line) return <Navigate to="/shop" replace />;

  const items = PRODUCTS.filter((p) => p.category === line.category);
  const hero = items[0];
  const num = String(LINES.indexOf(line) + 1).padStart(2, '0');

  return (
    <>
      {/* ── Line hero: big title + lead photo ─────────── */}
      <section className="mx-auto grid max-w-7xl items-end gap-10 px-4 pb-16 pt-32 md:grid-cols-12 md:px-8 md:pt-40">
        <div className="md:col-span-7">
          <SectionLabel num={num}>Shirts</SectionLabel>
          <DualHeading as="h1" text={line.title} className="mt-3 text-6xl md:text-[8.5rem]" />
          <p className="mt-6 max-w-md text-lg text-mute">{line.intro}</p>
          <p className="mt-6 font-mono text-xs uppercase tracking-[0.25em] text-aura">
            {items.length} {items.length === 1 ? 'shirt' : 'shirts'}
          </p>
        </div>
        {hero?.look && (
          <Reveal className="md:col-span-5">
            <Link to={`/product/${hero.id}`} className="group block overflow-hidden rounded-2xl border border-line">
              <img
                src={hero.look}
                alt={`${hero.name} shirt worn by Hammad Rasool`}
                className="aspect-[4/5] w-full object-cover transition duration-1000 group-hover:scale-105"
              />
            </Link>
          </Reveal>
        )}
      </section>

      {/* ── Grid ──────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="grid grid-cols-1 gap-x-8 gap-y-14 border-t border-line pt-12 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((p, i) => (
            <Reveal key={p.id} delay={(i % 3) * 90}>
              <ProductCard product={p} index={i} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Other lines ───────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 pt-24 md:px-8">
        <SectionLabel num="→">More shirts</SectionLabel>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {LINES.filter((l) => l.slug !== line.slug).map((l) => {
            const cover = PRODUCTS.find((p) => p.category === l.category && p.look);
            return (
              <Link key={l.slug} to={`/shirts/${l.slug}`} className="group relative flex h-48 items-end overflow-hidden rounded-2xl border border-line p-6">
                {cover?.look && (
                  <img src={cover.look} alt="" className="absolute inset-0 h-full w-full object-cover opacity-50 transition duration-700 group-hover:scale-105 group-hover:opacity-70" />
                )}
                <span className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
                <span className="relative font-display text-4xl font-semibold italic">{l.title} →</span>
              </Link>
            );
          })}
        </div>
      </section>
    </>
  );
}
