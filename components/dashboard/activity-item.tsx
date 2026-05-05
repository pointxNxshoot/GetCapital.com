import Link from "next/link";

type ActivityItemProps = {
  timeLabel: string;
  message: string;
  link?: { href: string; label: string };
};

export function ActivityItem({ timeLabel, message, link }: ActivityItemProps) {
  return (
    <div className="grid grid-cols-12 gap-4 py-6 border-b border-[var(--color-border)] last:border-0">
      <div className="col-span-12 lg:col-span-2">
        <p className="text-xs uppercase tracking-wider text-[var(--color-muted)]">
          {timeLabel}
        </p>
      </div>
      <div className="col-span-12 lg:col-span-10">
        <p className="text-base text-[var(--color-foreground)]">
          {message}
          {link && (
            <Link
              href={link.href}
              className="ml-2 text-[var(--color-foreground)] underline decoration-[var(--color-foreground)]/30 hover:decoration-[var(--color-foreground)] transition-colors"
            >
              {link.label} &rarr;
            </Link>
          )}
        </p>
      </div>
    </div>
  );
}
