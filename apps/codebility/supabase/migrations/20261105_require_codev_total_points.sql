do $$
begin
  if to_regclass('public.codev_total_points') is null then
    raise exception 'public.codev_total_points is missing. It exists in the live project but no migration creates it. Capture it with pg_get_viewdef and add a migration before provisioning a new database.';
  end if;
end
$$;
