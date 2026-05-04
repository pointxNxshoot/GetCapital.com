import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

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

    // Verify ownership
    const { data: listing } = await supabase
      .from("listings")
      .select("id")
      .eq("id", listingId)
      .eq("listing_owner_id", user.id)
      .single();

    if (!listing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }

    // Upload to Supabase Storage
    const ext = file.name.split(".").pop() || "jpg";
    const path = `listings/${listingId}/${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("listing-media")
      .upload(path, file, { contentType: file.type });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return NextResponse.json({ error: "Failed to upload" }, { status: 500 });
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from("listing-media")
      .getPublicUrl(path);

    // Insert media record
    const { data: media, error: dbError } = await supabase
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
      return NextResponse.json({ error: "Failed to save media record" }, { status: 500 });
    }

    return NextResponse.json({ id: media.id, url: media.url });
  } catch (err) {
    console.error("Media POST error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
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

    // Soft delete
    await supabase
      .from("listing_media")
      .update({ deleted_at: new Date().toISOString(), deleted_by: user.id })
      .eq("id", mediaId);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Media DELETE error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
