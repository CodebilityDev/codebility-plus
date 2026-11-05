with views as (
  select
    c.oid,
    c.relname,
    pg_get_viewdef(c.oid, true) as def,
    coalesce(c.reloptions, '{}') as opts
  from pg_class c
  join pg_namespace n on n.oid = c.relnamespace
  where n.nspname = 'public'
    and c.relkind = 'v'
    and c.relname in (
      'codev_total_points',
      'profile_points',
      'public_codev_profiles',
      'mentor_users'
    )
),
grants as (
  select
    table_name,
    string_agg(
      format('grant %s on public.%I to %I;', privilege_type, table_name, grantee),
      E'\n'
      order by privilege_type, grantee
    ) as stmts
  from information_schema.role_table_grants
  where table_schema = 'public'
    and table_name in (select relname from views)
    and grantee not in ('postgres', 'service_role')
  group by table_name
),
parts as (
  select
    v.relname,
    format(
      E'create or replace view public.%I%s as\n%s\n%s',
      v.relname,
      case
        when 'security_invoker=true' = any (v.opts) then E'\nwith (security_invoker = true)'
        else ''
      end,
      v.def,
      coalesce(g.stmts, '')
    ) as stmt
  from views v
  left join grants g on g.table_name = v.relname
)
select
  E'-- generated from the live database; review before committing\n\n' ||
  coalesce(string_agg(stmt, E'\n\n' order by relname), '-- no matching views found') as migration_sql
from parts;
