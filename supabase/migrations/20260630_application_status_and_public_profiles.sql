alter table public.opportunity_applications
add column if not exists status text;

update public.opportunity_applications
set status = 'new'
where status is null;

alter table public.opportunity_applications
alter column status set default 'new';

alter table public.opportunity_applications
alter column status set not null;

alter table public.opportunity_applications
drop constraint if exists opportunity_applications_status_check;

alter table public.opportunity_applications
add constraint opportunity_applications_status_check
check (status in ('new', 'reviewed', 'accepted', 'rejected'));

create index if not exists opportunity_applications_status_idx
on public.opportunity_applications(status);

drop policy if exists "students can update their opportunity applications" on public.opportunity_applications;

drop policy if exists "organizations can view applications for their opportunities" on public.opportunity_applications;
create policy "organizations can view applications for their opportunities"
on public.opportunity_applications
for select
to authenticated
using (
  exists (
    select 1
    from public.opportunities
    where opportunities.id = opportunity_applications.opportunity_id
      and opportunities.organization_id = auth.uid()
  )
);

drop policy if exists "organizations can update applications for their opportunities" on public.opportunity_applications;
create policy "organizations can update applications for their opportunities"
on public.opportunity_applications
for update
to authenticated
using (
  exists (
    select 1
    from public.opportunities
    where opportunities.id = opportunity_applications.opportunity_id
      and opportunities.organization_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.opportunities
    where opportunities.id = opportunity_applications.opportunity_id
      and opportunities.organization_id = auth.uid()
  )
);

drop policy if exists "admins can view all applications" on public.opportunity_applications;
create policy "admins can view all applications"
on public.opportunity_applications
for select
to authenticated
using (public.is_kenisar_admin());

drop policy if exists "admins can update all applications" on public.opportunity_applications;
create policy "admins can update all applications"
on public.opportunity_applications
for update
to authenticated
using (public.is_kenisar_admin())
with check (public.is_kenisar_admin());

drop policy if exists "public organization profiles with approved opportunities are visible" on public.organization_profiles;
create policy "public organization profiles with approved opportunities are visible"
on public.organization_profiles
for select
using (
  exists (
    select 1
    from public.opportunities
    where opportunities.organization_id = organization_profiles.user_id
      and opportunities.status = 'approved'
  )
);

drop policy if exists "organization owners and admins can read applicant student profiles" on public.student_profiles;
create policy "organization owners and admins can read applicant student profiles"
on public.student_profiles
for select
to authenticated
using (
  public.is_kenisar_admin()
  or exists (
    select 1
    from public.opportunity_applications
    join public.opportunities
      on opportunities.id = opportunity_applications.opportunity_id
    where opportunity_applications.student_user_id = student_profiles.user_id
      and opportunities.organization_id = auth.uid()
  )
);
