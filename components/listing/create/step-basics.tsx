"use client";

import type { ListingDraft } from "./wizard";

const AU_STATES = ["ACT", "NSW", "NT", "QLD", "SA", "TAS", "VIC", "WA"];

const INDUSTRIES = [
  { value: "cafe", label: "Cafés & Coffee Shops" },
  { value: "restaurant", label: "Restaurants & Hospitality" },
  { value: "retail", label: "Retail Store" },
  { value: "ecommerce", label: "E-commerce Business" },
  { value: "professional_services", label: "Professional Services" },
  { value: "trades", label: "Trades & Construction Services" },
  { value: "health_wellness", label: "Health & Wellness" },
  { value: "saas", label: "SaaS / Software" },
  { value: "manufacturing", label: "Manufacturing & Wholesale" },
  { value: "beauty", label: "Beauty & Personal Care" },
  { value: "other", label: "Other (specify below)" },
];

type Props = {
  draft: ListingDraft;
  updateDraft: (updates: Partial<ListingDraft>) => void;
  onNext: () => void;
};

export function StepBasics({ draft, updateDraft, onNext }: Props) {
  const selectedIndustry = INDUSTRIES.find((i) => i.value === draft.industry_code);
  const canProceed =
    draft.title.trim() &&
    draft.industry_code &&
    (draft.industry_code !== "other" || (draft.industry || "").trim()) &&
    draft.location.trim() &&
    draft.asking_price > 0;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-normal tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
          Business basics
        </h2>
        <p className="mt-2 text-sm text-[var(--color-muted-foreground)]">
          Start with the essentials. You can always edit these later.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Business name</label>
          <input
            type="text"
            value={draft.title}
            onChange={(e) => updateDraft({ title: e.target.value })}
            placeholder="e.g. Brew Haven Coffee"
            className="w-full border-b border-[var(--color-border)] bg-transparent py-3 text-base outline-none transition-colors placeholder:text-[var(--color-muted)] focus:border-[var(--color-foreground)]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Industry</label>
          <select
            value={draft.industry_code}
            onChange={(e) => {
              const val = e.target.value;
              const selected = INDUSTRIES.find((i) => i.value === val);
              updateDraft({
                industry_code: val,
                industry: val === "other" ? draft.industry : (selected?.label || ""),
              });
            }}
            className="w-full border-b border-[var(--color-border)] bg-white py-3 text-base outline-none transition-colors focus:border-[var(--color-foreground)] cursor-pointer"
          >
            <option value="">Select an industry</option>
            {INDUSTRIES.map((i) => (
              <option key={i.value} value={i.value}>{i.label}</option>
            ))}
          </select>

          {draft.industry_code === "other" && (
            <input
              type="text"
              value={draft.industry}
              onChange={(e) => updateDraft({ industry: e.target.value })}
              placeholder="Please specify your industry"
              className="w-full border-b border-[var(--color-border)] bg-transparent py-3 mt-3 text-base outline-none transition-colors placeholder:text-[var(--color-muted)] focus:border-[var(--color-foreground)]"
            />
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Location (state)</label>
          <select
            value={draft.location}
            onChange={(e) => updateDraft({ location: e.target.value })}
            className="w-full border-b border-[var(--color-border)] bg-white py-3 text-base outline-none transition-colors focus:border-[var(--color-foreground)] cursor-pointer"
          >
            <option value="">Select a state</option>
            {AU_STATES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Asking price (AUD)</label>
          <div className="relative">
            <span className="absolute left-0 top-3 text-[var(--color-muted)]">$</span>
            <input
              type="number"
              value={draft.asking_price || ""}
              onChange={(e) => updateDraft({ asking_price: parseInt(e.target.value) || 0 })}
              placeholder="500000"
              className="w-full border-b border-[var(--color-border)] bg-transparent py-3 pl-4 text-base outline-none transition-colors placeholder:text-[var(--color-muted)] focus:border-[var(--color-foreground)]"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Public description
            <span className="text-[var(--color-muted)] font-normal ml-2">
              ({draft.description_public.length}/200)
            </span>
          </label>
          <textarea
            value={draft.description_public}
            onChange={(e) => updateDraft({ description_public: e.target.value.slice(0, 200) })}
            placeholder="A short teaser visible to everyone browsing the marketplace."
            rows={3}
            maxLength={200}
            className="w-full border border-[var(--color-border)] bg-white p-3 text-base outline-none transition-colors placeholder:text-[var(--color-muted)] focus:border-[var(--color-foreground)] resize-none cursor-text"
          />
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button
          onClick={onNext}
          disabled={!canProceed}
          className="rounded-full bg-[var(--color-foreground)] px-10 py-3 text-base font-medium text-[var(--color-background)] transition-all hover:bg-[var(--color-foreground)]/90 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Save &amp; continue
        </button>
      </div>
    </div>
  );
}
