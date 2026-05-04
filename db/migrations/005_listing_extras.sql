-- Add slug and submitted_at columns to listings
-- These support the listing creation wizard

ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS slug text UNIQUE;
ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS submitted_at timestamptz;
ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS reason_for_sale text;
ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS inclusions text;

-- Create the listing-media storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('listing-media', 'listing-media', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload to the listing-media bucket
CREATE POLICY "Authenticated users can upload listing media"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'listing-media');

-- Allow public read access to listing media
CREATE POLICY "Public can read listing media"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'listing-media');

-- Allow users to delete their own uploads
CREATE POLICY "Users can delete own listing media"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'listing-media');
