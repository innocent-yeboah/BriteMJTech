"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Phone,
  Mail,
  MapPin,
  Calendar,
  Edit,
  Trash2,
  CheckCircle2,
  XCircle,
  ArrowRight,
  MessageSquare,
  FileText,
  ChevronRight,
} from "lucide-react";
import { PageHeader } from "@/components/admin/ui/page-header";
import { StatusBadge, PriorityBadge } from "@/components/admin/ui/badges";
import {
  Button,
  Select,
  Textarea,
  Input,
} from "@/components/admin/ui/form-fields";
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
  PRIORITY_CONFIG,
} from "@/lib/admin/constants";
import {
  LEAD_PIPELINE,
  OPEN_LEAD_STATUSES,
  buildLeadPipelineUpdate,
  getNextLeadStatus,
  isLeadClosed,
} from "@/lib/admin/lead-pipeline";
import { cn } from "@/lib/utils";
import type { Lead, LeadStatus, Priority, User as StaffUser } from "@/types/database";

export default function LeadDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [lead, setLead] = useState<Lead | null>(null);
  const [staff, setStaff] = useState<Pick<StaffUser, "id" | "full_name" | "email">[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState(false);
  const [statusModal, setStatusModal] = useState(false);
  const [convertModal, setConvertModal] = useState(false);
  const [newStatus, setNewStatus] = useState<LeadStatus>("new");
  const [statusNotes, setStatusNotes] = useState("");
  const [lostReason, setLostReason] = useState("");
  const [inspectionDate, setInspectionDate] = useState("");
  const [inspectionTime, setInspectionTime] = useState("");
  const [inspectionNotes, setInspectionNotes] = useState("");
  const [quoteAmount, setQuoteAmount] = useState("");
  const [assignTo, setAssignTo] = useState("");
  const [priority, setPriority] = useState<Priority>("normal");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const supabase = createClient();

  useEffect(() => {
    const fetchLead = async () => {
      const [{ data, error: leadError }, { data: users }] = await Promise.all([
        supabase
          .from("leads")
          .select("*, assigned_user:users!leads_assigned_to_fkey(id, full_name, email)")
          .eq("id", id)
          .single(),
        supabase
          .from("users")
          .select("id, full_name, email")
          .eq("is_active", true)
          .order("full_name"),
      ]);

      if (leadError) {
        console.error("Failed to fetch lead:", leadError);
        router.push("/admin/leads");
        return;
      }

      const nextLead = data as Lead;
      setLead(nextLead);
      setNewStatus(nextLead.status);
      setAssignTo(nextLead.assigned_to || "");
      setPriority(nextLead.priority || "normal");
      setInspectionDate(nextLead.inspection_date || "");
      setInspectionTime(nextLead.inspection_time || "");
      setInspectionNotes(nextLead.inspection_notes || "");
      setQuoteAmount(nextLead.quote_amount != null ? String(nextLead.quote_amount) : "");
      setLostReason(nextLead.lost_reason || "");
      setStaff((users as Pick<StaffUser, "id" | "full_name" | "email">[]) ?? []);
      setLoading(false);
    };

    void fetchLead();
  }, [id, supabase, router]);

  const nextStatus = useMemo(
    () => (lead ? getNextLeadStatus(lead.status) : null),
    [lead],
  );

  const openStatusModal = (status?: LeadStatus) => {
    if (!lead) return;
    const target = status ?? lead.status;
    setNewStatus(target);
    setStatusNotes("");
    setError("");
    setLostReason(lead.lost_reason || "");
    setInspectionDate(lead.inspection_date || "");
    setInspectionTime(lead.inspection_time || "");
    setInspectionNotes(lead.inspection_notes || "");
    setQuoteAmount(lead.quote_amount != null ? String(lead.quote_amount) : "");
    setAssignTo(lead.assigned_to || "");
    setPriority(lead.priority || "normal");
    setStatusModal(true);
  };

  const handleStatusChange = async () => {
    if (!lead) return;
    setError("");

    if (newStatus === "lost" && !lostReason.trim()) {
      setError("Add a lost reason before closing this lead.");
      return;
    }
    if (newStatus === "inspection_scheduled" && !inspectionDate) {
      setError("Choose an inspection date.");
      return;
    }
    if (newStatus === "quote_sent" && (!quoteAmount || Number(quoteAmount) <= 0)) {
      setError("Enter a quote amount greater than zero.");
      return;
    }

    setSaving(true);
    try {
      const updates = buildLeadPipelineUpdate(lead, {
        status: newStatus,
        notes: statusNotes,
        inspection_date: inspectionDate || null,
        inspection_time: inspectionTime || null,
        inspection_notes: inspectionNotes || null,
        quote_amount: quoteAmount ? Number(quoteAmount) : null,
        lost_reason: lostReason,
        assigned_to: assignTo || null,
        priority,
      });

      const { data, error: updateError } = await supabase
        .from("leads")
        .update(updates)
        .eq("id", lead.id)
        .select("*, assigned_user:users!leads_assigned_to_fkey(id, full_name, email)")
        .single();

      if (updateError) throw updateError;

      setLead(data as Lead);
      setStatusModal(false);
      setStatusNotes("");
    } catch (err) {
      console.error("Failed to update status:", err);
      setError("Could not update this lead. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleAssignOnly = async (userId: string) => {
    if (!lead) return;
    setSaving(true);
    try {
      const { data, error: updateError } = await supabase
        .from("leads")
        .update({ assigned_to: userId || null })
        .eq("id", lead.id)
        .select("*, assigned_user:users!leads_assigned_to_fkey(id, full_name, email)")
        .single();
      if (updateError) throw updateError;
      setLead(data as Lead);
      setAssignTo(userId);
    } catch (err) {
      console.error("Failed to assign lead:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!lead) return;
    setSaving(true);
    try {
      const { error: deleteError } = await supabase.from("leads").delete().eq("id", lead.id);
      if (deleteError) throw deleteError;
      router.push("/admin/leads");
    } catch (err) {
      console.error("Failed to delete lead:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleConvertToProject = async () => {
    if (!lead) return;
    setSaving(true);
    try {
      const serviceKey = lead.service_interest?.[0];
      const projectType =
        serviceKey &&
        [
          "cctv",
          "fencing",
          "networking",
          "gate_control",
          "video_intercom",
          "electric_fencing",
          "smart_security",
          "combined",
        ].includes(serviceKey)
          ? serviceKey
          : "combined";

      const { data, error: projectError } = await supabase
        .from("projects")
        .insert({
          lead_id: lead.id,
          client_name: lead.name,
          client_phone: lead.phone,
          client_email: lead.email,
          project_name: `${lead.name} - ${SERVICES_LIST.find((s) => s.value === serviceKey)?.label || "Security Project"}`,
          project_type: projectType,
          status: "planning",
          budget: lead.quote_amount,
          notes: lead.message,
          assigned_team: lead.assigned_to ? [lead.assigned_to] : null,
        })
        .select()
        .single();

      if (projectError) throw projectError;

      const winUpdates = buildLeadPipelineUpdate(lead, {
        status: "won",
        notes: "Converted to project",
      });

      await supabase.from("leads").update(winUpdates).eq("id", lead.id);
      router.push(`/admin/projects/${data.id}`);
    } catch (err) {
      console.error("Failed to convert lead:", err);
      setError("Could not convert this lead to a project.");
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

  const assignedLabel =
    lead.assigned_user?.full_name ||
    lead.assigned_user?.email ||
    staff.find((u) => u.id === lead.assigned_to)?.full_name ||
    "Unassigned";

  return (
    <div>
      <PageHeader
        title={lead.name}
        description={`Lead created on ${formatDate(lead.created_at)}`}
        backHref="/admin/leads"
        actions={
          <div className="flex flex-wrap items-center gap-2">
            {!isLeadClosed(lead.status) && (
              <Button variant="outline" onClick={() => openStatusModal()}>
                Manage pipeline
              </Button>
            )}
            <Link href={`/admin/leads/${lead.id}/edit`}>
              <Button variant="secondary" icon={<Edit className="h-4 w-4" />}>
                Edit
              </Button>
            </Link>
            <Button
              variant="danger"
              icon={<Trash2 className="h-4 w-4" />}
              onClick={() => setDeleteModal(true)}
            >
              Delete
            </Button>
          </div>
        }
      />

      {/* Pipeline stepper */}
      <div className="mb-6 overflow-x-auto rounded-xl border border-slate-200 bg-white p-4">
        <ol className="flex min-w-[640px] items-center gap-1">
          {LEAD_PIPELINE.filter((s) => s !== "lost").map((status, index) => {
            const currentIndex = LEAD_PIPELINE.indexOf(
              lead.status === "lost" ? "negotiating" : lead.status,
            );
            const stepIndex = LEAD_PIPELINE.indexOf(status);
            const done = stepIndex <= currentIndex && lead.status !== "lost";
            const active = lead.status === status;
            return (
              <li key={status} className="flex flex-1 items-center gap-1">
                <button
                  type="button"
                  disabled={isLeadClosed(lead.status)}
                  onClick={() => openStatusModal(status)}
                  className={cn(
                    "flex w-full flex-col items-center rounded-lg px-2 py-2 text-center transition-colors",
                    active && "bg-brand-50 ring-1 ring-brand-200",
                    !active && done && "opacity-90",
                    !isLeadClosed(lead.status) && "hover:bg-slate-50",
                  )}
                >
                  <span
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold",
                      done || active
                        ? "bg-brand-700 text-white"
                        : "bg-slate-100 text-slate-500",
                      lead.status === "lost" && "bg-red-100 text-red-700",
                    )}
                  >
                    {index + 1}
                  </span>
                  <span className="mt-1 text-[11px] font-medium leading-tight text-slate-700">
                    {LEAD_STATUS_CONFIG[status].label}
                  </span>
                </button>
                {index < LEAD_PIPELINE.filter((s) => s !== "lost").length - 1 && (
                  <ChevronRight className="h-4 w-4 shrink-0 text-slate-300" />
                )}
              </li>
            );
          })}
        </ol>
        {lead.status === "lost" && (
          <p className="mt-3 flex items-center gap-2 text-sm text-red-700">
            <XCircle className="h-4 w-4" />
            Closed as lost
            {lead.lost_reason ? `: ${lead.lost_reason}` : ""}
          </p>
        )}
      </div>

      {/* Quick actions */}
      {!isLeadClosed(lead.status) && (
        <div className="mb-6 flex flex-wrap gap-2">
          {nextStatus && (
            <Button
              onClick={() => openStatusModal(nextStatus)}
              icon={<ArrowRight className="h-4 w-4" />}
            >
              Advance to {LEAD_STATUS_CONFIG[nextStatus].label}
            </Button>
          )}
          {OPEN_LEAD_STATUSES.includes(lead.status) && (
            <>
              <Button variant="outline" onClick={() => openStatusModal("won")}>
                Mark won
              </Button>
              <Button variant="outline" onClick={() => openStatusModal("lost")}>
                Mark lost
              </Button>
              <Button variant="secondary" onClick={() => setConvertModal(true)}>
                Convert to project
              </Button>
            </>
          )}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <h3 className="mb-4 text-lg font-semibold text-slate-900">
              Contact Information
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                  <Phone className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Phone</p>
                  <a
                    href={`tel:${lead.phone}`}
                    className="font-medium text-slate-900 hover:text-brand-600"
                  >
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
                    <a
                      href={`mailto:${lead.email}`}
                      className="font-medium text-slate-900 hover:text-brand-600"
                    >
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
                      {PROPERTY_TYPES.find((p) => p.value === lead.property_type)?.label ||
                        lead.property_type}
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
            <h3 className="mb-4 text-lg font-semibold text-slate-900">
              Service Interest
            </h3>
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

          {(lead.quote_amount != null || lead.quote_sent_at) && (
            <div className="rounded-xl border border-slate-200 bg-white p-6">
              <h3 className="mb-4 text-lg font-semibold text-slate-900">
                Quote Information
              </h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Quote Amount</p>
                  <p className="text-2xl font-bold text-green-600">
                    {lead.quote_amount != null
                      ? formatCurrency(lead.quote_amount)
                      : "—"}
                  </p>
                </div>
                {lead.quote_sent_at && (
                  <div className="text-right">
                    <p className="text-sm text-slate-500">Sent on</p>
                    <p className="font-medium text-slate-900">
                      {formatDate(lead.quote_sent_at)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {lead.notes && (
            <div className="rounded-xl border border-slate-200 bg-white p-6">
              <h3 className="mb-4 text-lg font-semibold text-slate-900">
                Activity notes
              </h3>
              <div className="whitespace-pre-wrap text-slate-600">{lead.notes}</div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <h3 className="mb-4 text-lg font-semibold text-slate-900">Status</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Current</span>
                <StatusBadge status={lead.status} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Priority</span>
                <PriorityBadge priority={lead.priority} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Source</span>
                <span className="font-medium capitalize text-slate-900">
                  {lead.source.replace("_", " ")}
                </span>
              </div>
              <div>
                <label className="mb-1.5 block text-sm text-slate-600">
                  Assigned to
                </label>
                <Select
                  options={[
                    { value: "", label: "Unassigned" },
                    ...staff.map((u) => ({
                      value: u.id,
                      label: u.full_name || u.email,
                    })),
                  ]}
                  value={lead.assigned_to || ""}
                  onChange={(e) => void handleAssignOnly(e.target.value)}
                  disabled={saving || isLeadClosed(lead.status)}
                />
                <p className="mt-1 text-xs text-slate-500">{assignedLabel}</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <h3 className="mb-4 text-lg font-semibold text-slate-900">Timeline</h3>
            <div className="space-y-4">
              <TimelineItem
                icon={<Calendar className="h-4 w-4 text-blue-600" />}
                tone="bg-blue-100"
                label="Created"
                value={formatDateTime(lead.created_at)}
              />
              {lead.contacted_at && (
                <TimelineItem
                  icon={<Phone className="h-4 w-4 text-yellow-600" />}
                  tone="bg-yellow-100"
                  label="Contacted"
                  value={formatDateTime(lead.contacted_at)}
                />
              )}
              {lead.inspection_date && (
                <TimelineItem
                  icon={<MapPin className="h-4 w-4 text-purple-600" />}
                  tone="bg-purple-100"
                  label="Inspection"
                  value={`${formatDate(lead.inspection_date)}${
                    lead.inspection_time ? ` at ${lead.inspection_time}` : ""
                  }`}
                />
              )}
              {lead.inspection_notes && (
                <p className="pl-11 text-sm text-slate-600">{lead.inspection_notes}</p>
              )}
              {lead.quote_sent_at && (
                <TimelineItem
                  icon={<FileText className="h-4 w-4 text-orange-600" />}
                  tone="bg-orange-100"
                  label="Quote Sent"
                  value={formatDateTime(lead.quote_sent_at)}
                />
              )}
              {lead.won_at && (
                <TimelineItem
                  icon={<CheckCircle2 className="h-4 w-4 text-green-600" />}
                  tone="bg-green-100"
                  label="Won"
                  value={formatDateTime(lead.won_at)}
                />
              )}
              {lead.status === "lost" && (
                <TimelineItem
                  icon={<XCircle className="h-4 w-4 text-red-600" />}
                  tone="bg-red-100"
                  label="Lost"
                  value={lead.lost_reason || "No reason recorded"}
                />
              )}
            </div>
          </div>

          {!isLeadClosed(lead.status) && (
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
        title="Manage lead pipeline"
        size="md"
      >
        <div className="space-y-4">
          <Select
            label="Status"
            options={Object.entries(LEAD_STATUS_CONFIG).map(([value, config]) => ({
              value,
              label: config.label,
            }))}
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value as LeadStatus)}
          />

          <Select
            label="Priority"
            options={Object.entries(PRIORITY_CONFIG).map(([value, config]) => ({
              value,
              label: config.label,
            }))}
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
          />

          <Select
            label="Assign to"
            options={[
              { value: "", label: "Unassigned" },
              ...staff.map((u) => ({
                value: u.id,
                label: u.full_name || u.email,
              })),
            ]}
            value={assignTo}
            onChange={(e) => setAssignTo(e.target.value)}
          />

          {newStatus === "inspection_scheduled" && (
            <>
              <Input
                label="Inspection date"
                type="date"
                required
                value={inspectionDate}
                onChange={(e) => setInspectionDate(e.target.value)}
              />
              <Input
                label="Inspection time"
                type="time"
                value={inspectionTime}
                onChange={(e) => setInspectionTime(e.target.value)}
              />
              <Textarea
                label="Inspection notes"
                placeholder="Access notes, gate codes, focus areas…"
                value={inspectionNotes}
                onChange={(e) => setInspectionNotes(e.target.value)}
              />
            </>
          )}

          {newStatus === "quote_sent" && (
            <Input
              label="Quote amount (GHS)"
              type="number"
              min="0"
              step="0.01"
              required
              value={quoteAmount}
              onChange={(e) => setQuoteAmount(e.target.value)}
            />
          )}

          {newStatus === "lost" && (
            <Textarea
              label="Lost reason"
              required
              placeholder="Budget, chose competitor, postponed, unreachable…"
              value={lostReason}
              onChange={(e) => setLostReason(e.target.value)}
            />
          )}

          <Textarea
            label="Notes (optional)"
            placeholder="What happened at this stage?"
            value={statusNotes}
            onChange={(e) => setStatusNotes(e.target.value)}
          />

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setStatusModal(false)}>
              Cancel
            </Button>
            <Button onClick={() => void handleStatusChange()} loading={saving}>
              Save stage
            </Button>
          </div>
        </div>
      </Modal>

      <ConfirmModal
        open={deleteModal}
        onClose={() => setDeleteModal(false)}
        onConfirm={() => void handleDelete()}
        title="Delete Lead"
        description="Are you sure you want to delete this lead? This action cannot be undone."
        confirmLabel="Delete"
        variant="danger"
        loading={saving}
      />

      <ConfirmModal
        open={convertModal}
        onClose={() => setConvertModal(false)}
        onConfirm={() => void handleConvertToProject()}
        title="Convert to Project"
        description={`Create a project for ${lead.name}, carry over the quote as budget if set, and mark this lead as won.`}
        confirmLabel="Convert"
        loading={saving}
      />
    </div>
  );
}

function TimelineItem({
  icon,
  tone,
  label,
  value,
}: {
  icon: ReactNode;
  tone: string;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className={cn("flex h-8 w-8 items-center justify-center rounded-full", tone)}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-slate-500">{label}</p>
        <p className="font-medium text-slate-900">{value}</p>
      </div>
    </div>
  );
}
