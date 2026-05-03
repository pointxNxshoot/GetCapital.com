import { cn } from "@/lib/utils";

type BackgroundBreathProps = {
  variant: "warm" | "purple" | "orange" | "neutral";
  intensity?: "subtle" | "barely-there";
  className?: string;
};

const gradients = {
  warm: "radial-gradient(ellipse 80% 80% at 30% 40%, rgba(232, 147, 112, 0.25) 0%, transparent 70%)",
  purple: "radial-gradient(ellipse 80% 80% at 35% 45%, rgba(91, 95, 188, 0.2) 0%, transparent 70%)",
  orange: "radial-gradient(ellipse 80% 80% at 40% 35%, rgba(255, 106, 0, 0.2) 0%, transparent 70%)",
  neutral: "radial-gradient(ellipse 80% 80% at 35% 40%, rgba(140, 140, 136, 0.15) 0%, transparent 70%)",
};

export function BackgroundBreath({
  variant,
  intensity = "barely-there",
  className,
}: BackgroundBreathProps) {
  const isSubtle = intensity === "subtle";

  return (
    <div
      className={cn(
        "absolute inset-0 pointer-events-none -z-10",
        isSubtle ? "animate-breath-subtle" : "animate-breath",
        className
      )}
      style={{ background: gradients[variant] }}
      aria-hidden="true"
    />
  );
}
