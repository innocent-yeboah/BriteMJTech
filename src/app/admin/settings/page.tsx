"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Building2, Bell, Shield, Database, Users, KeyRound } from "lucide-react";
import { PageHeader } from "@/components/admin/ui/page-header";
import { Input, Textarea, Button, Checkbox } from "@/components/admin/ui/form-fields";
import { createClient } from "@/lib/supabase/client";
import type { UserRole } from "@/types/database";

interface CompanySettings {
  company_name: string;
  company_email: string;
  company_phone: string;
  company_address: string;
  tax_id: string;
  invoice_prefix: string;
  default_tax_rate: number;
}

interface NotificationSettings {
  email_new_lead: boolean;
  email_lead_status: boolean;
  email_project_update: boolean;
  email_low_stock: boolean;
  email_invoice_paid: boolean;
}

function SettingsContent() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") || "company";

  const [activeTab, setActiveTab] = useState(initialTab);
  const [saving, setSaving] = useState(false);
  const [role, setRole] = useState<UserRole | null>(null);
  const [securityMessage, setSecurityMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [company, setCompany] = useState<CompanySettings>({
    company_name: "Brite MJ Technologies",
    company_email: "britemjtechnology@gmail.com",
    company_phone: "0203412477",
    company_address: "Spintex-Shell Signboard, Accra, Ghana",
    tax_id: "",
    invoice_prefix: "INV",
    default_tax_rate: 12.5,
  });

  const [notifications, setNotifications] = useState<NotificationSettings>({
    email_new_lead: true,
    email_lead_status: true,
    email_project_update: false,
    email_low_stock: true,
    email_invoice_paid: true,
  });

  useEffect(() => {
    const loadRole = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from("users")
        .select("role")
        .eq("id", user.id)
        .single();
      if (data?.role) setRole(data.role as UserRole);
    };
    void loadRole();
  }, []);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  const handleSave = async () => {
    setSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    setSaving(false);
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSecurityMessage(null);
    setSaving(true);

    try {
      const res = await fetch("/api/admin/security/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(passwordForm),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to update password");

      setSecurityMessage({ type: "success", text: "Password updated successfully." });
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setSecurityMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to update password",
      });
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: "company", label: "Company", icon: Building2 },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Shield },
    { id: "backup", label: "Backup", icon: Database },
  ];

  return (
    <div>
      <PageHeader
        title="Settings"
        description="Manage system configuration and security"
      />

      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="w-full lg:w-64">
          <nav className="space-y-1 rounded-xl border border-slate-200 bg-white p-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? "bg-brand-50 text-brand-600"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex-1">
          {activeTab === "company" && (
            <div className="rounded-xl border border-slate-200 bg-white p-6">
              <h3 className="mb-6 text-lg font-semibold text-slate-900">Company Information</h3>
              <div className="space-y-4">
                <Input
                  label="Company Name"
                  value={company.company_name}
                  onChange={(e) => setCompany({ ...company, company_name: e.target.value })}
                />
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input
                    label="Email Address"
                    type="email"
                    value={company.company_email}
                    onChange={(e) => setCompany({ ...company, company_email: e.target.value })}
                  />
                  <Input
                    label="Phone Number"
                    value={company.company_phone}
                    onChange={(e) => setCompany({ ...company, company_phone: e.target.value })}
                  />
                </div>
                <Textarea
                  label="Address"
                  value={company.company_address}
                  onChange={(e) => setCompany({ ...company, company_address: e.target.value })}
                  rows={2}
                />
                <div className="grid gap-4 sm:grid-cols-3">
                  <Input
                    label="Tax ID / TIN"
                    value={company.tax_id}
                    onChange={(e) => setCompany({ ...company, tax_id: e.target.value })}
                    placeholder="GHA-000000000"
                  />
                  <Input
                    label="Invoice Prefix"
                    value={company.invoice_prefix}
                    onChange={(e) => setCompany({ ...company, invoice_prefix: e.target.value })}
                  />
                  <Input
                    label="Default Tax Rate (%)"
                    type="number"
                    step="0.1"
                    value={company.default_tax_rate}
                    onChange={(e) =>
                      setCompany({ ...company, default_tax_rate: parseFloat(e.target.value) || 0 })
                    }
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <Button onClick={() => void handleSave()} loading={saving}>
                  Save Changes
                </Button>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="rounded-xl border border-slate-200 bg-white p-6">
              <h3 className="mb-6 text-lg font-semibold text-slate-900">Email Notifications</h3>
              <div className="space-y-4">
                <Checkbox
                  label="New Lead Notifications"
                  description="Receive an email when a new lead is submitted"
                  checked={notifications.email_new_lead}
                  onChange={(e) =>
                    setNotifications({ ...notifications, email_new_lead: e.target.checked })
                  }
                />
                <Checkbox
                  label="Lead Status Changes"
                  description="Get notified when a lead status is updated"
                  checked={notifications.email_lead_status}
                  onChange={(e) =>
                    setNotifications({ ...notifications, email_lead_status: e.target.checked })
                  }
                />
                <Checkbox
                  label="Project Updates"
                  description="Receive updates on project progress"
                  checked={notifications.email_project_update}
                  onChange={(e) =>
                    setNotifications({ ...notifications, email_project_update: e.target.checked })
                  }
                />
                <Checkbox
                  label="Low Stock Alerts"
                  description="Get notified when inventory items are running low"
                  checked={notifications.email_low_stock}
                  onChange={(e) =>
                    setNotifications({ ...notifications, email_low_stock: e.target.checked })
                  }
                />
                <Checkbox
                  label="Invoice Payment Received"
                  description="Receive notification when an invoice is paid"
                  checked={notifications.email_invoice_paid}
                  onChange={(e) =>
                    setNotifications({ ...notifications, email_invoice_paid: e.target.checked })
                  }
                />
              </div>
              <div className="mt-6 flex justify-end">
                <Button onClick={() => void handleSave()} loading={saving}>
                  Save Preferences
                </Button>
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="space-y-6">
              {role === "admin" ? (
                <div className="rounded-xl border border-brand-200 bg-brand-50 p-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-brand-950">System access control</h3>
                      <p className="mt-1 text-sm text-brand-800/80">
                        Create users, assign roles (admin/manager/staff/technician), enable or
                        disable accounts, and reset passwords.
                      </p>
                    </div>
                    <Link href="/admin/settings/users">
                      <Button icon={<Users className="h-4 w-4" />}>Manage users</Button>
                    </Link>
                  </div>
                </div>
              ) : null}

              <form
                onSubmit={handlePasswordUpdate}
                className="rounded-xl border border-slate-200 bg-white p-6"
              >
                <h3 className="mb-2 text-lg font-semibold text-slate-900">Change password</h3>
                <p className="mb-6 text-sm text-slate-500">
                  Update your sign-in password. Use at least 8 characters.
                </p>

                {securityMessage ? (
                  <div
                    className={`mb-4 rounded-lg px-4 py-3 text-sm ${
                      securityMessage.type === "success"
                        ? "bg-green-50 text-green-700"
                        : "bg-red-50 text-red-700"
                    }`}
                  >
                    {securityMessage.text}
                  </div>
                ) : null}

                <div className="max-w-md space-y-4">
                  <Input
                    label="Current password"
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(e) =>
                      setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
                    }
                    required
                  />
                  <Input
                    label="New password"
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) =>
                      setPasswordForm({ ...passwordForm, newPassword: e.target.value })
                    }
                    required
                  />
                  <Input
                    label="Confirm new password"
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) =>
                      setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="mt-6 flex justify-end">
                  <Button type="submit" loading={saving} icon={<KeyRound className="h-4 w-4" />}>
                    Update password
                  </Button>
                </div>
              </form>

              <div className="rounded-xl border border-slate-200 bg-white p-6">
                <h3 className="mb-4 text-lg font-semibold text-slate-900">Role permissions</h3>
                <div className="space-y-3 text-sm">
                  <div className="rounded-lg bg-slate-50 p-3">
                    <p className="font-medium text-slate-900">Admin</p>
                    <p className="text-slate-600">
                      Full access including user management and system security.
                    </p>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-3">
                    <p className="font-medium text-slate-900">Manager</p>
                    <p className="text-slate-600">
                      Manage leads, projects, inventory, invoices, expenses, and reports.
                    </p>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-3">
                    <p className="font-medium text-slate-900">Staff / Technician</p>
                    <p className="text-slate-600">
                      View assigned work and update tasks; limited write access.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "backup" && (
            <div className="space-y-6">
              <div className="rounded-xl border border-slate-200 bg-white p-6">
                <h3 className="mb-4 text-lg font-semibold text-slate-900">Data Export</h3>
                <p className="mb-4 text-sm text-slate-600">
                  Export your data in CSV format for backup or migration purposes.
                </p>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  <Button variant="secondary">Export Leads</Button>
                  <Button variant="secondary">Export Projects</Button>
                  <Button variant="secondary">Export Invoices</Button>
                  <Button variant="secondary">Export Inventory</Button>
                  <Button variant="secondary">Export Expenses</Button>
                  <Button variant="secondary">Export All Data</Button>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-6">
                <h3 className="mb-4 text-lg font-semibold text-slate-900">Automatic Backups</h3>
                <p className="mb-4 text-sm text-slate-600">
                  Your data is automatically backed up by Supabase.
                </p>
                <div className="flex items-center gap-3 rounded-lg bg-green-50 p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                    <Database className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-green-700">Backups Active</p>
                    <p className="text-sm text-green-600">Point-in-time recovery enabled</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500">Loading settings...</div>}>
      <SettingsContent />
    </Suspense>
  );
}
