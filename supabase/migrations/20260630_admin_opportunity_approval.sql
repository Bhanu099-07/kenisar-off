create or replace function public.is_kenisar_admin()
returns boolean
language sql
stable
set search_path = public
as $$
  select lower(coalesce(auth.jwt() ->> 'email', '')) = any (
    array[
      'bhanucharan0999@gmail.com'
    ]
  );
$$;

drop policy if exists "organization profiles are readable by admins" on public.organization_profiles;
create policy "organization profiles are readable by admins"
on public.organization_profiles
for select
to authenticated
using (public.is_kenisar_admin());

drop policy if exists "admins can view all opportunities" on public.opportunities;
create policy "admins can view all opportunities"
on public.opportunities
for select
to authenticated
using (public.is_kenisar_admin());

drop policy if exists "admins can update opportunities" on public.opportunities;
create policy "admins can update opportunities"
on public.opportunities
for update
to authenticated
using (public.is_kenisar_admin())
with check (public.is_kenisar_admin());
