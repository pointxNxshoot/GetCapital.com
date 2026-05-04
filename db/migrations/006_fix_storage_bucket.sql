-- Ensure the listing-media bucket exists and is properly configured
-- Public = true means files are accessible via public URL (no signed URL needed for reads)
-- But uploads still require authentication

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'listing-media',
  'listing-media',
  true,
  10485760, -- 10MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/heic']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 10485760,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/heic'];

-- Drop existing policies to avoid conflicts, then recreate
DROP POLICY IF EXISTS "Authenticated users can upload listing media" ON storage.objects;
DROP POLICY IF EXISTS "Public can read listing media" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own listing media" ON storage.objects;

-- Allow authenticated users to upload
CREATE POLICY "Authenticated users can upload listing media"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'listing-media');

-- Allow public reads (since bucket is public)
CREATE POLICY "Public can read listing media"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'listing-media');

-- Allow authenticated users to update (needed for overwrites)
CREATE POLICY "Authenticated users can update listing media"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'listing-media');

-- Allow authenticated users to delete
CREATE POLICY "Authenticated users can delete listing media"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'listing-media');
