import { Section } from "@/components/swiss/section";
import { Headline } from "@/components/swiss/headline";

export const metadata = {
  title: "About — Capital",
  description: "Building a better way to buy and sell Australian businesses.",
};

export default function AboutPage() {
  return (
    <main>
      {/* Hero */}
      <Section>
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 lg:col-span-8">
            <div className="animate-reveal animate-delay-1">
              <Headline size="lg" as="h1">
                Building a better way to buy and sell Australian businesses.
              </Headline>
            </div>
            <p className="animate-reveal animate-delay-2 mt-8 max-w-2xl text-lg text-[var(--color-muted-foreground)]">
              Capital is a marketplace and intelligence platform for Australian SME transactions — connecting business owners with qualified buyers through structured data, transparent valuations, and secure deal flow.
            </p>
          </div>
        </div>
      </Section>

      {/* Why we're building this */}
      <Section background="dark">
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 lg:col-span-8">
            <Headline size="md" as="h2">
              Why we&apos;re building this
            </Headline>

            <div className="mt-10 space-y-8 text-base leading-relaxed opacity-80">
              <p>
                The Australian SME transaction market is opaque. Sellers rely on a single broker&apos;s opinion, buyers struggle to find deal flow, and nobody has reliable data on what businesses actually sell for. The result: deals that take too long, price too low, or never happen.
              </p>
              <p>
                Capital serves both sides. Sellers get a data-driven valuation, a confidential listing, and access to verified buyers — without paying a 10% success fee. Buyers get structured deal flow, verified financials, and industry-benchmarked metrics that let them move faster with confidence.
              </p>
              <p>
                Every transaction on the platform feeds a proprietary dataset. Over time, this becomes the most comprehensive source of Australian SME transaction data — useful for PE firms, accountants, and researchers. The data product is the long-term advantage.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* Who we are */}
      <Section>
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 lg:col-span-8">
            <Headline size="md" as="h2">
              Who we are
            </Headline>

            <div className="mt-10 space-y-4">
              <p className="text-lg font-medium">Alex Gorman</p>
              <p className="text-base text-[var(--color-muted-foreground)] max-w-xl leading-relaxed">
                Building Capital to fix a problem I&apos;ve seen firsthand — the gap between what Australian businesses are worth and what their owners can access in terms of data, buyers, and deal infrastructure.
              </p>
              <p className="mt-6 text-sm text-[var(--color-muted)]">
                Get in touch:{" "}
                <a href="mailto:alexander@get-capital.com.au" className="text-[var(--color-foreground)] underline underline-offset-4">
                  alexander@get-capital.com.au
                </a>
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* FAQ */}
      <Section>
        <div className="grid grid-cols-12 gap-8" id="faq">
          <div className="col-span-12 lg:col-span-3">
            <p className="text-sm font-medium uppercase tracking-wider text-[var(--color-muted)]">
              FAQs
            </p>
          </div>
          <div className="col-span-12 lg:col-span-9">
            <Headline size="md" className="mb-12">
              Questions from investors &amp; PE firms
            </Headline>

            <div className="divide-y divide-[var(--color-border)]">
              <FAQItem question="How does the valuation engine work?">
                We combine multiple valuation methods (SDE, EBITDA, ARR, and Revenue multiples) weighted by trust scores derived from source reliability, recency, sample size, and geographic match. Every data source carries an explicit confidence score — nothing is a black box.
              </FAQItem>
              <FAQItem question="What kinds of businesses are listed?">
                Australian SMEs with at least one year of trading history and verifiable financials. We cover hospitality, SaaS, e-commerce, professional services, manufacturing, and wholesale — from $250k to $10M+ asking prices.
              </FAQItem>
              <FAQItem question="How do you handle confidentiality?">
                Listings can be fully anonymous until a buyer is approved. Financial data sits behind access grants that the seller controls. We&apos;re building NDA infrastructure so document access is gated and audited.
              </FAQItem>
              <FAQItem question="What's the data product?">
                Every transaction on the platform — anonymised and aggregated — feeds industry benchmark data. We&apos;re building the most comprehensive Australian SME transaction dataset for licensing to PE firms, accountants, and researchers.
              </FAQItem>
              <FAQItem question="How do I get involved as a buyer or data partner?">
                Email us at alexander@get-capital.com.au. We&apos;re actively building our launch buyer network and talking to firms interested in early access to the data product.
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
