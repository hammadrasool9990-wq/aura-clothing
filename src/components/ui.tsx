import { useEffect, useId, useRef, useState, type ElementType, type ReactNode } from 'react';
import type { Pattern } from '../data/products';
import { fabricDataUrl } from '../lib/fabricPattern';

/* ── Section label in the portfolio style: "01/ COLLECTION" ─────────── */
// When the label scrolls into view its text "decodes" from random
// characters, like the signal effect on the portfolio.
const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/_#*';

export function SectionLabel({ num, children }: { num: string; children: ReactNode }) {
  const ref = useRef<HTMLSpanElement>(null);
  const text = typeof children === 'string' ? children : null;

  useEffect(() => {
    const el = ref.current;
    if (!el || !text || !('IntersectionObserver' in window)) return;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    let raf = 0;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const start = performance.now();
      const run = (t: number) => {
        const p = Math.min(1, (t - start) / 700);
        const done = Math.floor(p * text.length);
        el.textContent = text
          .split('')
          .map((ch, i) => (i < done || ch === ' ' ? ch : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]))
          .join('');
        if (p < 1) raf = requestAnimationFrame(run);
      };
      raf = requestAnimationFrame(run);
    });
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      el.textContent = text;
    };
  }, [text]);

  return (
    <p className="font-mono text-xs uppercase tracking-[0.25em] text-mute">
      <span className="text-aura">{num}/</span> <span ref={ref}>{children}</span>
    </p>
  );
}

/* ── Reveal on scroll ──────────────────────────────────────────────── */
export function Reveal({
  children,
  className = '',
  delay = 0,
  as: Tag = 'div',
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: ElementType;
}) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!('IntersectionObserver' in window)) return setShown(true);
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <Tag
      ref={ref}
      className={`reveal ${shown ? 'is-shown' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}

/* ── Heading drawn twice: outlined layer + filled layer that wipes in ── */
export function DualHeading({
  text,
  className = '',
  as: Tag = 'h2',
}: {
  text: string;
  className?: string;
  as?: ElementType;
}) {
  const ref = useRef<HTMLElement>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || !('IntersectionObserver' in window)) return setOn(true);
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setOn(true), { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <Tag ref={ref} className={`dual-heading font-display font-bold uppercase leading-[0.9] ${className}`}>
      <span className="sr-only">{text}</span>
      <span aria-hidden className="dual-outline">
        {text}
      </span>
      <span aria-hidden className={`dual-fill ${on ? 'is-on' : ''}`}>
        {text}
      </span>
    </Tag>
  );
}

/* ── Infinite text marquee ─────────────────────────────────────────── */
export function Marquee({ text }: { text: string }) {
  const chunk = Array.from({ length: 6 }, () => text).join('  ');
  return (
    <div className="relative overflow-hidden border-y border-line py-5" aria-hidden>
      <div className="flex w-max animate-marquee whitespace-nowrap font-display text-3xl font-bold uppercase tracking-tight text-bone/90 md:text-5xl">
        <span className="pr-8">{chunk}</span>
        <span className="pr-8">{chunk}</span>
      </div>
    </div>
  );
}

/* ── Email with one-click copy (as on the portfolio) ───────────────── */
export function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
    } catch {
      // fallback for older browsers
      const t = document.createElement('textarea');
      t.value = email;
      document.body.appendChild(t);
      t.select();
      try {
        document.execCommand('copy');
      } catch {
        /* ignore */
      }
      t.remove();
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };
  return (
    <div className="flex items-center justify-between gap-4 border-b border-line py-4">
      <a href={`mailto:${email}`} className="link-underline break-all font-display text-lg md:text-2xl">
        {email}
      </a>
      <button
        type="button"
        onClick={copy}
        className="shrink-0 rounded-full border border-line px-4 py-1.5 font-mono text-xs uppercase tracking-widest text-mute transition hover:border-aura hover:text-aura"
        aria-label={`Copy ${email}`}
      >
        {copied ? 'Copied' : 'Copy'}
      </button>
    </div>
  );
}

/* ── 2D shirt drawing for product cards, filled with the real fabric pattern
      (swap for photos later — see README "Add product photos") ─────────── */
const BODY =
  'M74 26 L50 34 Q36 40 32 56 L14 150 Q13 156 19 158 L36 162 Q42 163 43 157 L56 92 L56 182 Q100 190 144 182 L144 92 L157 157 Q158 163 164 162 L181 158 Q187 156 186 150 L168 56 Q164 40 150 34 L126 26 Q100 44 74 26 Z';

export function ShirtGlyph({
  color,
  pattern = 'poplin',
  accents,
  swatch: swatchUrl,
  className = '',
}: {
  color: string;
  pattern?: Pattern;
  accents?: string[];
  swatch?: string;
  className?: string;
}) {
  const id = useId().replace(/:/g, '');
  const [swatch, setSwatch] = useState<string | null>(null);
  useEffect(() => setSwatch(swatchUrl ?? fabricDataUrl(pattern, color, accents)), [pattern, color, accents, swatchUrl]);
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden>
      <defs>
        <pattern id={`p${id}`} patternUnits="userSpaceOnUse" width="90" height="90">
          {swatch && <image href={swatch} width="90" height="90" />}
        </pattern>
        <linearGradient id={`g${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.18" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.38" />
        </linearGradient>
      </defs>
      <path d={BODY} fill={color} />
      <path d={BODY} fill={`url(#p${id})`} />
      <path d={BODY} fill={`url(#g${id})`} />
      {/* sleeve seams + cuffs */}
      <path d="M56 92 L56 60 M144 92 L144 60" stroke="#000" strokeOpacity="0.18" strokeWidth="1.5" fill="none" />
      <path d="M17 146 L40 151 M160 151 L183 146" stroke="#000" strokeOpacity="0.3" strokeWidth="2" />
      {/* collar leaves */}
      <path d="M74 26 Q100 44 126 26 L122 22 Q100 36 78 22 Z" fill="#000" opacity="0.3" />
      <path d="M74 26 L100 44 L86 56 Z" fill={color} />
      <path d="M126 26 L100 44 L114 56 Z" fill={color} />
      <path d="M74 26 L100 44 L86 56 Z M126 26 L100 44 L114 56 Z" fill={`url(#p${id})`} opacity="0.9" />
      <path d="M74 26 L100 44 L86 56 Z M126 26 L100 44 L114 56 Z" fill="none" stroke="#000" strokeOpacity="0.25" />
      {/* placket + buttons */}
      <rect x="96" y="44" width="8" height="140" fill="#000" opacity="0.08" />
      {[62, 86, 110, 134, 158].map((y) => (
        <circle key={y} cx="100" cy={y} r="2.4" fill="#EDEAE3" stroke="#000" strokeOpacity="0.25" strokeWidth="0.6" />
      ))}
      <rect x="114" y="68" width="20" height="23" rx="2" fill="none" stroke="#000" strokeOpacity="0.2" />
    </svg>
  );
}
