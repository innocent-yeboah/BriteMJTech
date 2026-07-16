"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Eye, Pencil, Trash2, Send, CheckCircle, DollarSign, FileText } from "lucide-react";
import { PageHeader, AddButton } from "@/components/admin/ui/page-header";
import { DataTable, ActionMenu, ActionMenuItem, type Column } from "@/components/admin/ui/data-table";
import { InvoiceStatusBadge } from "@/components/admin/ui/badges";
import { ConfirmModal, Modal } from "@/components/admin/ui/modal";
import { Select, Button } from "@/components/admin/ui/form-fields";
import { createClient } from "@/lib/supabase/client";
import { formatCurrency, formatDate, INVOICE_STATUS_CONFIG, PAYMENT_METHOD_CONFIG } from "@/lib/admin/constants";
import type { Invoice, InvoiceStatus, PaymentMethod } from "@/types/database";

function InvoicesContent() {
  const searchParams = useSearchParams();
  const statusFilter = searchParams.get("status") as InvoiceStatus | null;

  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; invoice: Invoice | null }>({
    open: false,
    invoice: null,
  });
  const [payModal, setPayModal] = useState<{ open: boolean; invoice: Invoice | null }>({
    open: false,
    invoice: null,
  });
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("mobile_money");
  const [deleting, setDeleting] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [filters, setFilters] = useState({
    status: statusFilter || "",
  });

  const supabase = createClient();

  const fetchInvoices = useCallback(async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("invoices")
        .select("*")
        .order("created_at", { ascending: false });

      if (filters.status) {
        query = query.eq("status", filters.status);
      }

      const { data, error } = await query;
      if (error) throw error;
      setInvoices((data as Invoice[]) ?? []);
    } catch (error) {
      console.error("Failed to fetch invoices:", error);
    } finally {
      setLoading(false);
    }
  }, [supabase, filters]);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  const handleDelete = async () => {
    if (!deleteModal.invoice) return;
    setDeleting(true);
    try {
      const { error } = await supabase.from("invoices").delete().eq("id", deleteModal.invoice.id);
      if (error) throw error;
      setInvoices((prev) => prev.filter((i) => i.id !== deleteModal.invoice!.id));
      setDeleteModal({ open: false, invoice: null });
    } catch (error) {
      console.error("Failed to delete invoice:", error);
    } finally {
      setDeleting(false);
    }
  };

  const handleSend = async (invoice: Invoice) => {
    setProcessing(true);
    try {
      const { error } = await supabase
        .from("invoices")
        .update({ status: "sent" })
        .eq("id", invoice.id);
      if (error) throw error;
      setInvoices((prev) =>
        prev.map((i) => (i.id === invoice.id ? { ...i, status: "sent" as InvoiceStatus } : i))
      );
    } catch (error) {
      console.error("Failed to send invoice:", error);
    } finally {
      setProcessing(false);
    }
  };

  const handleMarkPaid = async () => {
    if (!payModal.invoice) return;
    setProcessing(true);
    try {
      const { error } = await supabase
        .from("invoices")
        .update({
          status: "paid",
          paid_at: new Date().toISOString(),
          payment_method: paymentMethod,
        })
        .eq("id", payModal.invoice.id);
      if (error) throw error;
      setInvoices((prev) =>
        prev.map((i) =>
          i.id === payModal.invoice!.id
            ? { ...i, status: "paid" as InvoiceStatus, paid_at: new Date().toISOString() }
            : i
        )
      );
      setPayModal({ open: false, invoice: null });
    } catch (error) {
      console.error("Failed to mark invoice as paid:", error);
    } finally {
      setProcessing(false);
    }
  };

  const columns: Column<Invoice>[] = [
    {
      key: "invoice_number",
      header: "Invoice",
      sortable: true,
      render: (invoice) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
            <FileText className="h-5 w-5 text-slate-500" />
          </div>
          <div>
            <p className="font-medium text-slate-900">{invoice.invoice_number}</p>
            <p className="text-sm text-slate-500">{invoice.client_name}</p>
          </div>
        </div>
      ),
    },
    {
      key: "total_amount",
      header: "Amount",
      sortable: true,
      align: "right",
      render: (invoice) => (
        <span className="text-lg font-semibold text-slate-900">
          {formatCurrency(invoice.total_amount)}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      render: (invoice) => <InvoiceStatusBadge status={invoice.status} />,
    },
    {
      key: "issue_date",
      header: "Issue Date",
      sortable: true,
      render: (invoice) => (
        <span className="text-sm text-slate-600">{formatDate(invoice.issue_date)}</span>
      ),
    },
    {
      key: "due_date",
      header: "Due Date",
      sortable: true,
      render: (invoice) => {
        const isOverdue =
          invoice.status !== "paid" &&
          invoice.status !== "cancelled" &&
          new Date(invoice.due_date) < new Date();
        return (
          <span className={`text-sm ${isOverdue ? "font-medium text-red-600" : "text-slate-600"}`}>
            {formatDate(invoice.due_date)}
            {isOverdue && " (Overdue)"}
          </span>
        );
      },
    },
  ];

  const filterComponent = (
    <div className="flex flex-wrap gap-4">
      <Select
        options={[
          { value: "", label: "All Statuses" },
          ...Object.entries(INVOICE_STATUS_CONFIG).map(([value, config]) => ({
            value,
            label: config.label,
          })),
        ]}
        value={filters.status}
        onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
        className="w-40"
      />
    </div>
  );

  const totalRevenue = invoices
    .filter((i) => i.status === "paid")
    .reduce((sum, i) => sum + i.total_amount, 0);
  const outstanding = invoices
    .filter((i) => i.status === "sent")
    .reduce((sum, i) => sum + i.total_amount, 0);
  const overdue = invoices
    .filter((i) => i.status !== "paid" && i.status !== "cancelled" && new Date(i.due_date) < new Date())
    .reduce((sum, i) => sum + i.total_amount, 0);

  return (
    <div>
      <PageHeader
        title="Invoices"
        description="Manage client invoices and payments"
        actions={<AddButton href="/admin/invoices/new">Create Invoice</AddButton>}
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-green-200 bg-green-50 p-4">
          <p className="text-sm text-green-600">Total Received</p>
          <p className="mt-1 text-2xl font-bold text-green-700">{formatCurrency(totalRevenue)}</p>
        </div>
        <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4">
          <p className="text-sm text-yellow-600">Outstanding</p>
          <p className="mt-1 text-2xl font-bold text-yellow-700">{formatCurrency(outstanding)}</p>
        </div>
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-600">Overdue</p>
          <p className="mt-1 text-2xl font-bold text-red-700">{formatCurrency(overdue)}</p>
        </div>
      </div>

      <DataTable
        data={invoices}
        columns={columns}
        keyField="id"
        loading={loading}
        searchable
        searchPlaceholder="Search invoices..."
        searchFields={["invoice_number", "client_name", "client_email"]}
        filterComponent={filterComponent}
        emptyMessage="No invoices found. Create your first invoice to get started."
        actions={(invoice) => (
          <ActionMenu>
            <ActionMenuItem
              icon={Eye}
              onClick={() => (window.location.href = `/admin/invoices/${invoice.id}`)}
            >
              View Details
            </ActionMenuItem>
            {invoice.status === "draft" && (
              <ActionMenuItem icon={Send} onClick={() => handleSend(invoice)}>
                Send Invoice
              </ActionMenuItem>
            )}
            {invoice.status === "sent" && (
              <ActionMenuItem
                icon={CheckCircle}
                onClick={() => setPayModal({ open: true, invoice })}
              >
                Mark as Paid
              </ActionMenuItem>
            )}
            {invoice.status === "draft" && (
              <ActionMenuItem
                icon={Pencil}
                onClick={() => (window.location.href = `/admin/invoices/${invoice.id}/edit`)}
              >
                Edit Invoice
              </ActionMenuItem>
            )}
            <ActionMenuItem
              icon={Trash2}
              variant="danger"
              onClick={() => setDeleteModal({ open: true, invoice })}
            >
              Delete Invoice
            </ActionMenuItem>
          </ActionMenu>
        )}
      />

      <Modal
        open={payModal.open}
        onClose={() => setPayModal({ open: false, invoice: null })}
        title="Mark Invoice as Paid"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-slate-600">
            Invoice{" "}
            <span className="font-semibold">{payModal.invoice?.invoice_number}</span> for{" "}
            <span className="font-semibold">
              {formatCurrency(payModal.invoice?.total_amount ?? 0)}
            </span>
          </p>
          <Select
            label="Payment Method"
            options={Object.entries(PAYMENT_METHOD_CONFIG).map(([value, config]) => ({
              value,
              label: config.label,
            }))}
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
          />
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setPayModal({ open: false, invoice: null })}>
              Cancel
            </Button>
            <Button onClick={handleMarkPaid} loading={processing}>
              Confirm Payment
            </Button>
          </div>
        </div>
      </Modal>

      <ConfirmModal
        open={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, invoice: null })}
        onConfirm={handleDelete}
        title="Delete Invoice"
        description={`Are you sure you want to delete invoice ${deleteModal.invoice?.invoice_number}? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
        loading={deleting}
      />
    </div>
  );
}

export default function InvoicesPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <InvoicesContent />
    </Suspense>
  );
}
