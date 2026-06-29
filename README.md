# Kenisar

Kenisar is a student opportunity platform for high school, college, and university students who want real-world experience through internships, volunteering, mentorship, workshops, and partner opportunities.

## Tech stack

- React + Vite
- Supabase (form submissions)

## Local development

```bash
npm install
npm run dev
```

## Environment variables

Create a `.env.local` file in the project root (this file is gitignored):

```env
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Copy `.env.example` as a starting point. Never commit real keys to git.

Get these values from your Supabase project: **Settings → API → Project URL** and **anon public** key.

## Supabase setup

Run the following SQL in the Supabase SQL editor to create the required tables and allow anonymous form inserts:

```sql
-- student_waitlist
create table public.student_waitlist (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  school text not null,
  grade_level text not null,
  interests text not null,
  created_at timestamptz not null default now()
);

-- partner_interest
create table public.partner_interest (
  id uuid primary key default gen_random_uuid(),
  organization_name text not null,
  contact_name text not null,
  email text not null,
  organization_type text not null,
  message text not null,
  created_at timestamptz not null default now()
);

-- contact_messages
create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  created_at timestamptz not null default now()
);

-- RLS: allow anonymous inserts only
alter table public.student_waitlist enable row level security;
alter table public.partner_interest enable row level security;
alter table public.contact_messages enable row level security;

create policy "anon insert student_waitlist"
  on public.student_waitlist for insert to anon with check (true);

create policy "anon insert partner_interest"
  on public.partner_interest for insert to anon with check (true);

create policy "anon insert contact_messages"
  on public.contact_messages for insert to anon with check (true);
```

### Forms

| Form | Table | Page |
|------|-------|------|
| Student waitlist | `student_waitlist` | `/apply` |
| Partner interest | `partner_interest` | `/partners` |
| Contact | `contact_messages` | `/about#contact` |

Forms validate inputs client-side, submit to Supabase, and show loading, success, or error states. If environment variables are missing, forms show a configuration error instead of fake success.

## Build

```bash
npm run build
npm run preview
```

## Pages

- `/` — Home
- `/students` — Student info and benefits
- `/apply` — Join the waitlist
- `/opportunities` — Opportunities coming soon
- `/partners` — Partner with Kenisar
- `/about` — About Kenisar and contact form
