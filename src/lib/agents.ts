import { BUYER_SYSTEM_PROMPT, buildSellerSystemPrompt } from './prompts';
import { SellerResponse, NegotiationMessage, Product, BrandPolicies } from './types';

const MISTRAL_API_URL = 'https://api.mistral.ai/v1/chat/completions';
const SELLER_MODEL = 'mistral-large-latest';
const BUYER_MODEL = 'mistral-small-latest';

interface MistralMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

async function callMistral(
  apiKey: string,
  model: string,
  messages: MistralMessage[]
): Promise<string> {
  const response = await fetch(MISTRAL_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.7,
      max_tokens: 1024,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Mistral API error (${response.status}): ${error}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

function parseSellerResponse(text: string): SellerResponse {
  let jsonStr = text;

  const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (jsonMatch) {
    jsonStr = jsonMatch[1].trim();
  }

  const objMatch = jsonStr.match(/\{[\s\S]*\}/);
  if (objMatch) {
    jsonStr = objMatch[0];
  }

  try {
    return JSON.parse(jsonStr);
  } catch {
    return {
      message: text,
      internal_reasoning: 'Response was not in expected JSON format.',
      action: 'recommend',
      products_discussed: [],
      discount_offered: 0,
      effective_margin_percent: 0,
      deal_status: 'negotiating',
    };
  }
}

export async function callSellerAgent(
  apiKey: string,
  conversationHistory: NegotiationMessage[],
  products: Product[],
  policies: BrandPolicies
): Promise<SellerResponse> {
  const sellerPrompt = buildSellerSystemPrompt(products, policies);
  const messages: MistralMessage[] = [
    { role: 'system', content: sellerPrompt },
  ];

  for (const msg of conversationHistory) {
    messages.push({
      role: msg.role === 'buyer' ? 'user' : 'assistant',
      content: msg.role === 'seller' && msg.sellerData
        ? JSON.stringify(msg.sellerData)
        : msg.content,
    });
  }

  const response = await callMistral(apiKey, SELLER_MODEL, messages);
  return parseSellerResponse(response);
}

export async function callBuyerAgent(
  apiKey: string,
  userRequest: string,
  conversationHistory: NegotiationMessage[],
  isFirstMessage: boolean,
  isFinalSummary: boolean
): Promise<string> {
  const messages: MistralMessage[] = [
    { role: 'system', content: BUYER_SYSTEM_PROMPT },
  ];

  if (isFirstMessage) {
    messages.push({
      role: 'user',
      content: `The user wants: "${userRequest}"\n\nPlease create an opening message to send to the seller agent. Be direct, state the user's needs, budget (if mentioned), and preferences. Keep it concise.`,
    });
  } else if (isFinalSummary) {
    const lastSellerMsg = conversationHistory
      .filter(m => m.role === 'seller')
      .pop();

    messages.push({
      role: 'user',
      content: `The user originally asked: "${userRequest}"\n\nHere's the full negotiation history:\n${conversationHistory.map(m => `${m.role.toUpperCase()}: ${m.content}`).join('\n\n')}\n\nThe negotiation has concluded. The seller's final response was:\n${JSON.stringify(lastSellerMsg?.sellerData)}\n\nPlease summarize the outcome for the user in a friendly, helpful way. Include: what was recommended, original price, final price (if discounted), and why this product works for them. Be concise but warm.`,
    });
  } else {
    const lastSellerMsg = conversationHistory
      .filter(m => m.role === 'seller')
      .pop();

    messages.push({
      role: 'user',
      content: `The user originally asked: "${userRequest}"\n\nHere's the negotiation so far:\n${conversationHistory.map(m => `${m.role.toUpperCase()}: ${m.content}`).join('\n\n')}\n\nThe seller's latest response (JSON):\n${JSON.stringify(lastSellerMsg?.sellerData)}\n\nEvaluate this offer. Is it a good deal for the user? Should you accept, push back, or ask more questions? Respond with your next message to the seller. If the deal is good, explicitly say you accept.`,
    });
  }

  return await callMistral(apiKey, BUYER_MODEL, messages);
}

export async function runNegotiation(
  apiKey: string,
  userRequest: string,
  products: Product[],
  policies: BrandPolicies,
  onMessage: (msg: NegotiationMessage) => void,
  onComplete: (summary: string) => void,
  onError: (error: string) => void
): Promise<void> {
  const maxRounds = 5;
  const history: NegotiationMessage[] = [];

  try {
    // Round 1: Buyer creates opening message
    const buyerOpening = await callBuyerAgent(apiKey, userRequest, history, true, false);
    const buyerMsg: NegotiationMessage = {
      role: 'buyer',
      content: buyerOpening,
      timestamp: new Date(),
    };
    history.push(buyerMsg);
    onMessage(buyerMsg);

    for (let round = 0; round < maxRounds; round++) {
      // Seller responds
      const sellerResponse = await callSellerAgent(apiKey, history, products, policies);
      const sellerMsg: NegotiationMessage = {
        role: 'seller',
        content: sellerResponse.message,
        sellerData: sellerResponse,
        timestamp: new Date(),
      };
      history.push(sellerMsg);
      onMessage(sellerMsg);

      // Check if negotiation is complete
      if (sellerResponse.deal_status !== 'negotiating') {
        break;
      }

      // Buyer evaluates and responds
      if (round < maxRounds - 1) {
        const buyerReply = await callBuyerAgent(apiKey, userRequest, history, false, false);

        const isAccepting = buyerReply.toLowerCase().includes('accept') &&
          (buyerReply.toLowerCase().includes('deal') || buyerReply.toLowerCase().includes('offer'));

        const buyerReplyMsg: NegotiationMessage = {
          role: 'buyer',
          content: buyerReply,
          timestamp: new Date(),
        };
        history.push(buyerReplyMsg);
        onMessage(buyerReplyMsg);

        if (isAccepting) {
          const finalSeller = await callSellerAgent(apiKey, history, products, policies);
          const finalSellerMsg: NegotiationMessage = {
            role: 'seller',
            content: finalSeller.message,
            sellerData: finalSeller,
            timestamp: new Date(),
          };
          history.push(finalSellerMsg);
          onMessage(finalSellerMsg);
          break;
        }
      }
    }

    // Generate summary for user
    const summary = await callBuyerAgent(apiKey, userRequest, history, false, true);
    onComplete(summary);
  } catch (error) {
    onError(error instanceof Error ? error.message : 'An unexpected error occurred');
  }
}
