-- Migration: Create notify_signups table for pre-launch email capture
-- Used by /valuation and /listings coming-soon pages

CREATE TABLE IF NOT EXISTS public.notify_signups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  page_source text NOT NULL CHECK (page_source IN ('valuation', 'listings', 'general')),
  submitted_at timestamptz NOT NULL DEFAULT now(),
  submission_count integer NOT NULL DEFAULT 1,
  ip_address text,
  user_agent text,
  notes text,
  notified_at timestamptz,
  unsubscribed_at timestamptz,
  UNIQUE (email, page_source)
);

CREATE INDEX IF NOT EXISTS idx_notify_signups_email ON public.notify_signups (email);
CREATE INDEX IF NOT EXISTS idx_notify_signups_page ON public.notify_signups (page_source);
CREATE INDEX IF NOT EXISTS idx_notify_signups_submitted ON public.notify_signups (submitted_at);

-- RLS: service role can insert/update (API route uses service role)
-- Admins can read all rows
ALTER TABLE public.notify_signups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service can insert notify signups"
  ON public.notify_signups FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Service can update notify signups"
  ON public.notify_signups FOR UPDATE
  USING (true);

CREATE POLICY "Admins can read notify signups"
  ON public.notify_signups FOR SELECT
  USING (public.is_admin());
