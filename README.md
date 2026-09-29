# Brite MJ Technologies — Corporate Lead Generation Website

> **Smart Solutions. Stronger Security. Better Connections.**
> A high-converting, Fortune 500-quality lead generation website for Brite MJ
> Technologies — a security & smart systems company in Accra, Ghana.
>
> Built for **Build With Innocent**.

---

## Tech Stack

| Layer          | Technology                                   |
| -------------- | -------------------------------------------- |
| Framework      | Next.js 14 (App Router, Server Components)   |
| Language       | TypeScript (strict)                          |
| Styling        | Tailwind CSS                                 |
| Forms          | React Hook Form + Zod validation             |
| Database       | Supabase (Postgres + Row Level Security)     |
| Email          | Resend (transactional notifications)         |
| Icons          | lucide-react                                 |
| Deployment     | Vercel + Supabase                            |

---

## Features

- **6 pages:** Home, Services, About, Projects (filterable), Contact, and a
  4-step Quote wizard with a Thank-You page.
- **Lead capture everywhere:** multi-step quote form, contact form, newsletter
  signup, and a floating WhatsApp/call widget on every page.
- **WhatsApp integration:** floating chat widget + per-service click-to-chat
  with pre-filled messages.
- **Click-to-call** phone links throughout.
- **Leads & enquiries** saved to Supabase with a full status pipeline
  (`new → contacted → inspection_scheduled → quote_sent → won/lost`).
- **Email notifications** to the team + friendly confirmation to the customer.
- **SEO:** dynamic per-page metadata, `LocalBusiness`/`SecurityService`
  structured data, breadcrumbs, `sitemap.xml`, and `robots.txt`.
- **Performance & a11y:** Next.js `<Image>`, server components by default,
  semantic HTML, keyboard navigation, focus rings, skip-link, and
  `prefers-reduced-motion` support.
- **Security:** Supabase RLS (anonymous clients cannot insert leads or
  enquiries; public forms insert with the server-only service role), Zod
  validation on the server, honeypot fields, Upstash rate limiting (required
  in production; in-memory fallback only in local development), and hardened
  HTTP headers.

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy the example file and fill in your values:

```bash
cp .env.example .env.local
```

The site runs **without any configuration** for local previewing — forms will
validate and show success states, logging submissions to the console. To
actually store leads and send email, configure Supabase and Resend below.

### 3. Set up the database (Supabase)

1. Create a project at [supabase.com](https://supabase.com).
2. Apply the SQL migrations in `supabase/migrations/` **in filename order**
   (`0001_init.sql` through `0005_revoke_public_lead_inserts.sql`). Paste each
   file into the Supabase **SQL Editor**, or with the CLI:

   ```bash
   supabase db push
   ```

   **Existing database:** if `0001`–`0004` are already applied, run only
   `supabase/migrations/0005_revoke_public_lead_inserts.sql`. It is safe to
   run more than once. It removes the anonymous `INSERT` policies on `leads`
   and `enquiries` (`WITH CHECK (true)`), which let anyone holding the public
   anon key create rows and set staff fields such as `status`. Quote, contact,
   and newsletter forms are unchanged: `src/app/actions/submit.ts` inserts with
   `SUPABASE_SERVICE_ROLE_KEY`, which bypasses RLS. Signed-in staff still
   create leads through the `leads_staff_insert` policy.

   After it is applied, an anonymous insert that sets `status` must fail.
   Replace the URL and anon key, then:

   ```bash
   curl -sS -o /tmp/lead-insert.json -w "%{http_code}\n" \
     -X POST "$NEXT_PUBLIC_SUPABASE_URL/rest/v1/leads" \
     -H "apikey: $NEXT_PUBLIC_SUPABASE_ANON_KEY" \
     -H "Authorization: Bearer $NEXT_PUBLIC_SUPABASE_ANON_KEY" \
     -H "Content-Type: application/json" \
     -H "Prefer: return=minimal" \
     -d '{"name":"Attacker","email":"a@example.com","phone":"0200000000","status":"won","source":"website"}'
   ```

   Expect `401` or `403` and a permission or row-level security error in
   `/tmp/lead-insert.json`. The service-role smoke check is
   `npm run smoke:leads`.

3. Copy your project URL and keys into `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (server-only — never expose to the browser).
     Required for quote, contact, and newsletter storage.

4. **Admin access to leads:** an active row in `public.users` grants access.
   `role` is `admin`, `manager`, `staff`, or `technician` (see `0002` and
   `0004`). Do not rely on `app_metadata.role`.

### 4. Set up email (Resend)

1. Create an account at [resend.com](https://resend.com) and verify a sending
   domain.
2. Add `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, and `LEADS_NOTIFICATION_EMAIL`
   to `.env.local`.

### 5. Rate limiting (Upstash Redis) — required in production

Public quote, contact, and newsletter submissions, and
`POST /api/auth/password-check`, are rate limited per IP.

1. Create a Redis database at [console.upstash.com](https://console.upstash.com)
   (the free tier is enough).
2. Copy the **REST URL** and **REST token** into `.env.local` as
   `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`.
3. Set the same two variables on the Vercel project for **Production** and
   **Preview**, then redeploy.

Local `next dev` still rate-limits with an in-memory bucket when those
variables are unset, so local development keeps working. Production
(`next start` or Vercel) requires the two Upstash variables. If Redis is
missing there, the public endpoints above
respond with "Please try again shortly" and the cause is logged. If Redis is
configured but a call fails, that isolate allows a small strict in-memory
budget and then denies further requests until Redis answers again. The budget
is 2 requests per IP for each bucket (quote, contact, newsletter, or
password-check) and 30 requests total on that running instance across those
buckets, per 10 minutes. A short outage can still accept a few real
submissions, and a flood on that instance is rejected. Every later request
tries Redis again, so once Redis recovers the fallback stops. If Redis
stays down, that in-memory allowance also expires after 10 minutes. Upstash
is what enforces the limit across instances.

Check the decision logic without Redis:

```bash
npm run verify:rate-limit
```

### 6. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Scripts

| Command             | Description                          |
| ------------------- | ------------------------------------ |
| `npm run dev`       | Start the development server         |
| `npm run build`     | Production build                     |
| `npm run start`     | Start the production server          |
| `npm run lint`      | Run ESLint                           |
| `npm run typecheck` | Type-check with the TypeScript compiler |
| `npm run verify:rate-limit` | Check production fail-closed rate-limit decisions |

---

## Project Structure

```
src/
├── app/
│   ├── actions/submit.ts      # Server actions: leads, enquiries, newsletter
│   ├── about/                 # About page
│   ├── contact/               # Contact page (form + map)
│   ├── projects/              # Filterable project gallery
│   ├── quote/                 # Multi-step quote wizard + thank-you
│   ├── services/              # Detailed services page
│   ├── layout.tsx             # Root layout, fonts, nav, footer, JSON-LD
│   ├── page.tsx               # Homepage
│   ├── sitemap.ts / robots.ts # SEO
│   └── globals.css
├── components/
│   ├── cards/ forms/ layout/ projects/ sections/ ui/
│   ├── service-icon.tsx
│   └── structured-data.tsx
└── lib/
    ├── supabase/              # Browser, server, and admin clients
    ├── data.ts                # Services, projects, testimonials content
    ├── email.ts               # Resend templates
    ├── site.ts                # Company config & navigation
    ├── validations.ts         # Zod schemas
    └── utils.ts
supabase/migrations/          # 0001–0005; apply in order (see setup step 3)
```

---

## Customization Guide

- **Company details / contact:** `src/lib/site.ts` (and env vars).
- **Services, projects, testimonials:** `src/lib/data.ts`. Once the Supabase
  tables are populated, swap the static reads for Supabase queries — the data
  shapes intentionally mirror the DB schema.
- **Colors & fonts:** `tailwind.config.ts`.
- **Images:** Placeholder Unsplash photos are marked with `REPLACE` comments —
  swap in the client's real photography before launch.

---

## Deployment (Vercel)

1. Push this repo to GitHub.
2. Import it into [Vercel](https://vercel.com).
3. Add all environment variables from `.env.example` in the Vercel project
   settings. `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` are
   required for Production and Preview. Without them, public forms and the
   password-check endpoint fail closed.
4. Deploy. Add the client's custom domain when ready.

---

## Notes

- Placeholder statistics (e.g. "10+ Years", "100+ Projects") and testimonials
  should be confirmed with the client before launch.
- Upstash Redis is required in production. Without
  `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`, public form
  submissions and the password-check endpoint fail closed on Vercel. See
  setup step 5.
```
