create table if not exists public.strategy_calls (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  budget text not null default '',
  needs text[] not null default '{}',
  details text not null default '',
  appointment_date date not null,
  appointment_time text not null,
  google_event_id text,
  google_event_url text,
  meeting_link text,
  status text not null default 'confirmed',
  created_at timestamptz not null default now()
);

alter table public.strategy_calls enable row level security;

create index if not exists strategy_calls_appointment_date_idx
  on public.strategy_calls (appointment_date);

create unique index if not exists strategy_calls_slot_key
  on public.strategy_calls (appointment_date, appointment_time)
  where status <> 'cancelled';

create unique index if not exists strategy_calls_google_event_id_key
  on public.strategy_calls (google_event_id)
  where google_event_id is not null;
