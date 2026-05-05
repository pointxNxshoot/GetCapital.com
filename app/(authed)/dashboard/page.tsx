import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CTAButton } from "@/components/swiss/cta-button";
import { Stat } from "@/components/dashboard/stat";
import { ActivityItem } from "@/components/dashboard/activity-item";
import { InsightItem } from "@/components/dashboard/insight-item";

export const metadata = { title: "Dashboard" };

function formatViews(count: number) {
  if (count >= 1000) return `${(count / 1000).toFixed(1)}k`;
  return count.toString();
}

function formatPrice(price: number) {
  if (price >= 1000000) return `$${(price / 1000000).toFixed(1)}M`;
  if (price >= 1000) return `$${Math.round(price / 1000)}k`;
  return `$${price}`;
}

function relativeTime(date: string): string {
  const now = new Date();
  const then = new Date(date);
  const diffMs = now.getTime() - then.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return `${Math.floor(diffDays / 30)} months ago`;
}

function daysSince(date: string): number {
  return Math.floor((Date.now() - new Date(date).getTime()) / (1000 * 60 * 60 * 24));
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/signin");

  // Fetch user profile
  const { data: profile } = await supabase
    .from("users")
    .select("full_name, is_seller, is_buyer, is_admin")
    .eq("id", user.id)
    .single();

  const firstName = profile?.full_name?.split(" ")[0] || "there";

  // Fetch user's listings
  const { data: listings } = await supabase
    .from("listings")
    .select("id, title, status, asking_price, view_count_total, inquiry_count_total, created_at, submitted_at, approved_at")
    .eq("listing_owner_id", user.id)
    .order("created_at", { ascending: false });

  const userListings = listings || [];
  const draftListings = userListings.filter((l) => l.status === "draft");
  const activeListings = userListings.filter((l) => l.status === "active");
  const pendingListings = userListings.filter((l) => l.status === "pending_approval");
  const soldListings = userListings.filter((l) => l.status === "sold");

  // Fetch pending inquiries (threads where user is listing owner)
  const { data: inquiries } = await supabase
    .from("message_threads")
    .select("id, status, listing_id, created_at")
    .eq("listing_owner_id", user.id)
    .eq("status", "pending");

  const pendingInquiries = inquiries || [];

  // Fetch saved listings count
  const { count: savedCount } = await supabase
    .from("saved_listings")
    .select("id", { count: "exact", head: true })
    .eq("saver_user_id", user.id);

  // Status message
  const statusMessage = getStatusMessage(userListings, pendingInquiries, activeListings, draftListings, soldListings);

  // Metrics
  const hasPublishedListing = activeListings.length > 0 || soldListings.length > 0;
  const totalViews = activeListings.reduce((sum, l) => sum + (l.view_count_total || 0), 0);
  const mostRecentActive = activeListings[0];
  const daysListed = mostRecentActive?.approved_at ? daysSince(mostRecentActive.approved_at) : 0;

  // Activity feed — recent listing events
  const activities: { id: string; timeLabel: string; message: string; link?: { href: string; label: string } }[] = [];

  for (const l of userListings.slice(0, 5)) {
    if (l.status === "active" && l.approved_at) {
      activities.push({
        id: `approved-${l.id}`,
        timeLabel: relativeTime(l.approved_at),
        message: `"${l.title}" was approved and is now live on the marketplace.`,
        link: { href: `/listings/${l.id}`, label: "View listing" },
      });
    } else if (l.status === "pending_approval" && l.submitted_at) {
      activities.push({
        id: `submitted-${l.id}`,
        timeLabel: relativeTime(l.submitted_at),
        message: `"${l.title}" was submitted for review.`,
      });
    } else if (l.status === "draft") {
      activities.push({
        id: `draft-${l.id}`,
        timeLabel: relativeTime(l.created_at),
        message: `Draft listing "${l.title}" was started.`,
        link: { href: `/listings/create`, label: "Continue editing" },
      });
    }
  }

  for (const inq of pendingInquiries.slice(0, 3)) {
    activities.push({
      id: `inquiry-${inq.id}`,
      timeLabel: relativeTime(inq.created_at),
      message: "New inquiry received from a buyer.",
      link: { href: "/dashboard/inquiries", label: "Review" },
    });
  }

  activities.sort((a, b) => 0); // Already ordered by recency from queries

  return (
    <main className="bg-[var(--color-background)]">
      {/* Section 1: Personalized hero */}
      <section className="pt-20 pb-12">
        <div className="mx-auto max-w-[var(--container-max)] px-8 lg:px-12">
          <h1
            className="tracking-tight leading-none"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "var(--font-size-display-md)",
              letterSpacing: "-0.02em",
              lineHeight: "1.05",
            }}
          >
            Welcome back,
            <br />
            {firstName}.
          </h1>
          <p className="text-xl text-[var(--color-muted-foreground)] mt-6 max-w-2xl">
            {statusMessage}
          </p>
        </div>
      </section>

      {/* Section 2: Metrics (conditional) */}
      {hasPublishedListing && (
        <section className="py-12 border-t border-[var(--color-border)]">
          <div className="mx-auto max-w-[var(--container-max)] px-8 lg:px-12">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
              <Stat
                number={formatViews(totalViews)}
                label="Listing views"
                sublabel="all time"
              />
              <Stat
                number={pendingInquiries.length.toString()}
                label="Inquiries"
                sublabel="pending review"
              />
              <Stat
                number={mostRecentActive ? formatPrice(mostRecentActive.asking_price) : "—"}
                label="Asking price"
                sublabel="your listing"
              />
              <Stat
                number={daysListed > 0 ? `${daysListed} days` : "—"}
                label="Listed"
                sublabel="and counting"
              />
            </div>
          </div>
        </section>
      )}

      {/* Section 3: Primary actions */}
      <section className="py-20 border-t border-[var(--color-border)]">
        <div className="mx-auto max-w-[var(--container-max)] px-8 lg:px-12">
          <div className="grid grid-cols-12 gap-8 lg:gap-12">
            {/* Action 1: Listings */}
            <div className="col-span-12 lg:col-span-4 flex flex-col h-full">
              <p className="text-sm uppercase tracking-wider text-[var(--color-muted)] mb-4">01</p>
              <h2
                className="text-3xl tracking-tight leading-none mb-4"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Your listings
              </h2>
              <p className="text-base text-[var(--color-muted-foreground)] mb-8 max-w-sm">
                {userListings.length > 0
                  ? `You have ${userListings.length} ${userListings.length === 1 ? "listing" : "listings"}. Manage details, review status, or create another.`
                  : "Get your business in front of qualified buyers. Start by creating a listing."
                }
              </p>
              <div className="mt-auto">
                <CTAButton href={userListings.length > 0 ? "/dashboard" : "/listings/create"}>
                  {userListings.length > 0 ? "View listings" : "Create listing"}
                </CTAButton>
              </div>
            </div>

            {/* Action 2: Saved listings */}
            <div className="col-span-12 lg:col-span-4 flex flex-col h-full">
              <p className="text-sm uppercase tracking-wider text-[var(--color-muted)] mb-4">02</p>
              <h2
                className="text-3xl tracking-tight leading-none mb-4"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Saved listings
              </h2>
              <p className="text-base text-[var(--color-muted-foreground)] mb-8 max-w-sm">
                Businesses you&apos;re tracking on the marketplace. Get notified when key details change.
              </p>
              <div className="mt-auto">
                <CTAButton href="/listings" variant="outline">
                  {(savedCount || 0) > 0 ? `View ${savedCount} saved` : "Browse marketplace"}
                </CTAButton>
              </div>
            </div>

            {/* Action 3: Inquiries */}
            <div className="col-span-12 lg:col-span-4 flex flex-col h-full">
              <p className="text-sm uppercase tracking-wider text-[var(--color-muted)] mb-4">03</p>
              <h2
                className="text-3xl tracking-tight leading-none mb-4"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Inquiries
              </h2>
              <p className="text-base text-[var(--color-muted-foreground)] mb-8 max-w-sm">
                {pendingInquiries.length > 0
                  ? `${pendingInquiries.length} new ${pendingInquiries.length === 1 ? "inquiry needs" : "inquiries need"} your response.`
                  : "Buyer inquiries on your listings appear here."
                }
              </p>
              <div className="mt-auto">
                <CTAButton href="/dashboard/inquiries" variant="outline">
                  View inquiries
                </CTAButton>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Recent activity (conditional) */}
      {activities.length > 0 && (
        <section className="py-20 border-t border-[var(--color-border)]">
          <div className="mx-auto max-w-[var(--container-max)] px-8 lg:px-12">
            <p className="text-sm uppercase tracking-wider text-[var(--color-muted)] mb-4">
              Recent activity
            </p>
            <h2
              className="text-3xl tracking-tight leading-none mb-12"
              style={{ fontFamily: "var(--font-display)" }}
            >
              What&apos;s happening
            </h2>
            <div className="space-y-0">
              {activities.map((activity) => (
                <ActivityItem key={activity.id} {...activity} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Section 5: Market insight (universal) */}
      <section className="py-20 border-t border-[var(--color-border)]">
        <div className="mx-auto max-w-[var(--container-max)] px-8 lg:px-12 grid grid-cols-12 gap-12">
          <div className="col-span-12 lg:col-span-4">
            <p className="text-sm uppercase tracking-wider text-[var(--color-muted)] mb-4">
              Market insight
            </p>
            <h2
              className="text-3xl tracking-tight leading-none"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Recent benchmarks.
            </h2>
          </div>
          <div className="col-span-12 lg:col-span-8 space-y-8">
            <InsightItem
              metric="3.2x – 4.1x"
              category="EBITDA multiples"
              description="Cafés sold in QLD over the last 90 days, based on comparable transaction data."
            />
            <InsightItem
              metric="$385k – $620k"
              category="Specialty café range"
              description="Median asking-to-sale gap is currently 8% in Australian F&B."
            />
            <InsightItem
              metric="42 days"
              category="Median time to inquiry"
              description="From listing publication to first qualified buyer interest."
            />
          </div>
        </div>
      </section>
    </main>
  );
}

function getStatusMessage(
  listings: { status: string; view_count_total: number }[],
  pendingInquiries: { id: string }[],
  activeListings: { status: string; view_count_total: number }[],
  draftListings: { status: string }[],
  soldListings: { status: string }[],
): string {
  if (!listings.length) {
    return "Get your business in front of qualified buyers. Start by creating a listing or value your business first.";
  }

  if (pendingInquiries.length > 0) {
    return `You have ${pendingInquiries.length} new ${pendingInquiries.length === 1 ? "inquiry" : "inquiries"} waiting for your response.`;
  }

  if (draftListings.length > 0) {
    return "Your draft listing is ready to be submitted. Finish it and reach buyers.";
  }

  if (activeListings.length > 0) {
    const totalViews = activeListings.reduce((sum, l) => sum + (l.view_count_total || 0), 0);
    return `Your ${activeListings.length === 1 ? "listing has" : "listings have"} been viewed ${totalViews} times.`;
  }

  if (soldListings.length > 0) {
    return "Congratulations on your sale. Your listing is closed.";
  }

  return "Browse listings or value your business to explore the marketplace.";
}
