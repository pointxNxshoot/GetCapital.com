"use client";

import { useState } from "react";
import { Section } from "./section";
import { Headline } from "./headline";
import { FeatureList } from "./feature-list";

type ComingSoonProps = {
  pageName: string;
  headline: string;
  subheadline: string;
  bodyParagraph: string;
  featureBullets: string[];
  variant?: "default" | "orange" | "purple-gradient";
};

export function ComingSoon({
  pageName,
  headline,
  subheadline,
  bodyParagraph,
  featureBullets,
  variant = "default",
}: ComingSoonProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const pageSource = pageName.toLowerCase().includes("valuation")
    ? "valuation"
    : "listings";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/notify-me", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, page_source: pageSource }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || "Something went wrong.");
        setStatus("error");
        return;
      }

      setStatus("success");
    } catch {
      setErrorMsg("Network error. Please try again.");
      setStatus("error");
    }
  }

  return (
    <Section background={variant}>
      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-8">
          {/* Status label */}
          <div className="animate-reveal animate-delay-1">
            <span className="inline-block rounded-full border border-current/30 px-4 py-1.5 text-xs font-medium uppercase tracking-wider">
              Launching soon
            </span>
          </div>

          {/* Headline */}
          <div className="animate-reveal animate-delay-2 mt-8">
            <Headline size="xl" as="h1">
              {headline}
            </Headline>
          </div>

          {/* Subheadline */}
          <p className="animate-reveal animate-delay-3 mt-6 max-w-2xl text-lg opacity-90">
            {subheadline}
          </p>

          {/* Body */}
          <p className="animate-reveal animate-delay-3 mt-6 max-w-xl text-base opacity-70">
            {bodyParagraph}
          </p>

          {/* Feature list */}
          <div className="animate-reveal animate-delay-4 mt-10">
            <FeatureList features={featureBullets} columns={2} />
          </div>

          {/* Email capture */}
          <div className="animate-reveal animate-delay-4 mt-12 max-w-md">
            {status === "success" ? (
              <div className="space-y-3">
                <p className="text-base font-medium">
                  ✓ You&apos;re on the list. We&apos;ll email you when {pageName} is ready.
                </p>
                <p className="text-sm opacity-70">
                  Want to chat in the meantime?{" "}
                  <a href="mailto:alexander@get-capital.com.au" className="underline underline-offset-4">
                    Email us
                  </a>
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex gap-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    className="flex-1 rounded-full border border-current/30 bg-transparent px-6 py-3.5 text-base outline-none placeholder:opacity-50 focus:border-current/60 transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className={`rounded-full px-8 py-3.5 text-base font-medium transition-all disabled:opacity-50 ${
                      variant === "default"
                        ? "bg-[var(--color-foreground)] text-[var(--color-background)]"
                        : "bg-white text-[var(--color-foreground)]"
                    }`}
                  >
                    {status === "loading" ? (
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                    ) : (
                      "Notify me"
                    )}
                  </button>
                </div>
                {status === "error" && (
                  <p className="text-sm opacity-90">{errorMsg}</p>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
    </Section>
  );
}
