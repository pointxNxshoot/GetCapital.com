export const industryLabels: Record<string, string> = {
  cafe: "Specialty Café",
  restaurant: "Restaurants & Hospitality",
  retail: "Retail",
  ecommerce: "E-commerce",
  professional_services: "Professional Services",
  trades: "Trades & Services",
  health_wellness: "Health & Wellness",
  saas: "SaaS / Software",
  manufacturing: "Manufacturing & Wholesale",
  beauty: "Beauty & Personal Care",
  other: "Other",
};

export function getIndustryLabel(code: string): string {
  return industryLabels[code] || code;
}
