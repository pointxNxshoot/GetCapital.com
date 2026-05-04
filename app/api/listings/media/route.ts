import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";

// Service role client for storage operations (bypasses RLS)
const adminSupabase = createServiceClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// POST: Upload media for a listing
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const listingId = formData.get("listing_id") as string;
    const file = formData.get("file") as File;
    const displayOrder = parseInt(formData.get("display_order") as string) || 0;

    if (!listingId || !file) {
      return NextResponse.json({ error: "Missing listing_id or file" }, { status: 400 });
    }

    // Verify ownership via user's authenticated client
    const { data: listing } = await supabase
      .from("listings")
      .select("id")
      .eq("id", listingId)
      .eq("listing_owner_id", user.id)
      .single();

    if (!listing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }

    // Convert file to buffer for upload
    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = file.name.split(".").pop() || "jpg";
    const path = `listings/${listingId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    // Upload using admin client (service role bypasses storage RLS)
    const { error: uploadError } = await adminSupabase.storage
      .from("listing-media")
      .upload(path, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return NextResponse.json(
        { error: `Upload failed: ${uploadError.message}` },
        { status: 500 }
      );
    }

    // Get public URL
    const { data: urlData } = adminSupabase.storage
      .from("listing-media")
      .getPublicUrl(path);

    // Insert media record using admin client
    const { data: media, error: dbError } = await adminSupabase
      .from("listing_media")
      .insert({
        listing_id: listingId,
        url: urlData.publicUrl,
        media_type: file.type.startsWith("video") ? "video" : "image",
        display_order: displayOrder,
      })
      .select("id, url")
      .single();

    if (dbError) {
      console.error("Media DB error:", dbError);
      return NextResponse.json(
        { error: `Failed to save: ${dbError.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({ id: media.id, url: media.url });
  } catch (err) {
    console.error("Media POST error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Server error" },
      { status: 500 }
    );
  }
}

// DELETE: Remove a media item
export async function DELETE(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const mediaId = searchParams.get("id");

    if (!mediaId) {
      return NextResponse.json({ error: "Missing media id" }, { status: 400 });
    }

    // Soft delete using admin client
    await adminSupabase
      .from("listing_media")
      .update({ deleted_at: new Date().toISOString(), deleted_by: user.id })
      .eq("id", mediaId);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Media DELETE error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
