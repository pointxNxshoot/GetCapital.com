"use client";

import type { ListingDraft } from "./wizard";

type Props = {
  draft: ListingDraft;
  onSubmit: () => void;
  onBack: () => void;
  saving: boolean;
  error?: string | null;
};

export function StepReview({ draft, onSubmit, onBack, saving, error }: Props) {
  const latestFinancials = draft.financials[0];
  const addbackTotal = draft.addbacks.reduce((sum, a) => sum + (a.amount || 0), 0);

  return (
    <div>
      <div className="mb-12">
        <h2
          className="tracking-tight leading-none mb-4"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "var(--font-size-display-md)",
            letterSpacing: "-0.02em",
            lineHeight: "1.05",
          }}
        >
          Review your listing.
        </h2>
        <p className="text-base text-[var(--color-muted-foreground)] max-w-xl">
          Check everything looks right. Once submitted, your listing goes to our review queue.
        </p>
      </div>

      <div className="space-y-0">
        <ReviewBlock label="Business" complete={!!draft.title}>
          <Row label="Name" value={draft.title} />
          <Row label="Industry" value={draft.industry || draft.industry_code} />
          <Row label="Location" value={draft.location} />
          <Row label="Asking price" value={`$${draft.asking_price?.toLocaleString("en-AU")}`} />
        </ReviewBlock>

        <ReviewBlock label="Public description" complete={!!draft.description_public}>
          <p className="text-sm text-[var(--color-muted-foreground)]">
            {draft.description_public || "Not provided"}
          </p>
        </ReviewBlock>

        <ReviewBlock label="Photos" complete={draft.media.length > 0}>
          {draft.media.length > 0 ? (
            <div className="grid grid-cols-4 gap-2">
              {draft.media.map((m, i) => (
                <img key={m.id} src={m.url} alt={`Photo ${i + 1}`} className="aspect-[4/3] object-cover w-full" />
              ))}
            </div>
          ) : (
            <p className="text-sm text-[var(--color-muted)]">No photos uploaded</p>
          )}
        </ReviewBlock>

        <ReviewBlock label="Financials" complete={!!latestFinancials?.revenue}>
          {latestFinancials ? (
            <>
              <Row label="Revenue" value={`$${latestFinancials.revenue?.toLocaleString("en-AU")}`} />
              <Row label="COGS" value={`$${latestFinancials.cogs?.toLocaleString("en-AU")}`} />
              <Row label="Gross profit" value={`$${latestFinancials.gross_profit?.toLocaleString("en-AU")}`} />
              <Row label="Opex" value={`$${latestFinancials.opex?.toLocaleString("en-AU")}`} />
              <Row label="EBITDA" value={`$${latestFinancials.ebitda?.toLocaleString("en-AU")}`} highlight />
              {addbackTotal > 0 && (
                <Row label="Adjusted EBITDA" value={`$${(latestFinancials.ebitda + addbackTotal).toLocaleString("en-AU")}`} highlight />
              )}
            </>
          ) : (
            <p className="text-sm text-[var(--color-muted)]">No financials entered</p>
          )}
        </ReviewBlock>

        {draft.addbacks.length > 0 && (
          <ReviewBlock label={`Addbacks (${draft.addbacks.length})`} complete>
            {draft.addbacks.map((a, i) => (
              <Row key={i} label={a.description} value={`$${a.amount?.toLocaleString("en-AU")}`} />
            ))}
            <Row label="Total" value={`$${addbackTotal.toLocaleString("en-AU")}`} highlight />
          </ReviewBlock>
        )}

        <ReviewBlock label="Private details" complete={!!draft.description_private}>
          {draft.description_private ? (
            <p className="text-sm text-[var(--color-muted-foreground)] line-clamp-4">{draft.description_private}</p>
          ) : (
            <p className="text-sm text-[var(--color-muted)]">Not provided</p>
          )}
          {draft.reason_for_sale && <Row label="Reason for sale" value={draft.reason_for_sale} />}
          {draft.deal_structure && <Row label="Deal structure" value={draft.deal_structure.replace("_", " ")} />}
        </ReviewBlock>
      </div>

      {error && (
        <p className="text-sm text-red-600 mt-8">{error}</p>
      )}

      <div className="border-t border-[var(--color-border)] pt-8 mt-16 flex items-center justify-between">
        <button
          onClick={onBack}
          className="text-base text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] transition-colors"
        >
          &larr; Back
        </button>
        <button
          onClick={onSubmit}
          disabled={saving}
          className="rounded-full bg-[var(--color-foreground)] px-12 py-4 text-base font-medium text-[var(--color-background)] transition-all hover:bg-[var(--color-foreground)]/90 disabled:opacity-50"
        >
          {saving ? "Submitting..." : "Submit for review"}
        </button>
      </div>
    </div>
  );
}

function ReviewBlock({ label, complete, children }: { label: string; complete?: boolean; children: React.ReactNode }) {
  return (
    <div className="py-8 border-b border-[var(--color-border)] first:pt-0">
      <div className="flex items-center gap-2 mb-4">
        {complete && (
          <span className="inline-block w-2 h-2 rounded-full bg-[var(--color-accent-orange)]" />
        )}
        <p className="text-xs font-medium uppercase tracking-wider text-[var(--color-muted)]">{label}</p>
      </div>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function Row({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-[var(--color-muted-foreground)]">{label}</span>
      <span className={highlight ? "font-medium" : ""}>{value}</span>
    </div>
  );
}
