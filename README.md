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
- **Security:** Supabase RLS, Zod validation on the server, honeypot fields,
  in-memory rate limiting, and hardened HTTP headers.

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
2. Run the migration in `supabase/migrations/0001_init.sql` via the Supabase
   **SQL Editor**, or with the CLI:

   ```bash
   supabase db push
   ```

3. Copy your project URL and keys into `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (server-only — never expose to the browser)

4. **Admin access to leads:** the RLS policies grant read/manage rights to
   users whose auth JWT has `app_metadata.role = 'admin'`. Set this on a user
   from the Supabase dashboard or via the Admin API.

### 4. Set up email (Resend)

1. Create an account at [resend.com](https://resend.com) and verify a sending
   domain.
2. Add `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, and `LEADS_NOTIFICATION_EMAIL`
   to `.env.local`.

### 5. Run the dev server

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
supabase/migrations/0001_init.sql
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
   settings.
4. Deploy. Add the client's custom domain when ready.

---

## Notes

- Placeholder statistics (e.g. "10+ Years", "100+ Projects") and testimonials
  should be confirmed with the client before launch.
- The in-memory rate limiter suits a single instance. For serverless scale,
  back it with Upstash Redis or a Supabase table.
```
