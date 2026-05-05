type InsightItemProps = {
  metric: string;
  category: string;
  description: string;
};

export function InsightItem({ metric, category, description }: InsightItemProps) {
  return (
    <div className="border-b border-[var(--color-border)] pb-8 last:border-0 last:pb-0">
      <div className="flex items-baseline gap-4 mb-2">
        <span
          className="text-2xl font-medium tracking-tight"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {metric}
        </span>
        <span className="text-sm uppercase tracking-wider text-[var(--color-muted)]">
          {category}
        </span>
      </div>
      <p className="text-base text-[var(--color-muted-foreground)] max-w-2xl">
        {description}
      </p>
    </div>
  );
}
