import { cn } from "@/lib/utils";

type SectionProps = {
  children: React.ReactNode;
  background?: "default" | "orange" | "purple-gradient" | "dark";
  number?: string;
  className?: string;
};

const bgStyles = {
  default: "bg-[var(--color-background)] text-[var(--color-foreground)]",
  orange: "bg-[var(--color-accent-orange)] text-white",
  "purple-gradient": "bg-gradient-to-br from-[var(--color-accent-purple)] to-[var(--color-accent-peach)] text-white",
  dark: "bg-[var(--color-foreground)] text-[var(--color-background)]",
};

export function Section({
  children,
  background = "default",
  number,
  className,
}: SectionProps) {
  return (
    <section className={cn(bgStyles[background], "relative", className)}>
      {number && (
        <span
          className="absolute top-8 right-8 lg:right-12 font-light opacity-20 select-none pointer-events-none"
          style={{ fontSize: "var(--font-size-section-number)", fontFamily: "var(--font-display)" }}
        >
          {number}
        </span>
      )}
      <div className="mx-auto max-w-[var(--container-max)] px-8 lg:px-12 py-[var(--spacing-section)]">
        {children}
      </div>
    </section>
  );
}
