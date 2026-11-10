import { useEffect, useRef, useState } from 'react';
import { prefersReducedMotion } from '../lib/storage';

/**
 * Little delights that run over the whole site (never block clicks):
 * 1. Cursor light — a soft champagne glow glides behind the cursor and a few
 *    fine gold sparkles drift up and fade where it moves.
 * 2. Button burst — click/tap on empty space and shirt buttons pop out,
 *    bounce on the bottom of the screen and roll away.
 * 3. Shirt thief — every so often a tiny UFO crosses the sky, beams up a
 *    tiny shirt and zooms off. Click it to make it drop the shirt.
 * 4. Shooting stars across the navy sky.
 */

interface Btn {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  rot: number;
  vr: number;
  color: string;
  life: number;
  holes: number;
}
interface Mote {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  life: number;
}
interface Star {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
}
interface Ufo {
  x: number;
  y: number;
  dir: 1 | -1;
  tx: number; // where it stops to beam
  phase: 'enter' | 'beam' | 'leave' | 'drop';
  t: number;
  shirtY: number;
  shirtColor: string;
  dropVy: number;
}

const BUTTON_COLORS = ['#F4ECDF', '#DDBB82', '#C9A06A', '#E9E2D4', '#8E6A3E', '#2A3A66'];
const SHIRT_COLORS = ['#DDBB82', '#F4ECDF', '#2F6B4F', '#3D5A86', '#B5523B'];

export default function Playground() {
  const ref = useRef<HTMLCanvasElement>(null);
  const [hint, setHint] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const cv = ref.current!;
    const ctx = cv.getContext('2d')!;
    let w = 0;
    let h = 0;
    let raf = 0;
    const buttons: Btn[] = [];
    const motes: Mote[] = [];
    const glow = document.getElementById('cursor-glow');
    const pos = { x: -999, y: -999, tx: -999, ty: -999, lastSpawn: 0 };
    const stars: Star[] = [];
    let ufo: Ufo | null = null;
    let nextUfo = performance.now() + 9000;
    let nextStar = performance.now() + 2500;
    const fine = window.matchMedia?.('(pointer: fine)').matches;

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

    const burst = (x: number, y: number, n = 14) => {
      for (let i = 0; i < n; i++) {
        const a = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.3;
        const sp = 4 + Math.random() * 7;
        buttons.push({
          x,
          y,
          vx: Math.cos(a) * sp,
          vy: Math.sin(a) * sp,
          r: 5 + Math.random() * 6,
          rot: Math.random() * 6.28,
          vr: (Math.random() - 0.5) * 0.4,
          color: BUTTON_COLORS[(Math.random() * BUTTON_COLORS.length) | 0],
          life: 1,
          holes: Math.random() > 0.3 ? 4 : 2,
        });
      }
      if (buttons.length > 160) buttons.splice(0, buttons.length - 160);
    };

    const onMove = (e: PointerEvent) => {
      if (!fine) return;
      pos.tx = e.clientX;
      pos.ty = e.clientY;
      if (pos.x < -900) {
        pos.x = pos.tx;
        pos.y = pos.ty;
      }
      // a few fine sparkles, only while moving
      const now = performance.now();
      if (now - pos.lastSpawn > 55) {
        pos.lastSpawn = now;
        motes.push({
          x: e.clientX + (Math.random() - 0.5) * 14,
          y: e.clientY + (Math.random() - 0.5) * 14,
          vx: (Math.random() - 0.5) * 0.25,
          vy: -0.25 - Math.random() * 0.35,
          r: 0.6 + Math.random() * 1.1,
          life: 1,
        });
        if (motes.length > 60) motes.shift();
      }
    };

    const onDown = (e: PointerEvent) => {
      const target = e.target as HTMLElement | null;
      // clicking the UFO makes it drop the shirt
      if (ufo && ufo.phase !== 'drop' && Math.hypot(e.clientX - ufo.x, e.clientY - ufo.y) < 40) {
        ufo.phase = 'drop';
        ufo.dropVy = 0;
        burst(ufo.x, ufo.y + 10, 10);
        return;
      }
      // only on empty space: never interfere with links, buttons, forms
      if (target?.closest('a, button, input, textarea, select, label, [role="button"], [role="radio"], .photo-ring-stage, canvas')) return;
      burst(e.clientX, e.clientY);
      setHint(false);
    };

    // ── drawing helpers ──────────────────────────────────
    const drawButton = (b: Btn) => {
      ctx.save();
      ctx.translate(b.x, b.y);
      ctx.rotate(b.rot);
      ctx.globalAlpha = Math.max(0, Math.min(1, b.life * 1.4));
      ctx.fillStyle = 'rgba(0,0,0,0.35)';
      ctx.beginPath();
      ctx.arc(1.2, 1.8, b.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = b.color;
      ctx.beginPath();
      ctx.arc(0, 0, b.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(0,0,0,0.25)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(0, 0, b.r * 0.72, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = 'rgba(10,17,36,0.75)';
      const o = b.r * 0.26;
      const holes = b.holes === 4 ? [[-o, -o], [o, -o], [-o, o], [o, o]] : [[-o, 0], [o, 0]];
      for (const [hx, hy] of holes) {
        ctx.beginPath();
        ctx.arc(hx, hy, Math.max(0.8, b.r * 0.11), 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    };

    const drawTinyShirt = (x: number, y: number, s: number, color: string, rot = 0) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rot);
      ctx.scale(s, s);
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(-4, -8);
      ctx.lineTo(-10, -5);
      ctx.lineTo(-13, 1);
      ctx.lineTo(-8, 3);
      ctx.lineTo(-7, 0);
      ctx.lineTo(-7, 10);
      ctx.lineTo(7, 10);
      ctx.lineTo(7, 0);
      ctx.lineTo(8, 3);
      ctx.lineTo(13, 1);
      ctx.lineTo(10, -5);
      ctx.lineTo(4, -8);
      ctx.quadraticCurveTo(0, -4, -4, -8);
      ctx.fill();
      ctx.fillStyle = 'rgba(0,0,0,0.25)';
      ctx.fillRect(-0.5, -6, 1, 16);
      ctx.restore();
    };

    const drawUfo = (u: Ufo, now: number) => {
      ctx.save();
      ctx.translate(u.x, u.y + Math.sin(now / 300) * 3);
      ctx.rotate(Math.sin(now / 500) * 0.06 * u.dir);
      // dome
      ctx.fillStyle = 'rgba(170,190,225,0.9)';
      ctx.beginPath();
      ctx.ellipse(0, -6, 11, 9, 0, Math.PI, 0);
      ctx.fill();
      // body
      const g = ctx.createLinearGradient(0, -6, 0, 8);
      g.addColorStop(0, '#d9d6cf');
      g.addColorStop(1, '#4a4a58');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.ellipse(0, 0, 26, 7, 0, 0, Math.PI * 2);
      ctx.fill();
      // blinking lights
      for (let i = -2; i <= 2; i++) {
        const on = Math.floor(now / 160 + i) % 2 === 0;
        ctx.fillStyle = on ? '#FFE7A8' : 'rgba(255,231,168,0.3)';
        ctx.beginPath();
        ctx.arc(i * 9, 2, 1.8, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    };

    // ── main loop ─────────────────────────────────────────
    const tick = (now: number) => {
      ctx.clearRect(0, 0, w, h);

      // shooting stars
      if (now > nextStar) {
        nextStar = now + 3500 + Math.random() * 6000;
        stars.push({ x: Math.random() * w * 0.8 + w * 0.1, y: Math.random() * h * 0.35, vx: -9 - Math.random() * 5, vy: 4 + Math.random() * 2, life: 1 });
      }
      for (let i = stars.length - 1; i >= 0; i--) {
        const s = stars[i];
        s.x += s.vx;
        s.y += s.vy;
        s.life -= 0.018;
        if (s.life <= 0) {
          stars.splice(i, 1);
          continue;
        }
        const g = ctx.createLinearGradient(s.x, s.y, s.x - s.vx * 9, s.y - s.vy * 9);
        g.addColorStop(0, `rgba(255,244,220,${0.9 * s.life})`);
        g.addColorStop(1, 'rgba(255,244,220,0)');
        ctx.strokeStyle = g;
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x - s.vx * 9, s.y - s.vy * 9);
        ctx.stroke();
      }

      // cursor light: glide the glow towards the pointer with a soft lag
      if (fine && glow && pos.tx > -900) {
        pos.x += (pos.tx - pos.x) * 0.09;
        pos.y += (pos.ty - pos.y) * 0.09;
        glow.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
        glow.style.opacity = '1';
      }
      // sparkles: rise, twinkle, fade
      for (let i = motes.length - 1; i >= 0; i--) {
        const m = motes[i];
        m.x += m.vx;
        m.y += m.vy;
        m.life -= 0.012;
        if (m.life <= 0) {
          motes.splice(i, 1);
          continue;
        }
        const tw = 0.6 + 0.4 * Math.sin(now / 90 + i);
        const a = m.life * tw;
        const g = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, m.r * 4);
        g.addColorStop(0, `rgba(255,240,205,${0.9 * a})`);
        g.addColorStop(0.35, `rgba(221,187,130,${0.45 * a})`);
        g.addColorStop(1, 'rgba(221,187,130,0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.r * 4, 0, Math.PI * 2);
        ctx.fill();
      }

      // buttons with gravity, floor bounce and roll
      for (let i = buttons.length - 1; i >= 0; i--) {
        const b = buttons[i];
        b.vy += 0.32;
        b.x += b.vx;
        b.y += b.vy;
        b.rot += b.vr;
        if (b.y > h - b.r) {
          b.y = h - b.r;
          b.vy *= -0.55;
          b.vx *= 0.85;
          b.vr = b.vx / b.r;
          if (Math.abs(b.vy) < 1) b.vy = 0;
        }
        if (b.x < b.r || b.x > w - b.r) b.vx *= -0.7;
        if (b.vy === 0) b.life -= 0.006;
        if (b.life <= 0) {
          buttons.splice(i, 1);
          continue;
        }
        drawButton(b);
      }

      // the shirt-stealing UFO
      if (!ufo && now > nextUfo && !document.hidden) {
        const dir = Math.random() > 0.5 ? 1 : -1;
        ufo = {
          x: dir === 1 ? -40 : w + 40,
          y: 90 + Math.random() * Math.min(160, h * 0.2),
          dir,
          tx: dir === 1 ? w * (0.35 + Math.random() * 0.3) : w * (0.35 + Math.random() * 0.3),
          phase: 'enter',
          t: now,
          shirtY: 0,
          shirtColor: SHIRT_COLORS[(Math.random() * SHIRT_COLORS.length) | 0],
          dropVy: 0,
        };
      }
      if (ufo) {
        const u = ufo;
        const groundY = Math.min(h - 30, u.y + 220);
        if (u.phase === 'enter') {
          u.x += u.dir * 3.2;
          if ((u.dir === 1 && u.x >= u.tx) || (u.dir === -1 && u.x <= u.tx)) {
            u.phase = 'beam';
            u.t = now;
            u.shirtY = groundY;
          }
        } else if (u.phase === 'beam') {
          const k = (now - u.t) / 1800;
          // beam
          const bg = ctx.createLinearGradient(0, u.y, 0, groundY + 12);
          bg.addColorStop(0, 'rgba(255,240,200,0.45)');
          bg.addColorStop(1, 'rgba(255,240,200,0.03)');
          ctx.fillStyle = bg;
          ctx.beginPath();
          ctx.moveTo(u.x - 8, u.y + 6);
          ctx.lineTo(u.x + 8, u.y + 6);
          ctx.lineTo(u.x + 34, groundY + 12);
          ctx.lineTo(u.x - 34, groundY + 12);
          ctx.closePath();
          ctx.fill();
          u.shirtY = groundY - (groundY - u.y - 10) * Math.min(1, Math.max(0, (k - 0.15) / 0.85)) ** 1.4;
          drawTinyShirt(u.x, u.shirtY, 1, u.shirtColor, Math.sin(now / 200) * 0.3);
          if (k >= 1) {
            u.phase = 'leave';
            u.t = now;
          }
        } else if (u.phase === 'leave') {
          u.x += u.dir * 7;
          u.y -= 1.2;
        } else if (u.phase === 'drop') {
          u.dropVy += 0.35;
          u.shirtY += u.dropVy;
          drawTinyShirt(u.x, u.shirtY, 1, u.shirtColor, u.dropVy * 0.05);
          u.x += u.dir * 6; // flees without its prize
          u.y -= 1.6;
          if (u.shirtY > h + 20) u.phase = 'leave';
        }
        drawUfo(u, now);
        if (u.x < -80 || u.x > w + 80 || u.y < -60) {
          ufo = null;
          nextUfo = now + 22000 + Math.random() * 20000;
        }
      }

      raf = requestAnimationFrame(tick);
    };

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onDown, { passive: true });
    raf = requestAnimationFrame(tick);
    const hintT = window.setTimeout(() => setHint(true), 16000);
    const hintOff = window.setTimeout(() => setHint(false), 23000);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(hintT);
      window.clearTimeout(hintOff);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
    };
  }, []);

  return (
    <>
      {/* soft light that follows the cursor, behind the page content */}
      <div id="cursor-glow" className="cursor-glow" aria-hidden />
      <canvas ref={ref} className="pointer-events-none fixed inset-0 z-[45]" aria-hidden />
      <p
        className={`pointer-events-none fixed bottom-5 left-1/2 z-[46] -translate-x-1/2 rounded-full border border-aura/40 bg-ink/80 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.25em] text-aura backdrop-blur transition-all duration-700 ${
          hint ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}
        aria-hidden
      >
        Psst… click anywhere empty
      </p>
    </>
  );
}
