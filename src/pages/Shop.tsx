import { useMemo, useState } from 'react';
import { CATEGORIES, PRODUCTS, type Category } from '../data/products';
import { useStore, currencySymbol } from '../context/StoreContext';
import ProductCard from '../components/ProductCard';
import { DualHeading, Reveal, SectionLabel } from '../components/ui';
import { useSeo } from '../lib/useSeo';

type Sort = 'featured' | 'name' | 'price-asc' | 'price-desc';

const ALL_SIZES = Array.from(new Set(PRODUCTS.flatMap((p) => p.sizes.map((s) => s.us))));
const ALL_COLORS = Array.from(new Set(PRODUCTS.flatMap((p) => p.colors.map((c) => c.name))));

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full border px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-wider transition ${
        active ? 'border-bone bg-bone text-ink' : 'border-line text-mute hover:border-bone/50 hover:text-bone'
      }`}
    >
      {children}
    </button>
  );
}

export default function Shop() {
  useSeo('Shop', 'Shop AURA-CLOTHING shirts. Filter by category, size, colour and price.');
  const { priceOf, currency } = useStore();
  const [cat, setCat] = useState<Category | 'All'>('All');
  const [size, setSize] = useState<string | null>(null);
  const [color, setColor] = useState<string | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [sort, setSort] = useState<Sort>('featured');

  // Price filter/sort only work once you've entered prices in products.ts
  const prices = PRODUCTS.map(priceOf).filter((v): v is number => v !== null);
  const hasPrices = prices.length > 0;
  const ceiling = hasPrices ? Math.ceil(Math.max(...prices)) : 0;

  const list = useMemo(() => {
    let out = PRODUCTS.filter(
      (p) =>
        (cat === 'All' || p.category === cat) &&
        (!size || p.sizes.some((s) => s.us === size)) &&
        (!color || p.colors.some((c) => c.name === color)) &&
        (maxPrice === null || (priceOf(p) ?? Infinity) <= maxPrice),
    );
    const byPrice = (a: typeof out[number], b: typeof out[number]) => (priceOf(a) ?? Infinity) - (priceOf(b) ?? Infinity);
    if (sort === 'name') out = [...out].sort((a, b) => a.name.localeCompare(b.name));
    if (sort === 'price-asc') out = [...out].sort(byPrice);
    if (sort === 'price-desc') out = [...out].sort((a, b) => -byPrice(a, b));
    return out;
  }, [cat, size, color, maxPrice, sort, priceOf]);

  const reset = () => {
    setCat('All');
    setSize(null);
    setColor(null);
    setMaxPrice(null);
  };

  return (
    <section className="mx-auto max-w-7xl px-4 pb-10 pt-32 md:px-8 md:pt-40">
      <SectionLabel num="02">Shop</SectionLabel>
      <DualHeading as="h1" text="The Collection" className="mt-3 text-5xl sm:text-6xl md:text-9xl" />

      {/* ── Filters ───────────────────────────────────── */}
      <div className="mt-12 space-y-5 border-y border-line py-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="w-20 font-mono text-[10px] uppercase tracking-[0.25em] text-mute">Category</span>
          {(['All', ...CATEGORIES] as const).map((c) => (
            <Chip key={c} active={cat === c} onClick={() => setCat(c)}>
              {c}
            </Chip>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="w-20 font-mono text-[10px] uppercase tracking-[0.25em] text-mute">Size</span>
          {ALL_SIZES.map((s) => (
            <Chip key={s} active={size === s} onClick={() => setSize(size === s ? null : s)}>
              {s}
            </Chip>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="w-20 font-mono text-[10px] uppercase tracking-[0.25em] text-mute">Colour</span>
          {ALL_COLORS.map((c) => (
            <Chip key={c} active={color === c} onClick={() => setColor(color === c ? null : c)}>
              {c}
            </Chip>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <span className="w-20 font-mono text-[10px] uppercase tracking-[0.25em] text-mute">Price</span>
          {hasPrices ? (
            <label className="flex items-center gap-3 font-mono text-xs">
              <input
                type="range"
                min={0}
                max={ceiling}
                value={maxPrice ?? ceiling}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="accent-[#C9A96E]"
                aria-label="Maximum price"
              />
              Up to {currencySymbol(currency)}
              {maxPrice ?? ceiling}
            </label>
          ) : (
            <span className="font-mono text-xs text-mute">Available once prices are added</span>
          )}
          <div className="ml-auto flex items-center gap-3">
            <label htmlFor="sort" className="font-mono text-[10px] uppercase tracking-[0.25em] text-mute">
              Sort
            </label>
            <select id="sort" value={sort} onChange={(e) => setSort(e.target.value as Sort)} className="field py-2 text-xs">
              <option value="featured">Featured</option>
              <option value="name">Name A–Z</option>
              <option value="price-asc" disabled={!hasPrices}>Price: low to high</option>
              <option value="price-desc" disabled={!hasPrices}>Price: high to low</option>
            </select>
          </div>
        </div>
      </div>

      <p className="mt-6 font-mono text-xs uppercase tracking-widest text-mute" aria-live="polite">
        {list.length} {list.length === 1 ? 'product' : 'products'}
      </p>

      {list.length === 0 ? (
        <div className="py-24 text-center">
          <p className="font-display text-2xl font-bold uppercase">No matches</p>
          <button onClick={reset} className="btn-ghost mt-6">
            Clear filters
          </button>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((p, i) => (
            <Reveal key={p.id} delay={(i % 3) * 90}>
              <ProductCard product={p} index={PRODUCTS.indexOf(p)} />
            </Reveal>
          ))}
        </div>
      )}
    </section>
  );
}
