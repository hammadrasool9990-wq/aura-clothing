// ─────────────────────────────────────────────────────────────
// PRODUCTS — edit this list to add / change products.
//
// Nothing here is invented as fact: prices, descriptions and fabric
// details describe only what is visible in each photo.
// Style names are suggestions — rename them freely.
//
// Prices: every shirt is SHIRT_PRICE_USD (below). Prices are shown in USD.
// ─────────────────────────────────────────────────────────────

import houndstoothSwatch from '../assets/fabrics/houndstooth.jpg';
import houndstoothLook from '../assets/looks/houndstooth.webp';
import pinstripeSwatch from '../assets/fabrics/pinstripe.jpg';
import pinstripeLook from '../assets/looks/pinstripe.webp';
import satinSwatch from '../assets/fabrics/satin.jpg';
import satinLook from '../assets/looks/satin.webp';
import ginghamSwatch from '../assets/fabrics/gingham.jpg';
import ginghamLook from '../assets/looks/gingham.webp';
import linenSwatch from '../assets/fabrics/linen.jpg';
import linenLook from '../assets/looks/linen.webp';
import denimSwatch from '../assets/fabrics/denim.jpg';
import denimLook from '../assets/looks/denim.webp';
import floralSwatch from '../assets/fabrics/floral.jpg';
import floralLook from '../assets/looks/floral.webp';
import embroideredSwatch from '../assets/fabrics/embroidered.jpg';
import embroideredLook from '../assets/looks/embroidered.webp';
import geometricSwatch from '../assets/fabrics/geometric.jpg';
import geometricLook from '../assets/looks/geometric.webp';
import oxfordSwatch from '../assets/fabrics/oxford.jpg';
import oxfordLook from '../assets/looks/oxford.webp';
import bengalSwatch from '../assets/fabrics/bengal.jpg';
import bengalLook from '../assets/looks/bengal.webp';
import ecruSwatch from '../assets/fabrics/ecru.jpg';
import ecruLook from '../assets/looks/ecru.webp';
import checkLook from '../assets/founder-casual.webp';

export type Category = 'Formal' | 'Casual' | 'Statement' | 'Old Money';

// Fabric pattern drawn on the 3D shirt and the product card.
export type Pattern =
  | 'oxford' | 'poplin' | 'check' | 'stripe' | 'twill' | 'chambray' | 'linen'
  | 'houndstooth' | 'geometric' | 'gingham' | 'floral' | 'embroidered'
  | 'pinstripe' | 'satin' | 'denim' | 'bengal';

export interface ProductColor {
  name: string; // shown to customers
  hex: string; // main fabric colour
  accents?: string[]; // extra thread colours for checks / stripes
}

export interface Product {
  id: string; // used in the URL: /product/<id>
  name: string;
  category: Category;
  priceUSD: number | null;
  priceGBP: number | null;
  pattern: Pattern;
  swatch?: string; // fabric image used on the 3D shirt (optional)
  look?: string; // photo of the shirt worn (shown on cards + product page)
  colors: ProductColor[];
  sizes: { us: string; uk: string }[];
  description: string;
  details: string[];
  featured: boolean;
}

// Letter sizes shown with both US and UK labels.
// CONFIRM these with your manufacturer before launch.
const SIZES = [
  { us: 'S', uk: 'S' },
  { us: 'M', uk: 'M' },
  { us: 'L', uk: 'L' },
  { us: 'XL', uk: 'XL' },
  { us: 'XXL', uk: 'XXL' },
];

// Every shirt has one fixed price. Change it here and it updates everywhere.
export const SHIRT_PRICE_USD = 250;

// Shown on each product page (fabric content and care: add from your supplier's label).
const details = (pattern: string, line: string) => [`Pattern: ${pattern}`, `Line: ${line}`, 'Sizes: S to XXL, US and UK labels'];

// Shirts in four lines: Formal, Casual, Statement and Old Money.
export const PRODUCTS: Product[] = [
  {
    id: 'sand-houndstooth',
    name: 'Sand Houndstooth',
    category: 'Formal',
    pattern: 'houndstooth',
    swatch: houndstoothSwatch,
    look: houndstoothLook,
    priceUSD: SHIRT_PRICE_USD,
    priceGBP: null,
    colors: [{ name: 'Sand', hex: '#D9C3A0' }],
    sizes: SIZES,
    description: 'A sand and cream houndstooth that looks sharp with chinos or under a blazer. Roll the sleeves for a relaxed evening look.',
    details: details('Houndstooth', 'Formal'),
    featured: true,
  },
  {
    id: 'ivory-pinstripe',
    name: 'Ivory Pinstripe',
    category: 'Formal',
    pattern: 'pinstripe',
    swatch: pinstripeSwatch,
    look: pinstripeLook,
    priceUSD: SHIRT_PRICE_USD,
    priceGBP: null,
    colors: [{ name: 'Ivory / Navy', hex: '#F2F1EC' }],
    sizes: SIZES,
    description: 'Crisp ivory with fine navy pinstripes. The classic office shirt that also looks right under a jacket on a night out.',
    details: details('Navy pinstripe', 'Formal'),
    featured: true,
  },
  {
    id: 'midnight-satin',
    name: 'Midnight Satin',
    category: 'Formal',
    pattern: 'satin',
    swatch: satinSwatch,
    look: satinLook,
    priceUSD: SHIRT_PRICE_USD,
    priceGBP: null,
    colors: [{ name: 'Black', hex: '#141418' }],
    sizes: SIZES,
    description: 'A deep black shirt with a soft sheen. Wear it under a navy or black blazer for dinners, events and photos.',
    details: details('Solid black', 'Formal'),
    featured: true,
  },
  {
    id: 'noir-gingham',
    name: 'Noir Gingham',
    category: 'Casual',
    pattern: 'gingham',
    swatch: ginghamSwatch,
    look: ginghamLook,
    priceUSD: SHIRT_PRICE_USD,
    priceGBP: null,
    colors: [{ name: 'Black / White', hex: '#8C8884' }],
    sizes: SIZES,
    description: 'Black and white gingham with clean, bold checks. Easy with white trousers, dark jeans or under a blazer.',
    details: details('Black and white gingham', 'Casual'),
    featured: true,
  },
  {
    id: 'sage-linen',
    name: 'Sage Linen',
    category: 'Casual',
    pattern: 'linen',
    swatch: linenSwatch,
    look: linenLook,
    priceUSD: SHIRT_PRICE_USD,
    priceGBP: null,
    colors: [{ name: 'Sage', hex: '#8FA287' }],
    sizes: SIZES,
    description: 'A calm sage green with a natural slub texture. Made for warm days, rolled sleeves and light trousers.',
    details: details('Sage slub', 'Casual'),
    featured: true,
  },
  {
    id: 'indigo-denim',
    name: 'Indigo Denim',
    category: 'Casual',
    pattern: 'chambray',
    swatch: denimSwatch,
    look: denimLook,
    priceUSD: SHIRT_PRICE_USD,
    priceGBP: null,
    colors: [{ name: 'Indigo', hex: '#3D5A86' }],
    sizes: SIZES,
    description: 'Mid-wash indigo with a twill weave. Wear it on its own or as a layer over a white tee.',
    details: details('Indigo twill', 'Casual'),
    featured: true,
  },
  {
    id: 'lantern-check',
    name: 'Lantern Check',
    category: 'Casual',
    pattern: 'check',
    look: checkLook,
    priceUSD: SHIRT_PRICE_USD,
    priceGBP: null,
    colors: [{ name: 'Sand Check', hex: '#EDE6D8', accents: ['#C9A36C', '#3B4F6E'] }],
    sizes: SIZES,
    description: 'A warm sand, navy and white check. The relaxed weekend shirt for reading, coffee and long afternoons.',
    details: details('Sand and navy check', 'Casual'),
    featured: true,
  },
  {
    id: 'midnight-tropic',
    name: 'Midnight Tropic',
    category: 'Statement',
    pattern: 'floral',
    swatch: floralSwatch,
    look: floralLook,
    priceUSD: SHIRT_PRICE_USD,
    priceGBP: null,
    colors: [{ name: 'Navy Floral', hex: '#233A73' }],
    sizes: SIZES,
    description: 'Navy with white palm leaves and hibiscus flowers. A holiday shirt that turns heads anywhere.',
    details: details('Tropical floral', 'Statement'),
    featured: true,
  },
  {
    id: 'emerald-heritage',
    name: 'Emerald Heritage',
    category: 'Statement',
    pattern: 'embroidered',
    swatch: embroideredSwatch,
    look: embroideredLook,
    priceUSD: SHIRT_PRICE_USD,
    priceGBP: null,
    colors: [{ name: 'Emerald', hex: '#1F3A2A' }],
    sizes: SIZES,
    description: 'Deep emerald with gold geometric embroidery running down the front. A statement for weddings, parties and Eid.',
    details: details('Gold embroidered bands', 'Statement'),
    featured: true,
  },
  {
    id: 'riviera-geo',
    name: 'Riviera Geo Print',
    category: 'Statement',
    pattern: 'geometric',
    swatch: geometricSwatch,
    look: geometricLook,
    priceUSD: SHIRT_PRICE_USD,
    priceGBP: null,
    colors: [{ name: 'Ivory', hex: '#ECE8E2' }],
    sizes: SIZES,
    description: 'Ivory with a small diamond print in taupe and burgundy. Smart enough for a blazer, relaxed enough for the weekend.',
    details: details('Diamond geometric print', 'Statement'),
    featured: true,
  },
  {
    id: 'heritage-oxford',
    name: 'Heritage Oxford',
    category: 'Old Money',
    pattern: 'oxford',
    swatch: oxfordSwatch,
    look: oxfordLook,
    priceUSD: SHIRT_PRICE_USD,
    priceGBP: null,
    colors: [{ name: 'Pale Blue', hex: '#B9CDE6' }],
    sizes: SIZES,
    description: 'A pale blue oxford with a soft basket weave. The quiet-luxury classic: tuck it into cream trousers and add loafers.',
    details: details('Oxford weave', 'Old Money'),
    featured: true,
  },
  {
    id: 'regatta-bengal',
    name: 'Regatta Bengal Stripe',
    category: 'Old Money',
    pattern: 'bengal',
    swatch: bengalSwatch,
    look: bengalLook,
    priceUSD: SHIRT_PRICE_USD,
    priceGBP: null,
    colors: [{ name: 'White / Sky', hex: '#F6F5F1' }],
    sizes: SIZES,
    description: 'White with bold sky-blue Bengal stripes. Made for summer lunches, sailing weekends and long evenings outdoors.',
    details: details('Bengal stripe', 'Old Money'),
    featured: true,
  },
  {
    id: 'ecru-linen',
    name: 'Ecru Linen',
    category: 'Old Money',
    pattern: 'linen',
    swatch: ecruSwatch,
    look: ecruLook,
    priceUSD: SHIRT_PRICE_USD,
    priceGBP: null,
    colors: [{ name: 'Ecru', hex: '#E6DCC8' }],
    sizes: SIZES,
    description: 'A warm ecru linen with a natural slub. Effortless, understated and right at home on a terrace in the sun.',
    details: details('Ecru slub', 'Old Money'),
    featured: true,
  },
];

export const CATEGORIES: Category[] = ['Formal', 'Casual', 'Statement', 'Old Money'];

// The three shirt lines, each with its own page at /shirts/<slug>
export const LINES: { slug: string; category: Category; title: string; intro: string }[] = [
  { slug: 'formal', category: 'Formal', title: 'Formal Shirts', intro: 'Sharp, quiet and tailored for the office, the interview and the evening.' },
  { slug: 'casual', category: 'Casual', title: 'Casual Shirts', intro: 'Gingham, linen, denim and check for the days without a dress code.' },
  { slug: 'statement', category: 'Statement', title: 'Statement Shirts', intro: 'Prints and embroidery for the moments you want to be noticed.' },
  { slug: 'old-money', category: 'Old Money', title: 'Old Money Shirts', intro: 'Oxford, Bengal stripe and linen. Quiet luxury that never needs a logo.' },
];

export const getProduct = (id: string | undefined) => PRODUCTS.find((p) => p.id === id);
