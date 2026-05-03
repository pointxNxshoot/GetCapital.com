-- Function to upsert a notify signup: insert or increment submission_count
CREATE OR REPLACE FUNCTION public.upsert_notify_signup(
  p_email text,
  p_page_source text,
  p_ip_address text DEFAULT NULL,
  p_user_agent text DEFAULT NULL
)
RETURNS void AS $$
BEGIN
  INSERT INTO public.notify_signups (email, page_source, ip_address, user_agent, submission_count)
  VALUES (p_email, p_page_source, p_ip_address, p_user_agent, 1)
  ON CONFLICT (email, page_source)
  DO UPDATE SET
    submission_count = notify_signups.submission_count + 1,
    ip_address = COALESCE(p_ip_address, notify_signups.ip_address),
    user_agent = COALESCE(p_user_agent, notify_signups.user_agent);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
