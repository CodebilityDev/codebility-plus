create or replace function public.custom_access_token_hook(event jsonb)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  claims jsonb;
  account record;
  mask integer := 0;
begin
  select c.role_id,
         c.application_status,
         r.dashboard,
         r.kanban,
         r.time_tracker,
         r.interns,
         r.applicants,
         r.inhouse,
         r.clients,
         r.projects,
         r.resume,
         r.settings,
         r.orgchart,
         r.overflow,
         exists (
           select 1
           from auth.mfa_factors f
           where f.user_id = c.id and f.status = 'verified'
         ) as has_mfa
    into account
    from public.codev c
    left join public.roles r on r.id = c.role_id
   where c.id = (event ->> 'user_id')::uuid;

  if not found then
    return event;
  end if;

  if account.dashboard then
    mask := mask + 1;
  end if;

  if account.kanban then
    mask := mask + 2;
  end if;

  if account.time_tracker then
    mask := mask + 4;
  end if;

  if account.interns then
    mask := mask + 8;
  end if;

  if account.applicants then
    mask := mask + 16;
  end if;

  if account.inhouse then
    mask := mask + 32;
  end if;

  if account.clients then
    mask := mask + 64;
  end if;

  if account.projects then
    mask := mask + 128;
  end if;

  if account.resume then
    mask := mask + 256;
  end if;

  if account.settings then
    mask := mask + 512;
  end if;

  if account.orgchart then
    mask := mask + 1024;
  end if;

  if account.overflow then
    mask := mask + 2048;
  end if;

  claims := event -> 'claims';
  claims := jsonb_set(claims, '{pm}', to_jsonb(mask), true);
  claims := jsonb_set(claims, '{pv}', to_jsonb(1), true);
  claims := jsonb_set(claims, '{st}', to_jsonb(account.application_status), true);
  claims := jsonb_set(claims, '{rid}', to_jsonb(account.role_id), true);
  claims := jsonb_set(claims, '{mfa}', to_jsonb(coalesce(account.has_mfa, false)), true);

  return jsonb_set(event, '{claims}', claims);
end;
$$;

grant execute on function public.custom_access_token_hook to supabase_auth_admin;
revoke execute on function public.custom_access_token_hook from public;
revoke execute on function public.custom_access_token_hook from anon, authenticated;
