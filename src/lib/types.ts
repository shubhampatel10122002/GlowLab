export interface SellerResponse {
  message: string;
  internal_reasoning: string;
  action: 'recommend' | 'counteroffer' | 'educate' | 'retain' | 'accept' | 'decline';
  products_discussed: string[];
  discount_offered: number;
  effective_margin_percent: number;
  deal_status: 'negotiating' | 'closed_sale' | 'lost_sale' | 'retained';
}

export interface NegotiationMessage {
  role: 'buyer' | 'seller';
  content: string;
  sellerData?: SellerResponse;
  timestamp: Date;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface NegotiationState {
  status: 'idle' | 'negotiating' | 'complete';
  messages: NegotiationMessage[];
  round: number;
  maxRounds: number;
  finalResult?: SellerResponse;
}

export interface Product {
  id: string;
  name: string;
  size: string;
  price: number;
  cost: number;
  ingredients: string;
  targets: string;
  notes: string;
  image: string;
}

export interface BrandPolicies {
  maxSingleDiscount: number;
  maxBundleDiscount: number;
  minMarginPercent: number;
  freeShippingValue: number;
  competitorPolicy: string;
  returnPolicy: string;
  negotiationStyle: string;
}

export const DEFAULT_PRODUCTS: Product[] = [
  {
    id: 'GL01',
    name: 'Vitamin C Brightening Serum',
    size: '30ml',
    price: 62,
    cost: 15,
    ingredients: '20% L-ascorbic acid (most brands use 10-15%), ferulic acid, vitamin E',
    targets: 'dullness, dark spots, uneven tone, early aging',
    notes: 'Also provides antioxidant protection — pairs perfectly with SPF',
    image: 'https://m.media-amazon.com/images/I/8176OyTS5DL.jpg',
  },
  {
    id: 'GL02',
    name: 'Hyaluronic Acid Moisturizer',
    size: '50ml',
    price: 48,
    cost: 14,
    ingredients: 'Triple-weight hyaluronic acid (surface + deep hydration)',
    targets: 'dryness, dehydration, fine lines from moisture loss',
    notes: 'Lightweight, layers well under anything',
    image: 'https://m.media-amazon.com/images/I/8176OyTS5DL.jpg',
  },
  {
    id: 'GL03',
    name: 'Retinol Night Cream',
    size: '50ml',
    price: 55,
    cost: 18,
    ingredients: '0.5% encapsulated retinol + squalane + ceramides',
    targets: 'wrinkles, fine lines, skin renewal, anti-aging',
    notes: 'Encapsulated = slow release = less irritation. Causes purging in first 1-3 weeks (normal). Users MUST wear SPF. Doubles as night moisturizer.',
    image: 'https://m.media-amazon.com/images/I/8176OyTS5DL.jpg',
  },
  {
    id: 'GL04',
    name: 'SPF 50 Daily Sunscreen',
    size: '40ml',
    price: 38,
    cost: 12,
    ingredients: 'Mineral SPF 50, no white cast, lightweight',
    targets: 'UV protection, preventing dark spots, anti-aging prevention',
    notes: 'Essential with any active (retinol, vitamin C, AHA/BHA)',
    image: 'https://m.media-amazon.com/images/I/8176OyTS5DL.jpg',
  },
  {
    id: 'GL05',
    name: 'Niacinamide Pore Serum',
    size: '30ml',
    price: 44,
    cost: 13,
    ingredients: '10% niacinamide + zinc PCA',
    targets: 'large pores, oiliness, texture, redness',
    notes: 'HIDDEN BENEFIT: Clinically proven to improve fine lines, boost collagen, and improve skin elasticity — a legitimate anti-aging product even though marketed as a pore serum.',
    image: 'https://m.media-amazon.com/images/I/8176OyTS5DL.jpg',
  },
  {
    id: 'GL06',
    name: 'Peptide Eye Cream',
    size: '15ml',
    price: 52,
    cost: 16,
    ingredients: 'Matrixyl 3000 + caffeine + vitamin K',
    targets: 'under-eye wrinkles, puffiness, dark circles',
    notes: '',
    image: 'https://m.media-amazon.com/images/I/8176OyTS5DL.jpg',
  },
  {
    id: 'GL07',
    name: 'Gentle Foam Cleanser',
    size: '150ml',
    price: 28,
    cost: 7,
    ingredients: 'Amino acid-based, pH 5.5',
    targets: 'daily cleansing without stripping',
    notes: 'Foundation of any routine — cheapest product, easiest entry point',
    image: 'https://m.media-amazon.com/images/I/8176OyTS5DL.jpg',
  },
  {
    id: 'GL08',
    name: 'AHA/BHA Exfoliating Toner',
    size: '120ml',
    price: 36,
    cost: 10,
    ingredients: '5% glycolic acid + 1% salicylic acid',
    targets: 'dullness, texture, clogged pores, blackheads',
    notes: 'Use 2-3x per week, not daily. Don\'t combine with retinol on same night.',
    image: 'https://m.media-amazon.com/images/I/8176OyTS5DL.jpg',
  },
  {
    id: 'GL09',
    name: 'Bakuchiol Anti-Aging Serum',
    size: '30ml',
    price: 68,
    cost: 20,
    ingredients: 'Bakuchiol (plant-based retinol alternative) + rosehip oil',
    targets: 'anti-aging, fine lines, firmness — WITHOUT irritation',
    notes: 'Perfect for sensitive skin or bad retinol experiences. No purging, no sun sensitivity.',
    image: 'https://m.media-amazon.com/images/I/8176OyTS5DL.jpg',
  },
  {
    id: 'GL10',
    name: 'Overnight Recovery Mask',
    size: '75ml',
    price: 58,
    cost: 17,
    ingredients: 'Centella asiatica + madecassoside + honey extract',
    targets: 'damaged barrier, redness, recovery from over-exfoliation',
    notes: '',
    image: 'https://m.media-amazon.com/images/I/8176OyTS5DL.jpg',
  },
];

export const DEFAULT_POLICIES: BrandPolicies = {
  maxSingleDiscount: 15,
  maxBundleDiscount: 20,
  minMarginPercent: 40,
  freeShippingValue: 8,
  competitorPolicy: 'Never badmouth competitors. Acknowledge respectfully, then explain differentiators: higher concentrations, cleaner formulations, dermatologist-tested, cruelty-free, small-batch manufacturing. Reframe value — our products often REPLACE multiple cheaper products.',
  returnPolicy: 'Accept returns no questions asked. But first ask diagnostic questions (how long used? what else using? wearing SPF?). If usage problem, educate gently. Offer product swap at 20% off for retention. Free sample of complementary product can be offered.',
  negotiationStyle: 'Educate first, sell second. You are NOT a discount machine. When someone can\'t afford a product, find a cheaper one that genuinely addresses their concern using hidden benefits. Only offer discount AFTER making the value argument.',
};
