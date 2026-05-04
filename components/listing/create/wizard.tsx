"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { StepBasics } from "./step-basics";
import { StepPhotos } from "./step-photos";
import { StepFinancials } from "./step-financials";
import { StepAddbacks } from "./step-addbacks";
import { StepPrivate } from "./step-private";
import { StepReview } from "./step-review";

const STEPS = [
  { id: 1, label: "Basics" },
  { id: 2, label: "Photos" },
  { id: 3, label: "Financials" },
  { id: 4, label: "Addbacks" },
  { id: 5, label: "Details" },
  { id: 6, label: "Review" },
];

export type ListingDraft = {
  id?: string;
  title: string;
  industry: string;
  industry_code: string;
  location: string;
  asking_price: number;
  description_public: string;
  description_private: string;
  reason_for_sale: string;
  inclusions: string;
  deal_structure: string;
  media: { id: string; url: string }[];
  financials: {
    year: number;
    revenue: number;
    cogs: number;
    gross_profit: number;
    opex: number;
    ebitda: number;
  }[];
  addbacks: {
    description: string;
    amount: number;
    category: string;
  }[];
};

const EMPTY_DRAFT: ListingDraft = {
  title: "",
  industry: "",
  industry_code: "",
  location: "",
  asking_price: 0,
  description_public: "",
  description_private: "",
  reason_for_sale: "",
  inclusions: "",
  deal_structure: "",
  media: [],
  financials: [
    { year: new Date().getFullYear() - 1, revenue: 0, cogs: 0, gross_profit: 0, opex: 0, ebitda: 0 },
    { year: new Date().getFullYear() - 2, revenue: 0, cogs: 0, gross_profit: 0, opex: 0, ebitda: 0 },
    { year: new Date().getFullYear() - 3, revenue: 0, cogs: 0, gross_profit: 0, opex: 0, ebitda: 0 },
  ],
  addbacks: [],
};

export function Wizard() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [draft, setDraft] = useState<ListingDraft>(EMPTY_DRAFT);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateDraft = useCallback((updates: Partial<ListingDraft>) => {
    setDraft((prev) => ({ ...prev, ...updates }));
  }, []);

  // Save draft to DB
  const saveDraft = useCallback(async (updates?: Partial<ListingDraft>) => {
    setSaving(true);
    setError(null);
    const current = updates ? { ...draft, ...updates } : draft;

    try {
      if (!current.id) {
        // Create new listing
        const res = await fetch("/api/listings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: current.title,
            industry: current.industry,
            industry_code: current.industry_code,
            location: current.location,
            asking_price: current.asking_price,
            description_public: current.description_public,
            description_private: current.description_private,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        updateDraft({ id: data.id, ...updates });
      } else {
        // Update existing
        const res = await fetch("/api/listings", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: current.id,
            title: current.title,
            industry: current.industry,
            industry_code: current.industry_code,
            location: current.location,
            asking_price: current.asking_price,
            description_public: current.description_public,
            description_private: current.description_private,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }, [draft, updateDraft]);

  const nextStep = useCallback(async () => {
    await saveDraft();
    setStep((s) => Math.min(s + 1, 6));
  }, [saveDraft]);

  const prevStep = useCallback(() => {
    setStep((s) => Math.max(s - 1, 1));
  }, []);

  const submitListing = useCallback(async () => {
    if (!draft.id) return;
    setSaving(true);
    setError(null);

    try {
      const res = await fetch("/api/listings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: draft.id, status: "pending_approval" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      router.push("/dashboard?submitted=true");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit");
    } finally {
      setSaving(false);
    }
  }, [draft.id, router]);

  return (
    <div className="mx-auto max-w-3xl px-8 lg:px-12 py-12">
      {/* Step indicator */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-4">
          {STEPS.map((s) => (
            <button
              key={s.id}
              onClick={() => s.id <= step && setStep(s.id)}
              className={`text-xs font-medium uppercase tracking-wider transition-colors ${
                s.id === step
                  ? "text-[var(--color-foreground)]"
                  : s.id < step
                    ? "text-[var(--color-muted-foreground)] cursor-pointer hover:text-[var(--color-foreground)]"
                    : "text-[var(--color-border)]"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
        <div className="h-0.5 bg-[var(--color-border)] rounded-full overflow-hidden">
          <div
            className="h-full bg-[var(--color-foreground)] transition-all duration-300"
            style={{ width: `${((step - 1) / (STEPS.length - 1)) * 100}%` }}
          />
        </div>
      </div>

      {/* Status */}
      {saving && (
        <p className="text-xs text-[var(--color-muted)] mb-4">Saving...</p>
      )}
      {error && (
        <p className="text-sm text-red-600 mb-4">{error}</p>
      )}

      {/* Steps */}
      {step === 1 && <StepBasics draft={draft} updateDraft={updateDraft} onNext={nextStep} />}
      {step === 2 && <StepPhotos draft={draft} updateDraft={updateDraft} onNext={nextStep} onBack={prevStep} />}
      {step === 3 && <StepFinancials draft={draft} updateDraft={updateDraft} onNext={nextStep} onBack={prevStep} />}
      {step === 4 && <StepAddbacks draft={draft} updateDraft={updateDraft} onNext={nextStep} onBack={prevStep} />}
      {step === 5 && <StepPrivate draft={draft} updateDraft={updateDraft} onNext={nextStep} onBack={prevStep} />}
      {step === 6 && <StepReview draft={draft} onSubmit={submitListing} onBack={prevStep} saving={saving} />}
    </div>
  );
}
