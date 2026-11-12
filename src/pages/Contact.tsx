import { useState, type FormEvent } from 'react';
import { CopyEmail, DualHeading, Reveal, SectionLabel } from '../components/ui';
import { SITE } from '../data/site';
import SocialLinks from '../components/SocialLinks';
import { sendContact, FormNotConnectedError, type ContactData } from '../lib/forms';
import { useSeo } from '../lib/useSeo';

type Status = { kind: 'idle' | 'sending' | 'ok' | 'error'; msg?: string };

export default function Contact() {
  useSeo('Contact', 'Contact AURA-CLOTHING. Email us or send a message.');
  const EMPTY: ContactData = { name: '', email: '', phone: '', topic: 'Question', rating: '', message: '', _gotcha: '' };
  const [form, setForm] = useState<ContactData>(EMPTY);
  const [status, setStatus] = useState<Status>({ kind: 'idle' });

  const update = (k: keyof ContactData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus({ kind: 'sending' });
    try {
      await sendContact(form);
      setStatus({ kind: 'ok', msg: "Message sent. We'll reply to your email soon." });
      setForm(EMPTY);
    } catch (err) {
      setStatus({
        kind: 'error',
        msg:
          err instanceof FormNotConnectedError
            ? `The form isn't connected yet. Please email ${SITE.inboxEmail} directly.`
            : (err as Error).message,
      });
    }
  };

  return (
    <section className="mx-auto max-w-7xl px-4 pb-10 pt-32 md:px-8 md:pt-40">
      <SectionLabel num="04">Contact</SectionLabel>
      <DualHeading as="h1" text="Let's talk." className="mt-3 text-6xl md:text-[10rem]" />
      <p className="mt-6 max-w-md text-mute">A question about sizing, an order, or feedback on your shirt? Send a message. Every message reaches the AURA inbox.</p>

      <div className="mt-16 grid gap-16 md:grid-cols-2">
        <Reveal>
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-mute">Email</p>
          <div className="mt-2">
            {SITE.emails.map((e) => (
              <CopyEmail key={e} email={e} />
            ))}
          </div>
          <p className="mt-10 font-mono text-[10px] uppercase tracking-[0.25em] text-mute">Find me online</p>
            <SocialLinks />
        </Reveal>

        <Reveal delay={120}>
          <form onSubmit={submit} className="space-y-5" noValidate={false}>
            {/* honeypot: hidden from people, catches spam bots */}
            <input
              type="text"
              name="_gotcha"
              value={form._gotcha}
              onChange={update('_gotcha')}
              tabIndex={-1}
              autoComplete="off"
              className="hidden"
              aria-hidden
            />
            <div>
              <label htmlFor="c-name" className="font-mono text-[10px] uppercase tracking-[0.25em] text-mute">Name</label>
              <input id="c-name" required value={form.name} onChange={update('name')} className="field mt-2 w-full" autoComplete="name" />
            </div>
            <div>
              <label htmlFor="c-email" className="font-mono text-[10px] uppercase tracking-[0.25em] text-mute">Email</label>
              <input id="c-email" type="email" required value={form.email} onChange={update('email')} className="field mt-2 w-full" autoComplete="email" />
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="c-phone" className="font-mono text-[10px] uppercase tracking-[0.25em] text-mute">
                  Contact number <span className="normal-case tracking-normal">(optional)</span>
                </label>
                <input
                  id="c-phone"
                  type="tel"
                  inputMode="tel"
                  value={form.phone}
                  onChange={update('phone')}
                  className="field mt-2 w-full"
                  autoComplete="tel"
                  placeholder="+1 555 010 0100"
                  pattern="[0-9+()\-\s]{7,20}"
                  title="Numbers, spaces, +, - and brackets only"
                />
              </div>
              <div>
                <label htmlFor="c-topic" className="font-mono text-[10px] uppercase tracking-[0.25em] text-mute">Topic</label>
                <select id="c-topic" value={form.topic} onChange={update('topic')} className="field mt-2 w-full">
                  <option>Question</option>
                  <option>Order</option>
                  <option>Sizing</option>
                  <option>Feedback</option>
                </select>
              </div>
            </div>
            <fieldset>
              <legend className="font-mono text-[10px] uppercase tracking-[0.25em] text-mute">
                Rate your experience <span className="normal-case tracking-normal">(optional)</span>
              </legend>
              <div className="mt-2 flex gap-1" role="radiogroup">
                {[1, 2, 3, 4, 5].map((n) => {
                  const on = Number(form.rating) >= n;
                  return (
                    <button
                      key={n}
                      type="button"
                      role="radio"
                      aria-checked={form.rating === String(n)}
                      aria-label={`${n} star${n > 1 ? 's' : ''}`}
                      onClick={() => setForm((f) => ({ ...f, rating: f.rating === String(n) ? '' : String(n) }))}
                      className={`text-3xl leading-none transition hover:scale-110 ${on ? 'text-aura' : 'text-line'}`}
                    >
                      ★
                    </button>
                  );
                })}
              </div>
            </fieldset>
            <div>
              <label htmlFor="c-msg" className="font-mono text-[10px] uppercase tracking-[0.25em] text-mute">Message or feedback</label>
              <textarea id="c-msg" required rows={6} value={form.message} onChange={update('message')} className="field mt-2 w-full resize-y" />
            </div>
            <button type="submit" className="btn-primary w-full md:w-auto md:px-14" disabled={status.kind === 'sending'}>
              {status.kind === 'sending' ? 'Sending…' : 'Send message'}
            </button>
            {status.msg && (
              <p
                role="status"
                className={`rounded-lg border p-3 text-sm ${
                  status.kind === 'ok' ? 'border-aura/40 bg-aura/10 text-bone' : 'border-red-400/40 bg-red-400/10 text-red-200'
                }`}
              >
                {status.msg}
              </p>
            )}
          </form>
        </Reveal>
      </div>
    </section>
  );
}
