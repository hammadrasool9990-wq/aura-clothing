import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PRODUCTS } from '../data/products';
import { useStore, currencySymbol } from '../context/StoreContext';
import { ShirtGlyph } from './ui';

export default function CartDrawer() {
  const { cart, cartOpen, setCartOpen, updateQty, removeItem, subtotal, currency, formatPrice } = useStore();
  const [note, setNote] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setCartOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [setCartOpen]);

  useEffect(() => {
    if (!cartOpen) setNote(false);
  }, [cartOpen]);

  return (
    <div className={`fixed inset-0 z-[60] ${cartOpen ? '' : 'pointer-events-none'}`} aria-hidden={!cartOpen}>
      <div
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-500 ${cartOpen ? 'opacity-100' : 'opacity-0'}`}
        onClick={() => setCartOpen(false)}
      />
      <aside
        className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-line bg-ink2 transition-transform duration-500 ease-[cubic-bezier(.7,0,.2,1)] ${
          cartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-label="Shopping cart"
      >
        <div className="flex items-center justify-between border-b border-line p-5">
          <p className="font-mono text-xs uppercase tracking-[0.25em]">
            <span className="text-aura">Cart/</span> {cart.length} {cart.length === 1 ? 'item' : 'items'}
          </p>
          <button onClick={() => setCartOpen(false)} className="font-mono text-xs uppercase tracking-widest text-mute hover:text-bone">
            Close ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {cart.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <p className="font-display text-2xl font-bold uppercase">Your cart is empty</p>
              <Link to="/shop" onClick={() => setCartOpen(false)} className="btn-primary mt-6">
                Shop the collection
              </Link>
            </div>
          ) : (
            <ul className="space-y-5">
              {cart.map((item, i) => {
                const p = PRODUCTS.find((x) => x.id === item.productId);
                if (!p) return null;
                const col = p.colors.find((c) => c.name === item.color) ?? p.colors[0];
                const size = p.sizes.find((s) => s.us === item.size);
                return (
                  <li key={`${item.productId}-${item.size}-${item.color}`} className="flex gap-4 border-b border-line pb-5">
                    <div className="flex h-24 w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-ink">
                      {p.look ? (
                        <img src={p.look} alt="" className="h-full w-full rounded-lg object-cover" />
                      ) : (
                        <ShirtGlyph color={col.hex} pattern={p.pattern} accents={col.accents} swatch={p.swatch} className="h-16 w-16" />
                      )}
                    </div>
                    <div className="flex flex-1 flex-col">
                      <div className="flex justify-between gap-2">
                        <Link to={`/product/${p.id}`} onClick={() => setCartOpen(false)} className="font-display font-bold uppercase">
                          {p.name}
                        </Link>
                        <span className="font-mono text-sm">{formatPrice(p)}</span>
                      </div>
                      <p className="mt-1 font-mono text-[11px] uppercase tracking-wider text-mute">
                        {item.color} · US {item.size} / UK {size?.uk ?? item.size}
                      </p>
                      <div className="mt-auto flex items-center justify-between pt-3">
                        <div className="flex items-center rounded-full border border-line">
                          <button className="px-3 py-1" onClick={() => updateQty(i, item.qty - 1)} aria-label="Decrease quantity">−</button>
                          <span className="w-6 text-center font-mono text-sm">{item.qty}</span>
                          <button className="px-3 py-1" onClick={() => updateQty(i, item.qty + 1)} aria-label="Increase quantity">+</button>
                        </div>
                        <button onClick={() => removeItem(i)} className="font-mono text-[11px] uppercase tracking-wider text-mute hover:text-bone">
                          Remove
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {cart.length > 0 && (
          <div className="border-t border-line p-5">
            <div className="flex justify-between font-mono text-sm uppercase tracking-wider">
              <span className="text-mute">Subtotal</span>
              <span>{subtotal === null ? 'Price on request' : `${currencySymbol(currency)}${subtotal.toLocaleString('en-US')}`}</span>
            </div>
            <p className="mt-1 text-xs text-mute">Shipping and taxes are confirmed with you before your order is placed.</p>
            {/* PLACEHOLDER CHECKOUT — connect Stripe or Shopify (see README) */}
            <button className="btn-primary mt-4 w-full" onClick={() => setNote(true)}>
              Checkout
            </button>
            {note && (
              <p className="mt-3 rounded-lg border border-aura/40 bg-aura/10 p-3 text-xs text-bone" role="status">
                Online checkout isn't connected yet. Please contact us to order — see the Contact page.
              </p>
            )}
          </div>
        )}
      </aside>
    </div>
  );
}
