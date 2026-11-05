create or replace function public.username_available(p_username text)
returns boolean
language sql
security definer
set search_path = ''
stable
as $$
  select not exists (
    select 1 from public.codev c where lower(c.username) = lower(p_username)
  );
$$;

revoke execute on function public.username_available(text) from public;
grant execute on function public.username_available(text) to anon, authenticated;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  meta jsonb := coalesce(new.raw_user_meta_data, '{}'::jsonb);
  v_username text := nullif(meta->>'username', '');
begin
  insert into public.codev (
    id, email_address, first_name, last_name, username, username_updated_at,
    phone_number, about, positions, display_position, portfolio_website,
    tech_stacks, image_url, availability_status,
    nda_status, nda_signature, nda_document, nda_signed_at,
    level, application_status, rejected_count,
    facebook, linkedin, github, discord,
    years_of_experience, role_id, internal_status, date_applied,
    created_at, updated_at
  ) values (
    new.id,
    new.email,
    coalesce(meta->>'first_name', ''),
    coalesce(meta->>'last_name', ''),
    v_username,
    case when v_username is null then null else now() end,
    nullif(meta->>'phone_number', ''),
    nullif(meta->>'about', ''),
    case when jsonb_typeof(meta->'positions') = 'array'
      then array(select jsonb_array_elements_text(meta->'positions'))
      else null end,
    coalesce(meta->>'display_position', ''),
    nullif(meta->>'portfolio_website', ''),
    case when jsonb_typeof(meta->'tech_stacks') = 'array'
      then array(select jsonb_array_elements_text(meta->'tech_stacks'))
      else null end,
    nullif(meta->>'image_url', ''),
    true,
    coalesce((meta->>'nda_status')::boolean, false),
    nullif(meta->>'nda_signature', ''),
    nullif(meta->>'nda_document', ''),
    nullif(meta->>'nda_signed_at', '')::timestamptz,
    '{}'::jsonb,
    'applying',
    0,
    nullif(meta->>'facebook', ''),
    nullif(meta->>'linkedin', ''),
    nullif(meta->>'github', ''),
    nullif(meta->>'discord', ''),
    nullif(meta->>'years_of_experience', '')::integer,
    7,
    'TRAINING',
    now(),
    now(),
    now()
  )
  on conflict (id) do nothing;

  insert into public.applicant (codev_id)
  values (new.id)
  on conflict do nothing;

  return new;
end;
$$;

revoke execute on function public.handle_new_user() from public, anon, authenticated;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
