"use client";

import type { ListingDraft } from "./wizard";

type Props = {
  draft: ListingDraft;
  onSubmit: () => void;
  onBack: () => void;
  saving: boolean;
};

export function StepReview({ draft, onSubmit, onBack, saving }: Props) {
  const latestFinancials = draft.financials[0];
  const addbackTotal = draft.addbacks.reduce((sum, a) => sum + (a.amount || 0), 0);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-normal tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
          Review your listing
        </h2>
        <p className="mt-2 text-sm text-[var(--color-muted-foreground)]">
          Check everything looks right. Once submitted, your listing goes to our review queue.
        </p>
      </div>

      {/* Summary blocks */}
      <div className="space-y-6 divide-y divide-[var(--color-border)]">
        <ReviewBlock label="Business">
          <Row label="Name" value={draft.title} />
          <Row label="Industry" value={draft.industry} />
          <Row label="Location" value={draft.location} />
          <Row label="Asking price" value={`$${draft.asking_price?.toLocaleString()}`} />
        </ReviewBlock>

        <ReviewBlock label="Public description">
          <p className="text-sm text-[var(--color-muted-foreground)]">
            {draft.description_public || "Not provided"}
          </p>
        </ReviewBlock>

        <ReviewBlock label="Photos">
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

        <ReviewBlock label="Financials (most recent year)">
          {latestFinancials ? (
            <>
              <Row label="Revenue" value={`$${latestFinancials.revenue?.toLocaleString()}`} />
              <Row label="COGS" value={`$${latestFinancials.cogs?.toLocaleString()}`} />
              <Row label="Gross profit" value={`$${latestFinancials.gross_profit?.toLocaleString()}`} />
              <Row label="Opex" value={`$${latestFinancials.opex?.toLocaleString()}`} />
              <Row label="EBITDA" value={`$${latestFinancials.ebitda?.toLocaleString()}`} highlight />
              {addbackTotal > 0 && (
                <Row label="Adjusted EBITDA" value={`$${(latestFinancials.ebitda + addbackTotal).toLocaleString()}`} highlight />
              )}
            </>
          ) : (
            <p className="text-sm text-[var(--color-muted)]">No financials entered</p>
          )}
        </ReviewBlock>

        {draft.addbacks.length > 0 && (
          <ReviewBlock label={`Addbacks (${draft.addbacks.length})`}>
            {draft.addbacks.map((a, i) => (
              <Row key={i} label={a.description} value={`$${a.amount?.toLocaleString()}`} />
            ))}
            <Row label="Total" value={`$${addbackTotal.toLocaleString()}`} highlight />
          </ReviewBlock>
        )}

        <ReviewBlock label="Private details">
          {draft.description_private ? (
            <p className="text-sm text-[var(--color-muted-foreground)] line-clamp-4">{draft.description_private}</p>
          ) : (
            <p className="text-sm text-[var(--color-muted)]">Not provided</p>
          )}
          {draft.reason_for_sale && <Row label="Reason for sale" value={draft.reason_for_sale} />}
          {draft.deal_structure && <Row label="Deal structure" value={draft.deal_structure.replace("_", " ")} />}
        </ReviewBlock>
      </div>

      <div className="flex justify-between pt-4 border-t border-[var(--color-border)]">
        <button
          onClick={onBack}
          className="text-sm text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] transition-colors"
        >
          Back
        </button>
        <button
          onClick={onSubmit}
          disabled={saving}
          className="rounded-full bg-[var(--color-foreground)] px-10 py-3 text-base font-medium text-[var(--color-background)] transition-all hover:bg-[var(--color-foreground)]/90 disabled:opacity-50"
        >
          {saving ? "Submitting..." : "Submit for review"}
        </button>
      </div>
    </div>
  );
}

function ReviewBlock({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="pt-6 first:pt-0">
      <p className="text-xs font-medium uppercase tracking-wider text-[var(--color-muted)] mb-3">{label}</p>
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
