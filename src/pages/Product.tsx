import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getProduct, LINES, PRODUCTS } from '../data/products';
import { useStore } from '../context/StoreContext';
import { DualHeading, Reveal, SectionLabel } from '../components/ui';
import ProductCard from '../components/ProductCard';
import { useSeo } from '../lib/useSeo';

export default function Product() {
  const { id } = useParams();
  const product = getProduct(id);
  const { addToCart, formatPrice, setCartOpen } = useStore();
  const [colorIdx, setColorIdx] = useState(0);
  const [size, setSize] = useState<string | null>(null);
  const [sizeError, setSizeError] = useState(false);
  const [guide, setGuide] = useState(false);
  const [view, setView] = useState<'look' | 'fabric'>('look');
  const [zoom, setZoom] = useState({ on: false, x: 50, y: 50 });

  useSeo(product ? product.name : 'Product not found', product ? `${product.name} shirt by AURA-CLOTHING.` : 'Product not found.');

  useEffect(() => {
    setColorIdx(0);
    setSize(null);
    setView('look');
    window.scrollTo(0, 0);
  }, [id]);

  if (!product) {
    return (
      <section className="mx-auto max-w-7xl px-4 pb-24 pt-40 text-center md:px-8">
        <DualHeading as="h1" text="Not found" className="text-6xl md:text-8xl" />
        <Link to="/shop" className="btn-primary mt-10">
          Back to shop
        </Link>
      </section>
    );
  }

  const color = product.colors[colorIdx];
  const line = LINES.find((l) => l.category === product.category);
  const more = PRODUCTS.filter((p) => p.id !== product.id && p.category === product.category)
    .concat(PRODUCTS.filter((p) => p.category !== product.category))
    .slice(0, 3);
  const image = view === 'fabric' && product.swatch ? product.swatch : product.look;

  const add = () => {
    if (!size) {
      setSizeError(true);
      return;
    }
    addToCart({ productId: product.id, size, color: color.name, qty: 1 });
    setCartOpen(true);
  };

  return (
    <>
      <section className="mx-auto grid max-w-7xl gap-10 px-4 pt-24 md:grid-cols-2 md:px-8 md:pt-32">
        {/* ── Photo with hover zoom ─────────────────────── */}
        <div className="md:sticky md:top-24 md:self-start">
          <div
            className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-line bg-ink2"
            onPointerEnter={() => setZoom((z) => ({ ...z, on: true }))}
            onPointerLeave={() => setZoom((z) => ({ ...z, on: false }))}
            onPointerMove={(e) => {
              const r = e.currentTarget.getBoundingClientRect();
              setZoom({ on: true, x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
            }}
          >
            {image && (
              <img
                key={image}
                src={image}
                alt={view === 'fabric' ? `${product.name} fabric close-up` : `${product.name} shirt worn by Hammad Rasool`}
                className="h-full w-full object-cover transition-transform duration-300 ease-out"
                style={{ transformOrigin: `${zoom.x}% ${zoom.y}%`, transform: zoom.on ? 'scale(1.8)' : 'scale(1)' }}
              />
            )}
            <span className="pointer-events-none absolute bottom-4 left-4 rounded-full bg-ink/60 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.25em] text-bone backdrop-blur">
              Hover to zoom
            </span>
          </div>
          {product.swatch && (
            <div className="mt-3 flex gap-3" role="group" aria-label="Choose view">
              {(['look', 'fabric'] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  aria-pressed={view === v}
                  className={`h-20 w-16 overflow-hidden rounded-lg border-2 transition ${view === v ? 'border-aura' : 'border-line opacity-70 hover:opacity-100'}`}
                >
                  <img src={v === 'look' ? product.look : product.swatch} alt={v === 'look' ? 'Worn' : 'Fabric'} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Details ───────────────────────────────────── */}
        <div className="md:py-6">
          <nav className="font-mono text-[10px] uppercase tracking-[0.25em] text-mute" aria-label="Breadcrumb">
            <Link to="/shop" className="hover:text-bone">Shop</Link> /{' '}
            {line ? (
              <Link to={`/shirts/${line.slug}`} className="hover:text-bone">
                {line.title}
              </Link>
            ) : (
              product.category
            )}
          </nav>
          <h1 className="mt-4 font-display text-5xl font-semibold leading-[0.95] md:text-7xl">{product.name}</h1>
          <p className="mt-4 font-mono text-xl text-aura">{formatPrice(product)}</p>
          <p className="mt-6 max-w-md text-mute">{product.description}</p>

          <div className="mt-8">
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-mute">
              Colour — <span className="text-bone">{color.name}</span>
            </p>
            <div className="mt-3 flex gap-3">
              {product.colors.map((c, i) => (
                <button
                  key={c.name}
                  onClick={() => setColorIdx(i)}
                  aria-label={c.name}
                  aria-pressed={i === colorIdx}
                  className={`h-10 w-10 rounded-full border-2 transition ${i === colorIdx ? 'scale-110 border-aura' : 'border-line hover:border-bone/50'}`}
                  style={{ background: c.hex }}
                />
              ))}
            </div>
          </div>

          <div className="mt-8">
            <div className="flex items-center justify-between">
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-mute">Size (US / UK)</p>
              <button onClick={() => setGuide((g) => !g)} className="link-underline font-mono text-[10px] uppercase tracking-[0.25em]">
                {guide ? 'Hide size guide' : 'Size guide'}
              </button>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {product.sizes.map((s) => (
                <button
                  key={s.us}
                  onClick={() => {
                    setSize(s.us);
                    setSizeError(false);
                  }}
                  aria-pressed={size === s.us}
                  className={`min-w-[4.5rem] rounded-xl border px-3 py-2.5 text-center transition ${
                    size === s.us ? 'border-aura bg-aura text-ink' : 'border-line hover:border-bone/50'
                  }`}
                >
                  <span className="block font-semibold">{s.us}</span>
                  <span className="block font-mono text-[9px] uppercase tracking-wider opacity-60">UK {s.uk}</span>
                </button>
              ))}
            </div>
            {sizeError && (
              <p className="mt-2 text-sm text-red-300" role="alert">
                Please choose a size.
              </p>
            )}
            {guide && (
              <div className="mt-4 overflow-x-auto rounded-xl border border-line">
                {/* SIZE GUIDE PLACEHOLDER — fill in real measurements from your manufacturer */}
                <table className="w-full text-left font-mono text-xs">
                  <thead className="bg-ink2 text-mute">
                    <tr>
                      <th className="px-4 py-3 font-normal">US</th>
                      <th className="px-4 py-3 font-normal">UK</th>
                      <th className="px-4 py-3 font-normal">Chest (in)</th>
                      <th className="px-4 py-3 font-normal">Chest (cm)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {product.sizes.map((s) => (
                      <tr key={s.us} className="border-t border-line">
                        <td className="px-4 py-3">{s.us}</td>
                        <td className="px-4 py-3">{s.uk}</td>
                        <td className="px-4 py-3 text-mute">[—]</td>
                        <td className="px-4 py-3 text-mute">[—]</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <button onClick={add} className="btn-primary mt-8 w-full md:w-auto md:px-14">
            Add to cart
          </button>

          <ul className="mt-10 space-y-2 border-t border-line pt-6 text-sm text-mute">
            {product.details.map((d) => (
              <li key={d}>— {d}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-24 md:px-8">
        <SectionLabel num="02">You may also like</SectionLabel>
        <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-3">
          {more.map((p, i) => (
            <Reveal key={p.id} delay={i * 90}>
              <ProductCard product={p} index={PRODUCTS.indexOf(p)} />
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
