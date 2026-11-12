import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { PRODUCTS, type Product } from '../data/products';
import { load, save } from '../lib/storage';

export type Currency = 'USD' | 'GBP';

export interface CartItem {
  productId: string;
  size: string; // US label (UK shown alongside)
  color: string;
  qty: number;
}

interface StoreValue {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  formatPrice: (p: Product) => string;
  priceOf: (p: Product) => number | null;
  cart: CartItem[];
  cartCount: number;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  addToCart: (item: CartItem) => void;
  updateQty: (index: number, qty: number) => void;
  removeItem: (index: number) => void;
  subtotal: number | null; // null when any item has no price set yet
}

const StoreContext = createContext<StoreValue | null>(null);

const SYMBOL: Record<Currency, string> = { USD: '$', GBP: '£' };

export function StoreProvider({ children }: { children: ReactNode }) {
  // Prices are shown in USD only (one fixed price per shirt). To add GBP later,
  // set priceGBP on products and bring back the toggle in Header.tsx.
  const [currency, setCurrency] = useState<Currency>('USD');
  const [cart, setCart] = useState<CartItem[]>(() => load<CartItem[]>('aura.cart', []));
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => save('aura.cart', cart), [cart]);

  const value = useMemo<StoreValue>(() => {
    const priceOf = (p: Product) => (currency === 'USD' ? p.priceUSD : p.priceGBP);
    const formatPrice = (p: Product) => {
      const v = priceOf(p);
      return v === null ? 'Price on request' : `${SYMBOL[currency]}${Number.isInteger(v) ? v : v.toFixed(2)}`;
    };

    let subtotal: number | null = 0;
    for (const item of cart) {
      const p = PRODUCTS.find((x) => x.id === item.productId);
      const v = p ? priceOf(p) : null;
      if (v === null || subtotal === null) subtotal = null;
      else subtotal += v * item.qty;
    }

    return {
      currency,
      setCurrency,
      priceOf,
      formatPrice,
      cart,
      cartCount: cart.reduce((n, i) => n + i.qty, 0),
      cartOpen,
      setCartOpen,
      subtotal,
      addToCart: (item) =>
        setCart((prev) => {
          const i = prev.findIndex(
            (x) => x.productId === item.productId && x.size === item.size && x.color === item.color,
          );
          if (i === -1) return [...prev, item];
          const next = [...prev];
          next[i] = { ...next[i], qty: next[i].qty + item.qty };
          return next;
        }),
      updateQty: (index, qty) =>
        setCart((prev) => prev.map((x, i) => (i === index ? { ...x, qty: Math.max(1, qty) } : x))),
      removeItem: (index) => setCart((prev) => prev.filter((_, i) => i !== index)),
    };
  }, [currency, cart, cartOpen]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used inside <StoreProvider>');
  return ctx;
}

export const currencySymbol = (c: Currency) => SYMBOL[c];
