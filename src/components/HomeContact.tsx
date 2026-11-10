import { Link } from 'react-router-dom';
import { CopyEmail, DualHeading, Reveal, SectionLabel } from './ui';
import { SITE } from '../data/site';

// Contact section at the end of the home page: both emails, Instagram,
// and a shortcut to the full contact form.
export default function HomeContact() {
  return (
    <section id="contact" className="relative z-10 mx-auto max-w-7xl scroll-mt-24 px-4 py-24 md:px-8">
      <div className="overflow-hidden rounded-3xl border border-line bg-ink2/70 p-6 backdrop-blur md:p-12">
        <div className="grid gap-12 md:grid-cols-2">
          <div>
            <SectionLabel num="08">Contact</SectionLabel>
            <DualHeading text="Say hello" className="mt-3 text-6xl md:text-8xl" />
            <p className="mt-6 max-w-sm text-mute">
              Questions about sizing, an order or a shirt you love? Write to us. We read every message.
            </p>
            <Link to="/contact" className="btn-primary mt-8">
              Send a message
            </Link>
          </div>
          <Reveal>
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-mute">Email us</p>
            <div className="mt-2">
              {SITE.emails.map((e) => (
                <CopyEmail key={e} email={e} />
              ))}
            </div>
            <p className="mt-10 font-mono text-[10px] uppercase tracking-[0.25em] text-mute">Follow</p>
            <a href={SITE.instagram} target="_blank" rel="noreferrer" className="link-underline mt-3 inline-block font-display text-2xl">
              Instagram {SITE.instagramHandle} ↗
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
