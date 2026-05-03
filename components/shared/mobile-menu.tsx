"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export function MobileMenu({ isLoggedIn }: { isLoggedIn: boolean }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    setOpen(false);
    router.push("/");
    router.refresh();
  }

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen(!open)}
        className="flex flex-col gap-1.5 p-2"
        aria-label="Toggle menu"
      >
        <span className={`block h-0.5 w-5 bg-[var(--color-foreground)] transition-transform duration-200 ${open ? "rotate-45 translate-y-2" : ""}`} />
        <span className={`block h-0.5 w-5 bg-[var(--color-foreground)] transition-opacity duration-200 ${open ? "opacity-0" : ""}`} />
        <span className={`block h-0.5 w-5 bg-[var(--color-foreground)] transition-transform duration-200 ${open ? "-rotate-45 -translate-y-2" : ""}`} />
      </button>

      {open && (
        <div className="absolute top-16 left-0 right-0 border-b border-[var(--color-border)] bg-[var(--color-background)] px-8 py-6 space-y-4">
          <Link href="/valuation" onClick={() => setOpen(false)} className="block text-base">Value your business</Link>
          <Link href="/listings" onClick={() => setOpen(false)} className="block text-base">Browse listings</Link>
          <Link href="/about" onClick={() => setOpen(false)} className="block text-base">About</Link>
          <Link href="/contact" onClick={() => setOpen(false)} className="block text-base">Contact</Link>
          <hr className="border-[var(--color-border)]" />
          {isLoggedIn ? (
            <>
              <Link href="/dashboard" onClick={() => setOpen(false)} className="block text-base">Dashboard</Link>
              <button onClick={handleSignOut} className="block text-base text-[var(--color-muted-foreground)]">Sign out</button>
            </>
          ) : (
            <>
              <Link href="/signin" onClick={() => setOpen(false)} className="block text-base">Sign in</Link>
              <Link href="/signup" onClick={() => setOpen(false)} className="block text-base font-medium">Sign up</Link>
            </>
          )}
        </div>
      )}
    </div>
  );
}
