import { ComingSoon } from "@/components/swiss/coming-soon";

export const metadata = {
  title: "Valuation Tool — Capital",
  description: "Get a data-driven business valuation powered by real Australian transaction data.",
};

export default function ValuationPage() {
  return (
    <ComingSoon
      pageName="Valuation Tool"
      headline="What's your business really worth?"
      subheadline="Our valuation engine combines industry benchmarks, real comparable transactions, and your specific financials to produce defensible business valuations in minutes."
      bodyParagraph="We're refining the methodology with input from PE firms, M&A advisors, and business owners. Be the first to use it — we'll notify you when it goes live."
      featureBullets={[
        "Industry-specific multiple ranges across SDE, EBITDA, ARR, and Revenue methods",
        "Real comparable transactions from completed deals on the platform and beyond",
        "Trust-weighted methodology — every data source carries an explicit confidence score",
        "Detailed valuation report with full methodology breakdown",
      ]}
      variant="purple-gradient"
    />
  );
}
