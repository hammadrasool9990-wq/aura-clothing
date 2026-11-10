import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Dissolver } from '../lib/dissolve';
import Spaceship from './Spaceship';
import { SectionLabel } from './ui';
import { onReady } from '../lib/ready';
import { prefersReducedMotion } from '../lib/storage';
import { SITE } from '../data/site';
import founder from '../assets/founder-landing.webp';

/**
 * Home-page landing scene:
 * 1. the spaceship flies down from the top
 * 2. its lights switch on and a beam of light opens
 * 3. Hammad descends through the beam and lands
 * 4. the brand name and buttons appear, the ship keeps hovering
 */
const WORD = 'AURA';
gsap.registerPlugin(ScrollTrigger);

export default function SpaceHero() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current!;
    const q = gsap.utils.selector(el);
    const reduced = prefersReducedMotion();

    // final state is the default in CSS; when animating we start from hidden
    const ctx = gsap.context(() => {
      if (reduced) {
        el.classList.add('lights-on');
        return;
      }
      gsap.set(q('.hero-ship'), { yPercent: -260, rotate: -8 });
      gsap.set(q('.hero-beam'), { scaleY: 0, opacity: 0 });
      gsap.set(q('.hero-founder'), { opacity: 0 });
      gsap.set(q('.hero-founder-img'), { opacity: 0 });
      gsap.set(q('.hero-silhouette'), { opacity: 1 });
      gsap.set(q('.hero-neon path'), { strokeDashoffset: 1 });
      gsap.set(q('.hero-letter'), { yPercent: 110 });
      gsap.set(q('.hero-sub'), { opacity: 0, y: 24 });
      gsap.set(q('.hero-ground'), { opacity: 0, scaleX: 0.4 });
      gsap.set(q('.hero-ring'), { opacity: 0, scale: 0.2 });
    }, el);

    if (reduced) return () => ctx.revert();

    const stop = onReady(() => {
      ctx.add(() => {
        const ship = q('.hero-ship')[0] as HTMLElement;
        const img = q('.hero-founder')[0] as HTMLElement;
        // distance from the ship's emitter down to the founder's final top edge
        const startY = () => ship.getBoundingClientRect().bottom - img.getBoundingClientRect().top - 20;

        let landed = false;
        const tl = gsap.timeline({ defaults: { ease: 'power2.inOut' } });
        tl.to(q('.hero-ship'), { yPercent: 0, rotate: 0, duration: 2, ease: 'power3.out' })
          .call(() => el.classList.add('lights-on'), [], '-=0.4')
          .to(q('.hero-beam'), { scaleY: 1, duration: 0.7, ease: 'power2.out' }, '-=0.1')
          .to(q('.hero-beam'), { keyframes: { opacity: [0, 0.7, 0.25, 1, 0.6, 1] }, duration: 0.8, ease: 'none' }, '<')
          // a glowing white silhouette floats down the beam…
          .fromTo(
            img,
            { opacity: 0, y: startY, scale: 0.3, filter: 'blur(6px)' },
            { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: 2.6 },
            '-=0.2',
          )
          // …and turns into the real photo as he lands
          .to(q('.hero-founder-img'), { opacity: 1, duration: 0.9, ease: 'power1.inOut' }, '-=0.7')
          .to(q('.hero-silhouette'), { opacity: 0, duration: 1.1, ease: 'power1.inOut' }, '<0.2')
          // a ribbon of light wraps around him
          .to(q('.hero-neon path'), { strokeDashoffset: 0, duration: 1.6, ease: 'power2.inOut' }, '<')
          .to(q('.hero-neon'), { opacity: 0.55, duration: 1.2 }, '>-0.2')
          .to(q('.hero-ground'), { opacity: 1, scaleX: 1, duration: 0.8, ease: 'power2.out' }, '-=0.5')
          .to(q('.hero-ring'), { keyframes: { opacity: [0, 1, 0], scale: [0.2, 1, 1.7] }, duration: 1.2, ease: 'power1.out' }, '<')
          .to(q('.hero-beam'), { opacity: 0.45, duration: 1.2 }, '<')
          .to(q('.hero-letter'), { yPercent: 0, duration: 1.1, stagger: 0.08, ease: 'expo.out' }, '-=1')
          .to(q('.hero-sub'), { opacity: 1, y: 0, duration: 0.8, stagger: 0.12, ease: 'power3.out' }, '-=0.7')
          .call(() => (landed = true))
          // gentle hover after landing
          .to(q('.hero-ship'), { y: -10, duration: 2.4, ease: 'sine.inOut', repeat: -1, yoyo: true });

        // scrolling away: he breaks into dust that drifts off to the right
        const photo = q('.hero-founder-img')[0] as HTMLImageElement;
        const canvas = q('.hero-dissolve')[0] as HTMLCanvasElement;
        const dissolver = new Dissolver(canvas, photo);
        let ready = false;
        const prep = () => (ready = dissolver.setup());
        if (photo.complete) prep();
        else photo.addEventListener('load', prep, { once: true });
        ScrollTrigger.create({
          trigger: el,
          start: 'top top',
          end: 'bottom 20%',
          scrub: true,
          onRefresh: () => prep(),
          onUpdate: (self) => {
            if (!ready || !landed) return;
            const p = Math.min(1, self.progress * 1.25);
            dissolver.draw(p);
            photo.style.visibility = p > 0.001 ? 'hidden' : '';
            gsap.set(q('.hero-neon'), { opacity: 0.55 * (1 - p) });
          },
        });
      });
    });

    return () => {
      stop();
      ctx.revert();
    };
  }, []);

  return (
    <section ref={root} className="space-hero relative isolate overflow-hidden" aria-label={`${SITE.name} — arrival`}>
      {/* giant brand word behind everything */}
      <h1 className="pointer-events-none absolute inset-x-0 top-[30%] z-0 flex justify-center overflow-hidden font-display font-bold leading-[0.8] tracking-[-0.04em] text-[30vw] md:top-[26%] md:text-[23vw]">
        <span className="sr-only">{SITE.name}</span>
        {WORD.split('').map((ch, i) => (
          <span key={i} aria-hidden className="hero-letter hero-word inline-block">
            {ch}
          </span>
        ))}
      </h1>

      {/* spaceship */}
      <div className="hero-ship-wrap pointer-events-none absolute inset-x-0 z-30 flex justify-center">
        <Spaceship className="hero-ship" />
      </div>

      {/* beam of light */}
      <div className="hero-beam-wrap pointer-events-none absolute inset-x-0 z-10 flex justify-center">
        <div className="hero-beam">
          <div className="hero-beam-core" />
          {Array.from({ length: 16 }, (_, i) => (
            <span
              key={i}
              className="hero-spark"
              style={{
                left: `${8 + ((i * 53) % 84)}%`,
                animationDelay: `${(i * 0.37) % 3}s`,
                animationDuration: `${2.6 + (i % 5) * 0.5}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* ground glow + landing ring */}
      <div className="pointer-events-none absolute inset-x-0 bottom-[5%] z-10 flex justify-center">
        <div className="hero-ground" />
        <div className="hero-ring" />
      </div>

      {/* the founder, landing */}
      <div className="pointer-events-none absolute inset-x-0 bottom-[4%] z-20 flex justify-center">
        <div className="hero-founder relative">
          {/* glowing silhouette seen while he floats down the beam */}
          <img src={founder} alt="" aria-hidden className="hero-silhouette absolute inset-0 h-full w-full" draggable={false} />
          <img
            src={founder}
            alt="Hammad Rasool, founder of AURA-CLOTHING, in a navy blazer, light blue shirt and dark trousers, resting a hand on a black and gold cane"
            className="hero-founder-img block h-full w-auto"
            draggable={false}
          />
          {/* dust layer for the scroll dissolve */}
          <canvas className="hero-dissolve pointer-events-none absolute left-0 top-0" aria-hidden />
          {/* ribbon of light that wraps around him after landing */}
          <svg className="hero-neon pointer-events-none absolute -inset-x-[18%] inset-y-[6%]" viewBox="0 0 100 200" preserveAspectRatio="none" aria-hidden>
            <path
              d="M6 178 C -8 150, 104 150, 94 128 S 2 104, 12 86 S 102 70, 86 50 S 30 26, 52 14"
              pathLength={1}
              fill="none"
              stroke="#fffaf0"
              strokeWidth="1.4"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              strokeDasharray="1"
            />
          </svg>
        </div>
      </div>

      {/* foreground copy */}
      <div className="relative z-40 mx-auto flex h-full max-w-7xl flex-col justify-end px-4 pb-8 md:px-8 md:pb-12">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="hero-sub max-w-[15rem] rounded-xl bg-ink/40 p-3 backdrop-blur-sm md:bg-transparent md:p-0 md:backdrop-blur-0">
            <SectionLabel num="01">Arrival</SectionLabel>
            <p className="mt-3 text-sm text-mute">
              Premium shirts for the USA and UK. {SITE.tagline}
            </p>
          </div>
          <div className="hero-sub flex gap-3">
            <Link to="/shop" className="btn-primary">
              Shop now
            </Link>
            <button
              type="button"
              onClick={() => document.getElementById('collection-3d')?.scrollIntoView({ behavior: 'smooth' })}
              className="btn-ghost bg-ink/40 backdrop-blur-sm"
            >
              See the collection
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
