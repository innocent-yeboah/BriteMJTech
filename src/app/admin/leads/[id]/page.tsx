"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Phone,
  Mail,
  MapPin,
  Calendar,
  Clock,
  Edit,
  Trash2,
  CheckCircle2,
  XCircle,
  ArrowRight,
  MessageSquare,
  FileText,
} from "lucide-react";
import { PageHeader } from "@/components/admin/ui/page-header";
import { StatusBadge, PriorityBadge } from "@/components/admin/ui/badges";
import { Button, Select, Textarea } from "@/components/admin/ui/form-fields";
import { ConfirmModal, Modal } from "@/components/admin/ui/modal";
import { createClient } from "@/lib/supabase/client";
import {
  formatDate,
  formatDateTime,
  formatPhoneGH,
  formatCurrency,
  SERVICES_LIST,
  PROPERTY_TYPES,
  LEAD_STATUS_CONFIG,
} from "@/lib/admin/constants";
import type { Lead, LeadStatus } from "@/types/database";

export default function LeadDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState(false);
  const [statusModal, setStatusModal] = useState(false);
  const [convertModal, setConvertModal] = useState(false);
  const [newStatus, setNewStatus] = useState<LeadStatus>("new");
  const [statusNotes, setStatusNotes] = useState("");
  const [saving, setSaving] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    const fetchLead = async () => {
      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Failed to fetch lead:", error);
        router.push("/admin/leads");
        return;
      }
      setLead(data as Lead);
      setNewStatus(data.status);
      setLoading(false);
    };

    fetchLead();
  }, [id, supabase, router]);

  const handleStatusChange = async () => {
    if (!lead) return;
    setSaving(true);
    try {
      const updates: Partial<Lead> = { status: newStatus };
      if (statusNotes) {
        updates.notes = lead.notes
          ? `${lead.notes}\n\n[${formatDateTime(new Date())}] Status changed to ${LEAD_STATUS_CONFIG[newStatus].label}: ${statusNotes}`
          : `[${formatDateTime(new Date())}] Status changed to ${LEAD_STATUS_CONFIG[newStatus].label}: ${statusNotes}`;
      }
      if (newStatus === "contacted") updates.contacted_at = new Date().toISOString();
      if (newStatus === "won") updates.won_at = new Date().toISOString();

      const { error } = await supabase.from("leads").update(updates).eq("id", lead.id);
      if (error) throw error;

      setLead({ ...lead, ...updates });
      setStatusModal(false);
      setStatusNotes("");
    } catch (error) {
      console.error("Failed to update status:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!lead) return;
    setSaving(true);
    try {
      const { error } = await supabase.from("leads").delete().eq("id", lead.id);
      if (error) throw error;
      router.push("/admin/leads");
    } catch (error) {
      console.error("Failed to delete lead:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleConvertToProject = async () => {
    if (!lead) return;
    setSaving(true);
    try {
      const { data, error } = await supabase
        .from("projects")
        .insert({
          lead_id: lead.id,
          client_name: lead.name,
          client_phone: lead.phone,
          client_email: lead.email,
          project_name: `${lead.name} - ${lead.service_interest?.[0] || "Security Project"}`,
          project_type: lead.service_interest?.[0] || "combined",
          status: "planning",
          notes: lead.message,
        })
        .select()
        .single();

      if (error) throw error;

      await supabase.from("leads").update({ status: "won", won_at: new Date().toISOString() }).eq("id", lead.id);

      router.push(`/admin/projects/${data.id}`);
    } catch (error) {
      console.error("Failed to convert lead:", error);
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

  if (!lead) return null;

  return (
    <div>
      <PageHeader
        title={lead.name}
        description={`Lead created on ${formatDate(lead.created_at)}`}
        backHref="/admin/leads"
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => setStatusModal(true)}>
              Update Status
            </Button>
            <Link href={`/admin/leads/${lead.id}/edit`}>
              <Button variant="secondary" icon={<Edit className="h-4 w-4" />}>
                Edit
              </Button>
            </Link>
            <Button variant="danger" icon={<Trash2 className="h-4 w-4" />} onClick={() => setDeleteModal(true)}>
              Delete
            </Button>
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <h3 className="mb-4 text-lg font-semibold text-slate-900">Contact Information</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                  <Phone className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Phone</p>
                  <a href={`tel:${lead.phone}`} className="font-medium text-slate-900 hover:text-brand-600">
                    {formatPhoneGH(lead.phone)}
                  </a>
                </div>
              </div>
              {lead.email && (
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
                    <Mail className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Email</p>
                    <a href={`mailto:${lead.email}`} className="font-medium text-slate-900 hover:text-brand-600">
                      {lead.email}
                    </a>
                  </div>
                </div>
              )}
              {lead.property_type && (
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50">
                    <MapPin className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Property Type</p>
                    <p className="font-medium text-slate-900">
                      {PROPERTY_TYPES.find((p) => p.value === lead.property_type)?.label || lead.property_type}
                    </p>
                  </div>
                </div>
              )}
              {lead.property_size && (
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-50">
                    <MapPin className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Property Size</p>
                    <p className="font-medium text-slate-900">{lead.property_size}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <h3 className="mb-4 text-lg font-semibold text-slate-900">Service Interest</h3>
            <div className="flex flex-wrap gap-2">
              {lead.service_interest?.map((service) => (
                <span
                  key={service}
                  className="inline-flex rounded-full bg-brand-100 px-3 py-1 text-sm font-medium text-brand-700"
                >
                  {SERVICES_LIST.find((s) => s.value === service)?.label || service}
                </span>
              ))}
            </div>
            {lead.message && (
              <div className="mt-4 rounded-lg bg-slate-50 p-4">
                <div className="mb-2 flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-slate-500" />
                  <span className="text-sm font-medium text-slate-700">Message</span>
                </div>
                <p className="text-slate-600">{lead.message}</p>
              </div>
            )}
          </div>

          {lead.quote_amount && (
            <div className="rounded-xl border border-slate-200 bg-white p-6">
              <h3 className="mb-4 text-lg font-semibold text-slate-900">Quote Information</h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Quote Amount</p>
                  <p className="text-2xl font-bold text-green-600">{formatCurrency(lead.quote_amount)}</p>
                </div>
                {lead.quote_sent_at && (
                  <div className="text-right">
                    <p className="text-sm text-slate-500">Sent on</p>
                    <p className="font-medium text-slate-900">{formatDate(lead.quote_sent_at)}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {lead.notes && (
            <div className="rounded-xl border border-slate-200 bg-white p-6">
              <h3 className="mb-4 text-lg font-semibold text-slate-900">Notes</h3>
              <div className="whitespace-pre-wrap text-slate-600">{lead.notes}</div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <h3 className="mb-4 text-lg font-semibold text-slate-900">Status</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Current Status</span>
                <StatusBadge status={lead.status} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Priority</span>
                <PriorityBadge priority={lead.priority} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Source</span>
                <span className="font-medium text-slate-900 capitalize">{lead.source.replace("_", " ")}</span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <h3 className="mb-4 text-lg font-semibold text-slate-900">Timeline</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                  <Calendar className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Created</p>
                  <p className="font-medium text-slate-900">{formatDateTime(lead.created_at)}</p>
                </div>
              </div>
              {lead.contacted_at && (
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-100">
                    <Phone className="h-4 w-4 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Contacted</p>
                    <p className="font-medium text-slate-900">{formatDateTime(lead.contacted_at)}</p>
                  </div>
                </div>
              )}
              {lead.inspection_date && (
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100">
                    <MapPin className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Inspection</p>
                    <p className="font-medium text-slate-900">
                      {formatDate(lead.inspection_date)}
                      {lead.inspection_time && ` at ${lead.inspection_time}`}
                    </p>
                  </div>
                </div>
              )}
              {lead.quote_sent_at && (
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100">
                    <FileText className="h-4 w-4 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Quote Sent</p>
                    <p className="font-medium text-slate-900">{formatDateTime(lead.quote_sent_at)}</p>
                  </div>
                </div>
              )}
              {lead.won_at && (
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Won</p>
                    <p className="font-medium text-slate-900">{formatDateTime(lead.won_at)}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {lead.status !== "won" && lead.status !== "lost" && (
            <Button
              className="w-full"
              icon={<ArrowRight className="h-4 w-4" />}
              onClick={() => setConvertModal(true)}
            >
              Convert to Project
            </Button>
          )}
        </div>
      </div>

      <Modal
        open={statusModal}
        onClose={() => setStatusModal(false)}
        title="Update Lead Status"
        size="sm"
      >
        <div className="space-y-4">
          <Select
            label="New Status"
            options={Object.entries(LEAD_STATUS_CONFIG).map(([value, config]) => ({
              value,
              label: config.label,
            }))}
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value as LeadStatus)}
          />
          <Textarea
            label="Notes (optional)"
            placeholder="Add notes about this status change..."
            value={statusNotes}
            onChange={(e) => setStatusNotes(e.target.value)}
          />
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setStatusModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleStatusChange} loading={saving}>
              Update Status
            </Button>
          </div>
        </div>
      </Modal>

      <ConfirmModal
        open={deleteModal}
        onClose={() => setDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete Lead"
        description="Are you sure you want to delete this lead? This action cannot be undone."
        confirmLabel="Delete"
        variant="danger"
        loading={saving}
      />

      <ConfirmModal
        open={convertModal}
        onClose={() => setConvertModal(false)}
        onConfirm={handleConvertToProject}
        title="Convert to Project"
        description={`This will create a new project for ${lead.name} and mark this lead as won. Continue?`}
        confirmLabel="Convert"
        loading={saving}
      />
    </div>
  );
}
