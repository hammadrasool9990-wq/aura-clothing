// Tiny signal so the home-page landing animation waits for the loader.
let ready = false;
const waiting: (() => void)[] = [];

export function markReady() {
  if (ready) return;
  ready = true;
  waiting.splice(0).forEach((cb) => cb());
}

export function onReady(cb: () => void) {
  if (ready) cb();
  else waiting.push(cb);
  return () => {
    const i = waiting.indexOf(cb);
    if (i >= 0) waiting.splice(i, 1);
  };
}
