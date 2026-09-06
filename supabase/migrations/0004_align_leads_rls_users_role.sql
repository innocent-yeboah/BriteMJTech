-- ============================================================================
-- Brite MJ Technologies — Align leads RLS with users.role (staff model)
-- ----------------------------------------------------------------------------
-- Phase 0.1 P0-D
--
-- Problem: leads policies used JWT app_metadata.role via public.is_admin(),
-- while the Next.js admin app authorizes with public.users.role.
-- Enquiries were already aligned to is_staff() / is_admin_or_manager() in 0003.
--
-- This migration:
--   1) Redefines public.is_admin() to read public.users.role (authoritative).
--   2) Replaces leads_admin_all with staff-aware SELECT/UPDATE/DELETE policies
--      matching how /api/admin/leads uses requireStaff().
--   3) Keeps public INSERT for website/anon lead capture (service-role also bypasses RLS).
-- ============================================================================

-- Authoritative admin check: active users.role = 'admin'
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.users
    WHERE id = auth.uid()
      AND role = 'admin'
      AND is_active = TRUE
  );
$$;

-- Drop JWT-era catch-all policy on leads
DROP POLICY IF EXISTS "leads_admin_all" ON public.leads;
DROP POLICY IF EXISTS leads_admin_all ON public.leads;

-- Staff (any active users row) can read leads — matches requireStaff() APIs
DROP POLICY IF EXISTS leads_staff_select ON public.leads;
CREATE POLICY leads_staff_select
  ON public.leads
  FOR SELECT
  TO authenticated
  USING (public.is_staff());

-- Staff can update lead status / fields — matches PUT /api/admin/leads/[id]
DROP POLICY IF EXISTS leads_staff_update ON public.leads;
CREATE POLICY leads_staff_update
  ON public.leads
  FOR UPDATE
  TO authenticated
  USING (public.is_staff())
  WITH CHECK (public.is_staff());

-- Staff can delete — matches DELETE /api/admin/leads/[id] (requireStaff)
DROP POLICY IF EXISTS leads_staff_delete ON public.leads;
CREATE POLICY leads_staff_delete
  ON public.leads
  FOR DELETE
  TO authenticated
  USING (public.is_staff());

-- Authenticated staff can insert leads from admin UI
DROP POLICY IF EXISTS leads_staff_insert ON public.leads;
CREATE POLICY leads_staff_insert
  ON public.leads
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_staff());

-- Preserve public website insert policy (anon + authenticated visitors)
-- Service-role inserts from server actions continue to bypass RLS.
DROP POLICY IF EXISTS "leads_insert_public" ON public.leads;
CREATE POLICY "leads_insert_public"
  ON public.leads
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);
