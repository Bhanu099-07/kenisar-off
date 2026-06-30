create extension if not exists pgcrypto;

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table if not exists public.user_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('student', 'organization')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.student_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text,
  school text,
  grade_or_year text,
  city text,
  interests text[] not null default '{}',
  skills text[] not null default '{}',
  experience_goals text,
  availability text,
  resume_link text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.organization_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  organization_name text,
  contact_name text,
  email text,
  website text,
  organization_type text,
  city text,
  description text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.opportunities (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organization_profiles(user_id) on delete cascade,
  title text not null,
  description text not null,
  opportunity_type text not null,
  location text not null,
  remote_or_in_person text not null,
  commitment text not null,
  eligibility text,
  skills_gained text,
  deadline date,
  application_link text,
  contact_email text,
  status text not null default 'pending' check (status in ('draft', 'pending', 'approved', 'rejected')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.saved_opportunities (
  id uuid primary key default gen_random_uuid(),
  student_user_id uuid not null references auth.users(id) on delete cascade,
  opportunity_id uuid not null references public.opportunities(id) on delete cascade,
  created_at timestamptz not null default timezone('utc', now()),
  unique (student_user_id, opportunity_id)
);

create table if not exists public.opportunity_applications (
  id uuid primary key default gen_random_uuid(),
  student_user_id uuid not null references auth.users(id) on delete cascade,
  opportunity_id uuid not null references public.opportunities(id) on delete cascade,
  action_type text not null default 'interested' check (action_type in ('interested', 'applied')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (student_user_id, opportunity_id)
);

create index if not exists opportunities_status_idx on public.opportunities(status);
create index if not exists opportunities_organization_idx on public.opportunities(organization_id);
create index if not exists saved_opportunities_student_idx on public.saved_opportunities(student_user_id);
create index if not exists saved_opportunities_opportunity_idx on public.saved_opportunities(opportunity_id);
create index if not exists opportunity_applications_student_idx on public.opportunity_applications(student_user_id);
create index if not exists opportunity_applications_opportunity_idx on public.opportunity_applications(opportunity_id);

drop trigger if exists user_profiles_touch_updated_at on public.user_profiles;
create trigger user_profiles_touch_updated_at
before update on public.user_profiles
for each row
execute function public.touch_updated_at();

drop trigger if exists student_profiles_touch_updated_at on public.student_profiles;
create trigger student_profiles_touch_updated_at
before update on public.student_profiles
for each row
execute function public.touch_updated_at();

drop trigger if exists organization_profiles_touch_updated_at on public.organization_profiles;
create trigger organization_profiles_touch_updated_at
before update on public.organization_profiles
for each row
execute function public.touch_updated_at();

drop trigger if exists opportunities_touch_updated_at on public.opportunities;
create trigger opportunities_touch_updated_at
before update on public.opportunities
for each row
execute function public.touch_updated_at();

drop trigger if exists opportunity_applications_touch_updated_at on public.opportunity_applications;
create trigger opportunity_applications_touch_updated_at
before update on public.opportunity_applications
for each row
execute function public.touch_updated_at();

create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.user_profiles (user_id, role)
  values (
    new.id,
    coalesce(nullif(new.raw_user_meta_data ->> 'role', ''), 'student')
  )
  on conflict (user_id) do update
    set role = excluded.role,
        updated_at = timezone('utc', now());

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_auth_user();

alter table public.user_profiles enable row level security;
alter table public.student_profiles enable row level security;
alter table public.organization_profiles enable row level security;
alter table public.opportunities enable row level security;
alter table public.saved_opportunities enable row level security;
alter table public.opportunity_applications enable row level security;

drop policy if exists "user profiles are readable by owner" on public.user_profiles;
create policy "user profiles are readable by owner"
on public.user_profiles
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "user profiles are insertable by owner" on public.user_profiles;
create policy "user profiles are insertable by owner"
on public.user_profiles
for insert
to authenticated
with check (auth.uid() = user_id and role in ('student', 'organization'));

drop policy if exists "user profiles are updatable by owner" on public.user_profiles;
create policy "user profiles are updatable by owner"
on public.user_profiles
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id and role in ('student', 'organization'));

drop policy if exists "student profiles are readable by owner" on public.student_profiles;
create policy "student profiles are readable by owner"
on public.student_profiles
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "student profiles are insertable by owner" on public.student_profiles;
create policy "student profiles are insertable by owner"
on public.student_profiles
for insert
to authenticated
with check (
  auth.uid() = user_id
  and exists (
    select 1
    from public.user_profiles
    where user_id = auth.uid() and role = 'student'
  )
);

drop policy if exists "student profiles are updatable by owner" on public.student_profiles;
create policy "student profiles are updatable by owner"
on public.student_profiles
for update
to authenticated
using (auth.uid() = user_id)
with check (
  auth.uid() = user_id
  and exists (
    select 1
    from public.user_profiles
    where user_id = auth.uid() and role = 'student'
  )
);

drop policy if exists "organization profiles are readable by owner" on public.organization_profiles;
create policy "organization profiles are readable by owner"
on public.organization_profiles
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "organization profiles are insertable by owner" on public.organization_profiles;
create policy "organization profiles are insertable by owner"
on public.organization_profiles
for insert
to authenticated
with check (
  auth.uid() = user_id
  and exists (
    select 1
    from public.user_profiles
    where user_id = auth.uid() and role = 'organization'
  )
);

drop policy if exists "organization profiles are updatable by owner" on public.organization_profiles;
create policy "organization profiles are updatable by owner"
on public.organization_profiles
for update
to authenticated
using (auth.uid() = user_id)
with check (
  auth.uid() = user_id
  and exists (
    select 1
    from public.user_profiles
    where user_id = auth.uid() and role = 'organization'
  )
);

drop policy if exists "approved opportunities are public" on public.opportunities;
create policy "approved opportunities are public"
on public.opportunities
for select
using (status = 'approved');

drop policy if exists "organizations can view their own opportunities" on public.opportunities;
create policy "organizations can view their own opportunities"
on public.opportunities
for select
to authenticated
using (organization_id = auth.uid());

drop policy if exists "organizations can insert their own opportunities" on public.opportunities;
create policy "organizations can insert their own opportunities"
on public.opportunities
for insert
to authenticated
with check (
  organization_id = auth.uid()
  and exists (
    select 1
    from public.user_profiles
    where user_id = auth.uid() and role = 'organization'
  )
);

drop policy if exists "organizations can update their own opportunities" on public.opportunities;
create policy "organizations can update their own opportunities"
on public.opportunities
for update
to authenticated
using (organization_id = auth.uid())
with check (
  organization_id = auth.uid()
  and exists (
    select 1
    from public.user_profiles
    where user_id = auth.uid() and role = 'organization'
  )
);

drop policy if exists "organizations can delete their own opportunities" on public.opportunities;
create policy "organizations can delete their own opportunities"
on public.opportunities
for delete
to authenticated
using (organization_id = auth.uid());

drop policy if exists "students can view their saved opportunities" on public.saved_opportunities;
create policy "students can view their saved opportunities"
on public.saved_opportunities
for select
to authenticated
using (student_user_id = auth.uid());

drop policy if exists "students can save approved opportunities" on public.saved_opportunities;
create policy "students can save approved opportunities"
on public.saved_opportunities
for insert
to authenticated
with check (
  student_user_id = auth.uid()
  and exists (
    select 1
    from public.user_profiles
    where user_id = auth.uid() and role = 'student'
  )
  and exists (
    select 1
    from public.opportunities
    where id = opportunity_id and status = 'approved'
  )
);

drop policy if exists "students can delete their saved opportunities" on public.saved_opportunities;
create policy "students can delete their saved opportunities"
on public.saved_opportunities
for delete
to authenticated
using (student_user_id = auth.uid());

drop policy if exists "students can view their opportunity applications" on public.opportunity_applications;
create policy "students can view their opportunity applications"
on public.opportunity_applications
for select
to authenticated
using (student_user_id = auth.uid());

drop policy if exists "students can insert their opportunity applications" on public.opportunity_applications;
create policy "students can insert their opportunity applications"
on public.opportunity_applications
for insert
to authenticated
with check (
  student_user_id = auth.uid()
  and exists (
    select 1
    from public.user_profiles
    where user_id = auth.uid() and role = 'student'
  )
  and exists (
    select 1
    from public.opportunities
    where id = opportunity_id and status = 'approved'
  )
);

drop policy if exists "students can update their opportunity applications" on public.opportunity_applications;
create policy "students can update their opportunity applications"
on public.opportunity_applications
for update
to authenticated
using (student_user_id = auth.uid())
with check (
  student_user_id = auth.uid()
  and exists (
    select 1
    from public.user_profiles
    where user_id = auth.uid() and role = 'student'
  )
);

drop policy if exists "students can delete their opportunity applications" on public.opportunity_applications;
create policy "students can delete their opportunity applications"
on public.opportunity_applications
for delete
to authenticated
using (student_user_id = auth.uid());
