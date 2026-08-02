"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertCircle, ArrowLeft, Mail } from "lucide-react";
import { Logo } from "@/components/layout/logo";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const origin =
        typeof window !== "undefined" ? window.location.origin : "";
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        email.trim(),
        { redirectTo: `${origin}/auth/login` },
      );

      if (resetError) {
        setError(resetError.message);
        return;
      }

      setSent(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-brand-950 via-brand-900 to-brand-950 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center justify-center">
            <Logo light className="h-10" />
          </Link>
          <h1 className="mt-6 text-2xl font-bold text-white">Reset password</h1>
          <p className="mt-2 text-sm text-white/60">
            We&apos;ll email you a secure link to choose a new password.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
          {sent ? (
            <div className="space-y-4 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent/20 text-accent">
                <Mail className="h-5 w-5" />
              </div>
              <p className="text-sm text-white/80">
                If an account exists for <strong>{email}</strong>, a reset link
                is on its way. Check your inbox and spam folder.
              </p>
              <Link
                href="/auth/login"
                className="inline-flex items-center gap-2 text-sm text-accent hover:text-accent/80"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to sign in
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="flex items-center gap-2 rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-400">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {error}
                </div>
              )}

              <div>
                <label
                  htmlFor="email"
                  className="mb-1.5 block text-sm font-medium text-white/80"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@britemjtechnologies.com"
                  required
                  className="block w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/30 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent py-3 font-semibold text-brand-950 transition-colors hover:bg-accent/90 disabled:opacity-50"
              >
                {loading ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-brand-950 border-t-transparent" />
                ) : (
                  "Send reset link"
                )}
              </button>

              <Link
                href="/auth/login"
                className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to sign in
              </Link>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
