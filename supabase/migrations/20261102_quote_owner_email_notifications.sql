-- Owner quote notifications: private server-side outbox (no public Data API access).
create table if not exists public.quote_owner_email_notifications (
  quote_request_id uuid primary key references public.public_quote_requests(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending','accepted','failed','delivered')),
  provider_message_id text,
  attempt_count integer not null default 0,
  last_attempt_at timestamptz,
  last_error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.quote_owner_email_notifications enable row level security;
revoke all on public.quote_owner_email_notifications from anon, authenticated;
create index if not exists quote_owner_email_retry_idx on public.quote_owner_email_notifications(status,last_attempt_at) where status in ('pending','failed');
comment on table public.quote_owner_email_notifications is 'Private operational notifications. Accepted means provider accepted; not necessarily delivered. Only service role writes.';
