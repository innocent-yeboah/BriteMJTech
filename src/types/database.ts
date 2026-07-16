/**
 * Brite MJ Technologies — Database Types
 * Auto-synced with Supabase schema for type safety.
 */

export type UserRole = "admin" | "manager" | "staff" | "technician";
export type LeadStatus = "new" | "contacted" | "inspection_scheduled" | "quote_sent" | "negotiating" | "won" | "lost";
export type LeadSource = "website" | "referral" | "walk_in" | "call" | "whatsapp" | "social_media";
export type Priority = "low" | "normal" | "high" | "urgent";
export type ProjectStatus = "planning" | "in_progress" | "awaiting_approval" | "installation" | "testing" | "completed" | "maintenance";
export type ProjectType = "cctv" | "fencing" | "networking" | "gate_control" | "video_intercom" | "electric_fencing" | "smart_security" | "combined";
export type TaskStatus = "pending" | "in_progress" | "completed" | "blocked";
export type InventoryCategory = "cctv" | "fencing" | "networking" | "gate_control" | "intercom" | "electric_fencing" | "smart_security" | "tools" | "cables" | "accessories";
export type TransactionType = "received" | "used" | "returned" | "adjusted";
export type InvoiceStatus = "draft" | "sent" | "paid" | "overdue" | "cancelled";
export type PaymentMethod = "cash" | "mobile_money" | "bank_transfer" | "card" | "cheque";
export type ExpenseCategory = "supplies" | "equipment" | "transport" | "salaries" | "utilities" | "rent" | "marketing" | "other";
export type ShiftType = "morning" | "afternoon" | "evening" | "full_day";
export type NotificationType = "lead" | "project" | "invoice" | "inventory" | "task" | "system";

export interface User {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  role: UserRole;
  is_active: boolean;
  last_login: string | null;
  created_at: string;
  updated_at: string;
}

export interface Lead {
  id: string;
  created_at: string;
  name: string;
  email: string | null;
  phone: string;
  service_interest: string[] | null;
  property_type: string | null;
  property_size: string | null;
  message: string | null;
  source: LeadSource;
  status: LeadStatus;
  priority: Priority;
  assigned_to: string | null;
  notes: string | null;
  contacted_at: string | null;
  inspection_date: string | null;
  inspection_time: string | null;
  inspection_notes: string | null;
  quote_sent_at: string | null;
  quote_amount: number | null;
  won_at: string | null;
  lost_reason: string | null;
  created_by: string | null;
  assigned_user?: User;
}

export interface Project {
  id: string;
  created_at: string;
  lead_id: string | null;
  client_name: string;
  client_phone: string | null;
  client_email: string | null;
  project_name: string;
  project_type: ProjectType | null;
  description: string | null;
  status: ProjectStatus;
  priority: Priority;
  start_date: string | null;
  estimated_completion: string | null;
  actual_completion: string | null;
  budget: number | null;
  actual_cost: number | null;
  assigned_team: string[] | null;
  notes: string | null;
  completed_at: string | null;
  tasks?: ProjectTask[];
  lead?: Lead;
}

export interface ProjectTask {
  id: string;
  project_id: string;
  title: string;
  description: string | null;
  assigned_to: string | null;
  status: TaskStatus;
  priority: Priority;
  due_date: string | null;
  completed_at: string | null;
  created_at: string;
  assigned_user?: User;
}

export interface InventoryItem {
  id: string;
  created_at: string;
  item_name: string;
  category: InventoryCategory | null;
  sku: string | null;
  description: string | null;
  quantity: number;
  min_quantity: number;
  max_quantity: number;
  unit_price: number | null;
  supplier: string | null;
  location: string | null;
  reorder_point: number;
  last_restocked: string | null;
  created_by: string | null;
  updated_at: string;
}

export interface InventoryTransaction {
  id: string;
  inventory_id: string;
  transaction_type: TransactionType;
  quantity: number;
  notes: string | null;
  project_id: string | null;
  created_at: string;
  created_by: string | null;
  inventory?: InventoryItem;
  project?: Project;
  user?: User;
}

export interface Invoice {
  id: string;
  created_at: string;
  invoice_number: string;
  project_id: string | null;
  client_name: string;
  client_email: string | null;
  client_phone: string | null;
  client_address: string | null;
  amount: number;
  tax: number;
  total_amount: number;
  status: InvoiceStatus;
  issue_date: string;
  due_date: string;
  paid_at: string | null;
  payment_method: PaymentMethod | null;
  notes: string | null;
  created_by: string | null;
  items?: InvoiceItem[];
  project?: Project;
}

export interface InvoiceItem {
  id: string;
  invoice_id: string;
  description: string;
  quantity: number;
  unit_price: number;
  total: number;
}

export interface Expense {
  id: string;
  created_at: string;
  expense_date: string;
  category: ExpenseCategory | null;
  description: string;
  amount: number;
  vendor: string | null;
  receipt_url: string | null;
  project_id: string | null;
  approved_by: string | null;
  notes: string | null;
  created_by: string | null;
  project?: Project;
  approver?: User;
}

export interface TeamSchedule {
  id: string;
  created_at: string;
  user_id: string;
  date: string;
  shift: ShiftType | null;
  project_id: string | null;
  notes: string | null;
  user?: User;
  project?: Project;
}

export interface Notification {
  id: string;
  created_at: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  link: string | null;
  read: boolean;
  read_at: string | null;
}

export interface AuditLog {
  id: string;
  created_at: string;
  user_id: string | null;
  action: string;
  table_name: string | null;
  record_id: string | null;
  old_data: Record<string, unknown> | null;
  new_data: Record<string, unknown> | null;
  ip_address: string | null;
  user_agent: string | null;
  user?: User;
}

export interface DashboardStats {
  leads: {
    total: number;
    new: number;
    contacted: number;
    won: number;
    lost: number;
    conversionRate: number;
  };
  projects: {
    total: number;
    active: number;
    completed: number;
    byStatus: Record<ProjectStatus, number>;
  };
  inventory: {
    totalItems: number;
    lowStock: number;
    totalValue: number;
  };
  finance: {
    revenue: number;
    expenses: number;
    profit: number;
    outstanding: number;
  };
}
