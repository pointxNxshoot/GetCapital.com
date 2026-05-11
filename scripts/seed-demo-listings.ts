import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";
import * as path from "path";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const DEMO_EMAIL = "demo@get-capital.com.au";
const DEMO_NAME = "Capital Demo Seller";

const LISTINGS = [
  {
    slug: "brew-lane",
    title: "Brew Lane Specialty Coffee",
    industry_code: "cafe",
    industry: "Cafés & Coffee Shops",
    location: "QLD",
    location_city: "Brisbane",
    asking_price: 485000,
    description_public: "Established specialty coffee shop in Brisbane's inner-north with a loyal local following and growing wholesale arm. Profitable, owner-operator-friendly, all systems documented for smooth transition.",
    description_private: "Brew Lane has operated for 8 years in Newstead, building a reputation for high-quality single-origin coffee and a welcoming community space. The business runs on a strong systemized model — we've documented all SOPs, supplier relationships, and staff training so the new owner can step in with minimal disruption.\n\nKey strengths: lease secured for 3 more years at favorable rates, consistent foot traffic from local apartment developments, growing wholesale arm supplying 4 local restaurants generating ~15% of revenue. The owner is selling to relocate interstate for family reasons.\n\nThe business has improving margins (EBITDA grew from $113k to $150k over the last 12 months) driven by wholesale expansion and operational efficiency gains.",
    reason_for_sale: "Owner relocating interstate for family reasons",
    inclusions: "All equipment (La Marzocca Linea PB espresso machine, Mahlkonig EK43 grinder, Mythos 2 grinder), POS system, customer database, supplier relationships, trained team of 5, all branding and IP including website and social accounts",
    years_in_operation: 8,
    employees_count: 7,
  },
  {
    slug: "stride-physio",
    title: "Stride Physiotherapy",
    industry_code: "health_wellness",
    industry: "Health & Wellness",
    location: "QLD",
    location_city: "Brisbane",
    asking_price: 695000,
    description_public: "Established physiotherapy clinic in Brisbane's western suburbs. 4 senior clinicians, strong patient base of 1,800 active patients, profitable with succession-ready team.",
    description_private: "Stride is a 9-year-old physiotherapy practice in Toowong, serving the local community with a focus on sports rehabilitation, post-surgical recovery, and chronic pain management.\n\nFinancials: $980k revenue, $245k EBITDA. Patient base of 1,800 active patients, with strong referral relationships from 4 local GPs and 2 surgeons. Repeat patient rate above 60%.\n\nTeam of 4 clinicians plus a practice manager. All clinicians are senior (8+ years experience) and have indicated willingness to stay through transition. The clinic operates from a 180sqm fitout in a high-traffic medical precinct, with a 6-year lease in place.\n\nGreat opportunity for another physio looking to step into ownership, or for an allied health group expanding their network.",
    reason_for_sale: "Founder transitioning to a teaching role at university, wants to ensure clinic continuity for staff and patients",
    inclusions: "All clinical equipment (4 treatment tables, dry needling, shockwave therapy, exercise equipment), patient records and database, team with continuity agreements, 6-year lease, brand and website, ongoing referral relationships with local medical professionals",
    years_in_operation: 9,
    employees_count: 5,
  },
  {
    slug: "coastal-hvac",
    title: "Coastal HVAC Services",
    industry_code: "trades",
    industry: "Trades & Construction Services",
    location: "SA",
    location_city: "Adelaide",
    asking_price: 745000,
    description_public: "Established residential and commercial HVAC contractor servicing Adelaide's eastern suburbs. Strong recurring service contract revenue, repeat clients, established team of licensed technicians.",
    description_private: "Coastal HVAC has provided heating, ventilation and air-conditioning services across Adelaide for 12 years. We specialize in installation, ongoing service contracts, and emergency repairs for both residential customers and small-to-mid commercial buildings.\n\nFinancials: $1.45M revenue, $312k EBITDA. About 42% of annual revenue comes from recurring service contracts — a significant differentiator in this sector. Customer base includes 850+ residential accounts and 60 commercial contracts.\n\nTeam: 5 fully-licensed HVAC technicians and 2 apprentices, all long-tenured. The lead technician is keen to stay on and is well-positioned to manage operations under a new owner. The founder works ~25 hours/week.\n\nIdeal buyer: existing trades business looking to add HVAC capabilities, or experienced HVAC professional wanting to step into ownership of a well-established operation.",
    reason_for_sale: "Founder pursuing other business interests, wants a buyer who will care for the team and existing customer relationships",
    inclusions: "Service vehicles (4 vans with full equipment fit-out), tools and diagnostic equipment, customer database with 850+ residential accounts, all commercial service contracts (60+ active), licenses and insurance arrangements, brand and website, transition support for 90 days post-sale",
    years_in_operation: 12,
    employees_count: 8,
  },
  {
    slug: "bolt-electrical",
    title: "Bolt Electrical Contractors",
    industry_code: "trades",
    industry: "Trades & Construction Services",
    location: "WA",
    location_city: "Perth",
    asking_price: 425000,
    description_public: "Established commercial and industrial electrical contractor servicing Perth metro and surrounding industrial areas. Strong reputation, established commercial client base, owner-operated with capable senior technician ready for transition.",
    description_private: "Bolt has provided commercial and industrial electrical services across Perth for 11 years, building a solid reputation for quality work on factory fit-outs, commercial premises maintenance, and small-to-mid construction projects.\n\nFinancials: $1.18M revenue, $285k EBITDA. About 55% of work is repeat business from established builders, facility managers, and commercial property owners.\n\nTeam: 3 fully-licensed electricians and 1 apprentice, all long-tenured. The lead electrician is interested in staying on under new ownership and would be capable of managing operations. The current owner works ~30 hours per week.\n\nWell-positioned for growth — Perth's commercial construction pipeline remains strong and the business has more inbound work than current capacity allows.",
    reason_for_sale: "Owner relocating to be closer to family on the east coast",
    inclusions: "Vehicles (3 fully-equipped vans), tools and testing equipment, client database with active commercial contracts, all licenses and insurance, ongoing project commitments, brand and website",
    years_in_operation: 11,
    employees_count: 5,
  },
  {
    slug: "tidewater",
    title: "Tidewater Goods",
    industry_code: "ecommerce",
    industry: "E-commerce Business",
    location: "VIC",
    location_city: "Melbourne",
    asking_price: 320000,
    description_public: "Curated DTC homewares brand with 18,000-strong email list and Melbourne-based fulfillment. Profitable, growing, ready for marketing-savvy owner to scale further.",
    description_private: "Tidewater Goods sells curated sustainable homewares (linens, ceramics, kitchenware, decor) directly to consumers via Shopify with a complementary small retail showroom in Melbourne. Built over 4 years from a market stall into a real DTC brand with a loyal customer base.\n\nFinancials: $480k revenue, $128k EBITDA, 38% gross margin. Repeat customer rate of 42%. LTV/CAC of 4.1x. Email list of 18,400 subscribers with strong open rates and engaged community.\n\nSupply chain is established with 6 reliable suppliers across Australia and Indonesia. Inventory held in our Melbourne warehouse, shipped via Sendle Australia-wide. Small retail showroom provides additional revenue stream (~15% of sales).\n\nThe business is currently bottlenecked by founder bandwidth. A buyer with marketing expertise or operational support could meaningfully scale this brand.",
    reason_for_sale: "Founder having a child and wanting to step back from day-to-day operations",
    inclusions: "Shopify store and admin access, all product photography and brand assets, email list (18,400 subscribers), supplier contracts and relationships, current inventory (~$45k value), retail showroom lease (assignable), brand IP and trademarks",
    years_in_operation: 4,
    employees_count: 2,
  },
  {
    slug: "placeholder",
    title: "Sixth Listing — TBD",
    industry_code: "professional_services",
    industry: "Professional Services",
    location: "NSW",
    location_city: "Sydney",
    asking_price: 580000,
    description_public: "This listing slot is being prepared. Final business details and photos will be added soon.",
    description_private: "Placeholder listing — to be updated with real business and photos.",
    reason_for_sale: "TBD",
    inclusions: "TBD",
    years_in_operation: 8,
    employees_count: 6,
  },
];

async function main() {
  console.log("Starting demo listing seed...\n");

  // 1. Ensure demo seller user
  let demoUserId: string;

  const { data: existingUser } = await supabase
    .from("users")
    .select("id")
    .eq("email", DEMO_EMAIL)
    .single();

  if (existingUser) {
    demoUserId = existingUser.id;
    console.log(`✓ Demo seller exists: ${demoUserId}`);
  } else {
    // Create auth user first
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email: DEMO_EMAIL,
      password: "demo-seed-password-not-for-login",
      email_confirm: true,
      user_metadata: { full_name: DEMO_NAME },
    });

    if (authError) {
      // User might exist in auth but not in public.users
      const { data: authList } = await supabase.auth.admin.listUsers();
      const found = authList?.users?.find((u) => u.email === DEMO_EMAIL);
      if (found) {
        demoUserId = found.id;
        // Ensure public.users row exists
        await supabase.from("users").upsert({
          id: found.id,
          email: DEMO_EMAIL,
          full_name: DEMO_NAME,
          role: "member",
          is_seller: true,
          account_status: "active",
        });
        console.log(`✓ Demo seller (existing auth): ${demoUserId}`);
      } else {
        console.error("✗ Failed to create demo user:", authError);
        process.exit(1);
      }
    } else {
      demoUserId = authUser.user.id;
      // The trigger should create the public.users row, but ensure it
      await new Promise((r) => setTimeout(r, 1000));
      await supabase.from("users").upsert({
        id: demoUserId,
        email: DEMO_EMAIL,
        full_name: DEMO_NAME,
        role: "member",
        is_seller: true,
        account_status: "active",
      });
      console.log(`✓ Demo seller created: ${demoUserId}`);
    }
  }

  // 2. Insert listings (idempotent)
  const listingIds: Record<string, string> = {};

  for (const listing of LISTINGS) {
    // Check if exists
    const { data: existing } = await supabase
      .from("listings")
      .select("id")
      .eq("title", listing.title)
      .eq("is_demo", true)
      .single();

    if (existing) {
      listingIds[listing.slug] = existing.id;
      console.log(`  - ${listing.title} (exists: ${existing.id})`);
      continue;
    }

    const { data: inserted, error } = await supabase
      .from("listings")
      .insert({
        listing_owner_id: demoUserId,
        title: listing.title,
        industry: listing.industry,
        industry_code: listing.industry_code,
        location: listing.location,
        location_city: listing.location_city,
        asking_price: listing.asking_price,
        description_public: listing.description_public,
        description_private: listing.description_private,
        reason_for_sale: listing.reason_for_sale,
        inclusions: listing.inclusions,
        years_in_operation: listing.years_in_operation,
        employees_count: listing.employees_count,
        status: "active",
        is_demo: true,
        slug: listing.slug,
        approved_at: new Date().toISOString(),
      })
      .select("id")
      .single();

    if (error) {
      console.error(`  ✗ ${listing.title}: ${error.message}`);
      continue;
    }

    listingIds[listing.slug] = inserted.id;
    console.log(`  ✓ ${listing.title} (inserted: ${inserted.id})`);
  }

  // 3. Insert listing_media
  console.log("\n✓ Listing photos:");
  const demoDir = path.join(process.cwd(), "public", "demo-listings");

  for (const listing of LISTINGS) {
    const listingId = listingIds[listing.slug];
    if (!listingId) continue;

    const folderPath = path.join(demoDir, listing.slug);
    if (!fs.existsSync(folderPath)) {
      console.log(`  - ${listing.slug}: folder not found, skipping`);
      continue;
    }

    const files = fs.readdirSync(folderPath).filter((f) => !f.startsWith("."));
    let heroCount = 0;
    let supportingCount = 0;

    for (const file of files) {
      const storagePath = `/demo-listings/${listing.slug}/${file}`;

      // Check if already exists
      const { data: existingMedia } = await supabase
        .from("listing_media")
        .select("id")
        .eq("listing_id", listingId)
        .eq("url", storagePath)
        .single();

      if (existingMedia) {
        const isHero = file.includes("-1-hero");
        if (isHero) heroCount++;
        else supportingCount++;
        continue;
      }

      // Parse order and hero status from filename
      const match = file.match(/-(\d+)-(\w+)\./);
      const order = match ? parseInt(match[1]) : 0;
      const isHero = file.includes("-1-hero");
      const ext = path.extname(file).slice(1);
      const mediaType = ext === "png" ? "image" : "image";

      // Generate alt text
      const businessName = listing.title;
      const descPart = match ? match[2] : "photo";
      const altText = `${businessName} ${descPart}`;

      const { error: mediaError } = await supabase.from("listing_media").insert({
        listing_id: listingId,
        url: storagePath,
        media_type: mediaType,
        display_order: order,
        is_primary: isHero,
        alt_text: altText,
      });

      if (mediaError) {
        console.error(`    ✗ ${file}: ${mediaError.message}`);
      } else {
        if (isHero) heroCount++;
        else supportingCount++;
      }
    }

    console.log(`  - ${listing.slug}: ${heroCount + supportingCount} photos (${heroCount} hero, ${supportingCount} supporting)`);
  }

  // Summary
  const totalPhotos = Object.keys(listingIds).length > 0
    ? fs.readdirSync(demoDir)
        .filter((d) => fs.statSync(path.join(demoDir, d)).isDirectory())
        .reduce((sum, d) => sum + fs.readdirSync(path.join(demoDir, d)).filter((f) => !f.startsWith(".")).length, 0)
    : 0;

  console.log(`\nTotal: ${Object.keys(listingIds).length} listings, ${totalPhotos} photos`);
  console.log("\n✓ Seed complete.");
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
