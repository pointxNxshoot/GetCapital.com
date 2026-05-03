import { Section } from "@/components/swiss/section";
import { Headline } from "@/components/swiss/headline";

export const metadata = {
  title: "Terms of Service",
};

export default function TermsPage() {
  return (
    <Section>
      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-8">
          <Headline size="md" as="h1">
            Terms of Service
          </Headline>
          <div className="mt-10 prose prose-neutral max-w-2xl text-[var(--color-muted-foreground)] text-base leading-relaxed space-y-6">
            <p>
              By using Capital (&quot;the platform&quot;), you agree to these terms. The platform is operated by Capital Pty Ltd, registered in Australia.
            </p>
            <p>
              <strong className="text-[var(--color-foreground)]">Platform purpose:</strong> Capital provides a marketplace for buying and selling Australian businesses, including valuation tools, listing services, and buyer-seller communication. We are not a licensed financial advisor, broker, or dealer.
            </p>
            <p>
              <strong className="text-[var(--color-foreground)]">Valuations:</strong> All valuations provided by the platform are indicative only and should not be relied upon as financial advice. They are based on available data and may not reflect actual market value. Always seek independent professional advice before making financial decisions.
            </p>
            <p>
              <strong className="text-[var(--color-foreground)]">User conduct:</strong> You agree not to submit false information, misrepresent your identity or business, or use the platform for any unlawful purpose.
            </p>
            <p>
              <strong className="text-[var(--color-foreground)]">Data consent:</strong> By submitting financial information through the platform, you consent to that information being anonymised and aggregated for industry benchmarking purposes, as described in our Privacy Policy.
            </p>
            <p>
              <strong className="text-[var(--color-foreground)]">Limitation of liability:</strong> Capital is provided &quot;as is&quot;. We make no guarantees about the accuracy of valuations, the quality of buyers or sellers, or the outcome of any transaction facilitated through the platform.
            </p>
            <p className="text-sm text-[var(--color-muted)]">
              Last updated: May 2026. These terms will be expanded and reviewed by legal counsel before full launch.
            </p>
          </div>
        </div>
      </div>
    </Section>
  );
}
