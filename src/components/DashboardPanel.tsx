'use client';

import { NegotiationMessage } from '@/lib/types';

const ACTION_LABELS: Record<string, { label: string; color: string }> = {
  recommend: { label: 'Recommend', color: 'bg-blue-500/20 text-blue-400' },
  counteroffer: { label: 'Counter', color: 'bg-amber-500/20 text-amber-400' },
  educate: { label: 'Educate', color: 'bg-purple-500/20 text-purple-400' },
  retain: { label: 'Retain', color: 'bg-emerald-500/20 text-emerald-400' },
  accept: { label: 'Accept', color: 'bg-green-500/20 text-green-400' },
  decline: { label: 'Decline', color: 'bg-red-500/20 text-red-400' },
};

const STATUS_STYLES: Record<string, { label: string; color: string }> = {
  negotiating: { label: 'Negotiating', color: 'text-amber-400' },
  closed_sale: { label: 'Sale Closed', color: 'text-green-400' },
  lost_sale: { label: 'Sale Lost', color: 'text-red-400' },
  retained: { label: 'Customer Retained', color: 'text-blue-400' },
};

interface DashboardPanelProps {
  messages: NegotiationMessage[];
  isNegotiating: boolean;
}

export default function DashboardPanel({ messages, isNegotiating }: DashboardPanelProps) {
  const sellerMessages = messages.filter(m => m.role === 'seller' && m.sellerData);
  const latestSeller = sellerMessages[sellerMessages.length - 1]?.sellerData;

  return (
    <div className="flex flex-col h-full bg-[#0a0a0a] text-white">
      {/* Header */}
      <div className="px-6 py-4 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <h2 className="text-sm font-medium text-white/60 uppercase tracking-wider">
            Seller Agent Dashboard
          </h2>
        </div>
        {latestSeller && (
          <div className="flex items-center gap-4 mt-3">
            <div className={`text-xs font-medium ${STATUS_STYLES[latestSeller.deal_status]?.color || 'text-white/40'}`}>
              {STATUS_STYLES[latestSeller.deal_status]?.label || latestSeller.deal_status}
            </div>
            <div className="text-xs text-white/30">|</div>
            <div className="text-xs text-white/40">
              Margin: <span className="text-white/80">{latestSeller.effective_margin_percent}%</span>
            </div>
            {latestSeller.discount_offered > 0 && (
              <>
                <div className="text-xs text-white/30">|</div>
                <div className="text-xs text-white/40">
                  Discount: <span className="text-amber-400">{latestSeller.discount_offered}%</span>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Activity Feed */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages.length === 0 && !isNegotiating && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="text-white/20 text-sm">No active negotiations</div>
              <div className="text-white/10 text-xs mt-1">
                Activity will appear here when a negotiation starts
              </div>
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className="animate-fadeIn">
            {msg.role === 'seller' && msg.sellerData ? (
              <div className="space-y-2">
                {/* Seller reasoning card */}
                <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-gradient-to-br from-rose-500 to-orange-500 flex items-center justify-center text-[10px] font-bold">
                        S
                      </div>
                      <span className="text-xs font-medium text-white/50">Seller Agent</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {msg.sellerData.action && ACTION_LABELS[msg.sellerData.action] && (
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${ACTION_LABELS[msg.sellerData.action].color}`}>
                          {ACTION_LABELS[msg.sellerData.action].label}
                        </span>
                      )}
                      <span className="text-[10px] text-white/20">
                        R{Math.ceil((i + 1) / 2)}
                      </span>
                    </div>
                  </div>

                  {/* Internal Reasoning - the key insight */}
                  <div className="mb-3 p-3 rounded-md bg-white/[0.03] border-l-2 border-amber-500/40">
                    <div className="text-[10px] text-amber-500/60 uppercase tracking-wider mb-1 font-medium">
                      Internal Reasoning
                    </div>
                    <p className="text-xs text-white/60 leading-relaxed">
                      {msg.sellerData.internal_reasoning}
                    </p>
                  </div>

                  {/* Message to buyer */}
                  <p className="text-sm text-white/80 leading-relaxed">
                    {msg.sellerData.message}
                  </p>

                  {/* Metrics row */}
                  <div className="flex items-center gap-3 mt-3 pt-3 border-t border-white/[0.04]">
                    {msg.sellerData.products_discussed.length > 0 && (
                      <div className="flex items-center gap-1">
                        {msg.sellerData.products_discussed.map(p => (
                          <span key={p} className="text-[10px] px-1.5 py-0.5 rounded bg-white/[0.06] text-white/40 font-mono">
                            {p}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="ml-auto flex items-center gap-3">
                      <span className="text-[10px] text-white/30">
                        Margin {msg.sellerData.effective_margin_percent}%
                      </span>
                      {msg.sellerData.discount_offered > 0 && (
                        <span className="text-[10px] text-amber-400/60">
                          -{msg.sellerData.discount_offered}%
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Buyer message */
              <div className="rounded-lg border border-white/[0.04] bg-white/[0.01] p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-[10px] font-bold">
                    B
                  </div>
                  <span className="text-xs font-medium text-white/50">Buyer Agent</span>
                  <span className="text-[10px] text-white/20 ml-auto">
                    R{Math.ceil((i + 1) / 2)}
                  </span>
                </div>
                <p className="text-sm text-white/70 leading-relaxed">
                  {msg.content}
                </p>
              </div>
            )}
          </div>
        ))}

        {isNegotiating && (
          <div className="flex items-center gap-2 py-2">
            <div className="flex gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-white/30 animate-bounce [animation-delay:0ms]" />
              <div className="w-1.5 h-1.5 rounded-full bg-white/30 animate-bounce [animation-delay:150ms]" />
              <div className="w-1.5 h-1.5 rounded-full bg-white/30 animate-bounce [animation-delay:300ms]" />
            </div>
            <span className="text-xs text-white/30">Agents negotiating...</span>
          </div>
        )}
      </div>
    </div>
  );
}
