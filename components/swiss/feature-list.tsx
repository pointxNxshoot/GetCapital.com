import { cn } from "@/lib/utils";

type FeatureListProps = {
  features: string[];
  columns?: 2 | 3;
  className?: string;
};

export function FeatureList({
  features,
  columns = 2,
  className,
}: FeatureListProps) {
  return (
    <div
      className={cn(
        "border-t border-current/20 pt-6",
        columns === 3 ? "grid grid-cols-1 sm:grid-cols-3 gap-4" : "grid grid-cols-1 sm:grid-cols-2 gap-4",
        className
      )}
    >
      {features.map((feature) => (
        <p key={feature} className="square-bullet text-base">
          {feature}
        </p>
      ))}
    </div>
  );
}
