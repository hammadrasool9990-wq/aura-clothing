import { Link } from 'react-router-dom';
import { LINES, PRODUCTS } from '../data/products';
import { DualHeading, Reveal, SectionLabel } from './ui';

// "How to wear it": one simple styling rule per shirt line, with a photo.
const TIPS: Record<string, { rule: string; tips: string[] }> = {
  formal: {
    rule: 'Tuck it in, keep it crisp.',
    tips: ['Tuck fully into tailored trousers', 'Add a navy or black blazer', 'Leather belt that matches your shoes'],
  },
  casual: {
    rule: 'Roll the sleeves, relax the fit.',
    tips: ['Roll the sleeves twice, just below the elbow', 'Wear it untucked with chinos or jeans', 'Clean white sneakers or loafers'],
  },
  'old-money': {
    rule: 'Quiet colours, perfect fit.',
    tips: ['Tuck into pleated cream or navy trousers', 'Brown leather loafers and belt', 'No logos, let the fabric speak'],
  },
  statement: {
    rule: 'Let the shirt do the talking.',
    tips: ['Keep trousers plain and neutral', 'One button open at the collar', 'Skip loud accessories'],
  },
};

export default function StyleNotes() {
  return (
    <section className="relative z-10 mx-auto max-w-7xl px-4 py-24 md:px-8">
      <SectionLabel num="07">Style notes</SectionLabel>
      <DualHeading text="How to wear it" className="mt-3 text-5xl md:text-8xl" />
      <p className="mt-6 max-w-md text-mute">Four simple rules, one for each line. Follow them and every shirt looks its best.</p>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {LINES.map((line, i) => {
          const t = TIPS[line.slug];
          const cover = PRODUCTS.find((p) => p.category === line.category && p.look);
          return (
            <Reveal key={line.slug} delay={i * 110}>
              <Link
                to={`/shirts/${line.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-ink2/70 transition-colors duration-500 hover:border-aura/50"
              >
                {cover?.look && (
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={cover.look}
                      alt={`${cover.name} shirt`}
                      loading="lazy"
                      className="h-full w-full object-cover object-top transition duration-1000 group-hover:scale-105"
                    />
                    <span className="absolute left-4 top-4 rounded-full bg-ink/70 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.25em] text-aura backdrop-blur">
                      {line.title}
                    </span>
                  </div>
                )}
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="font-display text-3xl font-semibold italic leading-tight">{t.rule}</h3>
                  <ul className="mt-4 space-y-2 text-sm text-mute">
                    {t.tips.map((tip) => (
                      <li key={tip} className="flex gap-3">
                        <span className="text-aura">—</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                  <span className="mt-auto pt-6 font-mono text-[10px] uppercase tracking-[0.25em] text-aura">
                    Shop {line.title.toLowerCase()} →
                  </span>
                </div>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
