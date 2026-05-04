"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { ListingDraft } from "./wizard";

const AU_STATES = ["ACT", "NSW", "NT", "QLD", "SA", "TAS", "VIC", "WA"];

type Props = {
  draft: ListingDraft;
  updateDraft: (updates: Partial<ListingDraft>) => void;
  onNext: () => void;
};

type Industry = { industry_code: string; display_name: string; parent_code: string | null };

export function StepBasics({ draft, updateDraft, onNext }: Props) {
  const [industries, setIndustries] = useState<Industry[]>([]);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data } = await supabase
        .from("industry_taxonomy")
        .select("industry_code, display_name, parent_code")
        .eq("is_active", true)
        .order("display_name");
      if (data) setIndustries(data);
    }
    load();
  }, []);

  const canProceed = draft.title.trim() && draft.location.trim() && draft.asking_price > 0;

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
              const selected = industries.find((i) => i.industry_code === e.target.value);
              updateDraft({
                industry_code: e.target.value,
                industry: selected?.display_name || "",
              });
            }}
            className="w-full border-b border-[var(--color-border)] bg-transparent py-3 text-base outline-none transition-colors focus:border-[var(--color-foreground)]"
          >
            <option value="">Select an industry</option>
            {industries.filter((i) => !i.parent_code).map((parent) => (
              <optgroup key={parent.industry_code} label={parent.display_name}>
                {industries
                  .filter((i) => i.parent_code === parent.industry_code)
                  .map((child) => (
                    <option key={child.industry_code} value={child.industry_code}>
                      {child.display_name}
                    </option>
                  ))}
                {/* If no children, show parent as option */}
                {!industries.some((i) => i.parent_code === parent.industry_code) && (
                  <option value={parent.industry_code}>{parent.display_name}</option>
                )}
              </optgroup>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Location (state)</label>
          <select
            value={draft.location}
            onChange={(e) => updateDraft({ location: e.target.value })}
            className="w-full border-b border-[var(--color-border)] bg-transparent py-3 text-base outline-none transition-colors focus:border-[var(--color-foreground)]"
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
            className="w-full border border-[var(--color-border)] bg-transparent p-3 text-base outline-none transition-colors placeholder:text-[var(--color-muted)] focus:border-[var(--color-foreground)] resize-none"
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
