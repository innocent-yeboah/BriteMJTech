"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Eye, Pencil, Trash2, Phone, Mail, Calendar } from "lucide-react";
import { PageHeader, AddButton } from "@/components/admin/ui/page-header";
import { DataTable, ActionMenu, ActionMenuItem, type Column } from "@/components/admin/ui/data-table";
import { StatusBadge, PriorityBadge } from "@/components/admin/ui/badges";
import { ConfirmModal } from "@/components/admin/ui/modal";
import { Select } from "@/components/admin/ui/form-fields";
import { createClient } from "@/lib/supabase/client";
import { formatDate, formatPhoneGH, LEAD_STATUS_CONFIG, SERVICES_LIST } from "@/lib/admin/constants";
import type { Lead, LeadStatus } from "@/types/database";

function LeadsContent() {
  const searchParams = useSearchParams();
  const statusFilter = searchParams.get("status") as LeadStatus | null;

  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; lead: Lead | null }>({
    open: false,
    lead: null,
  });
  const [deleting, setDeleting] = useState(false);
  const [filters, setFilters] = useState({
    status: statusFilter || "",
    priority: "",
    source: "",
  });

  const supabase = createClient();

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false });

      if (filters.status) {
        query = query.eq("status", filters.status);
      }
      if (filters.priority) {
        query = query.eq("priority", filters.priority);
      }
      if (filters.source) {
        query = query.eq("source", filters.source);
      }

      const { data, error } = await query;
      if (error) throw error;
      setLeads((data as Lead[]) ?? []);
    } catch (error) {
      console.error("Failed to fetch leads:", error);
    } finally {
      setLoading(false);
    }
  }, [supabase, filters]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const handleDelete = async () => {
    if (!deleteModal.lead) return;
    setDeleting(true);
    try {
      const { error } = await supabase.from("leads").delete().eq("id", deleteModal.lead.id);
      if (error) throw error;
      setLeads((prev) => prev.filter((l) => l.id !== deleteModal.lead!.id));
      setDeleteModal({ open: false, lead: null });
    } catch (error) {
      console.error("Failed to delete lead:", error);
    } finally {
      setDeleting(false);
    }
  };

  const columns: Column<Lead>[] = [
    {
      key: "name",
      header: "Contact",
      sortable: true,
      render: (lead) => (
        <div>
          <p className="font-medium text-slate-900">{lead.name}</p>
          <div className="mt-1 flex items-center gap-3 text-sm text-slate-500">
            <span className="flex items-center gap-1">
              <Phone className="h-3.5 w-3.5" />
              {formatPhoneGH(lead.phone)}
            </span>
            {lead.email && (
              <span className="flex items-center gap-1">
                <Mail className="h-3.5 w-3.5" />
                {lead.email}
              </span>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "service_interest",
      header: "Service Interest",
      render: (lead) => (
        <div className="flex flex-wrap gap-1">
          {lead.service_interest?.slice(0, 2).map((service) => (
            <span
              key={service}
              className="inline-flex rounded bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600"
            >
              {SERVICES_LIST.find((s) => s.value === service)?.label || service}
            </span>
          ))}
          {(lead.service_interest?.length ?? 0) > 2 && (
            <span className="text-xs text-slate-400">
              +{(lead.service_interest?.length ?? 0) - 2} more
            </span>
          )}
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      render: (lead) => <StatusBadge status={lead.status} />,
    },
    {
      key: "priority",
      header: "Priority",
      sortable: true,
      render: (lead) => <PriorityBadge priority={lead.priority} />,
    },
    {
      key: "created_at",
      header: "Created",
      sortable: true,
      render: (lead) => (
        <div className="flex items-center gap-1.5 text-sm text-slate-500">
          <Calendar className="h-3.5 w-3.5" />
          {formatDate(lead.created_at)}
        </div>
      ),
    },
  ];

  const filterComponent = (
    <div className="flex flex-wrap gap-4">
      <Select
        options={[
          { value: "", label: "All Statuses" },
          ...Object.entries(LEAD_STATUS_CONFIG).map(([value, config]) => ({
            value,
            label: config.label,
          })),
        ]}
        value={filters.status}
        onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
        className="w-40"
      />
      <Select
        options={[
          { value: "", label: "All Priorities" },
          { value: "low", label: "Low" },
          { value: "normal", label: "Normal" },
          { value: "high", label: "High" },
          { value: "urgent", label: "Urgent" },
        ]}
        value={filters.priority}
        onChange={(e) => setFilters((f) => ({ ...f, priority: e.target.value }))}
        className="w-40"
      />
      <Select
        options={[
          { value: "", label: "All Sources" },
          { value: "website", label: "Website" },
          { value: "referral", label: "Referral" },
          { value: "walk_in", label: "Walk-in" },
          { value: "call", label: "Phone Call" },
          { value: "whatsapp", label: "WhatsApp" },
          { value: "social_media", label: "Social Media" },
        ]}
        value={filters.source}
        onChange={(e) => setFilters((f) => ({ ...f, source: e.target.value }))}
        className="w-40"
      />
    </div>
  );

  return (
    <div>
      <PageHeader
        title="Leads"
        description="Manage and track potential customers"
        actions={<AddButton href="/admin/leads/new">Add Lead</AddButton>}
      />

      <DataTable
        data={leads}
        columns={columns}
        keyField="id"
        loading={loading}
        searchable
        searchPlaceholder="Search leads by name, phone, or email..."
        searchFields={["name", "email", "phone"]}
        filterComponent={filterComponent}
        emptyMessage="No leads found. Add your first lead to get started."
        actions={(lead) => (
          <ActionMenu>
            <ActionMenuItem
              icon={Eye}
              onClick={() => (window.location.href = `/admin/leads/${lead.id}`)}
            >
              View Details
            </ActionMenuItem>
            <ActionMenuItem
              icon={Pencil}
              onClick={() => (window.location.href = `/admin/leads/${lead.id}/edit`)}
            >
              Edit Lead
            </ActionMenuItem>
            <ActionMenuItem
              icon={Trash2}
              variant="danger"
              onClick={() => setDeleteModal({ open: true, lead })}
            >
              Delete Lead
            </ActionMenuItem>
          </ActionMenu>
        )}
      />

      <ConfirmModal
        open={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, lead: null })}
        onConfirm={handleDelete}
        title="Delete Lead"
        description={`Are you sure you want to delete ${deleteModal.lead?.name}? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
        loading={deleting}
      />
    </div>
  );
}

export default function LeadsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <LeadsContent />
    </Suspense>
  );
}
