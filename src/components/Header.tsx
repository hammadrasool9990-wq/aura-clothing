import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { NAV, SITE } from '../data/site';
import { useStore } from '../context/StoreContext';

export default function Header() {
  const { cartCount, setCartOpen } = useStore();
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => setMenu(false), [pathname]);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 20);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled || menu ? 'border-b border-line bg-ink/80 backdrop-blur-xl' : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:h-20 md:px-8">
        <Link to="/" className="font-display text-xl font-semibold tracking-[0.25em]" aria-label={`${SITE.name} home`}>
          AURA<span className="text-aura">.</span>
          <span className="ml-1 hidden font-mono text-[10px] font-normal tracking-[0.3em] text-mute sm:inline">CLOTHING</span>
        </Link>

        <nav className="hidden items-center gap-4 lg:flex xl:gap-5" aria-label="Main">
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.to === '/'}
              className={({ isActive }) =>
                `group whitespace-nowrap font-mono text-[11px] uppercase tracking-[0.14em] transition ${isActive ? 'text-bone' : 'text-mute hover:text-bone'}`
              }
            >
              <span className="hidden text-aura/70 2xl:inline">{n.num}/ </span>{n.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2 md:gap-4">
          <button
            onClick={() => setCartOpen(true)}
            className="relative flex h-10 w-10 items-center justify-center rounded-full border border-line transition hover:border-aura"
            aria-label={`Open cart, ${cartCount} items`}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M6 7h12l-1 13H7L6 7Z" />
              <path d="M9 7a3 3 0 0 1 6 0" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-aura px-1 font-mono text-[10px] text-ink">
                {cartCount}
              </span>
            )}
          </button>
          <button
            className="flex h-10 w-10 items-center justify-center rounded-full border border-line lg:hidden"
            onClick={() => setMenu((m) => !m)}
            aria-expanded={menu}
            aria-label="Menu"
          >
            <span className="relative block h-3 w-4">
              <span className={`absolute left-0 h-px w-4 bg-bone transition ${menu ? 'top-1.5 rotate-45' : 'top-0'}`} />
              <span className={`absolute left-0 h-px w-4 bg-bone transition ${menu ? 'top-1.5 -rotate-45' : 'top-3'}`} />
            </span>
          </button>
        </div>
      </div>

      {menu && (
        <nav className="max-h-[80svh] overflow-y-auto border-t border-line px-4 pb-6 lg:hidden" aria-label="Mobile">
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.to === '/'}
              className="flex items-baseline gap-3 border-b border-line py-3 font-display text-3xl font-semibold"
            >
              <span className="font-mono text-xs text-aura">{n.num}/</span>
              {n.label}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  );
}
