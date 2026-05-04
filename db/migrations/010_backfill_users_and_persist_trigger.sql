-- ============================================================
-- BACKFILL: Insert public.users rows for any auth.users that are missing.
-- This handles accounts created before the trigger existed, or rows
-- lost during a prisma db push --force-reset.
--
-- Idempotent: safe to run multiple times. ON CONFLICT DO NOTHING.
-- ============================================================

INSERT INTO public.users (id, email, full_name, role, is_seller, is_buyer, is_admin, account_status)
SELECT
  au.id,
  au.email,
  COALESCE(au.raw_user_meta_data->>'full_name', split_part(au.email, '@', 1)),
  'member',
  false,
  false,
  false,
  'active'
FROM auth.users au
LEFT JOIN public.users pu ON pu.id = au.id
WHERE pu.id IS NULL
ON CONFLICT (id) DO NOTHING;


-- ============================================================
-- TRIGGER: Ensure handle_new_user() and its trigger are defined here
-- so they survive future schema resets.
--
-- OWNERSHIP BOUNDARY:
--   Prisma owns: public.users table structure (columns, types, constraints)
--   This migration owns: handle_new_user() function + on_auth_user_created trigger
--   After any prisma db push --force-reset, re-run:
--     1. This migration (recreates trigger + backfills missing rows)
--     2. db/triggers.sql (recreates all other triggers)
--     3. db/policies.sql (recreates RLS policies)
-- ============================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, role, is_seller, is_buyer, is_admin, account_status)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    'member',
    false,
    false,
    false,
    'active'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
