# AURA-CLOTHING — Website

A 5-page men's clothing store with a rotating 3D shirt showcase and a
scroll-driven "exploded view" animation.

**Pages:** Home · Formal Shirts · Casual Shirts · Statement Shirts · Shop all · Product · About · Contact
**Built with:** React 18, TypeScript, Tailwind CSS, GSAP, Vite

---

## 1. Run it on your computer

You need **Node.js 18 or newer** (download from nodejs.org).

```bash
npm install        # install packages (first time only)
npm run dev        # start the site → open the address it prints (usually http://localhost:5173)
```

Other commands:

```bash
npm run build          # production build → dist/  (this is what Vercel deploys)
npm run preview        # preview the production build locally
npm run build:single   # ONE self-contained HTML file → dist-single/index.html (handy for sharing a preview)
```

---

## 2. Project structure

```
aura-clothing/
├─ index.html              page shell, SEO tags, font links
├─ vercel.json             makes /shop, /about etc. work on Vercel
├─ .env.example            copy to .env and add your form IDs
├─ prompts/                image + animation prompts for your product visuals
├─ public/
│  ├─ images/              put product photos here
│  └─ models/              put shirt.glb here (optional, see section 7)
└─ src/
   ├─ data/
   │  ├─ site.ts           ★ brand name, emails, Instagram
   │  └─ products.ts       ★ your products, prices, colours, sizes
   ├─ pages/               Home, Shop, Product, About, Contact
   ├─ components/          Header, Footer, CartDrawer, Loader, cards, effects
   ├─ three/               3D shirt, carousel, viewer, studio lighting
   ├─ context/             cart + USD/GBP currency
   └─ lib/                 contact form sending, SEO, safe storage
```

The ★ files are the ones you will edit most.

---

## 3. Add or edit products

Open `src/data/products.ts`. Each product looks like this:

```ts
{
  id: 'signal-oxford',          // used in the link: /product/signal-oxford
  name: 'Signal Oxford',
  category: 'Formal',           // Formal | Casual | Overshirt
  priceUSD: 59,                 // ← set your real US price
  priceGBP: 49,                 // ← set your real UK price
  colors: [{ name: 'Bone', hex: '#E8E2D6' }],   // hex also colours the 3D shirt
  sizes: SIZES,
  description: 'Your description here.',
  details: ['100% cotton', 'Slim fit', 'Machine wash cold'],
  featured: true,               // true = shows on the Home page ring + grid
}
```

- **Prices are `null` until you add them.** The site then shows `[PRICE]`,
  and the price filter / price sorting on the Shop page stay switched off.
- No exchange rate is guessed: you set the USD and GBP price separately.
- **Sizes:** both US and UK labels are shown. Confirm them with your
  manufacturer, and fill the size-guide measurements in `src/pages/Product.tsx`
  (search for `SIZE GUIDE PLACEHOLDER`).

---

## 4. Connect the contact form (messages → aurevon9990@gmail.com)

The site has no server, so it uses **Formspree** to deliver form messages
to your Gmail.

1. Go to **formspree.io** and sign up **using aurevon9990@gmail.com**.
2. Confirm your email (Formspree sends a verification link).
3. Create a new form. Formspree shows an endpoint like
   `https://formspree.io/f/abcdwxyz`. The **form ID** is `abcdwxyz`.
4. In the project folder, copy `.env.example` to a new file named `.env`
   and paste the ID:
   ```
   VITE_FORMSPREE_CONTACT_ID=abcdwxyz
   ```
5. Restart `npm run dev`, send a test message, and check your inbox
   (and spam folder the first time).
6. On Vercel, add the same variable under
   **Project → Settings → Environment Variables**, then redeploy.

Until this is done, the form clearly tells customers it isn't connected and
shows your email instead. It never pretends a message was sent.

**Newsletter (Home page):** uses the same form by default. To keep signups
separate, create a second Formspree form and set `VITE_FORMSPREE_NEWSLETTER_ID`.

---

## 5. Checkout and payments

The cart works (add, change quantity, remove; it's saved in the browser),
but **real payments are not connected.** The Checkout button shows a message
asking customers to contact you.

To take payments, connect a payment provider such as **Stripe** (Stripe
Checkout / Payment Links) or move the catalogue to **Shopify**. Both need an
account in your name. Look for `PLACEHOLDER CHECKOUT` in
`src/components/CartDrawer.tsx`.

---

## 6. Fonts

The brief asked to match your portfolio fonts. They could not be read from
the live site, so two **placeholder fonts** are used: *Space Grotesk*
(headings/body) and *JetBrains Mono* (labels).

To change them, edit two places:
1. `index.html` → the Google Fonts `<link>` (look for `FONT PLACEHOLDER`)
2. `tailwind.config.js` → `fontFamily.display` and `fontFamily.mono`

Tip: in your portfolio's source code, search for `next/font` or
`font-family` to find the exact names.

---

## 7. Replace the 3D shirt

Right now the shirt is drawn in code (`src/three/Shirt.tsx`) from separate
parts: front and back panels, sleeves, cuffs, collar, collar stand,
placket, pocket, buttons and stitching. That's why it can "explode".

**Easy changes (no 3D skills):**
- Colours come from each product's `hex` in `products.ts`.
- How far each part flies: the `offset` values in `Shirt.tsx`.
- The order parts separate: the `delay` values (0 = first, 0.4 = last).

**Using a real 3D model:** a single-piece model **cannot** explode. You need
a `.glb` file where every part (collar, sleeves, panels, buttons…) is a
**separate, named mesh**. A 3D artist can produce this. Put it at
`public/models/shirt.glb`, then load it with Three.js's `GLTFLoader` in
`Shirt.tsx` and map each named mesh to the matching entry in the `parts`
list. This step needs a developer.

---

## 8. Add product photos

Product cards show a drawn shirt icon until you add photos. Put images in
`public/images/`, then in `src/components/ProductCard.tsx` replace the
`<ShirtGlyph … />` lines (see `PRODUCT PHOTO PLACEHOLDER`) with:

```tsx
<img src="/images/signal-oxford-1.jpg" alt="Signal Oxford shirt" className="absolute inset-0 h-full w-full object-cover" />
```

Use the prompts in the `prompts/` folder with an AI image tool to create
matching dark-studio product shots.

---

## 8. Shirt photos (current version)

The 3D shirts were removed. Every shirt is now shown as a **photo of you
wearing it** (`src/assets/looks/`), with a fabric close-up you can zoom
(`src/assets/fabrics/`).

- `houndstooth.webp` is a full AI studio photo of you made from your
  portfolio picture.
- The other standing looks are that same photo with the shirt fabric swapped.
- The seated looks are your own check-shirt photo with the fabric swapped.

These are **design previews**. Before selling, photograph the real shirts
and replace the files (keep the same file names).

Three shirt pages: `/shirts/formal`, `/shirts/casual`, `/shirts/statement`
(`src/pages/ShirtLine.tsx`). Which shirt appears where is set by `category`
in `src/data/products.ts`.

## 8a. Older notes on the try-on images

`src/assets/looks/` holds design previews of you wearing each shirt:
houndstooth, geometric print, gingham, navy tropical floral and green
embroidered. They were made by replacing the shirt in your check-shirt photo
with each fabric, so treat them as **design previews**: once you have the
real shirts, photograph them and replace these files (same names).
`src/assets/fabrics/` holds the matching fabric swatches used on the 3D shirts.

## 8b. Your photos

Your photos live in `src/assets/`:
- `founder-landing.webp`: background removed, chair replaced with a black and gold cane, used in the spaceship scene
- `founder-portrait.webp`, `founder-casual.webp`: used on the About page

To swap the landing photo, use a full-body photo on a plain background,
remove the background (PNG/WebP with transparency) and save it with the same name.

## 9. Deploy to Vercel

1. Put the project on GitHub (new repository → upload these files, without
   `node_modules`, `dist` or `.env`).
2. Go to **vercel.com** → **Add New → Project** → import the repository.
3. Vercel detects Vite automatically (build: `npm run build`, output: `dist`).
4. Add `VITE_FORMSPREE_CONTACT_ID` under Environment Variables.
5. Click **Deploy**. `vercel.json` makes direct links like `/shop` work.

---

## 10. Effects included (from the portfolio style)

- Dark theme on `#07070B` (the portfolio's theme colour)
- Counting loader `000 → 100` (once per visit)
- Numbered section labels: `01/ COLLECTION`
- Headings drawn twice: outline layer + filled layer that wipes in
- Infinite text marquee
- Emails with one-click **Copy**
- Smooth scrolling and scroll reveals
- 3D shirt ring on Home (auto-rotates, pauses on hover, drag to spin, tap to open)
- Scroll-driven assembled → exploded → reassembled animation on each product
- **Spaceship landing (Home):** the ship flies down, its lights switch on, a beam opens and Hammad descends and lands (`src/components/SpaceHero.tsx`)
- **Dotted background (Home):** dots breathe in a slow wave and glow gold around the cursor (`src/components/DotField.tsx`)
- **Real fabric patterns:** check, stripe, oxford, poplin, linen, twill and chambray drawn on the 3D shirts and cards (`src/lib/fabricPattern.ts`; choose with `pattern` in `products.ts`)
- **Brand specialty section (Home):** `src/components/Specialty.tsx`
- **Click anywhere to enter** gate after the loader (cinematic intro)
- Glowing white silhouette descends the beam, turns into your photo, and a ribbon of light wraps around you
- **Dust dissolve:** scrolling past the hero blows the figure away to the right like charcoal dust (`src/lib/dissolve.ts`)
- **The signal:** big statement whose words light up as you scroll (`src/components/Story.tsx`)
- **Lookbook:** hover a shirt name and its photo follows the cursor (`src/components/Lookbook.tsx`)
- Custom gold cursor, magnetic buttons and "decoding" section labels (desktop)
- 3D pauses while scrolled off screen to keep the page smooth
- Respects "reduce motion": animations switch off, 3D stays still

---

## 11. Placeholders you must replace

| What | Where |
|---|---|
| Prices (USD + GBP) | `src/data/products.ts` → `priceUSD`, `priceGBP` |
| Product descriptions | `src/data/products.ts` → `DESC` / `description` |
| Fabric, fit, care details | `src/data/products.ts` → `DETAILS` / `details` |
| Product names & colours (suggestions only) | `src/data/products.ts` |
| Size labels (confirm) + size-guide measurements | `products.ts` → `SIZES`; `Product.tsx` → `SIZE GUIDE PLACEHOLDER` |
| Sixth specialty card (your fabric / quality promise) | `src/components/Specialty.tsx` → last item |
| Founder line under your name | `src/pages/About.tsx` → `[A line from you…]` |
| Brand story (3 paragraphs) + 3 values | `src/pages/About.tsx` |
| Shipping policy text | `src/components/CartDrawer.tsx` → `[SHIPPING POLICY]` |
| Formspree form ID | `.env` → `VITE_FORMSPREE_CONTACT_ID` |
| Payment checkout | `src/components/CartDrawer.tsx` → `PLACEHOLDER CHECKOUT` |
| Fonts | `index.html` + `tailwind.config.js` → `FONT PLACEHOLDER` |
| Product photos | `src/components/ProductCard.tsx` → `PRODUCT PHOTO PLACEHOLDER` |
| 3D model (optional) | `public/models/shirt.glb` + `src/three/Shirt.tsx` |
