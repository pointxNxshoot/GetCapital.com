import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// POST: Save addbacks for a listing
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { listing_id, addbacks } = body;

    if (!listing_id) {
      return NextResponse.json({ error: "Missing listing_id" }, { status: 400 });
    }

    // Verify ownership
    const { data: listing } = await supabase
      .from("listings")
      .select("id")
      .eq("id", listing_id)
      .eq("listing_owner_id", user.id)
      .single();

    if (!listing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }

    // Get the most recent submission for this listing
    const { data: submission } = await supabase
      .from("financial_submissions")
      .select("id")
      .eq("listing_id", listing_id)
      .order("submitted_at", { ascending: false })
      .limit(1)
      .single();

    if (!submission) {
      return NextResponse.json({ error: "Submit financials first" }, { status: 400 });
    }

    // Delete existing addbacks for this submission
    await supabase.from("ebitda_addbacks").delete().eq("submission_id", submission.id);

    // Insert new addbacks
    if (addbacks?.length > 0) {
      await supabase.from("ebitda_addbacks").insert(
        addbacks.map((a: { description: string; amount: number; category: string }) => ({
          submission_id: submission.id,
          description: a.description,
          amount: Math.round(a.amount),
          category: a.category,
        }))
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Addbacks POST error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
