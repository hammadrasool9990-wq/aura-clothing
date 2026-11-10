import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { PRODUCTS } from '../data/products';
import { useStore } from '../context/StoreContext';
import { DualHeading, SectionLabel } from './ui';

// Lookbook list: hover a row and the photo of that shirt follows the cursor
// (portfolio-style project list). On phones the photo shows inside the row.
export default function Lookbook() {
  const { formatPrice } = useStore();
  const looks = PRODUCTS.filter((p) => p.look);
  const [active, setActive] = useState<number | null>(null);
  const float = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0, tx: 0, ty: 0 });

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const p = pos.current;
      p.x += (p.tx - p.x) * 0.14;
      p.y += (p.ty - p.y) * 0.14;
      if (float.current) float.current.style.transform = `translate(${p.x}px, ${p.y}px) translate(-50%, -50%) rotate(${(p.tx - p.x) * 0.03}deg)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <section
      className="relative z-10 mx-auto max-w-7xl px-4 py-24 md:px-8"
      onPointerMove={(e) => {
        pos.current.tx = e.clientX;
        pos.current.ty = e.clientY;
      }}
      onPointerLeave={() => setActive(null)}
    >
      <SectionLabel num="05">Lookbook</SectionLabel>
      <DualHeading text="Worn by the founder" className="mt-3 text-5xl md:text-8xl" />

      <ul className="mt-12 border-t border-line">
        {looks.map((p, i) => (
          <li key={p.id}>
            <Link
              to={`/product/${p.id}`}
              onPointerEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              className="group flex items-center gap-4 border-b border-line py-6 transition-colors md:py-8"
            >
              <span className="w-10 font-mono text-xs text-aura">{String(i + 1).padStart(2, '0')}/</span>
              <img src={p.look} alt="" className="h-16 w-12 rounded-md object-cover md:hidden" loading="lazy" />
              <span className="min-w-0 flex-1 break-words font-display text-2xl font-bold uppercase tracking-tight transition-all duration-500 group-hover:translate-x-3 group-hover:text-aura sm:text-3xl md:text-6xl">
                {p.name}
              </span>
              <span className="hidden font-mono text-xs uppercase tracking-widest text-mute md:inline">{p.category}</span>
              <span className="shrink-0 font-mono text-xs text-mute sm:text-sm">{formatPrice(p)}</span>
            </Link>
          </li>
        ))}
      </ul>

      {/* floating preview that follows the cursor (desktop) */}
      <div
        ref={float}
        className={`pointer-events-none fixed left-0 top-0 z-50 hidden h-80 w-60 overflow-hidden rounded-xl border border-aura/40 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)] transition-opacity duration-300 md:block ${
          active === null ? 'opacity-0' : 'opacity-100'
        }`}
        aria-hidden
      >
        {looks.map((p, i) => (
          <img
            key={p.id}
            src={p.look}
            alt=""
            className={`absolute inset-0 h-full w-full object-cover transition-all duration-500 ${active === i ? 'scale-100 opacity-100' : 'scale-110 opacity-0'}`}
          />
        ))}
      </div>
    </section>
  );
}
