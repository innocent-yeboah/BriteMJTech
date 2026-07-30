import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Sign In",
  description: "Secure sign-in for Brite MJ Technologies staff.",
  robots: { index: false, follow: false, nocache: true },
};

export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
