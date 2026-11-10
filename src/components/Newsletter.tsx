import { useState, type FormEvent } from 'react';
import { sendNewsletter, FormNotConnectedError } from '../lib/forms';

type Status = { kind: 'idle' | 'sending' | 'ok' | 'error'; msg?: string };

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>({ kind: 'idle' });

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus({ kind: 'sending' });
    try {
      await sendNewsletter(email);
      setStatus({ kind: 'ok', msg: "You're on the list." });
      setEmail('');
    } catch (err) {
      setStatus({
        kind: 'error',
        msg: err instanceof FormNotConnectedError ? 'Signup is not connected yet (owner: see README).' : (err as Error).message,
      });
    }
  };

  return (
    <form onSubmit={submit} className="flex w-full max-w-lg flex-col gap-3 sm:flex-row">
      <label htmlFor="nl-email" className="sr-only">
        Email address
      </label>
      <input
        id="nl-email"
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        className="field flex-1"
      />
      <button type="submit" className="btn-primary" disabled={status.kind === 'sending'}>
        {status.kind === 'sending' ? 'Sending…' : 'Subscribe'}
      </button>
      {status.msg && (
        <p role="status" className={`text-sm sm:basis-full ${status.kind === 'ok' ? 'text-aura' : 'text-red-300'}`}>
          {status.msg}
        </p>
      )}
    </form>
  );
}
