-- Grant execute on RPC functions to authenticated and service_role
GRANT EXECUTE ON FUNCTION public.upsert_notify_signup(text, text, text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.upsert_notify_signup(text, text, text, text) TO service_role;
GRANT EXECUTE ON FUNCTION public.upsert_notify_signup(text, text, text, text) TO anon;

-- Ensure service_role has full access to the notify_signups table
GRANT ALL ON public.notify_signups TO service_role;
GRANT INSERT, UPDATE ON public.notify_signups TO anon;
GRANT INSERT, UPDATE ON public.notify_signups TO authenticated;
