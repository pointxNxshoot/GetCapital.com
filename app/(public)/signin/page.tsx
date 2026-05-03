"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function SignInPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const supabase = createClient();

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-8">
      <div className="w-full max-w-md">
        <div className="animate-reveal animate-delay-1">
          <h1
            className="text-3xl font-normal tracking-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Welcome back
          </h1>
          <p className="mt-3 text-[var(--color-muted-foreground)]">
            Sign in to your account.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-10 space-y-6 animate-reveal animate-delay-2">
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
              placeholder="Your password"
              className="w-full border-b border-[var(--color-border)] bg-transparent py-3 text-base outline-none transition-colors placeholder:text-[var(--color-muted)] focus:border-[var(--color-foreground)]"
            />
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
                Signing in...
              </span>
            ) : (
              "Sign in"
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-[var(--color-muted-foreground)] animate-reveal animate-delay-3">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-[var(--color-foreground)] underline underline-offset-4 hover:no-underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
