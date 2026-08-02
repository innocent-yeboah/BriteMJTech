-- Marketing site uses static data.ts for portfolio; CRM projects must not be world-readable.
DROP POLICY IF EXISTS projects_read_public ON public.projects;

-- Ensure staff (users.role) can read/write enquiries; 0001 only allowed JWT is_admin().
DROP POLICY IF EXISTS enquiries_staff_select ON public.enquiries;
CREATE POLICY enquiries_staff_select
  ON public.enquiries
  FOR SELECT
  TO authenticated
  USING (public.is_staff());

DROP POLICY IF EXISTS enquiries_staff_write ON public.enquiries;
CREATE POLICY enquiries_staff_write
  ON public.enquiries
  FOR ALL
  TO authenticated
  USING (public.is_admin_or_manager())
  WITH CHECK (public.is_admin_or_manager());
