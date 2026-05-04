"use client";

import type { ListingDraft } from "./wizard";

type Props = {
  draft: ListingDraft;
  updateDraft: (updates: Partial<ListingDraft>) => void;
  onNext: () => Promise<void>;
  onBack: () => void;
};

export function StepFinancials({ draft, updateDraft, onNext, onBack }: Props) {
  function updatePeriod(index: number, field: string, value: number) {
    const updated = [...draft.financials];
    updated[index] = { ...updated[index], [field]: value };

    // Auto-calculate gross profit and EBITDA
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
    // Save financials to DB
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
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-normal tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
          Financials
        </h2>
        <p className="mt-2 text-sm text-[var(--color-muted-foreground)]">
          Enter your income statement for the last 3 financial years. All figures in AUD.
        </p>
      </div>

      <div className="space-y-10">
        {draft.financials.map((period, i) => (
          <div key={period.year} className="space-y-4">
            <h3 className="text-sm font-medium uppercase tracking-wider text-[var(--color-muted)]">
              FY {period.year}
            </h3>

            <div className="grid grid-cols-2 gap-x-8 gap-y-4">
              <Field
                label="Revenue"
                value={period.revenue}
                onChange={(v) => updatePeriod(i, "revenue", v)}
              />
              <Field
                label="COGS"
                value={period.cogs}
                onChange={(v) => updatePeriod(i, "cogs", v)}
              />
              <Field
                label="Gross profit"
                value={period.gross_profit}
                onChange={(v) => updatePeriod(i, "gross_profit", v)}
                computed
              />
              <Field
                label="Operating expenses"
                value={period.opex}
                onChange={(v) => updatePeriod(i, "opex", v)}
              />
              <Field
                label="EBITDA"
                value={period.ebitda}
                onChange={(v) => updatePeriod(i, "ebitda", v)}
                computed
                highlight
              />
            </div>
          </div>
        ))}
      </div>

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

function Field({
  label,
  value,
  onChange,
  computed,
  highlight,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  computed?: boolean;
  highlight?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">
        {label}
        {computed && <span className="text-[var(--color-muted)] font-normal ml-1">(calculated)</span>}
      </label>
      <div className="relative">
        <span className="absolute left-0 top-3 text-[var(--color-muted)]">$</span>
        <input
          type="number"
          value={value || ""}
          onChange={(e) => onChange(parseInt(e.target.value) || 0)}
          className={`w-full border-b bg-transparent py-3 pl-4 text-base outline-none transition-colors placeholder:text-[var(--color-muted)] focus:border-[var(--color-foreground)] ${
            highlight
              ? "border-[var(--color-foreground)] font-medium"
              : "border-[var(--color-border)]"
          }`}
        />
      </div>
    </div>
  );
}
