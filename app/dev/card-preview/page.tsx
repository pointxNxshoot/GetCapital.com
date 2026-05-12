import { createClient } from "@supabase/supabase-js";
import { ListingCard, type ListingCardData } from "@/components/marketplace/listing-card";
import { demoFinancials } from "@/app/data/demo-financials";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const metadata = { title: "ListingCard Preview" };

export default async function CardPreviewPage() {
  // Fetch demo listings
  const { data: listings } = await supabase
    .from("listings")
    .select("id, slug, title, industry_code, location, location_city, asking_price, description_public, years_in_operation, employees_count, is_demo")
    .eq("is_demo", true)
    .eq("status", "active")
    .order("asking_price", { ascending: false });

  if (!listings || listings.length === 0) {
    return (
      <div className="mx-auto max-w-[var(--container-max)] px-8 lg:px-12 py-20">
        <p>No demo listings found. Run: npx tsx scripts/seed-demo-listings.ts</p>
      </div>
    );
  }

  // Fetch photos for all listing IDs
  const listingIds = listings.map((l) => l.id);
  const { data: allPhotos } = await supabase
    .from("listing_media")
    .select("listing_id, url, alt_text, display_order, is_primary")
    .in("listing_id", listingIds)
    .is("deleted_at", null)
    .order("display_order");

  // Build card data
  const cards: ListingCardData[] = listings.map((l) => {
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
    <div className="mx-auto max-w-[var(--container-max)] px-8 lg:px-12 py-20">
      <div className="mb-16">
        <p className="text-sm uppercase tracking-wider text-[var(--color-muted)] mb-4">
          Development preview
        </p>
        <h1
          className="text-3xl tracking-tight leading-none"
          style={{ fontFamily: "var(--font-display)" }}
        >
          ListingCard component.
        </h1>
        <p className="text-base text-[var(--color-muted-foreground)] mt-4 max-w-xl">
          {cards.length} demo listings rendered with the marketplace card component. This page is for design iteration — it will be removed before launch.
        </p>
      </div>

      <div className="divide-y divide-[var(--color-border)]">
        {cards.map((card, index) => (
          <div key={card.id} className="py-8 first:pt-0 last:pb-0">
            <ListingCard listing={card} priority={index < 3} />
          </div>
        ))}
      </div>
    </div>
  );
}
