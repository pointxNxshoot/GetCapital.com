"use client";

import type { ListingDraft } from "./wizard";

type Props = {
  draft: ListingDraft;
  updateDraft: (updates: Partial<ListingDraft>) => void;
  onNext: () => void;
  onBack: () => void;
};

export function StepPrivate({ draft, updateDraft, onNext, onBack }: Props) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-normal tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
          Private details
        </h2>
        <p className="mt-2 text-sm text-[var(--color-muted-foreground)]">
          This information is only visible to approved buyers. Be candid — it builds trust.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Detailed description</label>
          <textarea
            value={draft.description_private}
            onChange={(e) => updateDraft({ description_private: e.target.value })}
            placeholder="The full story — operations, customers, competitive position, growth opportunities, risks. This is what serious buyers read."
            rows={6}
            className="w-full border border-[var(--color-border)] bg-white p-3 text-base outline-none transition-colors placeholder:text-[var(--color-muted)] focus:border-[var(--color-foreground)] resize-none cursor-text"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Reason for sale</label>
          <textarea
            value={draft.reason_for_sale}
            onChange={(e) => updateDraft({ reason_for_sale: e.target.value })}
            placeholder="e.g. Relocating to Melbourne, retiring, pursuing a new venture"
            rows={2}
            className="w-full border border-[var(--color-border)] bg-white p-3 text-base outline-none transition-colors placeholder:text-[var(--color-muted)] focus:border-[var(--color-foreground)] resize-none cursor-text"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">What&apos;s included in the sale</label>
          <textarea
            value={draft.inclusions}
            onChange={(e) => updateDraft({ inclusions: e.target.value })}
            placeholder="e.g. All equipment, existing inventory, lease assignment, customer database, brand/IP, training period"
            rows={3}
            className="w-full border border-[var(--color-border)] bg-white p-3 text-base outline-none transition-colors placeholder:text-[var(--color-muted)] focus:border-[var(--color-foreground)] resize-none cursor-text"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Deal structure preference</label>
          <select
            value={draft.deal_structure}
            onChange={(e) => updateDraft({ deal_structure: e.target.value })}
            className="w-full border-b border-[var(--color-border)] bg-white py-3 text-base outline-none transition-colors focus:border-[var(--color-foreground)] cursor-pointer"
          >
            <option value="">No preference</option>
            <option value="asset_sale">Asset sale</option>
            <option value="share_sale">Share sale</option>
            <option value="flexible">Flexible</option>
          </select>
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <button
          onClick={onBack}
          className="text-sm text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] transition-colors"
        >
          Back
        </button>
        <button
          onClick={onNext}
          className="rounded-full bg-[var(--color-foreground)] px-10 py-3 text-base font-medium text-[var(--color-background)] transition-all hover:bg-[var(--color-foreground)]/90"
        >
          Save &amp; continue
        </button>
      </div>
    </div>
  );
}
