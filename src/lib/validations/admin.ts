/**
 * Brite MJ Technologies — Zod Validation Schemas
 * Form validation for all admin dashboard forms.
 */

import { z } from "zod";

const phoneRegex = /^(\+233|0)[2-9]\d{8}$/;

export const leadSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  phone: z.string().regex(phoneRegex, "Enter a valid Ghana phone number"),
  service_interest: z.array(z.string()).min(1, "Select at least one service"),
  property_type: z.string().optional(),
  property_size: z.string().optional(),
  message: z.string().optional(),
  source: z.enum(["website", "referral", "walk_in", "call", "whatsapp", "social_media"]),
  status: z.enum(["new", "contacted", "inspection_scheduled", "quote_sent", "negotiating", "won", "lost"]).default("new"),
  priority: z.enum(["low", "normal", "high", "urgent"]).default("normal"),
  assigned_to: z.string().uuid().optional().nullable(),
  notes: z.string().optional(),
  inspection_date: z.string().optional().nullable(),
  inspection_time: z.string().optional().nullable(),
  quote_amount: z.number().positive().optional().nullable(),
});

export const projectSchema = z.object({
  client_name: z.string().min(2, "Client name is required"),
  client_phone: z.string().regex(phoneRegex, "Enter a valid phone number").optional().or(z.literal("")),
  client_email: z.string().email("Invalid email").optional().or(z.literal("")),
  project_name: z.string().min(3, "Project name is required"),
  project_type: z.enum(["cctv", "fencing", "networking", "gate_control", "video_intercom", "electric_fencing", "smart_security", "combined"]),
  description: z.string().optional(),
  status: z.enum(["planning", "in_progress", "awaiting_approval", "installation", "testing", "completed", "maintenance"]).default("planning"),
  priority: z.enum(["low", "normal", "high", "urgent"]).default("normal"),
  start_date: z.string().optional().nullable(),
  estimated_completion: z.string().optional().nullable(),
  budget: z.number().positive().optional().nullable(),
  assigned_team: z.array(z.string().uuid()).optional(),
  notes: z.string().optional(),
  lead_id: z.string().uuid().optional().nullable(),
});

export const taskSchema = z.object({
  title: z.string().min(3, "Task title is required"),
  description: z.string().optional(),
  assigned_to: z.string().uuid().optional().nullable(),
  status: z.enum(["pending", "in_progress", "completed", "blocked"]).default("pending"),
  priority: z.enum(["low", "normal", "high", "urgent"]).default("normal"),
  due_date: z.string().optional().nullable(),
});

export const inventorySchema = z.object({
  item_name: z.string().min(2, "Item name is required"),
  category: z.enum(["cctv", "fencing", "networking", "gate_control", "intercom", "electric_fencing", "smart_security", "tools", "cables", "accessories"]),
  sku: z.string().optional(),
  description: z.string().optional(),
  quantity: z.number().int().min(0, "Quantity cannot be negative"),
  min_quantity: z.number().int().min(0).default(5),
  max_quantity: z.number().int().min(1).default(100),
  unit_price: z.number().positive().optional().nullable(),
  supplier: z.string().optional(),
  location: z.string().optional(),
  reorder_point: z.number().int().min(0).default(5),
});

export const inventoryAdjustmentSchema = z.object({
  transaction_type: z.enum(["received", "used", "returned", "adjusted"]),
  quantity: z.number().int().positive("Quantity must be positive"),
  notes: z.string().optional(),
  project_id: z.string().uuid().optional().nullable(),
});

export const invoiceSchema = z.object({
  client_name: z.string().min(2, "Client name is required"),
  client_email: z.string().email("Invalid email").optional().or(z.literal("")),
  client_phone: z.string().optional(),
  client_address: z.string().optional(),
  project_id: z.string().uuid().optional().nullable(),
  issue_date: z.string(),
  due_date: z.string(),
  tax: z.number().min(0).default(0),
  notes: z.string().optional(),
  items: z.array(z.object({
    description: z.string().min(1, "Description is required"),
    quantity: z.number().int().positive("Quantity must be positive"),
    unit_price: z.number().positive("Price must be positive"),
  })).min(1, "Add at least one item"),
});

export const expenseSchema = z.object({
  expense_date: z.string(),
  category: z.enum(["supplies", "equipment", "transport", "salaries", "utilities", "rent", "marketing", "other"]),
  description: z.string().min(3, "Description is required"),
  amount: z.number().positive("Amount must be positive"),
  vendor: z.string().optional(),
  project_id: z.string().uuid().optional().nullable(),
  notes: z.string().optional(),
});

export const userSchema = z.object({
  email: z.string().email("Invalid email address"),
  full_name: z.string().min(2, "Name is required"),
  phone: z.string().regex(phoneRegex, "Enter a valid phone number").optional().or(z.literal("")),
  role: z.enum(["admin", "manager", "staff", "technician"]).default("staff"),
  is_active: z.boolean().default(true),
});

export const scheduleSchema = z.object({
  user_id: z.string().uuid(),
  date: z.string(),
  shift: z.enum(["morning", "afternoon", "evening", "full_day"]),
  project_id: z.string().uuid().optional().nullable(),
  notes: z.string().optional(),
});

export type LeadFormData = z.infer<typeof leadSchema>;
export type ProjectFormData = z.infer<typeof projectSchema>;
export type TaskFormData = z.infer<typeof taskSchema>;
export type InventoryFormData = z.infer<typeof inventorySchema>;
export type InventoryAdjustmentData = z.infer<typeof inventoryAdjustmentSchema>;
export type InvoiceFormData = z.infer<typeof invoiceSchema>;
export type ExpenseFormData = z.infer<typeof expenseSchema>;
export type UserFormData = z.infer<typeof userSchema>;
export type ScheduleFormData = z.infer<typeof scheduleSchema>;
