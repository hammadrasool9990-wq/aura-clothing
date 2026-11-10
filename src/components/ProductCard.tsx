import { Link } from 'react-router-dom';
import type { Product } from '../data/products';
import { useStore } from '../context/StoreContext';
import { ShirtGlyph } from './ui';

export default function ProductCard({ product, index }: { product: Product; index: number }) {
  const { formatPrice } = useStore();
  const main = product.colors[0];
  const alt = product.colors[1] ?? main;
  return (
    <Link
      to={`/product/${product.id}`}
      className="group block"
      aria-label={`${product.name}, ${formatPrice(product)}`}
    >
      <div className="card-glow relative aspect-[4/5] overflow-hidden rounded-2xl border border-line bg-gradient-to-b from-ink2 to-ink">
        {product.look ? (
          /* photo of the shirt worn, with the fabric glyph shown on hover */
          <>
            <img
              src={product.look}
              alt={`${product.name} worn by Hammad Rasool`}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover transition duration-1000 ease-out group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/10 to-transparent" />
          </>
        ) : (
          <>
            <ShirtGlyph
              color={main.hex}
              pattern={product.pattern}
              accents={main.accents}
              className="absolute inset-0 m-auto h-3/5 w-3/5 transition duration-700 ease-out group-hover:-translate-y-2 group-hover:scale-105 group-hover:opacity-0"
            />
            <ShirtGlyph
              color={alt.hex}
              pattern={product.pattern}
              accents={alt.accents}
              className="absolute inset-0 m-auto h-3/5 w-3/5 translate-y-2 scale-95 opacity-0 transition duration-700 ease-out group-hover:translate-y-0 group-hover:scale-105 group-hover:opacity-100"
            />
          </>
        )}
        <span className="absolute left-4 top-4 z-10 font-mono text-[10px] uppercase tracking-[0.25em] text-bone/80">
          {String(index + 1).padStart(2, '0')}/ {product.category}
        </span>
        <div className="absolute inset-x-4 bottom-4 z-10 flex translate-y-3 items-center justify-between opacity-0 transition duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          <span className="font-mono text-[10px] uppercase tracking-widest text-mute">
            {product.colors.map((c) => c.name).join(' · ')}
          </span>
          <span className="font-mono text-[10px] uppercase tracking-widest text-aura">View shirt →</span>
        </div>
      </div>
      <div className="mt-4 flex items-baseline justify-between gap-3">
        <h3 className="font-display text-lg font-bold uppercase tracking-tight">{product.name}</h3>
        <span className="font-mono text-sm text-mute">{formatPrice(product)}</span>
      </div>
    </Link>
  );
}
