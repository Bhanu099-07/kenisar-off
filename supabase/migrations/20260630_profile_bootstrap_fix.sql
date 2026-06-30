create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  next_role text;
begin
  next_role := coalesce(nullif(new.raw_user_meta_data ->> 'role', ''), 'student');

  insert into public.user_profiles (user_id, role)
  values (new.id, next_role)
  on conflict (user_id) do update
    set role = excluded.role,
        updated_at = timezone('utc', now());

  if next_role = 'student' then
    insert into public.student_profiles (user_id, full_name, email)
    values (
      new.id,
      nullif(new.raw_user_meta_data ->> 'full_name', ''),
      new.email
    )
    on conflict (user_id) do nothing;
  elsif next_role = 'organization' then
    insert into public.organization_profiles (user_id, organization_name, contact_name, email)
    values (
      new.id,
      nullif(new.raw_user_meta_data ->> 'organization_name', ''),
      nullif(new.raw_user_meta_data ->> 'contact_name', ''),
      new.email
    )
    on conflict (user_id) do nothing;
  end if;

  return new;
end;
$$;

insert into public.student_profiles (user_id, full_name, email)
select
  auth_user.id,
  nullif(auth_user.raw_user_meta_data ->> 'full_name', ''),
  auth_user.email
from auth.users auth_user
join public.user_profiles user_profile
  on user_profile.user_id = auth_user.id
where user_profile.role = 'student'
on conflict (user_id) do nothing;

insert into public.organization_profiles (user_id, organization_name, contact_name, email)
select
  auth_user.id,
  nullif(auth_user.raw_user_meta_data ->> 'organization_name', ''),
  nullif(auth_user.raw_user_meta_data ->> 'contact_name', ''),
  auth_user.email
from auth.users auth_user
join public.user_profiles user_profile
  on user_profile.user_id = auth_user.id
where user_profile.role = 'organization'
on conflict (user_id) do nothing;

drop policy if exists "student profiles are insertable by owner" on public.student_profiles;
create policy "student profiles are insertable by owner"
on public.student_profiles
for insert
to authenticated
with check (
  auth.uid() = user_id
  and coalesce(
    (select role from public.user_profiles where user_id = auth.uid()),
    auth.jwt() -> 'user_metadata' ->> 'role'
  ) = 'student'
);

drop policy if exists "student profiles are updatable by owner" on public.student_profiles;
create policy "student profiles are updatable by owner"
on public.student_profiles
for update
to authenticated
using (auth.uid() = user_id)
with check (
  auth.uid() = user_id
  and coalesce(
    (select role from public.user_profiles where user_id = auth.uid()),
    auth.jwt() -> 'user_metadata' ->> 'role'
  ) = 'student'
);

drop policy if exists "organization profiles are insertable by owner" on public.organization_profiles;
create policy "organization profiles are insertable by owner"
on public.organization_profiles
for insert
to authenticated
with check (
  auth.uid() = user_id
  and coalesce(
    (select role from public.user_profiles where user_id = auth.uid()),
    auth.jwt() -> 'user_metadata' ->> 'role'
  ) = 'organization'
);

drop policy if exists "organization profiles are updatable by owner" on public.organization_profiles;
create policy "organization profiles are updatable by owner"
on public.organization_profiles
for update
to authenticated
using (auth.uid() = user_id)
with check (
  auth.uid() = user_id
  and coalesce(
    (select role from public.user_profiles where user_id = auth.uid()),
    auth.jwt() -> 'user_metadata' ->> 'role'
  ) = 'organization'
);
