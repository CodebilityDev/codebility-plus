create or replace function public.sign_nda(
  p_token text,
  p_signature_url text,
  p_document_url text
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_codev uuid;
begin
  select r.codev_id
    into v_codev
    from public.nda_requests r
   where r.token = p_token
     and r.status is distinct from 'completed'
     and r.expires_at > now()
   limit 1;

  if v_codev is null then
    return false;
  end if;

  update public.codev
     set nda_signature = p_signature_url,
         nda_document = p_document_url,
         nda_status = true,
         nda_signed_at = now()
   where id = v_codev;

  update public.nda_requests
     set status = 'completed',
         completed_at = now()
   where token = p_token;

  return true;
end;
$$;

revoke execute on function public.sign_nda(text, text, text) from public;
grant execute on function public.sign_nda(text, text, text) to anon, authenticated;
