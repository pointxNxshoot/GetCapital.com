import { ComingSoon } from "@/components/swiss/coming-soon";

export const metadata = {
  title: "Marketplace Listings",
  description: "Browse quality Australian businesses for sale with verified financials.",
  openGraph: {
    title: "Marketplace Listings — Get Capital",
    description: "Browse quality Australian businesses for sale with verified financials.",
  },
};

export default function ListingsPage() {
  return (
    <ComingSoon
      pageName="Marketplace Listings"
      headline="Quality businesses. Verified financials."
      subheadline="A curated marketplace for buying and selling Australian SMBs — with structured financial data, NDA-gated access, and direct connections between qualified buyers and sellers."
      bodyParagraph="We're working with our first sellers and buyer network to ensure every listing meets a real standard. Add your email and we'll notify you when listings go live."
      featureBullets={[
        "Verified financial data — Xero-connected or accountant-reviewed",
        "Industry-specific operating metrics for every business",
        "NDA-gated access to confidential information",
        "Direct buyer-seller messaging once approved",
      ]}
      variant="orange"
    />
  );
}
