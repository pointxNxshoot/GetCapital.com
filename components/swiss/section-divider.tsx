import { cn } from "@/lib/utils";

export function SectionDivider({ className }: { className?: string }) {
  return <hr className={cn("border-current/20", className)} />;
}
