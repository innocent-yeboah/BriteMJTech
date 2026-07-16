"use client";

import { useState } from "react";
import { Building2, User, Bell, Shield, Database } from "lucide-react";
import { PageHeader } from "@/components/admin/ui/page-header";
import { Input, Textarea, Select, Button, Checkbox } from "@/components/admin/ui/form-fields";

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

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("company");
  const [saving, setSaving] = useState(false);

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

  const handleSave = async () => {
    setSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSaving(false);
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
        description="Manage system configuration and preferences"
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
                <Button onClick={handleSave} loading={saving}>
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
                <Button onClick={handleSave} loading={saving}>
                  Save Preferences
                </Button>
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="space-y-6">
              <div className="rounded-xl border border-slate-200 bg-white p-6">
                <h3 className="mb-6 text-lg font-semibold text-slate-900">Password</h3>
                <div className="max-w-md space-y-4">
                  <Input label="Current Password" type="password" placeholder="••••••••" />
                  <Input label="New Password" type="password" placeholder="••••••••" />
                  <Input label="Confirm New Password" type="password" placeholder="••••••••" />
                </div>
                <div className="mt-6 flex justify-end">
                  <Button>Update Password</Button>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-6">
                <h3 className="mb-4 text-lg font-semibold text-slate-900">Two-Factor Authentication</h3>
                <p className="mb-4 text-sm text-slate-600">
                  Add an extra layer of security to your account by enabling two-factor authentication.
                </p>
                <Button variant="secondary">Enable 2FA</Button>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-6">
                <h3 className="mb-4 text-lg font-semibold text-slate-900">Active Sessions</h3>
                <p className="mb-4 text-sm text-slate-600">
                  Manage your active sessions across devices.
                </p>
                <div className="rounded-lg border border-slate-200 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-slate-900">Current Session</p>
                      <p className="text-sm text-slate-500">Windows • Chrome • Accra, Ghana</p>
                    </div>
                    <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
                      Active
                    </span>
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
                  Your data is automatically backed up by Supabase. Last backup was less than an hour ago.
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
