import Link from "next/link";

export default function AdminDashboardPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <p className="mt-2 text-muted-foreground">Platform management.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Link href="/admin/users" className="rounded-lg border p-6 hover:bg-muted/50">
          <h3 className="font-semibold">Users</h3>
          <p className="mt-1 text-sm text-muted-foreground">Manage accounts and roles.</p>
        </Link>
        <Link href="/admin/listings" className="rounded-lg border p-6 hover:bg-muted/50">
          <h3 className="font-semibold">Listings</h3>
          <p className="mt-1 text-sm text-muted-foreground">Approve, reject, and moderate.</p>
        </Link>
        <Link href="/admin/valuations" className="rounded-lg border p-6 hover:bg-muted/50">
          <h3 className="font-semibold">Valuations</h3>
          <p className="mt-1 text-sm text-muted-foreground">View valuation submissions.</p>
        </Link>
      </div>
    </div>
  );
}
