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
  slug text unique,
  phone text,
  invited_by text default 'Keluarga Irsyad & Adisty',
  has_opened boolean default false,
  opened_at timestamptz,
  created_at timestamptz default now()
);

-- 3. Table: settings (Pengaturan Foto & Latar Undangan)
create table if not exists public.settings (
  id text primary key default 'general',
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz default now()
);

-- Enable Row Level Security (RLS)
alter table public.rsvp enable row level security;
alter table public.guests enable row level security;
alter table public.settings enable row level security;

-- Drop all existing policies before recreating (Safe Re-run)
drop policy if exists "Public insert rsvp" on public.rsvp;
drop policy if exists "Public select rsvp" on public.rsvp;
drop policy if exists "Public delete rsvp" on public.rsvp;
drop policy if exists "Public all rsvp" on public.rsvp;

drop policy if exists "Public select guests" on public.guests;
drop policy if exists "Public insert guests" on public.guests;
drop policy if exists "Public update guests" on public.guests;
drop policy if exists "Public delete guests" on public.guests;
drop policy if exists "Public all guests" on public.guests;

drop policy if exists "Public select settings" on public.settings;
drop policy if exists "Public insert settings" on public.settings;
drop policy if exists "Public update settings" on public.settings;
drop policy if exists "Public all settings" on public.settings;

-- Recreate policies for rsvp
create policy "Public insert rsvp" on public.rsvp
  for insert with check (true);

create policy "Public select rsvp" on public.rsvp
  for select using (true);

create policy "Public delete rsvp" on public.rsvp
  for delete using (true);

-- Recreate policies for guests
create policy "Public select guests" on public.guests
  for select using (true);

create policy "Public insert guests" on public.guests
  for insert with check (true);

create policy "Public update guests" on public.guests
  for update using (true);

create policy "Public delete guests" on public.guests
  for delete using (true);

-- Recreate policies for settings
create policy "Public select settings" on public.settings
  for select using (true);

create policy "Public insert settings" on public.settings
  for insert with check (true);

create policy "Public update settings" on public.settings
  for update using (true);

-- Initial sample guests (Safe Insert)
insert into public.guests (name, slug, phone)
values 
  ('Keluarga Besar Bpk. Ahmad', 'keluarga-besar-bpk-ahmad', '081234567890'),
  ('Sahabat & Rekan Kantor', 'sahabat-rekan-kantor', '081298765432')
on conflict (slug) do update set name = excluded.name;
