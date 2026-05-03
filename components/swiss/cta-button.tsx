import Link from "next/link";
import { cn } from "@/lib/utils";

type CTAButtonProps = {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline";
  href?: string;
  onClick?: () => void;
  className?: string;
};

const variants = {
  primary:
    "bg-[var(--color-foreground)] text-[var(--color-background)] hover:bg-[var(--color-foreground)]/90",
  secondary:
    "bg-[var(--color-background)] text-[var(--color-foreground)] hover:bg-[var(--color-background)]/90",
  outline:
    "border border-current bg-transparent hover:bg-current/10",
};

export function CTAButton({
  children,
  variant = "primary",
  href,
  onClick,
  className,
}: CTAButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center rounded-full px-10 py-4 text-base font-medium transition-colors duration-200 cursor-pointer select-none",
    variants[variant],
    className
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={classes}>
      {children}
    </button>
  );
}
