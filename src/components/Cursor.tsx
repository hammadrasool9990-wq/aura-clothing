import { useEffect, useRef } from 'react';
import { prefersReducedMotion } from '../lib/storage';

// Portfolio-style pointer effects (desktop mouse only):
// - a gold dot with a trailing ring that grows over links and buttons
// - "magnetic" primary buttons that lean toward the cursor
export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const enabled =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(pointer: fine)').matches === true &&
    !prefersReducedMotion();

  useEffect(() => {
    if (!enabled) return;
    const pos = { x: -100, y: -100 };
    const trail = { x: -100, y: -100 };
    let raf = 0;
    let magnet: HTMLElement | null = null;

    const onMove = (e: PointerEvent) => {
      pos.x = e.clientX;
      pos.y = e.clientY;
      const target = e.target as HTMLElement | null;
      const interactive = target?.closest('a, button, [role="button"], input, select, textarea, canvas');
      ring.current?.classList.toggle('is-hover', !!interactive);

      // magnetic buttons
      const m = target?.closest<HTMLElement>('.btn-primary, .btn-ghost');
      if (magnet && magnet !== m) magnet.style.transform = '';
      magnet = m ?? null;
      if (magnet) {
        const r = magnet.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        magnet.style.transform = `translate(${dx * 0.22}px, ${dy * 0.35}px)`;
      }
    };

    const tick = () => {
      trail.x += (pos.x - trail.x) * 0.18;
      trail.y += (pos.y - trail.y) * 0.18;
      if (dot.current) dot.current.style.transform = `translate(${pos.x}px, ${pos.y}px)`;
      if (ring.current) ring.current.style.transform = `translate(${trail.x}px, ${trail.y}px)`;
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      if (magnet) magnet.style.transform = '';
    };
  }, [enabled]);

  if (!enabled) return null;
  return (
    <>
      <div ref={ring} className="cursor-ring" aria-hidden />
      <div ref={dot} className="cursor-dot" aria-hidden />
    </>
  );
}
