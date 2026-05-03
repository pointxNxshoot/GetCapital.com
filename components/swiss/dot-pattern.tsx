import { cn } from "@/lib/utils";

type DotPatternProps = {
  rows?: number;
  columns?: number;
  dotSize?: number;
  spacing?: number;
  className?: string;
};

export function DotPattern({
  rows = 16,
  columns = 40,
  dotSize = 6,
  spacing = 24,
  className,
}: DotPatternProps) {
  const width = columns * spacing;
  const height = rows * spacing;

  const dots: React.ReactNode[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      dots.push(
        <circle
          key={`${r}-${c}`}
          cx={c * spacing + spacing / 2}
          cy={r * spacing + spacing / 2}
          r={dotSize / 2}
          fill="var(--color-dot-inactive)"
        />
      );
    }
  }

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={cn("w-full h-auto", className)}
      aria-hidden="true"
    >
      {dots}
    </svg>
  );
}
