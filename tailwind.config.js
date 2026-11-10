/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Two-colour scheme: midnight navy + champagne gold, with ivory text
        ink: '#0A1124', // midnight navy (page background)
        ink2: '#111B36', // raised navy (cards, drawer)
        line: 'rgba(240,226,200,0.14)',
        bone: '#F4ECDF', // ivory text
        mute: '#A3A9BC', // soft blue-grey text
        aura: '#DDBB82', // champagne gold accent
      },
      fontFamily: {
        // FONT PLACEHOLDER: change these two names to your portfolio fonts.
        // The <link> in index.html loads them from Google Fonts.
        // Elegant serif for headings, clean sans for body, mono for small labels
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['Manrope', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      keyframes: {
        marquee: { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-50%)' } },
      },
      animation: { marquee: 'marquee 28s linear infinite' },
    },
  },
  plugins: [],
};
