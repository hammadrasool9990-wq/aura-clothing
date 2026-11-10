import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SectionLabel } from './ui';
import { prefersReducedMotion } from '../lib/storage';

gsap.registerPlugin(ScrollTrigger);

// Cinematic statement: each word lights up as you scroll through it.
// Edit the lines freely; keep them to things that are true for your brand.
const LINES = ['A label born to be seen.', 'Cut for the USA & UK.', 'Made for men who want to be remembered.'];

export default function Story() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current!;
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el.querySelectorAll('.story-word'),
        { opacity: 0.12 },
        {
          opacity: 1,
          stagger: 0.1,
          ease: 'none',
          scrollTrigger: { trigger: el, start: 'top 70%', end: 'bottom 60%', scrub: true },
        },
      );
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="relative z-10 mx-auto grid max-w-7xl items-center gap-10 px-4 py-28 md:grid-cols-12 md:px-8 md:py-40">
      <div className="md:col-span-7">
        <SectionLabel num="03">The signal</SectionLabel>
        <h2 className="mt-8 font-display text-[12vw] font-semibold leading-[0.95] tracking-tight md:text-[5.4vw]">
          {LINES.map((line, li) => (
            <span key={li} className="block">
              {line.split(' ').map((w, wi) => (
                <span key={wi} className={`story-word inline-block pr-[0.22em] ${li === 1 ? 'italic text-aura' : ''}`}>
                  {w}
                </span>
              ))}
            </span>
          ))}
        </h2>
      </div>
      {/* the background dots gather into the founder's portrait inside this box */}
      <div id="dot-portrait" className="relative aspect-square w-full md:col-span-5" aria-label="Portrait of Hammad Rasool drawn in dots" role="img">
        <span className="absolute bottom-0 right-0 font-mono text-[10px] uppercase tracking-[0.3em] text-mute">
          Hammad Rasool · Founder
        </span>
      </div>
    </section>
  );
}
