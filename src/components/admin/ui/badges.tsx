"use client";

import { cn } from "@/lib/utils";
import {
  LEAD_STATUS_CONFIG,
  PRIORITY_CONFIG,
  PROJECT_STATUS_CONFIG,
  TASK_STATUS_CONFIG,
  INVOICE_STATUS_CONFIG,
} from "@/lib/admin/constants";
import type {
  LeadStatus,
  Priority,
  ProjectStatus,
  TaskStatus,
  InvoiceStatus,
} from "@/types/database";

interface BadgeProps {
  className?: string;
}

export function StatusBadge({
  status,
  className,
}: BadgeProps & { status: LeadStatus }) {
  const config = LEAD_STATUS_CONFIG[status];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        config.bgColor,
        config.color,
        className
      )}
    >
      {config.label}
    </span>
  );
}

export function PriorityBadge({
  priority,
  className,
}: BadgeProps & { priority: Priority }) {
  const config = PRIORITY_CONFIG[priority];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        config.bgColor,
        config.color,
        className
      )}
    >
      {config.label}
    </span>
  );
}

export function ProjectStatusBadge({
  status,
  className,
}: BadgeProps & { status: ProjectStatus }) {
  const config = PROJECT_STATUS_CONFIG[status];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        config.bgColor,
        config.color,
        className
      )}
    >
      {config.label}
    </span>
  );
}

export function TaskStatusBadge({
  status,
  className,
}: BadgeProps & { status: TaskStatus }) {
  const config = TASK_STATUS_CONFIG[status];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        config.bgColor,
        config.color,
        className
      )}
    >
      {config.label}
    </span>
  );
}

export function InvoiceStatusBadge({
  status,
  className,
}: BadgeProps & { status: InvoiceStatus }) {
  const config = INVOICE_STATUS_CONFIG[status];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        config.bgColor,
        config.color,
        className
      )}
    >
      {config.label}
    </span>
  );
}

export function RoleBadge({
  role,
  className,
}: BadgeProps & { role: string }) {
  const roleColors: Record<string, { bg: string; text: string }> = {
    admin: { bg: "bg-purple-100", text: "text-purple-700" },
    manager: { bg: "bg-blue-100", text: "text-blue-700" },
    staff: { bg: "bg-green-100", text: "text-green-700" },
    technician: { bg: "bg-orange-100", text: "text-orange-700" },
  };
  const colors = roleColors[role] || { bg: "bg-slate-100", text: "text-slate-700" };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize",
        colors.bg,
        colors.text,
        className
      )}
    >
      {role}
    </span>
  );
}

export function CountBadge({
  count,
  variant = "default",
  className,
}: BadgeProps & { count: number; variant?: "default" | "warning" | "success" | "danger" }) {
  const variantStyles = {
    default: "bg-slate-100 text-slate-700",
    warning: "bg-yellow-100 text-yellow-700",
    success: "bg-green-100 text-green-700",
    danger: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={cn(
        "inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-semibold",
        variantStyles[variant],
        className
      )}
    >
      {count > 99 ? "99+" : count}
    </span>
  );
}
