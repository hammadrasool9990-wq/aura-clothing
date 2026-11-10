import type { Pattern } from '../data/products';

// Draws a tileable fabric swatch (check, stripe, oxford…) on a canvas.
// The same swatch is used on the 3D shirts and on the 2D product cards,
// so every shirt shows its real pattern everywhere on the site.

const cache = new Map<string, HTMLCanvasElement>();

function rand(seed: number) {
  // small deterministic random so swatches look the same on every load
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function shade(hex: string, amt: number) {
  const n = parseInt(hex.slice(1), 16);
  const c = (v: number) => Math.max(0, Math.min(255, Math.round(v + amt * 255)));
  return `rgb(${c(n >> 16)},${c((n >> 8) & 255)},${c(n & 255)})`;
}

export function fabricCanvas(pattern: Pattern, base: string, accents: string[] = []): HTMLCanvasElement {
  const key = `${pattern}|${base}|${accents.join(',')}`;
  const hit = cache.get(key);
  if (hit) return hit;

  const S = 512;
  const cv = document.createElement('canvas');
  cv.width = cv.height = S;
  const ctx = cv.getContext('2d')!;
  const r = rand(base.length * 997 + pattern.length * 131 + 7);
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, S, S);

  const a0 = accents[0] ?? shade(base, -0.25);
  const a1 = accents[1] ?? shade(base, 0.2);

  switch (pattern) {
    case 'check': {
      // tartan-style sett: wide band + thin lines, woven both directions
      const sett = 128;
      const bands: [number, number, string, number][] = [
        [0, 44, a0, 0.55],
        [52, 6, a1, 0.85],
        [64, 3, a1, 0.7],
        [96, 14, a0, 0.35],
        [116, 4, a1, 0.6],
      ];
      for (let o = 0; o < S; o += sett) {
        for (const [x, w, col, alpha] of bands) {
          ctx.globalAlpha = alpha;
          ctx.fillStyle = col;
          ctx.fillRect(o + x, 0, w, S); // warp
          ctx.fillRect(0, o + x, S, w); // weft
        }
      }
      ctx.globalAlpha = 1;
      break;
    }
    case 'stripe': {
      ctx.fillStyle = a0;
      for (let x = 0; x < S; x += 32) {
        ctx.fillRect(x, 0, 3, S);
        ctx.globalAlpha = 0.45;
        ctx.fillRect(x + 7, 0, 1, S);
        ctx.globalAlpha = 1;
      }
      break;
    }
    case 'twill': {
      ctx.strokeStyle = shade(base, -0.08);
      ctx.lineWidth = 2;
      for (let i = -S; i < S * 2; i += 6) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i + S, S);
        ctx.stroke();
      }
      break;
    }
    case 'chambray': {
      for (let y = 0; y < S; y += 2) {
        ctx.globalAlpha = 0.08 + r() * 0.12;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, y, S, 1);
      }
      for (let x = 0; x < S; x += 3) {
        ctx.globalAlpha = r() * 0.12;
        ctx.fillStyle = shade(base, -0.2);
        ctx.fillRect(x, 0, 1, S);
      }
      ctx.globalAlpha = 1;
      break;
    }
    case 'linen': {
      for (let i = 0; i < 900; i++) {
        const y = r() * S;
        ctx.globalAlpha = 0.05 + r() * 0.1;
        ctx.fillStyle = r() > 0.5 ? shade(base, 0.12) : shade(base, -0.12);
        ctx.fillRect(r() * S, y, 20 + r() * 120, 1 + r() * 1.5);
      }
      ctx.globalAlpha = 1;
      break;
    }
    case 'oxford': {
      for (let y = 0; y < S; y += 3) {
        for (let x = 0; x < S; x += 3) {
          if (((x + y) / 3) % 2 === 0) {
            ctx.fillStyle = 'rgba(255,255,255,0.13)';
            ctx.fillRect(x, y, 2, 2);
          }
        }
      }
      break;
    }
    case 'poplin':
    default:
      break;
  }

  // fine thread noise on every fabric
  const img = ctx.getImageData(0, 0, S, S);
  const d = img.data;
  for (let i = 0; i < d.length; i += 4) {
    const n = (r() - 0.5) * 14;
    d[i] += n;
    d[i + 1] += n;
    d[i + 2] += n;
  }
  ctx.putImageData(img, 0, 0);

  cache.set(key, cv);
  return cv;
}

const urlCache = new Map<string, string>();
export function fabricDataUrl(pattern: Pattern, base: string, accents?: string[]) {
  const key = `${pattern}|${base}|${(accents ?? []).join(',')}`;
  let u = urlCache.get(key);
  if (!u) {
    u = fabricCanvas(pattern, base, accents).toDataURL('image/jpeg', 0.85);
    urlCache.set(key, u);
  }
  return u;
}
