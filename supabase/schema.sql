-- ============================================================
-- SUPABASE SCHEMA FOR ICADISTY WEDDING INVITATION
-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/vgbrjmqiigqjuyeowvfo/sql
-- ============================================================

-- 1. Table: rsvp (Konfirmasi Kehadiran & Ucapan Doa)
create table if not exists public.rsvp (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  phone text,
  attending text not null default 'yes' check (attending in ('yes', 'no', 'maybe')),
  guest_count integer default 1,
  message text,
  wishes text,
  created_at timestamptz default now()
);

-- 2. Table: guests (Daftar Tamu Undangan Personalisasi)
create table if not exists public.guests (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  slug text,
  phone text,
  invited_by text default 'Keluarga Irsyad & Adisty',
  has_opened boolean default false,
  opened_at timestamptz,
  created_at timestamptz default now()
);

-- Enable Row Level Security (RLS)
alter table public.rsvp enable row level security;
alter table public.guests enable row level security;

-- Drop existing policies if rerun
drop policy if exists "Public insert rsvp" on public.rsvp;
drop policy if exists "Public select rsvp" on public.rsvp;
drop policy if exists "Public all rsvp" on public.rsvp;

drop policy if exists "Public insert guests" on public.guests;
drop policy if exists "Public select guests" on public.guests;
drop policy if exists "Public update guests" on public.guests;
drop policy if exists "Public all guests" on public.guests;

-- Policies for rsvp:
-- Allow anyone to submit RSVP and read wishes
create policy "Public insert rsvp" on public.rsvp
  for insert with check (true);

create policy "Public select rsvp" on public.rsvp
  for select using (true);

create policy "Public delete rsvp" on public.rsvp
  for delete using (true);

-- Policies for guests:
-- Allow reading, inserting, and updating guest opened status
create policy "Public select guests" on public.guests
  for select using (true);

create policy "Public insert guests" on public.guests
  for insert with check (true);

create policy "Public update guests" on public.guests
  for update using (true);

create policy "Public delete guests" on public.guests
  for delete using (true);

-- Initial sample guests (optional)
insert into public.guests (name, slug, phone)
values 
  ('Keluarga Besar Bpk. Ahmad', 'keluarga-besar-bpk-ahmad', '081234567890'),
  ('Sahabat & Rekan Kantor', 'sahabat-rekan-kantor', '081298765432')
on conflict do nothing;
