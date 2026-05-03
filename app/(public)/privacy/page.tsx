import { Section } from "@/components/swiss/section";
import { Headline } from "@/components/swiss/headline";

export const metadata = {
  title: "Privacy Policy",
};

export default function PrivacyPage() {
  return (
    <Section>
      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-8">
          <Headline size="md" as="h1">
            Privacy Policy
          </Headline>
          <div className="mt-10 prose prose-neutral max-w-2xl text-[var(--color-muted-foreground)] text-base leading-relaxed space-y-6">
            <p>
              Capital Pty Ltd (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) is committed to protecting your personal information in accordance with the Australian Privacy Act 1988 and the Australian Privacy Principles (APPs).
            </p>
            <p>
              <strong className="text-[var(--color-foreground)]">Information we collect:</strong> When you sign up, we collect your name, email address, and any business information you voluntarily provide. When you use the valuation tool or submit a notify-me form, we collect your email and the data you submit.
            </p>
            <p>
              <strong className="text-[var(--color-foreground)]">How we use it:</strong> To provide the platform services, send you notifications you&apos;ve opted into, and improve the platform. We do not sell your personal information.
            </p>
            <p>
              <strong className="text-[var(--color-foreground)]">Data anonymisation:</strong> Financial data submitted through the platform may be anonymised and aggregated for industry benchmarking purposes. Individual businesses are never identifiable in aggregated data.
            </p>
            <p>
              <strong className="text-[var(--color-foreground)]">Your rights:</strong> You can request access to, correction of, or deletion of your personal information at any time by emailing alexander@get-capital.com.au.
            </p>
            <p className="text-sm text-[var(--color-muted)]">
              Last updated: May 2026. This policy will be expanded as the platform develops.
            </p>
          </div>
        </div>
      </div>
    </Section>
  );
}
