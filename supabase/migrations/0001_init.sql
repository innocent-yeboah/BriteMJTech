-- ============================================================================
-- Brite MJ Technologies — Initial database schema
-- ----------------------------------------------------------------------------
-- Run with the Supabase CLI:   supabase db push
-- Or paste into the Supabase Dashboard → SQL Editor and run.
--
-- Security model:
--   * Public (anon) visitors may INSERT leads and enquiries only.
--   * Public may SELECT approved testimonials, services, and projects.
--   * Only authenticated "admin" users may read/manage leads & enquiries.
--     (An admin is a user whose auth JWT has app_metadata.role = 'admin'.)
-- ============================================================================

-- Helpful for gen_random_uuid()
create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Helper: is the current request an admin?
-- ---------------------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select coalesce(
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin',
    false
  );
$$;

-- ---------------------------------------------------------------------------
-- Leads
-- ---------------------------------------------------------------------------
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  email text not null,
  phone text not null,
  service_interest text[],
  property_type text,
  message text,
  source text not null default 'website'
    check (source in ('website', 'referral', 'walk-in', 'call', 'whatsapp')),
  status text not null default 'new'
    check (status in ('new', 'contacted', 'inspection_scheduled', 'quote_sent', 'won', 'lost')),
  notes text,
  contacted_at timestamptz,
  inspection_date date,
  inspection_time time,
  quote_sent_at timestamptz,
  created_by uuid references auth.users(id) on delete set null
);

create index if not exists leads_created_at_idx on public.leads (created_at desc);
create index if not exists leads_status_idx on public.leads (status);

-- ---------------------------------------------------------------------------
-- Services
-- ---------------------------------------------------------------------------
create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text not null,
  long_description text,
  benefits text[],
  image_url text,
  icon text,
  featured boolean not null default false,
  order_index integer not null default 0,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Projects
-- ---------------------------------------------------------------------------
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  category text check (category in ('residential', 'commercial', 'institutional')),
  location text,
  image_url text[],
  completed_date date,
  featured boolean not null default false,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Testimonials
-- ---------------------------------------------------------------------------
create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  client_name text not null,
  client_company text,
  content text not null,
  rating integer check (rating >= 1 and rating <= 5),
  approved boolean not null default false,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Enquiries (general contact form)
-- ---------------------------------------------------------------------------
create table if not exists public.enquiries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  email text not null,
  phone text,
  subject text,
  message text not null,
  status text not null default 'new'
    check (status in ('new', 'read', 'replied', 'closed'))
);

create index if not exists enquiries_created_at_idx on public.enquiries (created_at desc);

-- ============================================================================
-- Row Level Security
-- ============================================================================
alter table public.leads        enable row level security;
alter table public.services     enable row level security;
alter table public.projects     enable row level security;
alter table public.testimonials enable row level security;
alter table public.enquiries    enable row level security;

-- Leads: anyone may insert; only admins may read/update/delete.
drop policy if exists "leads_insert_public" on public.leads;
create policy "leads_insert_public"
  on public.leads for insert
  to anon, authenticated
  with check (true);

drop policy if exists "leads_admin_all" on public.leads;
create policy "leads_admin_all"
  on public.leads for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Enquiries: anyone may insert; only admins may read/manage.
drop policy if exists "enquiries_insert_public" on public.enquiries;
create policy "enquiries_insert_public"
  on public.enquiries for insert
  to anon, authenticated
  with check (true);

drop policy if exists "enquiries_admin_all" on public.enquiries;
create policy "enquiries_admin_all"
  on public.enquiries for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Services: public read; admin manage.
drop policy if exists "services_read_public" on public.services;
create policy "services_read_public"
  on public.services for select
  to anon, authenticated
  using (true);

drop policy if exists "services_admin_write" on public.services;
create policy "services_admin_write"
  on public.services for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Projects: public read; admin manage.
drop policy if exists "projects_read_public" on public.projects;
create policy "projects_read_public"
  on public.projects for select
  to anon, authenticated
  using (true);

drop policy if exists "projects_admin_write" on public.projects;
create policy "projects_admin_write"
  on public.projects for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Testimonials: public read approved only; admin manage & see all.
drop policy if exists "testimonials_read_approved" on public.testimonials;
create policy "testimonials_read_approved"
  on public.testimonials for select
  to anon, authenticated
  using (approved = true or public.is_admin());

drop policy if exists "testimonials_admin_write" on public.testimonials;
create policy "testimonials_admin_write"
  on public.testimonials for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());
