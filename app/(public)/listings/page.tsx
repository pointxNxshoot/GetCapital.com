import { createClient } from "@supabase/supabase-js";
import { ListingCard, type ListingCardData } from "@/components/marketplace/listing-card";
import { demoFinancials } from "@/app/data/demo-financials";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const metadata = {
  title: "Marketplace Listings",
  description: "Browse quality Australian businesses for sale with verified financials.",
  openGraph: {
    title: "Marketplace Listings — Get Capital",
    description: "Browse quality Australian businesses for sale with verified financials.",
  },
};

export default async function ListingsPage() {
  const { data: listings } = await supabase
    .from("listings")
    .select("id, slug, title, industry_code, location, location_city, asking_price, description_public, years_in_operation, employees_count, is_demo, status")
    .eq("status", "active")
    .order("asking_price", { ascending: false });

  const activeListings = listings || [];

  // Fetch photos
  const listingIds = activeListings.map((l) => l.id);
  const { data: allPhotos } = listingIds.length > 0
    ? await supabase
        .from("listing_media")
        .select("listing_id, url, alt_text, display_order, is_primary")
        .in("listing_id", listingIds)
        .is("deleted_at", null)
        .order("display_order")
    : { data: [] };

  const cards: ListingCardData[] = activeListings.map((l) => {
    const photos = (allPhotos || [])
      .filter((p) => p.listing_id === l.id)
      .map((p) => ({
        storage_path: p.url,
        alt_text: p.alt_text || l.title,
        display_order: p.display_order,
        is_primary: p.is_primary || false,
      }));

    const financials = l.slug ? demoFinancials[l.slug] : null;

    return {
      id: l.id,
      slug: l.slug || l.id,
      business_name: l.title,
      industry_code: l.industry_code,
      location_state: l.location,
      location_city: l.location_city || "",
      asking_price: l.asking_price,
      public_description: l.description_public,
      years_in_operation: l.years_in_operation || 0,
      employees_count: l.employees_count || 0,
      is_demo: l.is_demo || false,
      photos,
      revenue_ltm: financials?.revenue_ltm || 0,
      ebitda_ltm: financials?.ebitda_ltm || 0,
    };
  });

  return (
    <>
      {/* Orange hero band */}
      <section className="bg-[var(--color-accent-orange)]">
        <div className="mx-auto max-w-[var(--container-max)] px-6 md:px-12 py-16 md:py-24">
          <p className="inline-block px-3 py-1 mb-6 border border-white/40 rounded-full text-[11px] font-medium tracking-wider uppercase text-white">
            Marketplace
          </p>
          <h1
            className="text-white max-w-[20ch]"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "var(--font-size-display-lg)",
              letterSpacing: "-0.03em",
              lineHeight: "1",
              fontWeight: 500,
            }}
          >
            Businesses for sale.
          </h1>
          <p className="mt-6 max-w-[55ch] text-base md:text-lg text-white/85 leading-relaxed">
            Curated marketplace of Australian SMEs with verified financials, transparent metrics, and direct access to owners.
          </p>
        </div>
      </section>

      {/* Listings */}
      <section className="bg-[var(--color-background)]">
        <div className="mx-auto max-w-[var(--container-max)] px-6 md:px-12 py-12 md:py-16">
          {cards.length > 0 ? (
            <div className="space-y-6">
              {cards.map((card, index) => (
                <ListingCard key={card.id} listing={card} priority={index < 3} />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center">
              <p className="text-lg text-[var(--color-muted-foreground)]">
                No listings available yet. Check back soon.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
