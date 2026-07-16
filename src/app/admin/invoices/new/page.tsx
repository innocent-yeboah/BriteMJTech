"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/admin/ui/page-header";
import { Input, Textarea, Select, Button } from "@/components/admin/ui/form-fields";
import { createClient } from "@/lib/supabase/client";
import { formatCurrency, TAX_RATE } from "@/lib/admin/constants";
import type { Project } from "@/types/database";

interface LineItem {
  description: string;
  quantity: number;
  unit_price: number;
}

function NewInvoiceContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectId = searchParams.get("project");

  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [form, setForm] = useState({
    client_name: "",
    client_email: "",
    client_phone: "",
    client_address: "",
    project_id: projectId || "",
    issue_date: new Date().toISOString().split("T")[0],
    due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    tax_rate: TAX_RATE,
    notes: "",
  });
  const [items, setItems] = useState<LineItem[]>([
    { description: "", quantity: 1, unit_price: 0 },
  ]);

  const supabase = createClient();

  useEffect(() => {
    const fetchProjects = async () => {
      const { data } = await supabase
        .from("projects")
        .select("*")
        .in("status", ["planning", "in_progress", "installation", "testing", "completed"])
        .order("created_at", { ascending: false });
      setProjects((data as Project[]) ?? []);

      if (projectId && data) {
        const project = data.find((p: Project) => p.id === projectId);
        if (project) {
          setForm((f) => ({
            ...f,
            client_name: project.client_name,
            client_email: project.client_email || "",
            client_phone: project.client_phone || "",
          }));
        }
      }
    };
    fetchProjects();
  }, [supabase, projectId]);

  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unit_price, 0);
  const tax = subtotal * form.tax_rate;
  const total = subtotal + tax;

  const addItem = () => {
    setItems([...items, { description: "", quantity: 1, unit_price: 0 }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const updateItem = (index: number, field: keyof LineItem, value: string | number) => {
    setItems(
      items.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.client_name || items.some((i) => !i.description || i.unit_price <= 0)) {
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();

      const { data: invoiceNum } = await supabase.rpc("generate_invoice_number");
      const invoiceNumber = invoiceNum || `INV-${Date.now()}`;

      const { data: invoice, error: invoiceError } = await supabase
        .from("invoices")
        .insert({
          invoice_number: invoiceNumber,
          client_name: form.client_name,
          client_email: form.client_email || null,
          client_phone: form.client_phone || null,
          client_address: form.client_address || null,
          project_id: form.project_id || null,
          issue_date: form.issue_date,
          due_date: form.due_date,
          amount: subtotal,
          tax: tax,
          total_amount: total,
          status: "draft",
          notes: form.notes || null,
          created_by: user?.id,
        })
        .select()
        .single();

      if (invoiceError) throw invoiceError;

      const invoiceItems = items.map((item) => ({
        invoice_id: invoice.id,
        description: item.description,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total: item.quantity * item.unit_price,
      }));

      const { error: itemsError } = await supabase.from("invoice_items").insert(invoiceItems);
      if (itemsError) throw itemsError;

      router.push(`/admin/invoices/${invoice.id}`);
    } catch (error) {
      console.error("Failed to create invoice:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Create Invoice"
        description="Create a new invoice for a client"
        backHref="/admin/invoices"
      />

      <form onSubmit={handleSubmit} className="mx-auto max-w-3xl">
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <h3 className="mb-4 text-lg font-semibold text-slate-900">Client Information</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Client Name"
              placeholder="John Doe / ABC Company"
              value={form.client_name}
              onChange={(e) => setForm({ ...form, client_name: e.target.value })}
              required
            />
            <Input
              label="Client Phone"
              placeholder="0203412477"
              value={form.client_phone}
              onChange={(e) => setForm({ ...form, client_phone: e.target.value })}
            />
            <Input
              label="Client Email"
              type="email"
              placeholder="client@example.com"
              value={form.client_email}
              onChange={(e) => setForm({ ...form, client_email: e.target.value })}
            />
            <Select
              label="Related Project"
              options={[
                { value: "", label: "No project" },
                ...projects.map((p) => ({ value: p.id, label: p.project_name })),
              ]}
              value={form.project_id}
              onChange={(e) => {
                const project = projects.find((p) => p.id === e.target.value);
                setForm({
                  ...form,
                  project_id: e.target.value,
                  client_name: project?.client_name || form.client_name,
                  client_email: project?.client_email || form.client_email,
                  client_phone: project?.client_phone || form.client_phone,
                });
              }}
            />
            <Textarea
              label="Client Address"
              placeholder="123 Main Street, Accra"
              value={form.client_address}
              onChange={(e) => setForm({ ...form, client_address: e.target.value })}
              className="sm:col-span-2"
              rows={2}
            />
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6">
          <h3 className="mb-4 text-lg font-semibold text-slate-900">Invoice Details</h3>
          <div className="grid gap-4 sm:grid-cols-3">
            <Input
              label="Issue Date"
              type="date"
              value={form.issue_date}
              onChange={(e) => setForm({ ...form, issue_date: e.target.value })}
              required
            />
            <Input
              label="Due Date"
              type="date"
              value={form.due_date}
              onChange={(e) => setForm({ ...form, due_date: e.target.value })}
              required
            />
            <Input
              label="Tax Rate (%)"
              type="number"
              step="0.01"
              value={(form.tax_rate * 100).toFixed(1)}
              onChange={(e) => setForm({ ...form, tax_rate: parseFloat(e.target.value) / 100 || 0 })}
            />
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900">Line Items</h3>
            <Button type="button" size="sm" variant="secondary" icon={<Plus className="h-4 w-4" />} onClick={addItem}>
              Add Item
            </Button>
          </div>

          <div className="space-y-4">
            {items.map((item, index) => (
              <div key={index} className="grid gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 sm:grid-cols-12">
                <div className="sm:col-span-6">
                  <Input
                    placeholder="Description"
                    value={item.description}
                    onChange={(e) => updateItem(index, "description", e.target.value)}
                    required
                  />
                </div>
                <div className="sm:col-span-2">
                  <Input
                    type="number"
                    min={1}
                    placeholder="Qty"
                    value={item.quantity}
                    onChange={(e) => updateItem(index, "quantity", parseInt(e.target.value) || 1)}
                    required
                  />
                </div>
                <div className="sm:col-span-3">
                  <Input
                    type="number"
                    step="0.01"
                    min={0}
                    placeholder="Unit Price"
                    value={item.unit_price || ""}
                    onChange={(e) => updateItem(index, "unit_price", parseFloat(e.target.value) || 0)}
                    required
                  />
                </div>
                <div className="flex items-center justify-end sm:col-span-1">
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    disabled={items.length === 1}
                    className="rounded-lg p-2 text-slate-400 hover:bg-slate-200 hover:text-red-600 disabled:opacity-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 border-t border-slate-200 pt-4">
            <div className="ml-auto max-w-xs space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Subtotal</span>
                <span className="font-medium text-slate-900">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Tax ({(form.tax_rate * 100).toFixed(1)}%)</span>
                <span className="font-medium text-slate-900">{formatCurrency(tax)}</span>
              </div>
              <div className="flex items-center justify-between border-t border-slate-200 pt-2 text-lg">
                <span className="font-semibold text-slate-900">Total</span>
                <span className="font-bold text-brand-600">{formatCurrency(total)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6">
          <h3 className="mb-4 text-lg font-semibold text-slate-900">Notes</h3>
          <Textarea
            placeholder="Payment terms, bank details, or other notes..."
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            rows={4}
          />
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            Create Invoice
          </Button>
        </div>
      </form>
    </div>
  );
}

export default function NewInvoicePage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <NewInvoiceContent />
    </Suspense>
  );
}
