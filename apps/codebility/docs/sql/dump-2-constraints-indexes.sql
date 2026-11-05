with cons as (
  select c.relname as tbl, con.conname, con.contype, pg_get_constraintdef(con.oid) as def
  from pg_constraint con
  join pg_class c on c.oid = con.conrelid
  join pg_namespace n on n.oid = c.relnamespace
  where n.nspname = 'public' and con.contype in ('p', 'u', 'c', 'f')
),
parts as (
  select
    case con.contype when 'p' then 0 when 'u' then 1 when 'c' then 1 else 2 end as ord,
    tbl, conname,
    format('alter table public.%I drop constraint if exists %I;', tbl, conname) || E'\n' ||
    format('alter table public.%I add constraint %I %s;', tbl, conname, def) as stmt
  from cons
)
select string_agg(stmt, E'\n' order by ord, tbl, conname) as schema_part_2
from parts;

with idx as (
  select i.tablename, i.indexname,
         regexp_replace(i.indexdef, '^CREATE (UNIQUE )?INDEX ', 'CREATE \1INDEX IF NOT EXISTS ') || ';' as stmt
  from pg_indexes i
  where i.schemaname = 'public'
    and not exists (
      select 1 from pg_constraint con
      join pg_class c on c.oid = con.conrelid
      where con.conname = i.indexname and c.relname = i.tablename
    )
)
select string_agg(stmt, E'\n' order by tablename, indexname) as schema_part_2_indexes
from idx;
