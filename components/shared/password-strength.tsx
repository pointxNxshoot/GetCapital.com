"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";

type PasswordStrengthProps = {
  password: string;
};

type Rule = {
  label: string;
  test: (pw: string) => boolean;
};

const rules: Rule[] = [
  { label: "At least 8 characters", test: (pw) => pw.length >= 8 },
  { label: "Contains uppercase letter", test: (pw) => /[A-Z]/.test(pw) },
  { label: "Contains lowercase letter", test: (pw) => /[a-z]/.test(pw) },
  { label: "Contains a number", test: (pw) => /\d/.test(pw) },
  { label: "Contains special character", test: (pw) => /[^A-Za-z0-9]/.test(pw) },
];

export function PasswordStrength({ password }: PasswordStrengthProps) {
  const passed = useMemo(
    () => rules.filter((rule) => rule.test(password)).length,
    [password]
  );

  if (!password) return null;

  const strength = passed / rules.length;
  const label = strength <= 0.4 ? "Weak" : strength <= 0.7 ? "Fair" : strength < 1 ? "Good" : "Strong";
  const colour =
    strength <= 0.4
      ? "bg-red-500"
      : strength <= 0.7
        ? "bg-amber-500"
        : strength < 1
          ? "bg-emerald-400"
          : "bg-emerald-600";

  return (
    <div className="space-y-3">
      {/* Strength bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs">
          <span className="text-[var(--color-muted-foreground)]">Password strength</span>
          <span className={cn(
            "font-medium",
            strength <= 0.4 ? "text-red-600" : strength <= 0.7 ? "text-amber-600" : "text-emerald-600"
          )}>
            {label}
          </span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-[var(--color-border)] overflow-hidden">
          <div
            className={cn("h-full rounded-full transition-all duration-300 ease-out", colour)}
            style={{ width: `${strength * 100}%` }}
          />
        </div>
      </div>

      {/* Requirements checklist */}
      <ul className="space-y-1">
        {rules.map((rule) => {
          const met = rule.test(password);
          return (
            <li
              key={rule.label}
              className={cn(
                "flex items-center gap-2 text-xs transition-colors duration-200",
                met ? "text-emerald-600" : "text-[var(--color-muted)]"
              )}
            >
              <span className={cn(
                "inline-block w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-all duration-200",
                met ? "border-emerald-600 bg-emerald-600" : "border-[var(--color-border)]"
              )}>
                {met && (
                  <svg width="8" height="8" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6.5L4.5 9L10 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </span>
              {rule.label}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
