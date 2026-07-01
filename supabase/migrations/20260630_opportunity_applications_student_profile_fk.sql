insert into public.student_profiles (user_id, full_name, email)
select
  auth_user.id,
  nullif(auth_user.raw_user_meta_data ->> 'full_name', ''),
  auth_user.email
from auth.users auth_user
join (
  select distinct student_user_id
  from public.opportunity_applications
) application_students
  on application_students.student_user_id = auth_user.id
left join public.student_profiles student_profile
  on student_profile.user_id = auth_user.id
where student_profile.user_id is null
on conflict (user_id) do nothing;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'opportunity_applications_student_user_id_fkey_student_profile'
  ) then
    alter table public.opportunity_applications
    add constraint opportunity_applications_student_user_id_fkey_student_profile
    foreign key (student_user_id)
    references public.student_profiles(user_id)
    on delete cascade;
  end if;
end
$$;
