with fns as (
  select p.proname, p.oid,
         pg_get_functiondef(p.oid) || ';' as stmt
  from pg_proc p
  join pg_namespace n on n.oid = p.pronamespace
  where n.nspname = 'public'
    and p.prokind in ('f', 'p')
    and not exists (
      select 1 from pg_depend d where d.objid = p.oid and d.deptype = 'e'
    )
)
select string_agg(stmt, E'\n\n' order by proname, oid) as schema_part_3_functions
from fns;

with trg as (
  select c.relname as tbl, t.tgname,
         format('drop trigger if exists %I on public.%I;', t.tgname, c.relname) || E'\n' ||
         pg_get_triggerdef(t.oid) || ';' as stmt
  from pg_trigger t
  join pg_class c on c.oid = t.tgrelid
  join pg_namespace n on n.oid = c.relnamespace
  where n.nspname = 'public' and not t.tgisinternal
)
select string_agg(stmt, E'\n' order by tbl, tgname) as schema_part_3_triggers
from trg;

with v as (
  select c.relname, pg_get_viewdef(c.oid, true) as def
  from pg_class c join pg_namespace n on n.oid = c.relnamespace
  where n.nspname = 'public' and c.relkind = 'v'
)
select string_agg(format('create or replace view public.%I as\n%s', relname, def), E'\n\n' order by relname) as schema_part_3_views
from v;
