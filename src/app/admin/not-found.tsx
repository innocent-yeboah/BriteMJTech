import Link from "next/link";
import { Button } from "@/components/admin/ui/form-fields";

export default function AdminNotFound() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center px-4 text-center">
      <p className="font-heading text-6xl font-extrabold text-accent">404</p>
      <h1 className="mt-4 text-2xl font-bold text-slate-900">Page not found</h1>
      <p className="mt-2 max-w-md text-sm text-slate-500">
        This admin page doesn&apos;t exist or may have moved.
      </p>
      <div className="mt-6 flex gap-3">
        <Link href="/admin">
          <Button>Back to Dashboard</Button>
        </Link>
        <Link href="/admin/settings">
          <Button variant="outline">Settings</Button>
        </Link>
      </div>
    </div>
  );
}
