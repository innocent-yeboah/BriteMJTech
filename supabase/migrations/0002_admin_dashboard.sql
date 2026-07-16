-- ============================================================================
-- Brite MJ Technologies — Admin Dashboard Schema
-- ============================================================================

-- ---------------------------------------------------------------------------
-- Users table (extends Supabase auth)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'staff' CHECK (role IN ('admin', 'manager', 'staff', 'technician')),
  is_active BOOLEAN DEFAULT TRUE,
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger to sync auth.users with public.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name')
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, public.users.full_name),
    updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Enhanced Leads table (add missing columns)
-- ---------------------------------------------------------------------------
ALTER TABLE public.leads 
  ADD COLUMN IF NOT EXISTS property_size TEXT,
  ADD COLUMN IF NOT EXISTS priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  ADD COLUMN IF NOT EXISTS assigned_to UUID REFERENCES public.users(id),
  ADD COLUMN IF NOT EXISTS inspection_notes TEXT,
  ADD COLUMN IF NOT EXISTS quote_amount DECIMAL(10,2),
  ADD COLUMN IF NOT EXISTS won_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS lost_reason TEXT;

-- Update source check constraint
ALTER TABLE public.leads DROP CONSTRAINT IF EXISTS leads_source_check;
ALTER TABLE public.leads ADD CONSTRAINT leads_source_check 
  CHECK (source IN ('website', 'referral', 'walk_in', 'call', 'whatsapp', 'social_media'));

-- Update status check constraint
ALTER TABLE public.leads DROP CONSTRAINT IF EXISTS leads_status_check;
ALTER TABLE public.leads ADD CONSTRAINT leads_status_check 
  CHECK (status IN ('new', 'contacted', 'inspection_scheduled', 'quote_sent', 'negotiating', 'won', 'lost'));

-- ---------------------------------------------------------------------------
-- Enhanced Projects table
-- ---------------------------------------------------------------------------
ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS lead_id UUID REFERENCES public.leads(id),
  ADD COLUMN IF NOT EXISTS client_name TEXT,
  ADD COLUMN IF NOT EXISTS client_phone TEXT,
  ADD COLUMN IF NOT EXISTS client_email TEXT,
  ADD COLUMN IF NOT EXISTS project_name TEXT,
  ADD COLUMN IF NOT EXISTS project_type TEXT CHECK (project_type IN ('cctv', 'fencing', 'networking', 'gate_control', 'video_intercom', 'electric_fencing', 'smart_security', 'combined')),
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'planning' CHECK (status IN ('planning', 'in_progress', 'awaiting_approval', 'installation', 'testing', 'completed', 'maintenance')),
  ADD COLUMN IF NOT EXISTS priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  ADD COLUMN IF NOT EXISTS start_date DATE,
  ADD COLUMN IF NOT EXISTS estimated_completion DATE,
  ADD COLUMN IF NOT EXISTS actual_completion DATE,
  ADD COLUMN IF NOT EXISTS budget DECIMAL(10,2),
  ADD COLUMN IF NOT EXISTS actual_cost DECIMAL(10,2),
  ADD COLUMN IF NOT EXISTS assigned_team UUID[],
  ADD COLUMN IF NOT EXISTS notes TEXT,
  ADD COLUMN IF NOT EXISTS completed_at TIMESTAMPTZ;

-- ---------------------------------------------------------------------------
-- Project Tasks
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.project_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  assigned_to UUID REFERENCES public.users(id),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'blocked')),
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  due_date DATE,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS project_tasks_project_idx ON public.project_tasks(project_id);
CREATE INDEX IF NOT EXISTS project_tasks_assigned_idx ON public.project_tasks(assigned_to);

-- ---------------------------------------------------------------------------
-- Inventory
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  item_name TEXT NOT NULL,
  category TEXT CHECK (category IN ('cctv', 'fencing', 'networking', 'gate_control', 'intercom', 'electric_fencing', 'smart_security', 'tools', 'cables', 'accessories')),
  sku TEXT UNIQUE,
  description TEXT,
  quantity INTEGER DEFAULT 0,
  min_quantity INTEGER DEFAULT 5,
  max_quantity INTEGER DEFAULT 100,
  unit_price DECIMAL(10,2),
  supplier TEXT,
  location TEXT,
  reorder_point INTEGER DEFAULT 5,
  last_restocked DATE,
  created_by UUID REFERENCES public.users(id),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS inventory_category_idx ON public.inventory(category);
CREATE INDEX IF NOT EXISTS inventory_quantity_idx ON public.inventory(quantity);

-- ---------------------------------------------------------------------------
-- Inventory Transactions
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.inventory_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  inventory_id UUID REFERENCES public.inventory(id) ON DELETE CASCADE,
  transaction_type TEXT CHECK (transaction_type IN ('received', 'used', 'returned', 'adjusted')),
  quantity INTEGER NOT NULL,
  notes TEXT,
  project_id UUID REFERENCES public.projects(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES public.users(id)
);

CREATE INDEX IF NOT EXISTS inv_trans_inventory_idx ON public.inventory_transactions(inventory_id);
CREATE INDEX IF NOT EXISTS inv_trans_project_idx ON public.inventory_transactions(project_id);

-- ---------------------------------------------------------------------------
-- Invoices
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  invoice_number TEXT UNIQUE NOT NULL,
  project_id UUID REFERENCES public.projects(id),
  client_name TEXT NOT NULL,
  client_email TEXT,
  client_phone TEXT,
  client_address TEXT,
  amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  tax DECIMAL(10,2) DEFAULT 0,
  total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'paid', 'overdue', 'cancelled')),
  issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
  due_date DATE NOT NULL,
  paid_at TIMESTAMPTZ,
  payment_method TEXT CHECK (payment_method IN ('cash', 'mobile_money', 'bank_transfer', 'card', 'cheque')),
  notes TEXT,
  created_by UUID REFERENCES public.users(id)
);

CREATE INDEX IF NOT EXISTS invoices_status_idx ON public.invoices(status);
CREATE INDEX IF NOT EXISTS invoices_project_idx ON public.invoices(project_id);

-- ---------------------------------------------------------------------------
-- Invoice Items
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.invoice_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID REFERENCES public.invoices(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL,
  total DECIMAL(10,2) NOT NULL
);

CREATE INDEX IF NOT EXISTS invoice_items_invoice_idx ON public.invoice_items(invoice_id);

-- ---------------------------------------------------------------------------
-- Expenses
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expense_date DATE NOT NULL DEFAULT CURRENT_DATE,
  category TEXT CHECK (category IN ('supplies', 'equipment', 'transport', 'salaries', 'utilities', 'rent', 'marketing', 'other')),
  description TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  vendor TEXT,
  receipt_url TEXT,
  project_id UUID REFERENCES public.projects(id),
  approved_by UUID REFERENCES public.users(id),
  notes TEXT,
  created_by UUID REFERENCES public.users(id)
);

CREATE INDEX IF NOT EXISTS expenses_date_idx ON public.expenses(expense_date);
CREATE INDEX IF NOT EXISTS expenses_category_idx ON public.expenses(category);
CREATE INDEX IF NOT EXISTS expenses_project_idx ON public.expenses(project_id);

-- ---------------------------------------------------------------------------
-- Team Schedule
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.team_schedule (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  shift TEXT CHECK (shift IN ('morning', 'afternoon', 'evening', 'full_day')),
  project_id UUID REFERENCES public.projects(id),
  notes TEXT,
  UNIQUE(user_id, date)
);

CREATE INDEX IF NOT EXISTS team_schedule_user_idx ON public.team_schedule(user_id);
CREATE INDEX IF NOT EXISTS team_schedule_date_idx ON public.team_schedule(date);

-- ---------------------------------------------------------------------------
-- Notifications
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  type TEXT CHECK (type IN ('lead', 'project', 'invoice', 'inventory', 'task', 'system')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  link TEXT,
  read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS notifications_user_idx ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS notifications_read_idx ON public.notifications(read);

-- ---------------------------------------------------------------------------
-- Audit Log
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  user_id UUID REFERENCES public.users(id),
  action TEXT NOT NULL,
  table_name TEXT,
  record_id UUID,
  old_data JSONB,
  new_data JSONB,
  ip_address TEXT,
  user_agent TEXT
);

CREATE INDEX IF NOT EXISTS audit_log_user_idx ON public.audit_log(user_id);
CREATE INDEX IF NOT EXISTS audit_log_table_idx ON public.audit_log(table_name);
CREATE INDEX IF NOT EXISTS audit_log_created_idx ON public.audit_log(created_at DESC);

-- ---------------------------------------------------------------------------
-- Helper Functions
-- ---------------------------------------------------------------------------

-- Check if user has specific role
CREATE OR REPLACE FUNCTION public.has_role(required_role TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() 
    AND role = required_role 
    AND is_active = TRUE
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if user is admin or manager
CREATE OR REPLACE FUNCTION public.is_admin_or_manager()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() 
    AND role IN ('admin', 'manager') 
    AND is_active = TRUE
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if user is any staff member
CREATE OR REPLACE FUNCTION public.is_staff()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() 
    AND is_active = TRUE
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Generate invoice number
CREATE OR REPLACE FUNCTION public.generate_invoice_number()
RETURNS TEXT AS $$
DECLARE
  year_prefix TEXT;
  next_num INTEGER;
BEGIN
  year_prefix := 'INV-' || TO_CHAR(NOW(), 'YYYY') || '-';
  SELECT COALESCE(MAX(CAST(SUBSTRING(invoice_number FROM 10) AS INTEGER)), 0) + 1
  INTO next_num
  FROM public.invoices
  WHERE invoice_number LIKE year_prefix || '%';
  RETURN year_prefix || LPAD(next_num::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql;

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_schedule ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

-- Users policies
DROP POLICY IF EXISTS "users_read_own" ON public.users;
CREATE POLICY "users_read_own" ON public.users FOR SELECT
  TO authenticated USING (id = auth.uid() OR public.is_admin_or_manager());

DROP POLICY IF EXISTS "users_update_own" ON public.users;
CREATE POLICY "users_update_own" ON public.users FOR UPDATE
  TO authenticated USING (id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "users_admin_all" ON public.users;
CREATE POLICY "users_admin_all" ON public.users FOR ALL
  TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Project tasks policies
DROP POLICY IF EXISTS "tasks_staff_read" ON public.project_tasks;
CREATE POLICY "tasks_staff_read" ON public.project_tasks FOR SELECT
  TO authenticated USING (public.is_staff());

DROP POLICY IF EXISTS "tasks_staff_write" ON public.project_tasks;
CREATE POLICY "tasks_staff_write" ON public.project_tasks FOR ALL
  TO authenticated USING (public.is_admin_or_manager() OR assigned_to = auth.uid())
  WITH CHECK (public.is_admin_or_manager() OR assigned_to = auth.uid());

-- Inventory policies
DROP POLICY IF EXISTS "inventory_staff_read" ON public.inventory;
CREATE POLICY "inventory_staff_read" ON public.inventory FOR SELECT
  TO authenticated USING (public.is_staff());

DROP POLICY IF EXISTS "inventory_admin_write" ON public.inventory;
CREATE POLICY "inventory_admin_write" ON public.inventory FOR ALL
  TO authenticated USING (public.is_admin_or_manager())
  WITH CHECK (public.is_admin_or_manager());

-- Inventory transactions policies
DROP POLICY IF EXISTS "inv_trans_staff_read" ON public.inventory_transactions;
CREATE POLICY "inv_trans_staff_read" ON public.inventory_transactions FOR SELECT
  TO authenticated USING (public.is_staff());

DROP POLICY IF EXISTS "inv_trans_staff_insert" ON public.inventory_transactions;
CREATE POLICY "inv_trans_staff_insert" ON public.inventory_transactions FOR INSERT
  TO authenticated WITH CHECK (public.is_staff());

-- Invoices policies
DROP POLICY IF EXISTS "invoices_staff_read" ON public.invoices;
CREATE POLICY "invoices_staff_read" ON public.invoices FOR SELECT
  TO authenticated USING (public.is_staff());

DROP POLICY IF EXISTS "invoices_admin_write" ON public.invoices;
CREATE POLICY "invoices_admin_write" ON public.invoices FOR ALL
  TO authenticated USING (public.is_admin_or_manager())
  WITH CHECK (public.is_admin_or_manager());

-- Invoice items policies
DROP POLICY IF EXISTS "invoice_items_staff_read" ON public.invoice_items;
CREATE POLICY "invoice_items_staff_read" ON public.invoice_items FOR SELECT
  TO authenticated USING (public.is_staff());

DROP POLICY IF EXISTS "invoice_items_admin_write" ON public.invoice_items;
CREATE POLICY "invoice_items_admin_write" ON public.invoice_items FOR ALL
  TO authenticated USING (public.is_admin_or_manager())
  WITH CHECK (public.is_admin_or_manager());

-- Expenses policies
DROP POLICY IF EXISTS "expenses_staff_read" ON public.expenses;
CREATE POLICY "expenses_staff_read" ON public.expenses FOR SELECT
  TO authenticated USING (public.is_staff());

DROP POLICY IF EXISTS "expenses_staff_insert" ON public.expenses;
CREATE POLICY "expenses_staff_insert" ON public.expenses FOR INSERT
  TO authenticated WITH CHECK (public.is_staff());

DROP POLICY IF EXISTS "expenses_admin_manage" ON public.expenses;
CREATE POLICY "expenses_admin_manage" ON public.expenses FOR UPDATE
  TO authenticated USING (public.is_admin_or_manager());

DROP POLICY IF EXISTS "expenses_admin_delete" ON public.expenses;
CREATE POLICY "expenses_admin_delete" ON public.expenses FOR DELETE
  TO authenticated USING (public.is_admin_or_manager());

-- Team schedule policies
DROP POLICY IF EXISTS "schedule_staff_read" ON public.team_schedule;
CREATE POLICY "schedule_staff_read" ON public.team_schedule FOR SELECT
  TO authenticated USING (public.is_staff());

DROP POLICY IF EXISTS "schedule_admin_write" ON public.team_schedule;
CREATE POLICY "schedule_admin_write" ON public.team_schedule FOR ALL
  TO authenticated USING (public.is_admin_or_manager())
  WITH CHECK (public.is_admin_or_manager());

-- Notifications policies
DROP POLICY IF EXISTS "notifications_own" ON public.notifications;
CREATE POLICY "notifications_own" ON public.notifications FOR ALL
  TO authenticated USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Audit log policies (admin only)
DROP POLICY IF EXISTS "audit_admin_read" ON public.audit_log;
CREATE POLICY "audit_admin_read" ON public.audit_log FOR SELECT
  TO authenticated USING (public.is_admin());

DROP POLICY IF EXISTS "audit_system_insert" ON public.audit_log;
CREATE POLICY "audit_system_insert" ON public.audit_log FOR INSERT
  TO authenticated WITH CHECK (TRUE);

-- ---------------------------------------------------------------------------
-- Triggers for updated_at
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS users_updated_at ON public.users;
CREATE TRIGGER users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS inventory_updated_at ON public.inventory;
CREATE TRIGGER inventory_updated_at BEFORE UPDATE ON public.inventory
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
