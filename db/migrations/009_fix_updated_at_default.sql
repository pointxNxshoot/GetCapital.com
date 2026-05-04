-- Fix: updated_at column on listings has no default value.
-- Prisma's @updatedAt handles this in Prisma client, but raw Supabase inserts need a default.

ALTER TABLE public.listings ALTER COLUMN updated_at SET DEFAULT now();
