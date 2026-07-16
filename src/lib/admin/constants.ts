/**
 * Brite MJ Technologies — Admin Dashboard Constants
 * Centralized configuration for labels, colors, and options.
 */

import type {
  LeadStatus,
  LeadSource,
  Priority,
  ProjectStatus,
  ProjectType,
  TaskStatus,
  InventoryCategory,
  TransactionType,
  InvoiceStatus,
  PaymentMethod,
  ExpenseCategory,
  ShiftType,
  UserRole,
} from "@/types/database";

export const LEAD_STATUS_CONFIG: Record<LeadStatus, { label: string; color: string; bgColor: string }> = {
  new: { label: "New", color: "text-blue-700", bgColor: "bg-blue-50" },
  contacted: { label: "Contacted", color: "text-yellow-700", bgColor: "bg-yellow-50" },
  inspection_scheduled: { label: "Inspection Scheduled", color: "text-purple-700", bgColor: "bg-purple-50" },
  quote_sent: { label: "Quote Sent", color: "text-orange-700", bgColor: "bg-orange-50" },
  negotiating: { label: "Negotiating", color: "text-indigo-700", bgColor: "bg-indigo-50" },
  won: { label: "Won", color: "text-green-700", bgColor: "bg-green-50" },
  lost: { label: "Lost", color: "text-red-700", bgColor: "bg-red-50" },
};

export const LEAD_SOURCE_CONFIG: Record<LeadSource, { label: string; icon: string }> = {
  website: { label: "Website", icon: "globe" },
  referral: { label: "Referral", icon: "users" },
  walk_in: { label: "Walk-in", icon: "building" },
  call: { label: "Phone Call", icon: "phone" },
  whatsapp: { label: "WhatsApp", icon: "message-circle" },
  social_media: { label: "Social Media", icon: "share-2" },
};

export const PRIORITY_CONFIG: Record<Priority, { label: string; color: string; bgColor: string }> = {
  low: { label: "Low", color: "text-slate-600", bgColor: "bg-slate-100" },
  normal: { label: "Normal", color: "text-blue-600", bgColor: "bg-blue-100" },
  high: { label: "High", color: "text-orange-600", bgColor: "bg-orange-100" },
  urgent: { label: "Urgent", color: "text-red-600", bgColor: "bg-red-100" },
};

export const PROJECT_STATUS_CONFIG: Record<ProjectStatus, { label: string; color: string; bgColor: string }> = {
  planning: { label: "Planning", color: "text-slate-700", bgColor: "bg-slate-100" },
  in_progress: { label: "In Progress", color: "text-blue-700", bgColor: "bg-blue-100" },
  awaiting_approval: { label: "Awaiting Approval", color: "text-yellow-700", bgColor: "bg-yellow-100" },
  installation: { label: "Installation", color: "text-purple-700", bgColor: "bg-purple-100" },
  testing: { label: "Testing", color: "text-indigo-700", bgColor: "bg-indigo-100" },
  completed: { label: "Completed", color: "text-green-700", bgColor: "bg-green-100" },
  maintenance: { label: "Maintenance", color: "text-orange-700", bgColor: "bg-orange-100" },
};

export const PROJECT_TYPE_CONFIG: Record<ProjectType, { label: string; icon: string }> = {
  cctv: { label: "CCTV Installation", icon: "camera" },
  fencing: { label: "Security Fencing", icon: "fence" },
  networking: { label: "Networking", icon: "network" },
  gate_control: { label: "Remote Gate Control", icon: "gate" },
  video_intercom: { label: "Video Intercom", icon: "video" },
  electric_fencing: { label: "Electric Fencing", icon: "zap" },
  smart_security: { label: "Smart Security", icon: "shield" },
  combined: { label: "Combined Services", icon: "layers" },
};

export const TASK_STATUS_CONFIG: Record<TaskStatus, { label: string; color: string; bgColor: string }> = {
  pending: { label: "Pending", color: "text-slate-600", bgColor: "bg-slate-100" },
  in_progress: { label: "In Progress", color: "text-blue-600", bgColor: "bg-blue-100" },
  completed: { label: "Completed", color: "text-green-600", bgColor: "bg-green-100" },
  blocked: { label: "Blocked", color: "text-red-600", bgColor: "bg-red-100" },
};

export const INVENTORY_CATEGORY_CONFIG: Record<InventoryCategory, { label: string }> = {
  cctv: { label: "CCTV Equipment" },
  fencing: { label: "Fencing Materials" },
  networking: { label: "Networking Equipment" },
  gate_control: { label: "Gate Control Systems" },
  intercom: { label: "Intercom Systems" },
  electric_fencing: { label: "Electric Fencing" },
  smart_security: { label: "Smart Security" },
  tools: { label: "Tools" },
  cables: { label: "Cables & Wiring" },
  accessories: { label: "Accessories" },
};

export const TRANSACTION_TYPE_CONFIG: Record<TransactionType, { label: string; color: string }> = {
  received: { label: "Received", color: "text-green-600" },
  used: { label: "Used", color: "text-red-600" },
  returned: { label: "Returned", color: "text-blue-600" },
  adjusted: { label: "Adjusted", color: "text-yellow-600" },
};

export const INVOICE_STATUS_CONFIG: Record<InvoiceStatus, { label: string; color: string; bgColor: string }> = {
  draft: { label: "Draft", color: "text-slate-600", bgColor: "bg-slate-100" },
  sent: { label: "Sent", color: "text-blue-600", bgColor: "bg-blue-100" },
  paid: { label: "Paid", color: "text-green-600", bgColor: "bg-green-100" },
  overdue: { label: "Overdue", color: "text-red-600", bgColor: "bg-red-100" },
  cancelled: { label: "Cancelled", color: "text-slate-400", bgColor: "bg-slate-50" },
};

export const PAYMENT_METHOD_CONFIG: Record<PaymentMethod, { label: string }> = {
  cash: { label: "Cash" },
  mobile_money: { label: "Mobile Money" },
  bank_transfer: { label: "Bank Transfer" },
  card: { label: "Card Payment" },
  cheque: { label: "Cheque" },
};

export const EXPENSE_CATEGORY_CONFIG: Record<ExpenseCategory, { label: string; icon: string }> = {
  supplies: { label: "Supplies", icon: "package" },
  equipment: { label: "Equipment", icon: "tool" },
  transport: { label: "Transport", icon: "truck" },
  salaries: { label: "Salaries", icon: "users" },
  utilities: { label: "Utilities", icon: "zap" },
  rent: { label: "Rent", icon: "building" },
  marketing: { label: "Marketing", icon: "megaphone" },
  other: { label: "Other", icon: "more-horizontal" },
};

export const SHIFT_CONFIG: Record<ShiftType, { label: string; hours: string }> = {
  morning: { label: "Morning", hours: "6:00 AM - 12:00 PM" },
  afternoon: { label: "Afternoon", hours: "12:00 PM - 6:00 PM" },
  evening: { label: "Evening", hours: "6:00 PM - 10:00 PM" },
  full_day: { label: "Full Day", hours: "6:00 AM - 6:00 PM" },
};

export const USER_ROLE_CONFIG: Record<UserRole, { label: string; description: string; color: string }> = {
  admin: { label: "Admin", description: "Full system access", color: "text-purple-600" },
  manager: { label: "Manager", description: "Manage operations", color: "text-blue-600" },
  staff: { label: "Staff", description: "View and edit assigned work", color: "text-green-600" },
  technician: { label: "Technician", description: "View assigned tasks", color: "text-orange-600" },
};

export const SERVICES_LIST = [
  { value: "cctv", label: "CCTV Installation" },
  { value: "fencing", label: "Security Fencing" },
  { value: "networking", label: "Networking" },
  { value: "gate_control", label: "Remote Gate Control" },
  { value: "video_intercom", label: "Video Intercom" },
  { value: "electric_fencing", label: "Electric Fencing" },
  { value: "smart_security", label: "Smart Security Systems" },
];

export const PROPERTY_TYPES = [
  { value: "residential", label: "Residential" },
  { value: "commercial", label: "Commercial" },
  { value: "industrial", label: "Industrial" },
  { value: "institutional", label: "Institutional" },
];

export const PROPERTY_SIZES = [
  { value: "small", label: "Small (< 500 sqm)" },
  { value: "medium", label: "Medium (500 - 2000 sqm)" },
  { value: "large", label: "Large (2000 - 5000 sqm)" },
  { value: "enterprise", label: "Enterprise (> 5000 sqm)" },
];

export const CURRENCY = "GH₵";
export const CURRENCY_CODE = "GHS";
export const TAX_RATE = 0.125; // 12.5% VAT in Ghana

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-GH", {
    style: "currency",
    currency: CURRENCY_CODE,
    minimumFractionDigits: 2,
  }).format(amount);
};

export const formatDate = (date: string | Date): string => {
  return new Intl.DateTimeFormat("en-GH", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
};

export const formatDateTime = (date: string | Date): string => {
  return new Intl.DateTimeFormat("en-GH", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
};

export const formatPhoneGH = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
  }
  if (cleaned.length === 12 && cleaned.startsWith("233")) {
    return `+233 ${cleaned.slice(3, 5)} ${cleaned.slice(5, 8)} ${cleaned.slice(8)}`;
  }
  return phone;
};
