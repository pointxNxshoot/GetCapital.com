import { Section } from "@/components/swiss/section";
import { Headline } from "@/components/swiss/headline";
import { Hero } from "@/components/swiss/hero";
import { AnimatedFeatureSection } from "@/components/swiss/animated-feature-section";

export default function HomePage() {
  return (
    <main>
      {/* Section 1: Hero — animated, client component */}
      <Hero />

      {/* Section 2: List your business (orange) */}
      <AnimatedFeatureSection
        background="orange"
        number="01"
        headline="List your business in minutes."
        features={[
          "Industry-benchmarked valuation",
          "Confidential listing options",
          "Direct buyer connections",
          "Verified financial data",
        ]}
        ctaText="Get started"
        ctaHref="/signup"
        ctaVariant="secondary"
      />

      {/* Section 3: Reach buyers (purple gradient) */}
      <AnimatedFeatureSection
        background="purple-gradient"
        number="02"
        headline="Reach serious buyers, fast."
        features={[
          "Verified buyer profiles",
          "Industry-matched introductions",
          "Secure messaging",
          "NDA-protected sharing",
        ]}
        ctaText="Browse buyers"
        ctaHref="/listings"
        ctaVariant="secondary"
      />

      {/* Section 4: Market data (default) */}
      <AnimatedFeatureSection
        number="03"
        headline="Powered by real market data."
        features={[
          "Live transaction comparables",
          "Industry-specific benchmarks",
          "Trust-weighted methodology",
        ]}
        featureColumns={3}
        ctaText="See methodology"
        ctaHref="/valuation"
      />

      {/* Section 5: FAQ — static, no scroll animation */}
      <Section>
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 lg:col-span-3">
            <p className="text-sm font-medium uppercase tracking-wider text-[var(--color-muted)]">
              FAQs
            </p>
          </div>
          <div className="col-span-12 lg:col-span-9">
            <Headline size="md" className="mb-12">
              Plain answers. No fluff.
            </Headline>

            <div className="divide-y divide-[var(--color-border)]">
              <FAQItem question="How is my business valued?">
                We use a trust-weighted methodology combining real Australian transaction data, industry-specific multiples from verified sources, and comparable sales. You get a range, not a single number — because honest valuations reflect uncertainty.
              </FAQItem>
              <FAQItem question="Who can see my financials?">
                Nobody — until you grant access. Your listing can be anonymous, and financial details sit behind an access request that you approve individually. We never share raw data without your explicit consent.
              </FAQItem>
              <FAQItem question="How much does it cost to list?">
                Listing is free during our launch period. After that, a flat listing fee applies — no success fees, no percentage of sale price, no hidden charges.
              </FAQItem>
              <FAQItem question="What types of businesses can I list?">
                Any Australian business with at least one year of trading history. We cover cafes, SaaS, e-commerce, services, wholesale, manufacturing — if it has revenue and EBITDA, it belongs here.
              </FAQItem>
              <FAQItem question="How are buyers verified?">
                Buyers complete identity verification and can optionally upload proof of funds. You see their verification status before granting access to your data room.
              </FAQItem>
            </div>
          </div>
        </div>
      </Section>
    </main>
  );
}

function FAQItem({ question, children }: { question: string; children: React.ReactNode }) {
  return (
    <details className="group py-6">
      <summary className="flex cursor-pointer items-center justify-between text-base font-medium">
        {question}
        <span className="ml-4 text-xl transition-transform duration-200 group-open:rotate-45">
          +
        </span>
      </summary>
      <p className="mt-4 text-sm text-[var(--color-muted-foreground)] max-w-2xl leading-relaxed">
        {children}
      </p>
    </details>
  );
}
