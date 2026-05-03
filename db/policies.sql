-- ============================================================
-- ROW LEVEL SECURITY POLICIES
-- Enable RLS on all tables, then add policies per access pattern
-- ============================================================

-- Helper: check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND is_admin = true
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Helper: check if user has access grant for a listing
CREATE OR REPLACE FUNCTION public.has_access_grant(p_listing_id uuid)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.access_grants
    WHERE listing_id = p_listing_id
      AND acquirer_id = auth.uid()
      AND revoked_at IS NULL
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;


-- ============================================================
-- USERS
-- ============================================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Users can read their own row
CREATE POLICY "Users can read own profile"
  ON public.users FOR SELECT
  USING (id = auth.uid());

-- Admins can read all users
CREATE POLICY "Admins can read all users"
  ON public.users FOR SELECT
  USING (public.is_admin());

-- Users can update their own row
CREATE POLICY "Users can update own profile"
  ON public.users FOR UPDATE
  USING (id = auth.uid());

-- Admins can update any user
CREATE POLICY "Admins can update any user"
  ON public.users FOR UPDATE
  USING (public.is_admin());

-- Service role inserts (trigger handles this, so we allow insert for service role)
CREATE POLICY "Service role can insert users"
  ON public.users FOR INSERT
  WITH CHECK (true);


-- ============================================================
-- LISTINGS
-- ============================================================
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;

-- Anyone can read active listings (public browse)
CREATE POLICY "Public can read active listings"
  ON public.listings FOR SELECT
  USING (status = 'active' OR status = 'under_offer' OR status = 'sold');

-- Owners can read their own listings (any status)
CREATE POLICY "Owners can read own listings"
  ON public.listings FOR SELECT
  USING (listing_owner_id = auth.uid());

-- Admins can read all listings
CREATE POLICY "Admins can read all listings"
  ON public.listings FOR SELECT
  USING (public.is_admin());

-- Owners can insert listings
CREATE POLICY "Owners can create listings"
  ON public.listings FOR INSERT
  WITH CHECK (listing_owner_id = auth.uid());

-- Owners can update their own listings
CREATE POLICY "Owners can update own listings"
  ON public.listings FOR UPDATE
  USING (listing_owner_id = auth.uid());

-- Admins can update any listing (approve/reject)
CREATE POLICY "Admins can update any listing"
  ON public.listings FOR UPDATE
  USING (public.is_admin());


-- ============================================================
-- LISTING MEDIA
-- ============================================================
ALTER TABLE public.listing_media ENABLE ROW LEVEL SECURITY;

-- Public can read media for active listings
CREATE POLICY "Public can read media for active listings"
  ON public.listing_media FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.listings
      WHERE listings.id = listing_media.listing_id
        AND (listings.status = 'active' OR listings.status = 'under_offer' OR listings.status = 'sold')
    )
  );

-- Owners can manage their own listing media
CREATE POLICY "Owners can manage own listing media"
  ON public.listing_media FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.listings
      WHERE listings.id = listing_media.listing_id
        AND listings.listing_owner_id = auth.uid()
    )
  );

-- Admins can read all media
CREATE POLICY "Admins can read all media"
  ON public.listing_media FOR SELECT
  USING (public.is_admin());


-- ============================================================
-- FINANCIAL SUBMISSIONS (owner + granted users only)
-- ============================================================
ALTER TABLE public.financial_submissions ENABLE ROW LEVEL SECURITY;

-- Owners can manage their own financial submissions
CREATE POLICY "Owners can manage own financials"
  ON public.financial_submissions FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.listings
      WHERE listings.id = financial_submissions.listing_id
        AND listings.listing_owner_id = auth.uid()
    )
  );

-- Users with access grant can read
CREATE POLICY "Granted users can read financials"
  ON public.financial_submissions FOR SELECT
  USING (
    public.has_access_grant(listing_id)
  );

-- Admins can read all
CREATE POLICY "Admins can read all financials"
  ON public.financial_submissions FOR SELECT
  USING (public.is_admin());


-- ============================================================
-- FINANCIAL LINES (same access as submissions)
-- ============================================================
ALTER TABLE public.financial_lines ENABLE ROW LEVEL SECURITY;

-- Owners can manage
CREATE POLICY "Owners can manage own financial lines"
  ON public.financial_lines FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.financial_submissions fs
      JOIN public.listings l ON l.id = fs.listing_id
      WHERE fs.id = financial_lines.submission_id
        AND l.listing_owner_id = auth.uid()
    )
  );

-- Granted users can read
CREATE POLICY "Granted users can read financial lines"
  ON public.financial_lines FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.financial_submissions fs
      WHERE fs.id = financial_lines.submission_id
        AND public.has_access_grant(fs.listing_id)
    )
  );

-- Admins
CREATE POLICY "Admins can read all financial lines"
  ON public.financial_lines FOR SELECT
  USING (public.is_admin());


-- ============================================================
-- EBITDA ADDBACKS (same as financial lines)
-- ============================================================
ALTER TABLE public.ebitda_addbacks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners can manage own addbacks"
  ON public.ebitda_addbacks FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.financial_submissions fs
      JOIN public.listings l ON l.id = fs.listing_id
      WHERE fs.id = ebitda_addbacks.submission_id
        AND l.listing_owner_id = auth.uid()
    )
  );

CREATE POLICY "Granted users can read addbacks"
  ON public.ebitda_addbacks FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.financial_submissions fs
      WHERE fs.id = ebitda_addbacks.submission_id
        AND public.has_access_grant(fs.listing_id)
    )
  );

CREATE POLICY "Admins can read all addbacks"
  ON public.ebitda_addbacks FOR SELECT
  USING (public.is_admin());


-- ============================================================
-- SUBMISSION METRICS (same pattern)
-- ============================================================
ALTER TABLE public.submission_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners can manage own metrics"
  ON public.submission_metrics FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.financial_submissions fs
      JOIN public.listings l ON l.id = fs.listing_id
      WHERE fs.id = submission_metrics.submission_id
        AND l.listing_owner_id = auth.uid()
    )
  );

CREATE POLICY "Granted users can read metrics"
  ON public.submission_metrics FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.financial_submissions fs
      WHERE fs.id = submission_metrics.submission_id
        AND public.has_access_grant(fs.listing_id)
    )
  );

CREATE POLICY "Admins can read all metrics"
  ON public.submission_metrics FOR SELECT
  USING (public.is_admin());


-- ============================================================
-- DOCUMENTS (gated by access_grant + requires_nda flag)
-- ============================================================
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

-- Public docs (requires_nda = false) readable by anyone
CREATE POLICY "Public can read non-NDA docs"
  ON public.documents FOR SELECT
  USING (requires_nda = false);

-- NDA docs only for granted users
CREATE POLICY "Granted users can read NDA docs"
  ON public.documents FOR SELECT
  USING (requires_nda = true AND public.has_access_grant(listing_id));

-- Owners can manage their listing docs
CREATE POLICY "Owners can manage own docs"
  ON public.documents FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.listings
      WHERE listings.id = documents.listing_id
        AND listings.listing_owner_id = auth.uid()
    )
  );

-- Admins
CREATE POLICY "Admins can read all docs"
  ON public.documents FOR SELECT
  USING (public.is_admin());


-- ============================================================
-- ACCESS GRANTS
-- ============================================================
ALTER TABLE public.access_grants ENABLE ROW LEVEL SECURITY;

-- Users can see grants they received
CREATE POLICY "Users can read own access grants"
  ON public.access_grants FOR SELECT
  USING (acquirer_id = auth.uid());

-- Owners can see/manage grants for their listings
CREATE POLICY "Owners can manage grants for own listings"
  ON public.access_grants FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.listings
      WHERE listings.id = access_grants.listing_id
        AND listings.listing_owner_id = auth.uid()
    )
  );

-- Admins
CREATE POLICY "Admins can manage all grants"
  ON public.access_grants FOR ALL
  USING (public.is_admin());


-- ============================================================
-- MESSAGE THREADS
-- ============================================================
ALTER TABLE public.message_threads ENABLE ROW LEVEL SECURITY;

-- Participants can see their threads
CREATE POLICY "Participants can read own threads"
  ON public.message_threads FOR SELECT
  USING (inquirer_id = auth.uid() OR listing_owner_id = auth.uid());

-- Authenticated users can create threads (inquire)
CREATE POLICY "Authenticated users can create threads"
  ON public.message_threads FOR INSERT
  WITH CHECK (inquirer_id = auth.uid());

-- Participants can update (approve/reject)
CREATE POLICY "Owners can update thread status"
  ON public.message_threads FOR UPDATE
  USING (listing_owner_id = auth.uid());

-- Admins
CREATE POLICY "Admins can read all threads"
  ON public.message_threads FOR SELECT
  USING (public.is_admin());


-- ============================================================
-- MESSAGES
-- ============================================================
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Thread participants can read messages
CREATE POLICY "Thread participants can read messages"
  ON public.messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.message_threads
      WHERE message_threads.id = messages.thread_id
        AND (message_threads.inquirer_id = auth.uid() OR message_threads.listing_owner_id = auth.uid())
    )
  );

-- Thread participants can send messages
CREATE POLICY "Thread participants can send messages"
  ON public.messages FOR INSERT
  WITH CHECK (
    sender_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM public.message_threads
      WHERE message_threads.id = messages.thread_id
        AND (message_threads.inquirer_id = auth.uid() OR message_threads.listing_owner_id = auth.uid())
    )
  );

-- Admins
CREATE POLICY "Admins can read all messages"
  ON public.messages FOR SELECT
  USING (public.is_admin());


-- ============================================================
-- NOTIFICATIONS
-- ============================================================
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Users can only see their own notifications
CREATE POLICY "Users see own notifications"
  ON public.notifications FOR SELECT
  USING (recipient_user_id = auth.uid());

-- Users can update their own (mark read/dismissed)
CREATE POLICY "Users can update own notifications"
  ON public.notifications FOR UPDATE
  USING (recipient_user_id = auth.uid());

-- Service role / admin can insert
CREATE POLICY "Service can insert notifications"
  ON public.notifications FOR INSERT
  WITH CHECK (true);


-- ============================================================
-- SAVED LISTINGS
-- ============================================================
ALTER TABLE public.saved_listings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own saved listings"
  ON public.saved_listings FOR ALL
  USING (saver_user_id = auth.uid());


-- ============================================================
-- SAVED SEARCHES
-- ============================================================
ALTER TABLE public.saved_searches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own saved searches"
  ON public.saved_searches FOR ALL
  USING (searcher_user_id = auth.uid());


-- ============================================================
-- VALUATION INQUIRIES
-- ============================================================
ALTER TABLE public.valuation_inquiries ENABLE ROW LEVEL SECURITY;

-- Anyone can insert (public tool)
CREATE POLICY "Anyone can submit valuation inquiry"
  ON public.valuation_inquiries FOR INSERT
  WITH CHECK (true);

-- Users can read their own
CREATE POLICY "Users can read own inquiries"
  ON public.valuation_inquiries FOR SELECT
  USING (submitter_user_id = auth.uid());

-- Admins can read all
CREATE POLICY "Admins can read all valuation inquiries"
  ON public.valuation_inquiries FOR SELECT
  USING (public.is_admin());


-- ============================================================
-- VALUATION RUNS
-- ============================================================
ALTER TABLE public.valuation_runs ENABLE ROW LEVEL SECURITY;

-- Listing owners can read their valuation runs
CREATE POLICY "Owners can read own valuation runs"
  ON public.valuation_runs FOR SELECT
  USING (
    listing_id IS NOT NULL AND
    EXISTS (
      SELECT 1 FROM public.listings
      WHERE listings.id = valuation_runs.listing_id
        AND listings.listing_owner_id = auth.uid()
    )
  );

-- Service role can insert
CREATE POLICY "Service can insert valuation runs"
  ON public.valuation_runs FOR INSERT
  WITH CHECK (true);

-- Admins
CREATE POLICY "Admins can read all valuation runs"
  ON public.valuation_runs FOR SELECT
  USING (public.is_admin());


-- ============================================================
-- LISTING VIEWS (write-heavy, minimal read)
-- ============================================================
ALTER TABLE public.listing_views ENABLE ROW LEVEL SECURITY;

-- Anyone can insert (tracking)
CREATE POLICY "Anyone can insert listing views"
  ON public.listing_views FOR INSERT
  WITH CHECK (true);

-- Listing owners can read views on their listings
CREATE POLICY "Owners can read own listing views"
  ON public.listing_views FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.listings
      WHERE listings.id = listing_views.listing_id
        AND listings.listing_owner_id = auth.uid()
    )
  );

-- Admins
CREATE POLICY "Admins can read all views"
  ON public.listing_views FOR SELECT
  USING (public.is_admin());


-- ============================================================
-- ANALYTICS EVENTS
-- ============================================================
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- Anyone can insert
CREATE POLICY "Anyone can insert analytics events"
  ON public.analytics_events FOR INSERT
  WITH CHECK (true);

-- Admins only read
CREATE POLICY "Admins can read analytics"
  ON public.analytics_events FOR SELECT
  USING (public.is_admin());


-- ============================================================
-- AUDIT LOG (admin read-only, service writes)
-- ============================================================
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service can insert audit log"
  ON public.audit_log FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can read audit log"
  ON public.audit_log FOR SELECT
  USING (public.is_admin());


-- ============================================================
-- REVIEW QUEUE (admin only)
-- ============================================================
ALTER TABLE public.review_queue ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage review queue"
  ON public.review_queue FOR ALL
  USING (public.is_admin());


-- ============================================================
-- REFERENCE/CONFIG TABLES (public read)
-- ============================================================
ALTER TABLE public.industry_taxonomy ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read industry taxonomy"
  ON public.industry_taxonomy FOR SELECT
  USING (true);

ALTER TABLE public.industry_benchmarks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read active benchmarks"
  ON public.industry_benchmarks FOR SELECT
  USING (is_active = true);
CREATE POLICY "Admins can manage benchmarks"
  ON public.industry_benchmarks FOR ALL
  USING (public.is_admin());

ALTER TABLE public.comparable_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage comparables"
  ON public.comparable_transactions FOR ALL
  USING (public.is_admin());

ALTER TABLE public.data_sources ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read data sources"
  ON public.data_sources FOR SELECT
  USING (true);

ALTER TABLE public.industry_metric_templates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read metric templates"
  ON public.industry_metric_templates FOR SELECT
  USING (is_active = true);

ALTER TABLE public.legal_documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read legal docs"
  ON public.legal_documents FOR SELECT
  USING (true);

ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read subscription plans"
  ON public.subscription_plans FOR SELECT
  USING (is_active = true);

ALTER TABLE public.retention_policies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can read retention policies"
  ON public.retention_policies FOR SELECT
  USING (public.is_admin());


-- ============================================================
-- REMAINING TABLES (admin-only until their MVP phase)
-- ============================================================
ALTER TABLE public.standardized_financials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage standardized financials"
  ON public.standardized_financials FOR ALL
  USING (public.is_admin());

ALTER TABLE public.document_access_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can read doc access log"
  ON public.document_access_log FOR ALL
  USING (public.is_admin());

ALTER TABLE public.nda_signatures ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage NDA signatures"
  ON public.nda_signatures FOR ALL
  USING (public.is_admin());

ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage offers"
  ON public.offers FOR ALL
  USING (public.is_admin());

ALTER TABLE public.due_diligence_checklists ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage DD checklists"
  ON public.due_diligence_checklists FOR ALL
  USING (public.is_admin());

ALTER TABLE public.message_attachments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage attachments"
  ON public.message_attachments FOR ALL
  USING (public.is_admin());

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage payments"
  ON public.payments FOR ALL
  USING (public.is_admin());

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage subscriptions"
  ON public.subscriptions FOR ALL
  USING (public.is_admin());

ALTER TABLE public.external_customers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage external customers"
  ON public.external_customers FOR ALL
  USING (public.is_admin());

ALTER TABLE public.data_exports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage data exports"
  ON public.data_exports FOR ALL
  USING (public.is_admin());

ALTER TABLE public.data_export_records ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage export records"
  ON public.data_export_records FOR ALL
  USING (public.is_admin());

ALTER TABLE public.account_status_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage status history"
  ON public.account_status_history FOR ALL
  USING (public.is_admin());

ALTER TABLE public.deletion_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage deletion requests"
  ON public.deletion_requests FOR ALL
  USING (public.is_admin());
