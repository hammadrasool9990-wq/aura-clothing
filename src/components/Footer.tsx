import { Link } from 'react-router-dom';
import { NAV, SITE, SOCIAL } from '../data/site';
import { Marquee } from './ui';

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-line">
      <Marquee text="AURA. — WEAR THE SIGNAL. —" />
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-4 md:px-8">
        <div className="md:col-span-2">
          <p className="font-display text-3xl font-bold tracking-[0.15em]">
            AURA<span className="text-aura">.</span>
          </p>
          <p className="mt-3 max-w-sm text-sm text-mute">{SITE.tagline} Premium shirts for the USA and UK.</p>
        </div>
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-mute">Pages</p>
          <ul className="mt-4 space-y-2">
            {NAV.map((n) => (
              <li key={n.to}>
                <Link to={n.to} className="link-underline text-sm">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-mute">Contact</p>
          <ul className="mt-4 space-y-2 text-sm">
            {SITE.emails.map((e) => (
              <li key={e}>
                <a href={`mailto:${e}`} className="link-underline break-all">
                  {e}
                </a>
              </li>
            ))}
            {SOCIAL.map((x) => (
              <li key={x.label}>
                <a href={x.href} target="_blank" rel="noreferrer" className="link-underline">
                  {x.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-line">
        <p className="mx-auto max-w-7xl px-4 py-6 font-mono text-[11px] uppercase tracking-[0.2em] text-mute md:px-8">
          © {new Date().getFullYear()} {SITE.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
