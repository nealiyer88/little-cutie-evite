-- ============================================================
-- Olivia's First Birthday Evite — Supabase Schema
-- Run this in Supabase Dashboard > SQL Editor
-- ============================================================

-- 1. Create the rsvps table
create table public.rsvps (
  id         uuid        default gen_random_uuid() primary key,
  name       text        not null,
  status     text        not null check (status in ('attending', 'declined')),
  guest_count int        default 1,
  note       text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. Unique index on lowercased name (prevents duplicate RSVPs)
create unique index rsvps_name_lower_idx on public.rsvps (lower(name));

-- 3. Enable Row Level Security
alter table public.rsvps enable row level security;

-- 4. RLS Policies (open read/write — protected at app layer for admin)
create policy "Anyone can insert rsvps"
  on public.rsvps for insert
  to anon, authenticated
  with check (true);

create policy "Anyone can update rsvps"
  on public.rsvps for update
  to anon, authenticated
  using (true)
  with check (true);

create policy "Anyone can read rsvps"
  on public.rsvps for select
  to anon, authenticated
  using (true);

-- 5. Auto-update updated_at on row change
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger on_rsvp_updated
  before update on public.rsvps
  for each row execute procedure public.handle_updated_at();

-- 6. Enable realtime
-- In Supabase Dashboard: Database > Replication > toggle rsvps ON
-- Or run:
alter publication supabase_realtime add table public.rsvps;
