// Safe wrappers: browser storage can be blocked (private mode, previews),
// so every read/write is wrapped and the site still works without it.

export function load<T>(key: string, fallback: T, session = false): T {
  try {
    const store = session ? window.sessionStorage : window.localStorage;
    const raw = store.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function save(key: string, value: unknown, session = false) {
  try {
    const store = session ? window.sessionStorage : window.localStorage;
    store.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable — ignore */
  }
}

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true;
