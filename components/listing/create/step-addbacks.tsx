"use client";

import type { ListingDraft } from "./wizard";

type Props = {
  draft: ListingDraft;
  updateDraft: (updates: Partial<ListingDraft>) => void;
  onNext: () => Promise<void>;
  onBack: () => void;
};

const CATEGORIES = [
  { value: "owner_compensation", label: "Owner compensation" },
  { value: "personal_expense", label: "Personal expense" },
  { value: "non_recurring", label: "Non-recurring" },
  { value: "other", label: "Other" },
];

export function StepAddbacks({ draft, updateDraft, onNext, onBack }: Props) {
  function addRow() {
    updateDraft({
      addbacks: [...draft.addbacks, { description: "", amount: 0, category: "owner_compensation" }],
    });
  }

  function updateRow(index: number, field: string, value: string | number) {
    const updated = [...draft.addbacks];
    updated[index] = { ...updated[index], [field]: value };
    updateDraft({ addbacks: updated });
  }

  function removeRow(index: number) {
    updateDraft({ addbacks: draft.addbacks.filter((_, i) => i !== index) });
  }

  const total = draft.addbacks.reduce((sum, a) => sum + (a.amount || 0), 0);

  async function handleNext() {
    if (draft.id && draft.addbacks.length > 0) {
      await fetch("/api/listings/addbacks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listing_id: draft.id, addbacks: draft.addbacks }),
      });
    }
    await onNext();
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-normal tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
          EBITDA addbacks
        </h2>
        <p className="mt-2 text-sm text-[var(--color-muted-foreground)]">
          Adjustments to normalise earnings — owner salary above market rate, one-off expenses, personal costs run through the business.
        </p>
      </div>

      {draft.addbacks.length > 0 && (
        <div className="space-y-4">
          {draft.addbacks.map((addback, i) => (
            <div key={i} className="grid grid-cols-12 gap-4 items-end">
              <div className="col-span-5">
                {i === 0 && <label className="block text-sm font-medium mb-1">Description</label>}
                <input
                  type="text"
                  value={addback.description}
                  onChange={(e) => updateRow(i, "description", e.target.value)}
                  placeholder="e.g. Owner salary above market"
                  className="w-full border-b border-[var(--color-border)] bg-transparent py-2 text-sm outline-none focus:border-[var(--color-foreground)]"
                />
              </div>
              <div className="col-span-3">
                {i === 0 && <label className="block text-sm font-medium mb-1">Category</label>}
                <select
                  value={addback.category}
                  onChange={(e) => updateRow(i, "category", e.target.value)}
                  className="w-full border-b border-[var(--color-border)] bg-transparent py-2 text-sm outline-none focus:border-[var(--color-foreground)]"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>
              <div className="col-span-3">
                {i === 0 && <label className="block text-sm font-medium mb-1">Amount (AUD)</label>}
                <div className="relative">
                  <span className="absolute left-0 top-2 text-[var(--color-muted)] text-sm">$</span>
                  <input
                    type="number"
                    value={addback.amount || ""}
                    onChange={(e) => updateRow(i, "amount", parseInt(e.target.value) || 0)}
                    className="w-full border-b border-[var(--color-border)] bg-transparent py-2 pl-4 text-sm outline-none focus:border-[var(--color-foreground)]"
                  />
                </div>
              </div>
              <div className="col-span-1">
                <button
                  onClick={() => removeRow(i)}
                  className="text-[var(--color-muted)] hover:text-red-600 transition-colors text-lg"
                >
                  &times;
                </button>
              </div>
            </div>
          ))}

          {total > 0 && (
            <div className="border-t border-[var(--color-border)] pt-4 flex justify-between text-sm font-medium">
              <span>Total addbacks</span>
              <span>${total.toLocaleString()}</span>
            </div>
          )}
        </div>
      )}

      <button
        onClick={addRow}
        className="text-sm font-medium text-[var(--color-foreground)] border border-[var(--color-border)] px-6 py-2 hover:bg-[var(--color-foreground)] hover:text-[var(--color-background)] transition-colors"
      >
        + Add adjustment
      </button>

      <div className="flex justify-between pt-4">
        <button
          onClick={onBack}
          className="text-sm text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] transition-colors"
        >
          Back
        </button>
        <button
          onClick={handleNext}
          className="rounded-full bg-[var(--color-foreground)] px-10 py-3 text-base font-medium text-[var(--color-background)] transition-all hover:bg-[var(--color-foreground)]/90"
        >
          Save &amp; continue
        </button>
      </div>
    </div>
  );
}
