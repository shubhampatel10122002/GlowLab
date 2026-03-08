'use client';

import { BrandPolicies } from '@/lib/types';

interface PoliciesPanelProps {
  policies: BrandPolicies;
  onUpdate: (policies: BrandPolicies) => void;
}

export default function PoliciesPanel({ policies, onUpdate }: PoliciesPanelProps) {
  const update = (field: keyof BrandPolicies, value: string | number) => {
    onUpdate({ ...policies, [field]: value });
  };

  return (
    <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
      {/* Discount Rules */}
      <div>
        <h3 className="text-xs font-medium text-white/50 uppercase tracking-wider mb-3">
          Discount Rules
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-lg border border-white/[0.06] bg-white/[0.02]">
            <div>
              <p className="text-sm text-white/70">Max single product discount</p>
              <p className="text-[10px] text-white/25 mt-0.5">Applied when buyer purchases one item</p>
            </div>
            <div className="flex items-center gap-1.5">
              <input
                type="number"
                value={policies.maxSingleDiscount}
                onChange={e => update('maxSingleDiscount', Number(e.target.value))}
                className="w-16 bg-white/[0.04] border border-white/[0.08] rounded px-2 py-1.5 text-sm text-white text-right focus:outline-none focus:border-white/20"
              />
              <span className="text-xs text-white/30">%</span>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg border border-white/[0.06] bg-white/[0.02]">
            <div>
              <p className="text-sm text-white/70">Max bundle discount</p>
              <p className="text-[10px] text-white/25 mt-0.5">Applied when buyer purchases 2+ items</p>
            </div>
            <div className="flex items-center gap-1.5">
              <input
                type="number"
                value={policies.maxBundleDiscount}
                onChange={e => update('maxBundleDiscount', Number(e.target.value))}
                className="w-16 bg-white/[0.04] border border-white/[0.08] rounded px-2 py-1.5 text-sm text-white text-right focus:outline-none focus:border-white/20"
              />
              <span className="text-xs text-white/30">%</span>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg border border-white/[0.06] bg-white/[0.02]">
            <div>
              <p className="text-sm text-white/70">Minimum margin floor</p>
              <p className="text-[10px] text-white/25 mt-0.5">Agent will never sell below this margin</p>
            </div>
            <div className="flex items-center gap-1.5">
              <input
                type="number"
                value={policies.minMarginPercent}
                onChange={e => update('minMarginPercent', Number(e.target.value))}
                className="w-16 bg-white/[0.04] border border-white/[0.08] rounded px-2 py-1.5 text-sm text-white text-right focus:outline-none focus:border-white/20"
              />
              <span className="text-xs text-white/30">%</span>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg border border-white/[0.06] bg-white/[0.02]">
            <div>
              <p className="text-sm text-white/70">Free shipping value</p>
              <p className="text-[10px] text-white/25 mt-0.5">Offered as a negotiation sweetener</p>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-white/30">$</span>
              <input
                type="number"
                value={policies.freeShippingValue}
                onChange={e => update('freeShippingValue', Number(e.target.value))}
                className="w-16 bg-white/[0.04] border border-white/[0.08] rounded px-2 py-1.5 text-sm text-white text-right focus:outline-none focus:border-white/20"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Competitor Policy */}
      <div>
        <h3 className="text-xs font-medium text-white/50 uppercase tracking-wider mb-3">
          Competitor Policy
        </h3>
        <textarea
          value={policies.competitorPolicy}
          onChange={e => update('competitorPolicy', e.target.value)}
          rows={4}
          className="w-full bg-white/[0.03] border border-white/[0.06] rounded-lg px-3 py-2.5 text-sm text-white/70 focus:outline-none focus:border-white/15 resize-none leading-relaxed"
        />
      </div>

      {/* Return Policy */}
      <div>
        <h3 className="text-xs font-medium text-white/50 uppercase tracking-wider mb-3">
          Return & Complaint Policy
        </h3>
        <textarea
          value={policies.returnPolicy}
          onChange={e => update('returnPolicy', e.target.value)}
          rows={4}
          className="w-full bg-white/[0.03] border border-white/[0.06] rounded-lg px-3 py-2.5 text-sm text-white/70 focus:outline-none focus:border-white/15 resize-none leading-relaxed"
        />
      </div>

      {/* Negotiation Style */}
      <div>
        <h3 className="text-xs font-medium text-white/50 uppercase tracking-wider mb-3">
          Negotiation Style
        </h3>
        <textarea
          value={policies.negotiationStyle}
          onChange={e => update('negotiationStyle', e.target.value)}
          rows={4}
          className="w-full bg-white/[0.03] border border-white/[0.06] rounded-lg px-3 py-2.5 text-sm text-white/70 focus:outline-none focus:border-white/15 resize-none leading-relaxed"
        />
      </div>

      <div className="pb-4">
        <p className="text-[10px] text-white/15 text-center">
          Changes apply instantly to the next negotiation
        </p>
      </div>
    </div>
  );
}
