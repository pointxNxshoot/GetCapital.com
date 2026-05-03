import Link from "next/link";
import { DotPattern } from "@/components/swiss/dot-pattern";

export function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-background)]">
      <div className="mx-auto max-w-[var(--container-max)] px-8 lg:px-12 py-16">
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-6 sm:col-span-4">
            <p className="font-medium text-sm uppercase tracking-wider mb-4">Platform</p>
            <ul className="space-y-2 text-sm text-[var(--color-muted-foreground)]">
              <li><Link href="/valuation" className="hover:text-[var(--color-foreground)] transition-colors">Value your business</Link></li>
              <li><Link href="/listings" className="hover:text-[var(--color-foreground)] transition-colors">Browse listings</Link></li>
              <li><Link href="/about" className="hover:text-[var(--color-foreground)] transition-colors">About</Link></li>
            </ul>
          </div>
          <div className="col-span-6 sm:col-span-4">
            <p className="font-medium text-sm uppercase tracking-wider mb-4">Resources</p>
            <ul className="space-y-2 text-sm text-[var(--color-muted-foreground)]">
              <li><Link href="/contact" className="hover:text-[var(--color-foreground)] transition-colors">Contact</Link></li>
              <li><Link href="/about#faq" className="hover:text-[var(--color-foreground)] transition-colors">FAQ</Link></li>
            </ul>
          </div>
          <div className="col-span-6 sm:col-span-4">
            <p className="font-medium text-sm uppercase tracking-wider mb-4">Legal</p>
            <ul className="space-y-2 text-sm text-[var(--color-muted-foreground)]">
              <li><Link href="/privacy" className="hover:text-[var(--color-foreground)] transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-[var(--color-foreground)] transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-16 overflow-hidden opacity-30">
          <DotPattern rows={6} columns={40} />
        </div>

        <div className="mt-10 flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-[var(--color-border)] pt-8 text-sm text-[var(--color-muted)]">
          <p>&copy; {new Date().getFullYear()} Capital Pty Ltd. All rights reserved.</p>
          <p>Registered in Australia</p>
        </div>
      </div>
    </footer>
  );
}
