# Schema Drift Audit — 2026-05-04

## Summary

- **Critical issues found:** 0 (all previously critical issues resolved in migrations 005–011)
- **Migrations written this round:** 0 (no new drift discovered)
- **Error handling improvements:** 1 file (wizard saveDraft)
- **Tables actively used by code:** 7 of 37

## Code vs DB Diff — Active Tables

### listings
| Column | In Code | In DB | Status |
|---|---|---|---|
| id | Yes | Yes | OK |
| listing_owner_id | Yes | Yes | OK |
| title | Yes | Yes | OK |
| industry | Yes | Yes | OK |
| industry_code | Yes | Yes | OK (FK to industry_taxonomy) |
| industry_other_text | Yes | Yes | OK (added migration 007) |
| location | Yes | Yes | OK |
| asking_price | Yes | Yes | OK |
| description_public | Yes | Yes | OK |
| description_private | Yes | Yes | OK |
| status | Yes | Yes | OK |
| slug | Yes | Yes | OK (added migration 005) |
| submitted_at | Yes | Yes | OK (added migration 005) |
| reason_for_sale | Yes | Yes | OK (added migration 005) |
| inclusions | Yes | Yes | OK (added migration 005) |
| deal_structure | Yes | Yes | OK (added migration 011) |
| updated_at | Not sent | Yes | OK — has DEFAULT now() (migration 009) |
| created_at | Not sent | Yes | OK — has DEFAULT |
| All other columns | Not referenced | Yes | Stale-safe: future phases will use them |

**Verdict: No drift. All code-referenced columns exist.**

### financial_submissions
| Column | In Code | In DB | Status |
|---|---|---|---|
| id | Yes | Yes | OK |
| listing_id | Yes | Yes | OK |
| period_start | Yes | Yes | OK |
| period_end | Yes | Yes | OK |
| currency | Yes | Yes | OK (default 'AUD') |
| submitted_by | Yes | Yes | OK |
| submitted_at | Not sent | Yes | OK — has DEFAULT |

**Verdict: No drift.**

### financial_lines
| Column | In Code | In DB | Status |
|---|---|---|---|
| id | Yes | Yes | OK |
| submission_id | Yes | Yes | OK |
| statement_type | Yes | Yes | OK |
| line_item | Yes | Yes | OK |
| amount | Yes | Yes | OK |
| display_order | Yes | Yes | OK (default 0) |

**Verdict: No drift.**

### ebitda_addbacks
| Column | In Code | In DB | Status |
|---|---|---|---|
| id | Yes | Yes | OK |
| submission_id | Yes | Yes | OK |
| description | Yes | Yes | OK |
| amount | Yes | Yes | OK |
| category | Yes | Yes | OK |

**Verdict: No drift.**

### listing_media
| Column | In Code | In DB | Status |
|---|---|---|---|
| id | Yes | Yes | OK |
| listing_id | Yes | Yes | OK |
| url | Yes | Yes | OK |
| media_type | Yes | Yes | OK |
| display_order | Yes | Yes | OK (default 0) |
| deleted_at | Yes (soft delete) | Yes | OK |
| deleted_by | Yes (soft delete) | Yes | OK |

**Verdict: No drift.**

### users
| Column | In Code | In DB | Status |
|---|---|---|---|
| id | Yes | Yes | OK |
| email | Yes | Yes | OK |
| full_name | Yes | Yes | OK |
| is_seller | Yes | Yes | OK (default false) |
| is_admin | Yes | Yes | OK (default false) |

**Verdict: No drift.**

### notify_signups
| Column | In Code (via RPC) | In DB | Status |
|---|---|---|---|
| email | Yes | Yes | OK |
| page_source | Yes | Yes | OK |
| ip_address | Yes | Yes | OK |
| user_agent | Yes | Yes | OK |
| submission_count | Yes (incremented by RPC) | Yes | OK |

**Verdict: No drift.**

## Tables in DB But Not Referenced in Code (30 tables)

These are all future-phase tables. None are stale — they were intentionally created as part of the full schema scaffold:

- access_grants, account_status_history, analytics_events, audit_log
- comparable_transactions, data_export_records, data_exports, data_sources
- deletion_requests, document_access_log, documents, due_diligence_checklists
- external_customers, industry_benchmarks, industry_metric_templates
- legal_documents, listing_views, message_attachments, message_threads
- messages, nda_signatures, notifications, offers, payments
- retention_policies, review_queue, saved_listings, saved_searches
- standardized_financials, submission_metrics, subscription_plans, subscriptions
- valuation_inquiries, valuation_runs

**Recommendation: Leave them. They'll be used in Phases 3–5.**

## FK Constraints — Potential Gotchas

| FK | Risk | Status |
|---|---|---|
| listings.industry_code → industry_taxonomy.industry_code | Code sends hardcoded values (cafe, restaurant, etc.) | OK — migration 008 seeded 11 rows matching the code |
| listings.listing_owner_id → users.id | Requires public.users row for auth user | OK — trigger + backfill in migration 010 |
| financial_submissions.submitted_by → users.id | Same as above | OK — covered by same fix |

## NOT NULL Columns Without Defaults — Risk Map

These are the columns that would cause silent insert failures if code doesn't provide them:

| Table | Column | Risk |
|---|---|---|
| listings | title | Low — wizard always sends it |
| listings | industry | Low — wizard always sends it |
| listings | industry_code | Low — wizard always sends it |
| listings | location | Low — wizard always sends it |
| listings | asking_price | Low — wizard always sends it |
| listings | description_public | Low — wizard sends empty string |
| listings | description_private | Low — wizard sends empty string |
| users | email | Low — trigger pulls from auth.users |
| users | full_name | Low — trigger pulls from metadata |
| financial_lines | amount | Low — wizard sends 0 as default |

**No hidden bombs. All NOT NULL columns without defaults are provided by the code that writes to them.**

## Triggers

| Trigger | Table | Function | In Migration File | Status |
|---|---|---|---|---|
| on_auth_user_created | auth.users | handle_new_user() | migration 010 + db/triggers.sql | OK |
| on_listing_view_inserted | listing_views | increment_listing_view_count() | db/triggers.sql only | Works but not in numbered migration |
| on_message_inserted | messages | update_thread_last_message() | db/triggers.sql only | Works but not in numbered migration |
| on_thread_created | message_threads | increment_listing_inquiry_count() | db/triggers.sql only | Works but not in numbered migration |

**Note:** Triggers 2–4 exist in `db/triggers.sql` but not in numbered migration files. They would survive a `prisma db push` (which only touches table structure) but would NOT survive if someone drops and recreates the functions manually.

## How This Happened

Three contributing factors:

1. **`prisma db push --force-reset` wiped the `public` schema** — this dropped all table data including `public.users` rows, but `auth.users` rows survived (different schema). The `handle_new_user()` trigger was recreated by `db/triggers.sql` but couldn't backfill pre-existing auth accounts.

2. **Schema managed in two places** — Prisma owns table structure (`db/schema.prisma`), but columns added for the wizard (slug, submitted_at, reason_for_sale, inclusions, deal_structure, industry_other_text) were added via standalone SQL migrations, not in Prisma. This means Prisma's schema is now out of sync with the live DB — a future `prisma db push` would NOT know about these columns.

3. **Silent error handling** — `saveDraft()` returned `false` without surfacing the actual Supabase error (FK violation, unknown column). The user saw "stuck on step" instead of the actual cause.

## How to Prevent Recurrence

1. **Pick one schema owner.** Either Prisma manages all columns (and you run `prisma db push` to sync) OR Supabase migrations manage all columns (and Prisma is read-only, used only for type generation). Currently both are writing schema, and they disagree. **Recommendation: Use Supabase migrations as canonical, Prisma for types only.** This matches how the app actually works (Supabase JS client, not Prisma client, at runtime).

2. **Never run `prisma db push --force-reset` without a runbook.** After any reset:
   - Re-run all numbered migrations in order
   - Re-run `db/triggers.sql`
   - Re-run `db/policies.sql`
   - Run the backfill in migration 010

3. **Surface Supabase errors to logs.** Every `.insert()`, `.update()`, `.delete()` call should log the full error object on failure, not just return false/null.

4. **CI check (future).** A pre-deploy script that queries `information_schema.columns` and compares against a known-good column list. Flags any code-referenced column that doesn't exist in the live DB.
