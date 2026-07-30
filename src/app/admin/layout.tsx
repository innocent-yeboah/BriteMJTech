import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/shell";

export const metadata: Metadata = {
  title: {
    default: "Admin Dashboard",
    template: "%s | Admin | Brite MJ Technologies",
  },
  description: "Private operations dashboard for Brite MJ Technologies.",
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <AdminShell>{children}</AdminShell>;
}
