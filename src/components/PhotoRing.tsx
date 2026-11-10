import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Product } from '../data/products';
import { prefersReducedMotion } from '../lib/storage';

/**
 * A slowly turning 3D ring of real shirt photos (CSS 3D, no WebGL).
 * Hover pauses it, drag spins it, tap a photo to open that shirt.
 */
export default function PhotoRing({ items }: { items: Product[] }) {
  const ring = useRef<HTMLDivElement>(null);
  const state = useRef({ angle: 0, vel: 0, paused: false, drag: false, lastX: 0, moved: 0 });
  const [radius, setRadius] = useState(520);
  const n = items.length;
  const step = 360 / n;

  useEffect(() => {
    const fit = () => {
      const w = window.innerWidth;
      const card = w < 640 ? 170 : 240;
      // spread the cards so they just touch around the ring
      setRadius(Math.round(card / 2 / Math.tan(Math.PI / n) + 40));
    };
    fit();
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, [n]);

  useEffect(() => {
    const reduced = prefersReducedMotion();
    let raf = 0;
    const tick = () => {
      const s = state.current;
      if (!reduced && !s.paused && !s.drag) s.angle -= 0.12;
      s.angle += s.vel;
      s.vel *= 0.93;
      if (ring.current) ring.current.style.transform = `translateZ(${-radius}px) rotateY(${s.angle}deg)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [radius]);

  return (
    <div
      className="photo-ring-stage relative mx-auto h-[420px] w-full select-none sm:h-[520px]"
      onPointerEnter={() => (state.current.paused = true)}
      onPointerLeave={() => {
        state.current.paused = false;
        state.current.drag = false;
      }}
      onPointerDown={(e) => {
        state.current.drag = true;
        state.current.lastX = e.clientX;
        state.current.moved = 0;
      }}
      onPointerMove={(e) => {
        const s = state.current;
        if (!s.drag) return;
        const dx = e.clientX - s.lastX;
        s.lastX = e.clientX;
        s.moved += Math.abs(dx);
        s.vel = dx * 0.25;
      }}
      onPointerUp={() => (state.current.drag = false)}
      onClickCapture={(e) => {
        if (state.current.moved > 6) {
          e.preventDefault();
          e.stopPropagation();
        }
      }}
    >
      <div ref={ring} className="photo-ring absolute left-1/2 top-1/2">
        {items.map((p, i) => (
          <Link
            key={p.id}
            to={`/product/${p.id}`}
            draggable={false}
            className="photo-card group absolute block overflow-hidden rounded-2xl border border-line bg-ink2"
            style={{ transform: `rotateY(${i * step}deg) translateZ(${radius}px)` }}
          >
            <img src={p.look} alt={`${p.name} shirt`} draggable={false} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
            <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/90 to-transparent p-3 pt-10">
              <span className="block font-display text-lg font-semibold leading-tight">{p.name}</span>
              <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-aura">{p.category}</span>
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
