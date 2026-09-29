-- ============================================================================
-- Brite MJ Technologies — Close anonymous inserts on leads and enquiries
-- ----------------------------------------------------------------------------
-- Problem:
--   0001_init.sql and 0004_align_leads_rls_users_role.sql allowed
--   INSERT ... WITH CHECK (true) for the anon (and any authenticated) role
--   on public.leads. public.enquiries had the same policy from 0001.
--   The anon key is shipped to the browser, so anyone could POST a row
--   through PostgREST, skip the Zod / honeypot / rate limiter in
--   src/app/actions/submit.ts, and set staff-only columns (status,
--   assigned_to, notes, quote_amount, and so on).
--
-- Fix (least change that fully closes the hole):
--   The public quote, contact, and newsletter actions already insert with
--   the service-role key (createAdminClient), which bypasses RLS.
--   Staff create leads as the authenticated role under leads_staff_insert
--   (public.is_staff()). Nothing legitimate uses the anon insert policy.
--   This migration removes that policy and revokes INSERT from anon.
--   Staff-managed columns are therefore not writable by public callers;
--   the server action supplies only the validated form fields and the
--   safe status / source values.
--
-- Safe to re-run. Does not edit earlier migrations.
-- ============================================================================

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;

-- Known policy names from 0001 and 0004.
DROP POLICY IF EXISTS "leads_insert_public" ON public.leads;
DROP POLICY IF EXISTS "enquiries_insert_public" ON public.enquiries;

-- Drop any other INSERT or ALL policy on these tables that still targets
-- anon or PUBLIC. Leaves authenticated staff policies in place
-- (leads_staff_insert, enquiries_staff_write, and the select/update/delete
-- policies from 0003 and 0004).
DO $$
DECLARE
  rec record;
BEGIN
  FOR rec IN
    SELECT nsp.nspname AS schema_name,
           cls.relname AS table_name,
           policy.polname AS policy_name
    FROM pg_policy AS policy
    JOIN pg_class AS cls ON cls.oid = policy.polrelid
    JOIN pg_namespace AS nsp ON nsp.oid = cls.relnamespace
    WHERE nsp.nspname = 'public'
      AND cls.relname IN ('leads', 'enquiries')
      AND policy.polcmd IN ('a', '*') -- INSERT, or ALL
      AND (
        policy.polroles = ARRAY[0]::oid[] -- PUBLIC
        OR EXISTS (
          SELECT 1
          FROM pg_roles AS role_row
          WHERE role_row.rolname = 'anon'
            AND role_row.oid = ANY (policy.polroles)
        )
      )
  LOOP
    EXECUTE format(
      'DROP POLICY IF EXISTS %I ON %I.%I',
      rec.policy_name,
      rec.schema_name,
      rec.table_name
    );
  END LOOP;
END $$;

-- Table privilege, independent of RLS. A future permissive policy must not
-- be enough on its own to reopen anonymous inserts.
REVOKE INSERT ON TABLE public.leads FROM anon;
REVOKE INSERT ON TABLE public.enquiries FROM anon;
REVOKE INSERT ON TABLE public.leads FROM PUBLIC;
REVOKE INSERT ON TABLE public.enquiries FROM PUBLIC;

-- PUBLIC may have been the only grant. Put the privileges the app still
-- needs back explicitly. Idempotent if they are already granted.
--   authenticated: admin "Add lead" and POST /api/admin/leads (RLS still
--                  requires public.is_staff()).
--   service_role:  submitQuote / submitEnquiry / submitNewsletter and
--                  scripts/smoke-lead-path.mjs (bypasses RLS).
GRANT INSERT ON TABLE public.leads TO authenticated;
GRANT INSERT ON TABLE public.leads TO service_role;
GRANT INSERT ON TABLE public.enquiries TO authenticated;
GRANT INSERT ON TABLE public.enquiries TO service_role;
