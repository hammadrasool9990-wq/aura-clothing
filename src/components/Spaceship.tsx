// Hand-drawn SVG spaceship: glass dome, brushed-metal saucer, a ring of
// running lights and a glowing emitter underneath where the beam starts.
export default function Spaceship({ className = '' }: { className?: string }) {
  const lights = Array.from({ length: 11 }, (_, i) => {
    const t = (i / 10) * Math.PI; // along the lower front edge
    return { x: 200 - Math.cos(t) * 168, y: 96 + Math.sin(t) * 18, i };
  });
  return (
    <svg viewBox="0 0 400 170" className={className} aria-hidden>
      <defs>
        <linearGradient id="ship-metal" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#c9c9d2" />
          <stop offset="0.35" stopColor="#6d6d7a" />
          <stop offset="0.6" stopColor="#2a2a33" />
          <stop offset="1" stopColor="#121218" />
        </linearGradient>
        <linearGradient id="ship-rim" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#3a3a44" />
          <stop offset="0.5" stopColor="#e9e6dd" />
          <stop offset="1" stopColor="#3a3a44" />
        </linearGradient>
        <radialGradient id="ship-dome" cx="0.4" cy="0.3" r="0.8">
          <stop offset="0" stopColor="#e6f0ff" stopOpacity="0.95" />
          <stop offset="0.4" stopColor="#7d93b8" stopOpacity="0.75" />
          <stop offset="1" stopColor="#1c2333" stopOpacity="0.9" />
        </radialGradient>
        <radialGradient id="ship-emit" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#fffaf0" />
          <stop offset="0.5" stopColor="#f3d9a4" />
          <stop offset="1" stopColor="#c9a96e" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* dome */}
      <path d="M128 78 Q132 18 200 14 Q268 18 272 78 Z" fill="url(#ship-dome)" />
      <path d="M150 56 Q160 30 196 24" stroke="#fff" strokeOpacity="0.55" strokeWidth="3" fill="none" strokeLinecap="round" />
      {/* saucer body */}
      <ellipse cx="200" cy="90" rx="190" ry="34" fill="url(#ship-metal)" />
      <ellipse cx="200" cy="80" rx="150" ry="14" fill="#fff" opacity="0.12" />
      <ellipse cx="200" cy="92" rx="186" ry="8" fill="url(#ship-rim)" opacity="0.55" />
      {/* underside + emitter */}
      <ellipse cx="200" cy="112" rx="90" ry="16" fill="#0d0d12" />
      <ellipse className="ship-emitter" cx="200" cy="120" rx="64" ry="16" fill="url(#ship-emit)" />
      {/* running lights */}
      {lights.map((l) => (
        <circle
          key={l.i}
          className="ship-light"
          style={{ animationDelay: `${l.i * 0.12}s` }}
          cx={l.x}
          cy={l.y}
          r="4"
          fill="#f3d9a4"
        />
      ))}
    </svg>
  );
}
