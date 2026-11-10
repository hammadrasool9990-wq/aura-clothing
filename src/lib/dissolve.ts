// "Charcoal dissolve": as the visitor scrolls past the hero, the founder's
// figure breaks into dust that drifts to the right, starting from his
// right-hand side. Works on any image drawn into a canvas.

interface Grain {
  x: number; // position inside the image, px
  y: number;
  c: string; // colour
  t: number; // when this grain lets go (0–1)
  vx: number;
  vy: number;
}

export class Dissolver {
  private ctx: CanvasRenderingContext2D;
  private grains: Grain[] = [];
  private w = 0;
  private h = 0;
  private dpr = 1;

  constructor(private canvas: HTMLCanvasElement, private img: HTMLImageElement) {
    this.ctx = canvas.getContext('2d')!;
  }

  /** Measure the image on screen and sample its pixels into grains. */
  setup() {
    const r = this.img.getBoundingClientRect();
    // use layout size (ignores in-flight transforms)
    this.w = this.img.offsetWidth || r.width;
    this.h = this.img.offsetHeight || r.height;
    if (!this.w || !this.h) return false;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width = this.w * this.dpr;
    this.canvas.height = this.h * this.dpr;
    this.canvas.style.width = `${this.w}px`;
    this.canvas.style.height = `${this.h}px`;

    // sample on a small offscreen copy
    const step = 4;
    const sw = Math.ceil(this.w / step);
    const sh = Math.ceil(this.h / step);
    const off = document.createElement('canvas');
    off.width = sw;
    off.height = sh;
    const o = off.getContext('2d')!;
    o.drawImage(this.img, 0, 0, sw, sh);
    let data: Uint8ClampedArray;
    try {
      data = o.getImageData(0, 0, sw, sh).data;
    } catch {
      return false; // image not readable (shouldn't happen for our own files)
    }
    this.grains = [];
    for (let y = 0; y < sh; y++) {
      for (let x = 0; x < sw; x++) {
        const i = (y * sw + x) * 4;
        if (data[i + 3] < 60) continue;
        const nx = x / sw;
        // right side lets go first, with a ragged edge
        const t = Math.min(0.98, Math.max(0, (1 - nx) * 0.75 + Math.random() * 0.25));
        this.grains.push({
          x: x * step,
          y: y * step,
          c: `rgba(${data[i]},${data[i + 1]},${data[i + 2]},`,
          t,
          vx: 120 + Math.random() * 260,
          vy: -40 + Math.random() * 80,
        });
      }
    }
    return true;
  }

  /** p: 0 = whole figure, 1 = fully blown away */
  draw(p: number) {
    const { ctx, w, h, dpr } = this;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    if (p <= 0.001) return;
    ctx.globalCompositeOperation = 'source-over';
    ctx.drawImage(this.img, 0, 0, w, h);
    // punch out grains that have already left…
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillStyle = '#000';
    for (const g of this.grains) if (p > g.t) ctx.fillRect(g.x - 1, g.y - 1, 6, 6);
    // …and draw them drifting away
    ctx.globalCompositeOperation = 'source-over';
    for (const g of this.grains) {
      const k = (p - g.t) / (1 - g.t + 0.0001);
      if (k <= 0) continue;
      const a = Math.max(0, 1 - k * 1.1);
      if (a <= 0) continue;
      ctx.fillStyle = `${g.c}${a.toFixed(3)})`;
      const s = 2.4 * (1 - k * 0.6);
      ctx.fillRect(g.x + g.vx * k * k, g.y + g.vy * k - 30 * k * k, s, s);
    }
  }
}
