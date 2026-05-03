import { cn } from "@/lib/utils";

type HeadlineProps = {
  children: React.ReactNode;
  size?: "xl" | "lg" | "md";
  as?: "h1" | "h2" | "h3";
  className?: string;
};

const sizeMap = {
  xl: "var(--font-size-display-xl)",
  lg: "var(--font-size-display-lg)",
  md: "var(--font-size-display-md)",
};

const trackingMap = {
  xl: "-0.04em",
  lg: "-0.03em",
  md: "-0.02em",
};

const leadingMap = {
  xl: "0.95",
  lg: "1",
  md: "1.05",
};

export function Headline({
  children,
  size = "lg",
  as: Tag = "h2",
  className,
}: HeadlineProps) {
  return (
    <Tag
      className={cn("font-normal", className)}
      style={{
        fontSize: sizeMap[size],
        letterSpacing: trackingMap[size],
        lineHeight: leadingMap[size],
        fontFamily: "var(--font-display)",
      }}
    >
      {children}
    </Tag>
  );
}
