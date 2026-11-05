grant insert on public.job_applications to anon;

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = ''
stable
as $$
  select coalesce(
    (select c.role_id = 1 from public.codev c where c.id = auth.uid()),
    false
  );
$$;

create or replace function public.has_permission(permission text)
returns boolean
language sql
security definer
set search_path = ''
stable
as $$
  select coalesce(
    (
      select (to_jsonb(r) ->> permission)::boolean
        from public.codev c
        join public.roles r on r.id = c.role_id
       where c.id = auth.uid()
    ),
    false
  );
$$;

create or replace function public.is_project_member(target_project uuid)
returns boolean
language sql
security definer
set search_path = ''
stable
as $$
  select exists (
    select 1
      from public.project_members m
     where m.project_id = target_project
       and m.codev_id = auth.uid()
  );
$$;

revoke execute on function public.is_admin() from public, anon;
revoke execute on function public.has_permission(text) from public, anon;
revoke execute on function public.is_project_member(uuid) from public, anon;

grant execute on function public.is_admin() to authenticated;
grant execute on function public.has_permission(text) to authenticated;
grant execute on function public.is_project_member(uuid) to authenticated;
