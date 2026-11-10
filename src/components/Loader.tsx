import { useCallback, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { load, save, prefersReducedMotion } from '../lib/storage';
import { SITE } from '../data/site';
import { markReady } from '../lib/ready';

// Counting loader (000 → 100), like the portfolio's "00/ LOADING_ 000".
// Shown once per browser session so returning shoppers aren't slowed down.
export default function Loader() {
  const [visible, setVisible] = useState(() => !load('aura.loaded', false, true) && !prefersReducedMotion());
  const wrap = useRef<HTMLDivElement>(null);
  const num = useRef<HTMLSpanElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const gate = useRef<HTMLDivElement>(null);
  const [waiting, setWaiting] = useState(false); // counter done, waiting for "click to enter"
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const early = useRef(false); // tapped before the gate finished appearing

  useEffect(() => {
    if (!visible) {
      markReady(); // no loader this visit: start page animations now
      return;
    }
    document.documentElement.style.overflow = 'hidden';
    const counter = { v: 0 };
    const q = gsap.utils.selector(wrap.current);
    const tl = gsap.timeline({
      onComplete: () => {
        save('aura.loaded', true, true);
        document.documentElement.style.overflow = '';
        setVisible(false);
      },
    });
    tl.to(counter, {
      v: 100,
      duration: 1.7,
      ease: 'power2.inOut',
      onUpdate: () => {
        if (num.current) num.current.textContent = String(Math.round(counter.v)).padStart(3, '0');
        if (bar.current) bar.current.style.transform = `scaleX(${counter.v / 100})`;
      },
    })
      // cinematic "click anywhere to enter" gate
      .to(q('.loader-count'), { opacity: 0, y: -30, duration: 0.6, ease: 'power2.in' }, '+=0.2')
      .set(gate.current, { autoAlpha: 1 })
      .fromTo(q('.gate-line'), { scaleX: 0 }, { scaleX: 1, duration: 1.1, ease: 'expo.inOut' })
      .fromTo(q('.gate-copy'), { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out' }, '-=0.4')
      // stop here until the visitor clicks (unless they already tapped)
      .call(() => {
        if (early.current) return;
        tl.pause();
        setWaiting(true);
      })
      .to(wrap.current, { yPercent: -100, duration: 1, ease: 'expo.inOut' })
      .add(markReady, '-=0.4'); // landing scene starts as the curtain lifts
    tlRef.current = tl;
    return () => {
      tl.kill();
      document.documentElement.style.overflow = '';
    };
  }, [visible]);

  const enter = useCallback(() => {
    if (!waiting) {
      early.current = true; // remember it and enter as soon as the gate is ready
      return;
    }
    setWaiting(false);
    tlRef.current?.play();
  }, [waiting]);


  useEffect(() => {
    if (!waiting) return;
    const onKey = (e: KeyboardEvent) => (e.key === 'Enter' || e.key === ' ') && enter();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [waiting, enter]);

  if (!visible) return null;
  return (
    <div
      ref={wrap}
      className={`fixed inset-0 z-[100] flex flex-col justify-between bg-ink p-6 md:p-10 ${waiting ? 'cursor-pointer' : ''}`}
      role={waiting ? 'button' : 'status'}
      aria-label={waiting ? 'Click anywhere to enter' : 'Loading'}
      tabIndex={waiting ? 0 : -1}
      onClick={enter}
    >
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-mute">
        <span className="text-aura">00/</span> {waiting ? 'Signal found_' : 'Loading_'}
      </p>
      <div className="loader-count">
        <p className="font-display text-sm uppercase tracking-[0.4em] text-mute">{SITE.name}</p>
        <span ref={num} className="block font-display text-[28vw] font-bold leading-none tracking-tighter text-bone md:text-[18vw]">
          000
        </span>
        <div className="mt-4 h-px w-full bg-line">
          <div ref={bar} className="h-px origin-left scale-x-0 bg-aura" />
        </div>
      </div>

      {/* entry gate */}
      <div ref={gate} className="invisible absolute inset-0 flex flex-col items-center justify-center px-6 text-center opacity-0">
        <div className="gate-line h-px w-full max-w-2xl origin-left bg-aura shadow-[0_0_18px_rgba(201,169,110,0.9)]" />
        <p className="gate-copy mt-6 max-w-2xl text-sm leading-relaxed text-aura md:text-base">
          {SITE.name} is a menswear label for men who dress to be remembered. Formal, casual and statement shirts for the USA and UK.
        </p>
        <p className="gate-copy mt-16 animate-pulse font-mono text-xs uppercase tracking-[0.5em] text-bone">
          Click anywhere to enter
        </p>
      </div>
    </div>
  );
}
