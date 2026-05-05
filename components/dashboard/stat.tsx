type StatProps = {
  number: string;
  label: string;
  sublabel: string;
};

export function Stat({ number, label, sublabel }: StatProps) {
  return (
    <div>
      <div
        className="text-4xl tracking-tight leading-none"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {number}
      </div>
      <div className="mt-3 text-sm font-medium uppercase tracking-wider text-[var(--color-foreground)]">
        {label}
      </div>
      <div className="text-sm text-[var(--color-muted-foreground)]">
        {sublabel}
      </div>
    </div>
  );
}
