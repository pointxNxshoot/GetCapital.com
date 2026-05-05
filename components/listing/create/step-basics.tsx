"use client";

import type { ListingDraft } from "./wizard";
import { WizardInput, WizardSelect, WizardTextarea, CurrencyInput, WizardStepHeading, WizardActions } from "./form-fields";

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
  const canProceed =
    draft.title.trim() &&
    draft.industry_code &&
    (draft.industry_code !== "other" || (draft.industry || "").trim()) &&
    draft.location.trim() &&
    draft.asking_price > 0;

  return (
    <div>
      <WizardStepHeading
        title="Business basics"
        description="Start with the essentials. You can always edit these later."
      />

      <div className="space-y-8">
        <WizardInput
          label="Business name"
          value={draft.title}
          onChange={(e) => updateDraft({ title: e.target.value })}
          placeholder="e.g. Brew Haven Coffee"
        />

        <WizardSelect
          label="Industry"
          value={draft.industry_code}
          onChange={(e) => {
            const val = e.target.value;
            const selected = INDUSTRIES.find((i) => i.value === val);
            updateDraft({
              industry_code: val,
              industry: val === "other" ? draft.industry : (selected?.label || ""),
            });
          }}
        >
          <option value="">Select an industry</option>
          {INDUSTRIES.map((i) => (
            <option key={i.value} value={i.value}>{i.label}</option>
          ))}
        </WizardSelect>

        {draft.industry_code === "other" && (
          <WizardInput
            label="Specify your industry"
            value={draft.industry}
            onChange={(e) => updateDraft({ industry: e.target.value })}
            placeholder="e.g. Specialty grain mill"
          />
        )}

        <WizardSelect
          label="Location"
          value={draft.location}
          onChange={(e) => updateDraft({ location: e.target.value })}
          helperText="The state where the business primarily operates."
        >
          <option value="">Select a state</option>
          {AU_STATES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </WizardSelect>

        <CurrencyInput
          label="Asking price"
          value={draft.asking_price}
          onChange={(v) => updateDraft({ asking_price: v })}
          helperText="The total price you're seeking for the business."
        />

        <WizardTextarea
          label="Public description"
          value={draft.description_public}
          onChange={(e) => updateDraft({ description_public: e.target.value.slice(0, 200) })}
          placeholder="A short teaser visible to everyone browsing the marketplace."
          rows={3}
          maxLength={200}
          charCount={{ current: draft.description_public.length, max: 200 }}
          helperText="This appears on the listing card. Keep it concise and compelling."
        />
      </div>

      <WizardActions onNext={onNext} disabled={!canProceed} />
    </div>
  );
}
