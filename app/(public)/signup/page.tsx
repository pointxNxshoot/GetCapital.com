"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { PasswordStrength } from "@/components/shared/password-strength";

export default function SignUpPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [password, setPassword] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const fullName = formData.get("full_name") as string;

    const supabase = createClient();

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  }

  if (success) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-8">
        <div className="w-full max-w-md animate-reveal animate-delay-1">
          <h1
            className="text-3xl font-normal tracking-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Check your email
          </h1>
          <p className="mt-4 text-[var(--color-muted-foreground)]">
            We&apos;ve sent you a verification link. Click it to activate your account.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-8">
      <div className="w-full max-w-md">
        <div className="animate-reveal animate-delay-1">
          <h1
            className="text-3xl font-normal tracking-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Create an account
          </h1>
          <p className="mt-3 text-[var(--color-muted-foreground)]">
            Sign up to list your business or browse opportunities.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-10 space-y-6 animate-reveal animate-delay-2">
          <div className="space-y-2">
            <label htmlFor="full_name" className="block text-sm font-medium">
              Full name
            </label>
            <input
              id="full_name"
              name="full_name"
              type="text"
              required
              placeholder="Maria Chen"
              className="w-full border-b border-[var(--color-border)] bg-transparent py-3 text-base outline-none transition-colors placeholder:text-[var(--color-muted)] focus:border-[var(--color-foreground)]"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="you@example.com"
              className="w-full border-b border-[var(--color-border)] bg-transparent py-3 text-base outline-none transition-colors placeholder:text-[var(--color-muted)] focus:border-[var(--color-foreground)]"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={8}
              placeholder="Create a strong password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border-b border-[var(--color-border)] bg-transparent py-3 text-base outline-none transition-colors placeholder:text-[var(--color-muted)] focus:border-[var(--color-foreground)]"
            />
            <div className="pt-3">
              <PasswordStrength password={password} />
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-[var(--color-foreground)] py-4 text-base font-medium text-[var(--color-background)] transition-all hover:bg-[var(--color-foreground)]/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Creating account...
              </span>
            ) : (
              "Sign up"
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-[var(--color-muted-foreground)] animate-reveal animate-delay-3">
          Already have an account?{" "}
          <Link href="/signin" className="text-[var(--color-foreground)] underline underline-offset-4 hover:no-underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
