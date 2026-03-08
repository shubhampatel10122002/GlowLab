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
