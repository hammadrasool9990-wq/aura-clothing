// ─────────────────────────────────────────────────────────────
// PRODUCTS — edit this list to add / change products.
//
// Nothing here is invented as fact: prices, descriptions and fabric
// details are left as null / [PLACEHOLDER] for you to fill in.
// Style names are suggestions — rename them freely.
//
// Prices: set BOTH priceUSD and priceGBP yourself (no exchange rate is
// guessed). While a price is null the site shows "[PRICE]".
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
import checkLook from '../assets/founder-casual.webp';

export type Category = 'Formal' | 'Casual' | 'Statement';

// Fabric pattern drawn on the 3D shirt and the product card.
export type Pattern =
  | 'oxford' | 'poplin' | 'check' | 'stripe' | 'twill' | 'chambray' | 'linen'
  | 'houndstooth' | 'geometric' | 'gingham' | 'floral' | 'embroidered'
  | 'pinstripe' | 'satin' | 'denim';

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

const DESC = '[PRODUCT DESCRIPTION — write 1–2 sentences about this shirt]';
const DETAILS = ['[FABRIC / MATERIAL]', '[FIT — e.g. slim, regular]', '[CARE INSTRUCTIONS]'];

// Ten shirts in three lines: Formal, Casual and Statement.
export const PRODUCTS: Product[] = [
  {
    id: 'sand-houndstooth',
    name: 'Sand Houndstooth',
    category: 'Formal',
    pattern: 'houndstooth',
    swatch: houndstoothSwatch,
    look: houndstoothLook,
    priceUSD: null,
    priceGBP: null,
    colors: [{ name: 'Sand', hex: '#D9C3A0' }],
    sizes: SIZES,
    description: DESC,
    details: DETAILS,
    featured: true,
  },
  {
    id: 'ivory-pinstripe',
    name: 'Ivory Pinstripe',
    category: 'Formal',
    pattern: 'pinstripe',
    swatch: pinstripeSwatch,
    look: pinstripeLook,
    priceUSD: null,
    priceGBP: null,
    colors: [{ name: 'Ivory / Navy', hex: '#F2F1EC' }],
    sizes: SIZES,
    description: DESC,
    details: DETAILS,
    featured: true,
  },
  {
    id: 'midnight-satin',
    name: 'Midnight Satin',
    category: 'Formal',
    pattern: 'satin',
    swatch: satinSwatch,
    look: satinLook,
    priceUSD: null,
    priceGBP: null,
    colors: [{ name: 'Black', hex: '#141418' }],
    sizes: SIZES,
    description: DESC,
    details: DETAILS,
    featured: true,
  },
  {
    id: 'noir-gingham',
    name: 'Noir Gingham',
    category: 'Casual',
    pattern: 'gingham',
    swatch: ginghamSwatch,
    look: ginghamLook,
    priceUSD: null,
    priceGBP: null,
    colors: [{ name: 'Black / White', hex: '#8C8884' }],
    sizes: SIZES,
    description: DESC,
    details: DETAILS,
    featured: true,
  },
  {
    id: 'sage-linen',
    name: 'Sage Linen',
    category: 'Casual',
    pattern: 'linen',
    swatch: linenSwatch,
    look: linenLook,
    priceUSD: null,
    priceGBP: null,
    colors: [{ name: 'Sage', hex: '#8FA287' }],
    sizes: SIZES,
    description: DESC,
    details: DETAILS,
    featured: true,
  },
  {
    id: 'indigo-denim',
    name: 'Indigo Denim',
    category: 'Casual',
    pattern: 'chambray',
    swatch: denimSwatch,
    look: denimLook,
    priceUSD: null,
    priceGBP: null,
    colors: [{ name: 'Indigo', hex: '#3D5A86' }],
    sizes: SIZES,
    description: DESC,
    details: DETAILS,
    featured: true,
  },
  {
    id: 'lantern-check',
    name: 'Lantern Check',
    category: 'Casual',
    pattern: 'check',
    look: checkLook,
    priceUSD: null,
    priceGBP: null,
    colors: [{ name: 'Sand Check', hex: '#EDE6D8', accents: ['#C9A36C', '#3B4F6E'] }],
    sizes: SIZES,
    description: DESC,
    details: DETAILS,
    featured: true,
  },
  {
    id: 'midnight-tropic',
    name: 'Midnight Tropic',
    category: 'Statement',
    pattern: 'floral',
    swatch: floralSwatch,
    look: floralLook,
    priceUSD: null,
    priceGBP: null,
    colors: [{ name: 'Navy Floral', hex: '#233A73' }],
    sizes: SIZES,
    description: DESC,
    details: DETAILS,
    featured: true,
  },
  {
    id: 'emerald-heritage',
    name: 'Emerald Heritage',
    category: 'Statement',
    pattern: 'embroidered',
    swatch: embroideredSwatch,
    look: embroideredLook,
    priceUSD: null,
    priceGBP: null,
    colors: [{ name: 'Emerald', hex: '#1F3A2A' }],
    sizes: SIZES,
    description: DESC,
    details: DETAILS,
    featured: true,
  },
  {
    id: 'riviera-geo',
    name: 'Riviera Geo Print',
    category: 'Statement',
    pattern: 'geometric',
    swatch: geometricSwatch,
    look: geometricLook,
    priceUSD: null,
    priceGBP: null,
    colors: [{ name: 'Ivory', hex: '#ECE8E2' }],
    sizes: SIZES,
    description: DESC,
    details: DETAILS,
    featured: true,
  },
];

export const CATEGORIES: Category[] = ['Formal', 'Casual', 'Statement'];

// The three shirt lines, each with its own page at /shirts/<slug>
export const LINES: { slug: string; category: Category; title: string; intro: string }[] = [
  { slug: 'formal', category: 'Formal', title: 'Formal Shirts', intro: 'Sharp, quiet and tailored for the office, the interview and the evening.' },
  { slug: 'casual', category: 'Casual', title: 'Casual Shirts', intro: 'Gingham, linen, denim and check for the days without a dress code.' },
  { slug: 'statement', category: 'Statement', title: 'Statement Shirts', intro: 'Prints and embroidery for the moments you want to be noticed.' },
];

export const getProduct = (id: string | undefined) => PRODUCTS.find((p) => p.id === id);
