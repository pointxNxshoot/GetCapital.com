import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendEmail } from "@/lib/email";
import ListingSubmitted from "@/emails/listing-submitted";
import AdminAlertNotify from "@/emails/admin-alert-notify";
import { createElement } from "react";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "alexander@get-capital.com.au";

// POST: Create a new draft listing
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Generate slug from business name
    const slug = (body.title || "draft")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      + "-" + Date.now().toString(36);

    const { data: listing, error } = await supabase
      .from("listings")
      .insert({
        listing_owner_id: user.id,
        title: body.title || "Untitled listing",
        industry: body.industry || "",
        industry_code: body.industry_code || "other",
        location: body.location || "",
        asking_price: body.asking_price || 0,
        description_public: body.description_public || "",
        description_private: body.description_private || "",
        status: "draft",
        slug,
      })
      .select("id")
      .single();

    if (error) {
      console.error("Create listing error:", JSON.stringify(error, null, 2));
      return NextResponse.json(
        { error: `Failed to create listing: ${error.message}`, code: error.code, details: error.details },
        { status: 500 }
      );
    }

    // Mark user as seller if not already
    await supabase
      .from("users")
      .update({ is_seller: true })
      .eq("id", user.id);

    return NextResponse.json({ id: listing.id });
  } catch (err) {
    console.error("Listings POST error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// PATCH: Update an existing draft listing
export async function PATCH(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: "Listing ID required" }, { status: 400 });
    }

    // If submitting for review
    if (updates.status === "pending_approval") {
      updates.submitted_at = new Date().toISOString();

      const { error } = await supabase
        .from("listings")
        .update(updates)
        .eq("id", id)
        .eq("listing_owner_id", user.id);

      if (error) {
        console.error("Submit listing error:", error);
        return NextResponse.json({ error: "Failed to submit" }, { status: 500 });
      }

      // Get listing details for email
      const { data: listing } = await supabase
        .from("listings")
        .select("title")
        .eq("id", id)
        .single();

      // Get user profile for email
      const { data: profile } = await supabase
        .from("users")
        .select("full_name, email")
        .eq("id", user.id)
        .single();

      const firstName = profile?.full_name?.split(" ")[0] || "there";

      // Send emails
      await Promise.all([
        sendEmail({
          to: profile?.email || user.email!,
          subject: "Your listing has been submitted",
          react: createElement(ListingSubmitted, {
            firstName,
            listingAddress: listing?.title || "your business",
            listingId: id,
          }),
        }),
        sendEmail({
          to: ADMIN_EMAIL,
          subject: `New listing submitted: ${listing?.title}`,
          react: createElement(AdminAlertNotify, {
            email: profile?.email || user.email!,
            source: "listing_submission",
            timestamp: new Date().toISOString(),
          }),
        }),
      ]);

      return NextResponse.json({ success: true });
    }

    // Regular draft save
    const { error } = await supabase
      .from("listings")
      .update(updates)
      .eq("id", id)
      .eq("listing_owner_id", user.id);

    if (error) {
      console.error("Update listing error:", error);
      return NextResponse.json({ error: "Failed to save" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Listings PATCH error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
