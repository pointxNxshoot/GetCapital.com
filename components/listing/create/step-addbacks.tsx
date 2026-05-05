"use client";

import type { ListingDraft } from "./wizard";
import { WizardInput, WizardSelect, CurrencyInput, WizardStepHeading, WizardActions } from "./form-fields";

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
    <div>
      <WizardStepHeading
        title="EBITDA addbacks"
        description="Adjustments to normalise earnings — owner salary above market rate, one-off expenses, personal costs run through the business."
      />

      {draft.addbacks.length > 0 && (
        <div className="space-y-6">
          {draft.addbacks.map((addback, i) => (
            <div key={i} className="grid grid-cols-12 gap-4 items-end">
              <div className="col-span-12 sm:col-span-5">
                <WizardInput
                  label={i === 0 ? "Description" : ""}
                  value={addback.description}
                  onChange={(e) => updateRow(i, "description", e.target.value)}
                  placeholder="e.g. Owner salary above market"
                />
              </div>
              <div className="col-span-6 sm:col-span-3">
                <WizardSelect
                  label={i === 0 ? "Category" : ""}
                  value={addback.category}
                  onChange={(e) => updateRow(i, "category", e.target.value)}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </WizardSelect>
              </div>
              <div className="col-span-5 sm:col-span-3">
                <CurrencyInput
                  label={i === 0 ? "Amount" : ""}
                  value={addback.amount}
                  onChange={(v) => updateRow(i, "amount", v)}
                />
              </div>
              <div className="col-span-1 flex items-end pb-4">
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
            <div className="border-t border-[var(--color-border)] pt-4 flex justify-between text-base font-medium">
              <span>Total addbacks</span>
              <span>${total.toLocaleString("en-AU")}</span>
            </div>
          )}
        </div>
      )}

      <button
        onClick={addRow}
        className="mt-8 text-sm font-medium text-[var(--color-foreground)] border border-[var(--color-border)] px-6 py-3 hover:bg-[var(--color-foreground)] hover:text-[var(--color-background)] transition-colors"
      >
        + Add adjustment
      </button>

      <WizardActions onBack={onBack} onNext={handleNext} />
    </div>
  );
}
