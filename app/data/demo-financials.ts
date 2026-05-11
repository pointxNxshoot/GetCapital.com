// Demo listing financial data
// Used by the listing detail page to display financial summaries for is_demo listings
// Real listings draw this data from financial_submissions and financial_lines tables

export type DemoFinancials = {
  listing_slug: string;
  revenue_ltm: number;
  ebitda_ltm: number;
  revenue_growth: number;
  ebitda_margin: number;
  revenue_history: { year: string; value: number }[];
  ebitda_history: { year: string; value: number }[];
  customer_concentration: "low" | "medium" | "high";
  recurring_revenue_pct: number;
  owner_hours_per_week: number;
};

export const demoFinancials: Record<string, DemoFinancials> = {
  "brew-lane": {
    listing_slug: "brew-lane",
    revenue_ltm: 1247850,
    ebitda_ltm: 149903,
    revenue_growth: 0.136,
    ebitda_margin: 0.120,
    revenue_history: [
      { year: "FY2022", value: 945000 },
      { year: "FY2023", value: 1098420 },
      { year: "FY2024", value: 1247850 },
    ],
    ebitda_history: [
      { year: "FY2022", value: 89000 },
      { year: "FY2023", value: 113309 },
      { year: "FY2024", value: 149903 },
    ],
    customer_concentration: "low",
    recurring_revenue_pct: 0.15,
    owner_hours_per_week: 45,
  },

  "stride-physio": {
    listing_slug: "stride-physio",
    revenue_ltm: 982400,
    ebitda_ltm: 245600,
    revenue_growth: 0.082,
    ebitda_margin: 0.250,
    revenue_history: [
      { year: "FY2022", value: 845000 },
      { year: "FY2023", value: 908000 },
      { year: "FY2024", value: 982400 },
    ],
    ebitda_history: [
      { year: "FY2022", value: 198000 },
      { year: "FY2023", value: 220500 },
      { year: "FY2024", value: 245600 },
    ],
    customer_concentration: "low",
    recurring_revenue_pct: 0.60,
    owner_hours_per_week: 35,
  },

  "coastal-hvac": {
    listing_slug: "coastal-hvac",
    revenue_ltm: 1452000,
    ebitda_ltm: 312000,
    revenue_growth: 0.110,
    ebitda_margin: 0.215,
    revenue_history: [
      { year: "FY2022", value: 1178000 },
      { year: "FY2023", value: 1308000 },
      { year: "FY2024", value: 1452000 },
    ],
    ebitda_history: [
      { year: "FY2022", value: 232000 },
      { year: "FY2023", value: 275000 },
      { year: "FY2024", value: 312000 },
    ],
    customer_concentration: "medium",
    recurring_revenue_pct: 0.42,
    owner_hours_per_week: 25,
  },

  "bolt-electrical": {
    listing_slug: "bolt-electrical",
    revenue_ltm: 1180000,
    ebitda_ltm: 285000,
    revenue_growth: 0.085,
    ebitda_margin: 0.241,
    revenue_history: [
      { year: "FY2022", value: 998000 },
      { year: "FY2023", value: 1087000 },
      { year: "FY2024", value: 1180000 },
    ],
    ebitda_history: [
      { year: "FY2022", value: 228000 },
      { year: "FY2023", value: 253000 },
      { year: "FY2024", value: 285000 },
    ],
    customer_concentration: "medium",
    recurring_revenue_pct: 0.55,
    owner_hours_per_week: 30,
  },

  tidewater: {
    listing_slug: "tidewater",
    revenue_ltm: 480000,
    ebitda_ltm: 128000,
    revenue_growth: 0.220,
    ebitda_margin: 0.267,
    revenue_history: [
      { year: "FY2022", value: 322000 },
      { year: "FY2023", value: 393000 },
      { year: "FY2024", value: 480000 },
    ],
    ebitda_history: [
      { year: "FY2022", value: 78000 },
      { year: "FY2023", value: 102000 },
      { year: "FY2024", value: 128000 },
    ],
    customer_concentration: "low",
    recurring_revenue_pct: 0.42,
    owner_hours_per_week: 50,
  },

  placeholder: {
    listing_slug: "placeholder",
    revenue_ltm: 720000,
    ebitda_ltm: 215000,
    revenue_growth: 0.080,
    ebitda_margin: 0.299,
    revenue_history: [
      { year: "FY2022", value: 612000 },
      { year: "FY2023", value: 667000 },
      { year: "FY2024", value: 720000 },
    ],
    ebitda_history: [
      { year: "FY2022", value: 178000 },
      { year: "FY2023", value: 195000 },
      { year: "FY2024", value: 215000 },
    ],
    customer_concentration: "low",
    recurring_revenue_pct: 0.30,
    owner_hours_per_week: 30,
  },
};
