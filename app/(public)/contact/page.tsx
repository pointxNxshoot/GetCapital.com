import { Section } from "@/components/swiss/section";
import { Headline } from "@/components/swiss/headline";
import { CTAButton } from "@/components/swiss/cta-button";

export const metadata = {
  title: "Contact — Capital",
  description: "Get in touch with the Capital team.",
};

export default function ContactPage() {
  return (
    <Section>
      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-7">
          <div className="animate-reveal animate-delay-1">
            <Headline size="lg" as="h1">
              Get in touch
            </Headline>
          </div>

          <p className="animate-reveal animate-delay-2 mt-8 max-w-xl text-lg text-[var(--color-muted-foreground)] leading-relaxed">
            We&apos;re early. If you&apos;re interested in being a launch buyer, partnering on data, or just want to share thoughts, we want to hear from you.
          </p>

          <div className="animate-reveal animate-delay-3 mt-12">
            <CTAButton href="mailto:alexander@get-capital.com.au">
              alexander@get-capital.com.au
            </CTAButton>
          </div>

          <div className="animate-reveal animate-delay-4 mt-16 border-t border-[var(--color-border)] pt-10">
            <p className="text-sm text-[var(--color-muted)] uppercase tracking-wider font-medium mb-4">
              Specifically useful to hear from
            </p>
            <ul className="space-y-3 text-base text-[var(--color-muted-foreground)]">
              <li className="square-bullet">PE firms looking for Australian SME deal flow</li>
              <li className="square-bullet">M&A advisors interested in data partnerships</li>
              <li className="square-bullet">Business owners considering a sale in the next 12 months</li>
              <li className="square-bullet">Accountants who advise SME owners on exit planning</li>
            </ul>
          </div>
        </div>
      </div>
    </Section>
  );
}
