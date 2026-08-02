import type { Lead, LeadStatus } from "@/types/database";
import { LEAD_STATUS_CONFIG, formatDateTime } from "@/lib/admin/constants";

/** Ordered pipeline from intake to close. */
export const LEAD_PIPELINE: LeadStatus[] = [
  "new",
  "contacted",
  "inspection_scheduled",
  "quote_sent",
  "negotiating",
  "won",
  "lost",
];

/** Open stages before a lead is closed. */
export const OPEN_LEAD_STATUSES: LeadStatus[] = [
  "new",
  "contacted",
  "inspection_scheduled",
  "quote_sent",
  "negotiating",
];

export function isLeadClosed(status: LeadStatus): boolean {
  return status === "won" || status === "lost";
}

export function getNextLeadStatus(status: LeadStatus): LeadStatus | null {
  if (status === "negotiating") return "won";
  if (isLeadClosed(status)) return null;
  const index = OPEN_LEAD_STATUSES.indexOf(status);
  if (index === -1 || index >= OPEN_LEAD_STATUSES.length - 1) return null;
  return OPEN_LEAD_STATUSES[index + 1] ?? null;
}

export type LeadStatusTransitionInput = {
  status: LeadStatus;
  notes?: string;
  inspection_date?: string | null;
  inspection_time?: string | null;
  inspection_notes?: string | null;
  quote_amount?: number | null;
  lost_reason?: string | null;
  assigned_to?: string | null;
  priority?: Lead["priority"];
};

/**
 * Builds the partial lead update for a status / pipeline transition,
 * including automatic timestamps and note appends.
 */
export function buildLeadPipelineUpdate(
  lead: Lead,
  input: LeadStatusTransitionInput,
): Partial<Lead> {
  const updates: Partial<Lead> = {
    status: input.status,
  };

  if (input.priority) updates.priority = input.priority;
  if (input.assigned_to !== undefined) updates.assigned_to = input.assigned_to;

  if (input.status === "contacted" && !lead.contacted_at) {
    updates.contacted_at = new Date().toISOString();
  }

  if (input.status === "inspection_scheduled") {
    if (input.inspection_date !== undefined) {
      updates.inspection_date = input.inspection_date || null;
    }
    if (input.inspection_time !== undefined) {
      updates.inspection_time = input.inspection_time || null;
    }
    if (input.inspection_notes !== undefined) {
      updates.inspection_notes = input.inspection_notes || null;
    }
  }

  if (input.status === "quote_sent") {
    updates.quote_sent_at = new Date().toISOString();
    if (input.quote_amount !== undefined) {
      updates.quote_amount = input.quote_amount;
    }
  }

  if (input.status === "won") {
    updates.won_at = new Date().toISOString();
    updates.lost_reason = null;
  }

  if (input.status === "lost") {
    updates.lost_reason = input.lost_reason?.trim() || null;
  }

  const noteParts: string[] = [];
  if (input.notes?.trim()) noteParts.push(input.notes.trim());
  if (input.status === "lost" && input.lost_reason?.trim()) {
    noteParts.push(`Lost reason: ${input.lost_reason.trim()}`);
  }
  if (input.status === "quote_sent" && input.quote_amount != null) {
    noteParts.push(`Quote amount: GHS ${input.quote_amount}`);
  }

  if (noteParts.length > 0 || lead.status !== input.status) {
    const stamp = `[${formatDateTime(new Date())}] Status → ${LEAD_STATUS_CONFIG[input.status].label}`;
    const body = noteParts.length ? `${stamp}: ${noteParts.join(" | ")}` : stamp;
    updates.notes = lead.notes ? `${lead.notes}\n\n${body}` : body;
  }

  return updates;
}
