"use client";

import { cn } from "@/lib/utils";

// Shared field styles
const fieldBase =
  "w-full bg-[#FAF9F5] border border-[var(--color-border)] px-5 py-4 text-base text-[var(--color-foreground)] placeholder:text-[var(--color-muted-foreground)] outline-none transition-colors duration-200 focus:border-[var(--color-accent-orange)] focus:bg-white disabled:bg-[#F0EFEA] disabled:border-[#D8D7D2] disabled:text-[var(--color-muted-foreground)] disabled:cursor-not-allowed";

// --- WizardInput ---
interface WizardInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  optional?: boolean;
  helperText?: string;
  error?: string;
  prefix?: string;
}

export function WizardInput({
  label,
  optional,
  helperText,
  error,
  prefix,
  className,
  ...props
}: WizardInputProps) {
  return (
    <label className="block">
      <span className="block text-base font-medium text-[var(--color-foreground)] mb-2">
        {label}
        {optional && (
          <span className="text-sm font-normal text-[var(--color-muted-foreground)] ml-2">
            Optional
          </span>
        )}
      </span>
      <div className="relative">
        {prefix && (
          <span className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--color-muted-foreground)] text-base pointer-events-none">
            {prefix}
          </span>
        )}
        <input
          className={cn(
            fieldBase,
            prefix && "pl-10",
            error && "border-red-600 bg-[#FFF8F8]",
            className
          )}
          {...props}
        />
      </div>
      {helperText && !error && (
        <span className="block text-sm text-[var(--color-muted-foreground)] mt-2">
          {helperText}
        </span>
      )}
      {error && (
        <span className="block text-sm text-red-600 mt-2">{error}</span>
      )}
    </label>
  );
}

// --- WizardSelect ---
interface WizardSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  optional?: boolean;
  helperText?: string;
  error?: string;
  children: React.ReactNode;
}

export function WizardSelect({
  label,
  optional,
  helperText,
  error,
  className,
  children,
  ...props
}: WizardSelectProps) {
  return (
    <label className="block">
      <span className="block text-base font-medium text-[var(--color-foreground)] mb-2">
        {label}
        {optional && (
          <span className="text-sm font-normal text-[var(--color-muted-foreground)] ml-2">
            Optional
          </span>
        )}
      </span>
      <select
        className={cn(
          fieldBase,
          "cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%3E%3Cpath%20fill%3D%22%235C5C58%22%20d%3D%22M2%204l4%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:12px] bg-[right_20px_center] bg-no-repeat pr-12",
          error && "border-red-600 bg-[#FFF8F8]",
          className
        )}
        {...props}
      >
        {children}
      </select>
      {helperText && !error && (
        <span className="block text-sm text-[var(--color-muted-foreground)] mt-2">
          {helperText}
        </span>
      )}
      {error && (
        <span className="block text-sm text-red-600 mt-2">{error}</span>
      )}
    </label>
  );
}

// --- WizardTextarea ---
interface WizardTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  optional?: boolean;
  helperText?: string;
  error?: string;
  charCount?: { current: number; max: number };
}

export function WizardTextarea({
  label,
  optional,
  helperText,
  error,
  charCount,
  className,
  ...props
}: WizardTextareaProps) {
  return (
    <label className="block">
      <span className="flex items-baseline justify-between mb-2">
        <span className="text-base font-medium text-[var(--color-foreground)]">
          {label}
          {optional && (
            <span className="text-sm font-normal text-[var(--color-muted-foreground)] ml-2">
              Optional
            </span>
          )}
        </span>
        {charCount && (
          <span className="text-sm text-[var(--color-muted)]">
            {charCount.current}/{charCount.max}
          </span>
        )}
      </span>
      <textarea
        className={cn(
          fieldBase,
          "resize-none cursor-text",
          error && "border-red-600 bg-[#FFF8F8]",
          className
        )}
        {...props}
      />
      {helperText && !error && (
        <span className="block text-sm text-[var(--color-muted-foreground)] mt-2">
          {helperText}
        </span>
      )}
      {error && (
        <span className="block text-sm text-red-600 mt-2">{error}</span>
      )}
    </label>
  );
}

// --- CurrencyInput ---
interface CurrencyInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  optional?: boolean;
  helperText?: string;
  computed?: boolean;
  highlight?: boolean;
}

function formatCurrency(value: number): string {
  if (!value) return "";
  return value.toLocaleString("en-AU");
}

export function CurrencyInput({
  label,
  value,
  onChange,
  optional,
  helperText,
  computed,
  highlight,
}: CurrencyInputProps) {
  return (
    <label className="block">
      <span className="flex items-baseline gap-2 mb-2">
        <span className="text-base font-medium text-[var(--color-foreground)]">
          {label}
        </span>
        {computed && (
          <span className="flex items-center gap-1 text-sm text-[var(--color-muted-foreground)]">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--color-accent-orange)]" />
            Calculated
          </span>
        )}
        {optional && (
          <span className="text-sm font-normal text-[var(--color-muted-foreground)]">
            Optional
          </span>
        )}
      </span>
      <div className="relative">
        <span className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--color-muted-foreground)] text-base pointer-events-none">
          $
        </span>
        <input
          type="text"
          inputMode="numeric"
          value={formatCurrency(value)}
          onChange={(e) => {
            const raw = e.target.value.replace(/[^\d]/g, "");
            onChange(parseInt(raw) || 0);
          }}
          placeholder="0"
          className={cn(
            fieldBase,
            "pl-10",
            highlight && "border-[var(--color-foreground)] font-medium"
          )}
        />
      </div>
      {helperText && (
        <span className="block text-sm text-[var(--color-muted-foreground)] mt-2">
          {helperText}
        </span>
      )}
    </label>
  );
}

// --- WizardStepHeading ---
interface WizardStepHeadingProps {
  title: string;
  description: string;
}

export function WizardStepHeading({ title, description }: WizardStepHeadingProps) {
  return (
    <div className="mb-12">
      <h2
        className="text-3xl tracking-tight leading-none mb-4"
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "var(--font-size-display-md)",
          letterSpacing: "-0.02em",
          lineHeight: "1.05",
        }}
      >
        {title}.
      </h2>
      <p className="text-base text-[var(--color-muted-foreground)] max-w-xl">
        {description}
      </p>
    </div>
  );
}

// --- WizardActions ---
interface WizardActionsProps {
  onBack?: () => void;
  onNext: () => void;
  nextLabel?: string;
  saving?: boolean;
  disabled?: boolean;
}

export function WizardActions({
  onBack,
  onNext,
  nextLabel = "Save & continue",
  saving,
  disabled,
}: WizardActionsProps) {
  return (
    <div className="border-t border-[var(--color-border)] pt-8 mt-16 flex items-center justify-between">
      {onBack ? (
        <button
          type="button"
          onClick={onBack}
          className="text-base text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] transition-colors"
        >
          &larr; Back
        </button>
      ) : (
        <div />
      )}
      <button
        type="button"
        onClick={onNext}
        disabled={saving || disabled}
        className="rounded-full bg-[var(--color-foreground)] px-10 py-4 text-base font-medium text-[var(--color-background)] transition-all hover:bg-[var(--color-foreground)]/90 disabled:opacity-30 disabled:cursor-not-allowed"
      >
        {saving ? "Saving..." : nextLabel}
      </button>
    </div>
  );
}
