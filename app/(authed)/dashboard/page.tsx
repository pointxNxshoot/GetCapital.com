import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/signin");

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="mt-2 text-muted-foreground">
        Welcome back, {user.user_metadata?.full_name || user.email}.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border p-6">
          <h3 className="font-semibold">List your business</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Create a listing and reach qualified buyers.
          </p>
          <Link href="/listings/create" className={buttonVariants({ size: "sm", className: "mt-4" })}>
            Create listing
          </Link>
        </div>
        <div className="rounded-lg border p-6">
          <h3 className="font-semibold">Your inquiries</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            View and manage buyer inquiries.
          </p>
          <Link href="/inquiries" className={buttonVariants({ variant: "outline", size: "sm", className: "mt-4" })}>
            View inquiries
          </Link>
        </div>
      </div>
    </div>
  );
}
