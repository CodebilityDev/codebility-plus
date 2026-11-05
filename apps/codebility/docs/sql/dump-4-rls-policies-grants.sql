with rls as (
  select string_agg(
    format('alter table public.%I enable row level security;', c.relname) ||
    case when c.relforcerowsecurity then E'\n' || format('alter table public.%I force row level security;', c.relname) else '' end,
    E'\n' order by c.relname) as s
  from pg_class c join pg_namespace n on n.oid = c.relnamespace
  where n.nspname = 'public' and c.relkind = 'r' and c.relrowsecurity
)
select rls.s as schema_part_4_rls from rls;

select string_agg(
  format('drop policy if exists %I on public.%I;', p.policyname, p.tablename) || E'\n' ||
  format('create policy %I on public.%I as %s for %s to %s%s%s;',
    p.policyname, p.tablename,
    p.permissive, lower(p.cmd),
    (select string_agg(quote_ident(r), ', ') from unnest(p.roles) as r),
    case when p.qual is not null then format(' using (%s)', p.qual) else '' end,
    case when p.with_check is not null then format(' with check (%s)', p.with_check) else '' end),
  E'\n' order by p.tablename, p.policyname) as schema_part_4_policies
from pg_policies p
where p.schemaname = 'public';

select string_agg(
  format('grant %s on public.%I to %I;', g.privs, g.table_name, g.grantee),
  E'\n' order by g.table_name, g.grantee) as schema_part_4_grants
from (
  select table_name, grantee,
         string_agg(privilege_type, ', ' order by privilege_type) as privs
  from information_schema.role_table_grants
  where table_schema = 'public'
    and grantee in ('anon', 'authenticated')
  group by table_name, grantee
) g;
