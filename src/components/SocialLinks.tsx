import { SOCIAL } from '../data/site';

// Instagram, LinkedIn and portfolio as large links (contact areas)
export default function SocialLinks() {
  return (
    <ul className="mt-3 divide-y divide-line border-y border-line">
      {SOCIAL.map((s) => (
        <li key={s.label}>
          <a
            href={s.href}
            target="_blank"
            rel="noreferrer"
            className="group flex items-baseline justify-between gap-4 py-3 transition-colors hover:text-aura"
          >
            <span className="font-display text-2xl font-semibold">{s.label}</span>
            <span className="min-w-0 truncate font-mono text-xs text-mute transition-colors group-hover:text-aura">
              {s.handle} ↗
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}
