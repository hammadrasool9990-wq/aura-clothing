import { useEffect, useRef } from 'react';
import { prefersReducedMotion } from '../lib/storage';
import { PORTRAIT_ASPECT, PORTRAIT_DOTS, PORTRAIT_GRID } from '../data/portraitDots';

/**
 * Home-page background made of dots.
 * - Normally the dots drift and swirl, mixing across the whole screen.
 * - When the element with id="dot-portrait" scrolls into view, every dot
 *   flies to its place in a halftone portrait of Hammad inside that box.
 * - Scroll on and they mix again. The cursor pushes dots away.
 */
export default function DotField() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current!;
    const ctx = cv.getContext('2d')!;
    const reduced = prefersReducedMotion();
    let w = 0;
    let h = 0;
    let raf = 0;
    const mouse = { x: -9999, y: -9999 };
    let morph = 0; // 0 = mixing, 1 = portrait

    // one particle per portrait dot, each with its own wander path
    const N = PORTRAIT_DOTS.length;
    const P = PORTRAIT_DOTS.map(([tx, ty, s], i) => ({
      tx,
      ty,
      s,
      // wander seed
      ax: Math.random(),
      ay: Math.random(),
      sp: 0.00004 + Math.random() * 0.00008,
      ph: Math.random() * Math.PI * 2,
      r: 40 + Math.random() * 120,
      delay: (i % 97) / 97, // stagger so they arrive like a wave
      x: 0,
      y: 0,
    }));

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      cv.width = w * dpr;
      cv.height = h * dpr;
      cv.style.width = `${w}px`;
      cv.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

    const frame = (t: number) => {
      // how much the portrait box is in view → target morph
      const anchor = document.getElementById('dot-portrait');
      let target = 0;
      let box = { x: w * 0.55, y: h * 0.15, bw: w * 0.35, bh: h * 0.7 };
      if (anchor) {
        const r = anchor.getBoundingClientRect();
        const centre = r.top + r.height / 2;
        const off = Math.abs(centre - h / 2) / (h * 0.75);
        target = Math.max(0, Math.min(1, 1.25 - off * 1.6));
        // fit the portrait inside the box, keeping its proportions
        let bw = r.width;
        let bh = bw / PORTRAIT_ASPECT;
        if (bh > r.height) {
          bh = r.height;
          bw = bh * PORTRAIT_ASPECT;
        }
        box = { x: r.left + (r.width - bw) / 2, y: r.top + (r.height - bh) / 2, bw, bh };
      }
      morph += (target - morph) * (reduced ? 1 : 0.045);

      ctx.clearRect(0, 0, w, h);
      const cell = box.bw / PORTRAIT_GRID;
      for (let i = 0; i < N; i++) {
        const p = P[i];
        // wandering "mixing" position: slow loops around a home point
        const hx = p.ax * w + Math.cos(t * p.sp * 6 + p.ph) * p.r;
        const hy = p.ay * h + Math.sin(t * p.sp * 5 + p.ph * 1.3) * p.r;
        // portrait position
        const px = box.x + p.tx * box.bw;
        const py = box.y + p.ty * box.bh;
        const k = ease(Math.max(0, Math.min(1, morph * 1.35 - p.delay * 0.35)));
        let x = hx + (px - hx) * k;
        let y = hy + (py - hy) * k;
        // cursor push
        const dx = x - mouse.x;
        const dy = y - mouse.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < 14000) {
          const d = Math.sqrt(d2) || 1;
          const f = (1 - d / 118) * 22;
          x += (dx / d) * f;
          y += (dy / d) * f;
        }
        p.x = x;
        p.y = y;
        const size = Math.max(0.8, 1 + (p.s * cell * 0.9 - 1) * k);
        const alpha = 0.18 + k * (0.25 + p.s * 0.6);
        ctx.fillStyle = `rgba(226,200,150,${alpha.toFixed(3)})`;
        ctx.fillRect(x - size / 2, y - size / 2, Math.max(1, size), Math.max(1, size));
      }
    };

    const loop = (t: number) => {
      if (!document.hidden) frame(t);
      raf = requestAnimationFrame(loop);
    };
    const onMove = (e: PointerEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    const onLeave = () => (mouse.x = mouse.y = -9999);

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerleave', onLeave);
    if (reduced) {
      // still frame, redrawn on scroll
      const still = () => frame(0);
      still();
      window.addEventListener('scroll', still, { passive: true });
      return () => {
        window.removeEventListener('scroll', still);
        window.removeEventListener('resize', resize);
      };
    }
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return <canvas ref={ref} className="pointer-events-none fixed inset-0 z-0" aria-hidden />;
}
