import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// POST: Save financial data for a listing
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { listing_id, periods } = body;

    if (!listing_id || !periods) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
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

    // Delete existing submissions for this listing (replace on re-save)
    const { data: existingSubs } = await supabase
      .from("financial_submissions")
      .select("id")
      .eq("listing_id", listing_id);

    if (existingSubs?.length) {
      const subIds = existingSubs.map((s: { id: string }) => s.id);
      await supabase.from("financial_lines").delete().in("submission_id", subIds);
      await supabase.from("financial_submissions").delete().eq("listing_id", listing_id);
    }

    // Create submissions and lines for each period
    for (const period of periods) {
      const { data: submission, error: subError } = await supabase
        .from("financial_submissions")
        .insert({
          listing_id,
          period_start: `${period.year}-01-01`,
          period_end: `${period.year}-12-31`,
          currency: "AUD",
          submitted_by: user.id,
        })
        .select("id")
        .single();

      if (subError || !submission) {
        console.error("Submission insert error:", subError);
        continue;
      }

      const lines = [
        { line_item: "Revenue", amount: period.revenue, display_order: 1 },
        { line_item: "COGS", amount: period.cogs, display_order: 2 },
        { line_item: "Gross Profit", amount: period.gross_profit, display_order: 3 },
        { line_item: "Operating Expenses", amount: period.opex, display_order: 4 },
        { line_item: "EBITDA", amount: period.ebitda, display_order: 5 },
      ].filter((l) => l.amount !== null && l.amount !== undefined);

      if (lines.length > 0) {
        await supabase.from("financial_lines").insert(
          lines.map((l) => ({
            submission_id: submission.id,
            statement_type: "income_statement",
            line_item: l.line_item,
            amount: Math.round(l.amount),
            display_order: l.display_order,
          }))
        );
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Financials POST error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
