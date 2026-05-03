import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { SignOutButton } from "./sign-out-button";
import { MobileMenu } from "./mobile-menu";

export async function Header() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <header className="border-b border-[var(--color-border)] bg-[var(--color-background)] sticky top-0 z-50">
      <div className="mx-auto flex h-16 max-w-[var(--container-max)] items-center justify-between px-8 lg:px-12">
        <Link href="/" className="font-display font-semibold text-xl lg:text-2xl tracking-tight leading-none text-[var(--color-foreground)] hover:opacity-80 transition-opacity">
          Get Capital
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/valuation" className="text-sm text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] transition-colors">
            Value your business
          </Link>
          <Link href="/listings" className="text-sm text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] transition-colors">
            Browse listings
          </Link>
          <Link href="/about" className="text-sm text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] transition-colors">
            About
          </Link>
          <Link href="/contact" className="text-sm text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] transition-colors">
            Contact
          </Link>

          {user ? (
            <div className="flex items-center gap-6">
              <Link href="/dashboard" className="text-sm text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] transition-colors">
                Dashboard
              </Link>
              <SignOutButton />
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link href="/signin" className="text-sm text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] transition-colors">
                Sign in
              </Link>
              <Link
                href="/signup"
                className="rounded-full bg-[var(--color-foreground)] px-6 py-2 text-sm font-medium text-[var(--color-background)] hover:bg-[var(--color-foreground)]/90 transition-colors"
              >
                Sign up
              </Link>
            </div>
          )}
        </nav>

        {/* Mobile menu */}
        <MobileMenu isLoggedIn={!!user} />
      </div>
    </header>
  );
}
