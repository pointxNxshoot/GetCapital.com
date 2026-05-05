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

  // Save draft to DB — returns true on success, false on failure
  const saveDraft = useCallback(async (): Promise<boolean> => {
    setSaving(true);
    setSubmitError(null);

    try {
      if (!draft.id) {
        const res = await fetch("/api/listings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: draft.title || "Untitled listing",
            industry: draft.industry_code === "other" ? draft.industry : draft.industry,
            industry_code: draft.industry_code || "other",
            industry_other_text: draft.industry_code === "other" ? draft.industry : null,
            location: draft.location,
            asking_price: draft.asking_price,
            description_public: draft.description_public,
            description_private: draft.description_private,
          }),
        });
        const data = await res.json();
        if (res.ok && data.id) {
          setDraft((prev) => ({ ...prev, id: data.id }));
          return true;
        } else {
          console.error("[wizard] Draft create failed:", JSON.stringify(data));
          setSubmitError(data.error || "Failed to save listing. Please try again.");
          return false;
        }
      } else {
        const res = await fetch("/api/listings", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: draft.id,
            title: draft.title,
            industry: draft.industry_code === "other" ? draft.industry : draft.industry,
            industry_code: draft.industry_code,
            industry_other_text: draft.industry_code === "other" ? draft.industry : null,
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
          console.error("[wizard] Draft update failed:", JSON.stringify(data));
          setSubmitError(data.error || "Failed to save changes. Please try again.");
          return false;
        }
      }
      return true;
    } catch (err) {
      console.error("[wizard] Draft save error:", err);
      setSubmitError("Network error. Please check your connection and try again.");
      return false;
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
    const success = await saveDraft();
    if (!success) return;
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
      <div className="flex items-start justify-between border-b border-[var(--color-border)] pb-8 mb-12">
        {STEPS.map((s) => (
          <button
            key={s.id}
            onClick={() => goToStep(s.id)}
            className="flex flex-col items-start gap-2 text-left"
          >
            <div className="flex items-baseline gap-2">
              <span
                className={`text-sm font-medium tracking-wider transition-colors ${
                  s.id === step
                    ? "text-[var(--color-accent-orange)]"
                    : s.id <= highestStep
                      ? "text-[var(--color-foreground)]"
                      : "text-[var(--color-muted)]"
                }`}
              >
                {String(s.id).padStart(2, "0")}
              </span>
              <span
                className={`text-sm font-medium uppercase tracking-wider transition-colors hidden sm:inline ${
                  s.id === step
                    ? "text-[var(--color-foreground)]"
                    : s.id <= highestStep
                      ? "text-[var(--color-foreground)] cursor-pointer"
                      : "text-[var(--color-muted)]"
                }`}
              >
                {s.label}
              </span>
            </div>
            <div
              className={`h-0.5 transition-all duration-300 ${
                s.id === step
                  ? "w-full bg-[var(--color-accent-orange)]"
                  : "w-0 bg-transparent"
              }`}
            />
          </button>
        ))}
      </div>

      {/* Saving indicator — subtle, not alarming */}
      {saving && (
        <p className="text-xs text-[var(--color-muted)] mb-4">Saving...</p>
      )}

      {/* Error from save/submit — shown on any step */}
      {submitError && step !== 6 && (
        <p className="text-sm text-red-600 mb-4">{submitError}</p>
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
