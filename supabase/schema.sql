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

-- Ensure unique constraint on guests(slug) safely
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'guests_slug_key'
  ) then
    alter table public.guests add constraint guests_slug_key unique (slug);
  end if;
exception
  when others then null;
end $$;

-- 4. Initial Seed for Settings with Current Customized Data
insert into public.settings (id, data)
values (
  'general',
  '{
    "groomName": "Muhammad Irsyad, S.T.",
    "groomFather": "Iptu (Purn.) Samsul Hadi",
    "groomMother": "Kartika Sari, S.Pd.",
    "brideName": "Adisty Vana Lestari, S.Pd., M.Pd.",
    "brideFather": "M. Didi Rahman",
    "brideMother": "Yulia Fariza, S.Pd., M.Pd.",
    "weddingDate": "2026-11-11T07:00",
    "groomPhoto": "https://cdn.phototourl.com/free/2026-09-12-05250eb4-3dc4-4f27-a325-a0f05aa15c39.jpg",
    "bridePhoto": "https://cdn.phototourl.com/free/2026-09-12-b2ff5350-374c-4301-8442-79cc8141818d.jpg",
    "heroBgPhoto": "https://cdn.phototourl.com/free/2026-09-12-3bdbd724-5746-4c95-a6f4-de810cc0b91b.jpg",
    "groomBgPhoto": "https://cdn.phototourl.com/member/2026-09-13-040d1c7a-16b6-408f-b5f6-390d3db850c8.jpg",
    "brideBgPhoto": "https://cdn.phototourl.com/member/2026-09-13-bf19892a-aee6-43a2-8708-2eb2dc44e2b9.jpg",
    "coupleBgPhoto": "https://cdn.phototourl.com/free/2026-09-12-1c0f3b0b-582e-495b-89e5-9d612279466b.jpg",
    "loveStoryBgPhoto": "https://cdn.phototourl.com/free/2026-09-12-4e845dd8-c547-4f18-a2e5-47443cfb0ccc.jpg",
    "eventsBgPhoto": "https://cdn.phototourl.com/member/2026-09-13-da305b2c-c3fa-4656-8173-bff5e35c598a.jpg",
    "countdownBgPhoto": "https://cdn.phototourl.com/member/2026-09-12-718ee39b-ed1b-45ce-91f0-a26623156e82.jpg",
    "galleryBgPhoto": "https://cdn.phototourl.com/member/2026-09-12-718ee39b-ed1b-45ce-91f0-a26623156e82.jpg",
    "rsvpBgPhoto": "https://cdn.phototourl.com/member/2026-09-13-51e14aab-7ee5-4bfe-bef4-5a8d0bab81ca.jpg",
    "closingBgPhoto": "https://cdn.phototourl.com/member/2026-09-13-2e0ffa26-f312-4c50-aaff-a76fc200ef07.jpg",
    "bankAccounts": [
      {
        "id": "bca",
        "bankName": "BANK MANDIRI",
        "accountNumber": "1590023031999",
        "accountHolder": "Muhammad Irsyad"
      },
      {
        "id": "mandiri",
        "bankName": "SEABANK",
        "accountNumber": "901887777649",
        "accountHolder": "Adisty Vana Lestari"
      }
    ],
    "coverDarkness": 40,
    "coverSpiralOpacity": 65,
    "bgOverlayDarkness": 45,
    "bgTheme": "midnight",
    "musicUrl": "https://mp3tourl.com/audio/1789271106104-e32841b8-6d23-45fe-b410-79f8c9b8d44b.mp3"
  }'::jsonb
)
on conflict (id) do update set data = excluded.data, updated_at = now();

-- Initial sample guests (Safe Insert)
insert into public.guests (name, slug, phone)
values 
  ('Keluarga Besar Bpk. Ahmad', 'keluarga-besar-bpk-ahmad', '081234567890'),
  ('Sahabat & Rekan Kantor', 'sahabat-rekan-kantor', '081298765432')
on conflict do nothing;
