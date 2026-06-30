alter table public.user_profiles drop constraint if exists user_profiles_role_check;

alter table public.user_profiles
add constraint user_profiles_role_check
check (role in ('student', 'organization', 'admin'));

create or replace function public.is_kenisar_admin()
returns boolean
language sql
stable
set search_path = public
as $$
  select
    exists (
      select 1
      from public.user_profiles
      where user_id = auth.uid() and role = 'admin'
    )
    or lower(coalesce(auth.jwt() ->> 'email', '')) = any (
      array[
        'bhanucharan0999@gmail.com'
        -- TODO: add Sabiha's email here once it is confirmed.
      ]
    );
$$;

create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  next_role text;
begin
  next_role := case
    when lower(coalesce(new.email, '')) = any (
      array[
        'bhanucharan0999@gmail.com'
      ]
    ) then 'admin'
    else coalesce(nullif(new.raw_user_meta_data ->> 'role', ''), 'student')
  end;

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

update public.user_profiles
set role = 'admin',
    updated_at = timezone('utc', now())
where user_id in (
  select id
  from auth.users
  where lower(coalesce(email, '')) = any (
    array[
      'bhanucharan0999@gmail.com'
    ]
  )
);

insert into public.user_profiles (user_id, role)
select
  auth_user.id,
  'admin'
from auth.users auth_user
where lower(coalesce(auth_user.email, '')) = any (
  array[
    'bhanucharan0999@gmail.com'
  ]
)
on conflict (user_id) do update
  set role = excluded.role,
      updated_at = timezone('utc', now());

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

drop policy if exists "user profiles are insertable by owner" on public.user_profiles;
create policy "user profiles are insertable by owner"
on public.user_profiles
for insert
to authenticated
with check (auth.uid() = user_id and role in ('student', 'organization', 'admin'));

drop policy if exists "user profiles are updatable by owner" on public.user_profiles;
create policy "user profiles are updatable by owner"
on public.user_profiles
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id and role in ('student', 'organization', 'admin'));

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
