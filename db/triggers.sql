-- ============================================================
-- TRIGGER 1: Auto-create users row when someone signs up via Supabase Auth
-- ============================================================
-- When auth.users gets a new row (signup), create a matching public.users row

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, role, is_seller, is_buyer, is_admin, account_status, created_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    'member',
    false,
    false,
    false,
    'active',
    NOW()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop if exists to make this idempotent
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();


-- ============================================================
-- TRIGGER 2: Increment view_count_total on listings when a listing_view is inserted
-- ============================================================

CREATE OR REPLACE FUNCTION public.increment_listing_view_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.listings
  SET view_count_total = view_count_total + 1
  WHERE id = NEW.listing_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_listing_view_inserted ON public.listing_views;
CREATE TRIGGER on_listing_view_inserted
  AFTER INSERT ON public.listing_views
  FOR EACH ROW
  EXECUTE FUNCTION public.increment_listing_view_count();


-- ============================================================
-- TRIGGER 3: Update last_message_at on message_threads when a message is sent
-- ============================================================

CREATE OR REPLACE FUNCTION public.update_thread_last_message()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.message_threads
  SET last_message_at = NEW.sent_at
  WHERE id = NEW.thread_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_message_inserted ON public.messages;
CREATE TRIGGER on_message_inserted
  AFTER INSERT ON public.messages
  FOR EACH ROW
  EXECUTE FUNCTION public.update_thread_last_message();


-- ============================================================
-- TRIGGER 4: Increment inquiry_count_total on listings when a new thread is created
-- ============================================================

CREATE OR REPLACE FUNCTION public.increment_listing_inquiry_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.listings
  SET inquiry_count_total = inquiry_count_total + 1
  WHERE id = NEW.listing_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_thread_created ON public.message_threads;
CREATE TRIGGER on_thread_created
  AFTER INSERT ON public.message_threads
  FOR EACH ROW
  EXECUTE FUNCTION public.increment_listing_inquiry_count();
