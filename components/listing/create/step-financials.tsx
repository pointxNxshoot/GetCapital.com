"use client";

import type { ListingDraft } from "./wizard";
import { CurrencyInput, WizardStepHeading, WizardActions } from "./form-fields";

type Props = {
  draft: ListingDraft;
  updateDraft: (updates: Partial<ListingDraft>) => void;
  onNext: () => Promise<void>;
  onBack: () => void;
};

const YEAR_LABELS = ["Most recent", "Previous year", "Two years ago"];

export function StepFinancials({ draft, updateDraft, onNext, onBack }: Props) {
  function updatePeriod(index: number, field: string, value: number) {
    const updated = [...draft.financials];
    updated[index] = { ...updated[index], [field]: value };

    if (field === "revenue" || field === "cogs") {
      updated[index].gross_profit = updated[index].revenue - Math.abs(updated[index].cogs);
    }
    if (field === "revenue" || field === "cogs" || field === "opex") {
      updated[index].ebitda =
        updated[index].revenue - Math.abs(updated[index].cogs) - Math.abs(updated[index].opex);
    }

    updateDraft({ financials: updated });
  }

  async function handleNext() {
    if (draft.id) {
      await fetch("/api/listings/financials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listing_id: draft.id, periods: draft.financials }),
      });
    }
    await onNext();
  }

  return (
    <div>
      <WizardStepHeading
        title="Financials"
        description="Enter your income statement for the last 3 financial years. All figures in AUD."
      />

      <div className="space-y-16">
        {draft.financials.map((period, i) => (
          <section key={period.year}>
            <div className="flex items-baseline justify-between mb-8 pb-4 border-b border-[var(--color-border)]">
              <h3
                className="text-2xl tracking-tight"
                style={{ fontFamily: "var(--font-display)" }}
              >
                FY {period.year}
              </h3>
              <span className="text-sm uppercase tracking-wider text-[var(--color-muted)]">
                {YEAR_LABELS[i]}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <CurrencyInput
                label="Revenue"
                value={period.revenue}
                onChange={(v) => updatePeriod(i, "revenue", v)}
              />
              <CurrencyInput
                label="COGS"
                value={period.cogs}
                onChange={(v) => updatePeriod(i, "cogs", v)}
              />
              <CurrencyInput
                label="Gross profit"
                value={period.gross_profit}
                onChange={(v) => updatePeriod(i, "gross_profit", v)}
                computed
              />
              <CurrencyInput
                label="Operating expenses"
                value={period.opex}
                onChange={(v) => updatePeriod(i, "opex", v)}
              />
              <CurrencyInput
                label="EBITDA"
                value={period.ebitda}
                onChange={(v) => updatePeriod(i, "ebitda", v)}
                computed
                highlight
              />
            </div>
          </section>
        ))}
      </div>

      <WizardActions onBack={onBack} onNext={handleNext} />
    </div>
  );
}
