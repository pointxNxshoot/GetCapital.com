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
  const [highestStep, setHighestStep] = useState(1);
  const [draft, setDraft] = useState<ListingDraft>(EMPTY_DRAFT);
  const [saving, setSaving] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const updateDraft = useCallback((updates: Partial<ListingDraft>) => {
    setDraft((prev) => ({ ...prev, ...updates }));
  }, []);

  // Save draft to DB — errors are silent (logged, not shown to user)
  const saveDraft = useCallback(async () => {
    setSaving(true);

    try {
      if (!draft.id) {
        const res = await fetch("/api/listings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: draft.title || "Untitled listing",
            industry: draft.industry,
            industry_code: draft.industry_code || "other",
            location: draft.location,
            asking_price: draft.asking_price,
            description_public: draft.description_public,
            description_private: draft.description_private,
          }),
        });
        const data = await res.json();
        if (res.ok && data.id) {
          setDraft((prev) => ({ ...prev, id: data.id }));
        } else {
          console.warn("[wizard] Draft create failed:", data.error);
        }
      } else {
        const res = await fetch("/api/listings", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: draft.id,
            title: draft.title,
            industry: draft.industry,
            industry_code: draft.industry_code,
            location: draft.location,
            asking_price: draft.asking_price,
            description_public: draft.description_public,
            description_private: draft.description_private,
            reason_for_sale: draft.reason_for_sale,
            inclusions: draft.inclusions,
            deal_structure: draft.deal_structure,
          }),
        });
        if (!res.ok) {
          const data = await res.json();
          console.warn("[wizard] Draft update failed:", data.error);
        }
      }
    } catch (err) {
      console.warn("[wizard] Draft save error:", err);
    } finally {
      setSaving(false);
    }
  }, [draft]);

  const goToStep = useCallback((target: number) => {
    if (target <= highestStep) {
      setStep(target);
    }
  }, [highestStep]);

  const nextStep = useCallback(async () => {
    await saveDraft();
    setStep((s) => {
      const next = Math.min(s + 1, 6);
      setHighestStep((h) => Math.max(h, next));
      return next;
    });
  }, [saveDraft]);

  const prevStep = useCallback(() => {
    setStep((s) => Math.max(s - 1, 1));
  }, []);

  const submitListing = useCallback(async () => {
    if (!draft.id) {
      setSubmitError("Please complete all steps before submitting.");
      return;
    }
    setSaving(true);
    setSubmitError(null);

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
      setSubmitError(err instanceof Error ? err.message : "Failed to submit. Please try again.");
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
              onClick={() => goToStep(s.id)}
              className={`text-xs font-medium uppercase tracking-wider transition-colors ${
                s.id === step
                  ? "text-[var(--color-foreground)]"
                  : s.id <= highestStep
                    ? "text-[var(--color-muted-foreground)] cursor-pointer hover:text-[var(--color-foreground)]"
                    : "text-[var(--color-border)] cursor-default"
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

      {/* Saving indicator — subtle, not alarming */}
      {saving && (
        <p className="text-xs text-[var(--color-muted)] mb-4">Saving...</p>
      )}

      {/* Steps */}
      {step === 1 && <StepBasics draft={draft} updateDraft={updateDraft} onNext={nextStep} />}
      {step === 2 && <StepPhotos draft={draft} updateDraft={updateDraft} onNext={nextStep} onBack={prevStep} />}
      {step === 3 && <StepFinancials draft={draft} updateDraft={updateDraft} onNext={nextStep} onBack={prevStep} />}
      {step === 4 && <StepAddbacks draft={draft} updateDraft={updateDraft} onNext={nextStep} onBack={prevStep} />}
      {step === 5 && <StepPrivate draft={draft} updateDraft={updateDraft} onNext={nextStep} onBack={prevStep} />}
      {step === 6 && <StepReview draft={draft} onSubmit={submitListing} onBack={prevStep} saving={saving} error={submitError} />}
    </div>
  );
}
