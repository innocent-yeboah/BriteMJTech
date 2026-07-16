"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User, Mail, Shield, Save } from "lucide-react";
import { PageHeader } from "@/components/admin/ui/page-header";
import { Input, Button } from "@/components/admin/ui/form-fields";
import { RoleBadge } from "@/components/admin/ui/badges";
import { createClient } from "@/lib/supabase/client";
import { formatDateTime } from "@/lib/admin/constants";
import type { User as ProfileUser } from "@/types/database";

export default function ProfileSettingsPage() {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [profile, setProfile] = useState<ProfileUser | null>(null);
  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    email: "",
  });

  useEffect(() => {
    const loadProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/auth/login?redirect=/admin/settings/profile");
        return;
      }

      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error || !data) {
        setForm({
          full_name: user.user_metadata?.full_name || "",
          phone: "",
          email: user.email || "",
        });
        setLoading(false);
        return;
      }

      const row = data as ProfileUser;
      setProfile(row);
      setForm({
        full_name: row.full_name || "",
        phone: row.phone || "",
        email: row.email || user.email || "",
      });
      setLoading(false);
    };

    void loadProfile();
  }, [supabase, router]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("Not signed in");
      }

      const { error } = await supabase
        .from("users")
        .update({
          full_name: form.full_name.trim() || null,
          phone: form.phone.trim() || null,
        })
        .eq("id", user.id);

      if (error) throw error;

      await supabase.auth.updateUser({
        data: { full_name: form.full_name.trim() || null },
      });

      setProfile((prev) =>
        prev
          ? {
              ...prev,
              full_name: form.full_name.trim() || null,
              phone: form.phone.trim() || null,
            }
          : prev
      );
      setMessage({ type: "success", text: "Profile updated successfully." });
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "Could not update profile. Please try again." });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="My Profile"
        description="Manage your account details"
        backHref="/admin/settings"
      />

      <div className="mx-auto grid max-w-3xl gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-6 lg:col-span-1">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-100 text-brand-600">
              <User className="h-10 w-10" />
            </div>
            <h2 className="mt-4 text-lg font-semibold text-slate-900">
              {form.full_name || "Team Member"}
            </h2>
            <p className="mt-1 text-sm text-slate-500">{form.email}</p>
            {profile?.role ? (
              <div className="mt-3">
                <RoleBadge role={profile.role} />
              </div>
            ) : null}
          </div>

          <div className="mt-6 space-y-3 border-t border-slate-100 pt-4 text-sm">
            <div className="flex items-center gap-2 text-slate-600">
              <Shield className="h-4 w-4 text-slate-400" />
              <span className="capitalize">{profile?.role || "staff"}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <Mail className="h-4 w-4 text-slate-400" />
              <span className="truncate">{form.email}</span>
            </div>
            {profile?.last_login ? (
              <p className="text-xs text-slate-400">
                Last login {formatDateTime(profile.last_login)}
              </p>
            ) : null}
          </div>
        </div>

        <form
          onSubmit={handleSave}
          className="rounded-xl border border-slate-200 bg-white p-6 lg:col-span-2"
        >
          <h3 className="mb-4 text-lg font-semibold text-slate-900">Account details</h3>

          {message ? (
            <div
              className={`mb-4 rounded-lg px-4 py-3 text-sm ${
                message.type === "success"
                  ? "bg-green-50 text-green-700"
                  : "bg-red-50 text-red-700"
              }`}
            >
              {message.text}
            </div>
          ) : null}

          <div className="space-y-4">
            <Input
              label="Full name"
              value={form.full_name}
              onChange={(e) => setForm((f) => ({ ...f, full_name: e.target.value }))}
              placeholder="Your full name"
            />
            <Input
              label="Email"
              type="email"
              value={form.email}
              disabled
              hint="Email is managed through authentication and cannot be changed here."
            />
            <Input
              label="Phone"
              value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
              placeholder="0203412477"
            />
          </div>

          <div className="mt-6 flex justify-end">
            <Button type="submit" loading={saving} icon={<Save className="h-4 w-4" />}>
              Save changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
