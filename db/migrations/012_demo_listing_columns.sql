-- Add columns needed for demo/seed listings
ALTER TABLE public.listings
  ADD COLUMN IF NOT EXISTS is_demo boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS location_city text,
  ADD COLUMN IF NOT EXISTS employees_count integer,
  ADD COLUMN IF NOT EXISTS years_in_operation integer;

-- listing_media needs is_primary and alt_text
ALTER TABLE public.listing_media
  ADD COLUMN IF NOT EXISTS is_primary boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS alt_text text;

-- reason_for_sale, inclusions, industry_other_text already exist from prior migrations
-- but verify they're present (IF NOT EXISTS handles this safely)
ALTER TABLE public.listings
  ADD COLUMN IF NOT EXISTS reason_for_sale text,
  ADD COLUMN IF NOT EXISTS inclusions text,
  ADD COLUMN IF NOT EXISTS industry_other_text text;
