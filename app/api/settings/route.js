import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

const DEFAULT_SUPABASE_URL = 'https://vgbrjmqiigqjuyeowvfo.supabase.co'
const DEFAULT_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZnYnJqbXFpaWdxanV5ZW93dmZvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkxOTk1MTcsImV4cCI6MjEwNDc3NTUxN30.c_7rPTiLUSdgbvNv7O7wGv2tcm9VDYjKKJCPlwV2Kmc'

export const DEFAULT_SETTINGS = {
  // Photos - Couple 3D Cards
  groomPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop',
  bridePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop',

  // Background Photos for All 8 Scroll Segments (Full-bleed per segment)
  heroBgPhoto: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1600&auto=format&fit=crop',
  coupleBgPhoto: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1600&auto=format&fit=crop',
  loveStoryBgPhoto: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=1600&auto=format&fit=crop',
  eventsBgPhoto: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?q=80&w=1600&auto=format&fit=crop',
  countdownBgPhoto: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?q=80&w=1600&auto=format&fit=crop',
  galleryBgPhoto: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=1600&auto=format&fit=crop',
  rsvpBgPhoto: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=1600&auto=format&fit=crop',
  closingBgPhoto: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop',

  // 4 Gallery Moments (3D Perspective Slice Carousel)
  moment1Photo: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop',
  moment1Title: 'Pertama Bertemu',
  moment1Date: 'November 2020',
  moment1Desc: 'Sebuah perjumpaan tak terduga di Muara Teweh yang menjadi awal mula lembaran kisah kasih kami.',

  moment2Photo: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop',
  moment2Title: 'Merajut Janji',
  moment2Date: 'Agustus 2022',
  moment2Desc: 'Melangkah bersama melewati ragam cerita, bertumbuh dalam cinta, saling menjaga dan menguatkan.',

  moment3Photo: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=800&auto=format&fit=crop',
  moment3Title: 'Restu Keluarga',
  moment3Date: 'Mei 2024',
  moment3Desc: 'Dua keluarga besar bersatu dalam doa dan restu yang tulus menyongsong mahligai suci.',

  moment4Photo: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=800&auto=format&fit=crop',
  moment4Title: 'Hari Bahagia',
  moment4Date: '11 November 2026',
  moment4Desc: 'Masjid H. Muhammad Sidik Islamic Center Muara Teweh, mengikat janji suci seumur hidup.',

  // Background & Ambience
  bgOverlayDarkness: 60, // 40 - 95 %
  bgTheme: 'midnight', // 'midnight' | 'amber' | 'espresso' | 'velvet'
  musicUrl: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3',
}

const NO_CACHE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
  'Pragma': 'no-cache',
  'Expires': '0',
}

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || DEFAULT_ANON_KEY
  return createClient(url, key)
}

let memoryCache = null

// Helper to fetch settings from Supabase (tries 'settings' table first, then 'guests' table fallback)
async function fetchSupabaseSettings() {
  const supabase = getSupabase()

  // 1. Try public.settings table
  try {
    const { data, error } = await supabase
      .from('settings')
      .select('data')
      .eq('id', 'general')
      .maybeSingle()

    if (!error && data?.data && Object.keys(data.data).length > 0) {
      return data.data
    }
  } catch (e) {}

  // 2. Fallback to public.guests table row (name = 'SYSTEM_SETTINGS')
  try {
    const { data, error } = await supabase
      .from('guests')
      .select('id, invited_by')
      .eq('name', 'SYSTEM_SETTINGS')
      .maybeSingle()

    if (!error && data?.invited_by) {
      const parsed = JSON.parse(data.invited_by)
      if (parsed && typeof parsed === 'object') {
        return parsed
      }
    }
  } catch (e) {}

  return null
}

// Helper to save settings to Supabase (saves to both 'settings' and 'guests' fallback)
async function persistSupabaseSettings(settingsObj) {
  const supabase = getSupabase()

  // 1. Try saving to public.settings table
  try {
    await supabase
      .from('settings')
      .upsert({
        id: 'general',
        data: settingsObj,
        updated_at: new Date().toISOString(),
      })
  } catch (e) {}

  // 2. Always also sync to public.guests fallback row (guaranteed to exist across all devices)
  try {
    const { data: existing } = await supabase
      .from('guests')
      .select('id')
      .eq('name', 'SYSTEM_SETTINGS')
      .maybeSingle()

    if (existing?.id) {
      await supabase
        .from('guests')
        .update({
          invited_by: JSON.stringify(settingsObj),
        })
        .eq('id', existing.id)
    } else {
      await supabase
        .from('guests')
        .insert([{
          name: 'SYSTEM_SETTINGS',
          slug: '__settings__',
          invited_by: JSON.stringify(settingsObj),
        }])
    }
  } catch (e) {}
}

export async function GET() {
  try {
    const cloudSettings = await fetchSupabaseSettings()
    const merged = { ...DEFAULT_SETTINGS, ...(cloudSettings || memoryCache || {}) }
    memoryCache = merged
    return NextResponse.json({ data: merged }, { headers: NO_CACHE_HEADERS })
  } catch (err) {
    const merged = { ...DEFAULT_SETTINGS, ...(memoryCache || {}) }
    return NextResponse.json({ data: merged, notice: err.message }, { headers: NO_CACHE_HEADERS })
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    const newSettings = body.settings || body

    // Fetch existing first to ensure safe merge
    const currentCloud = await fetchSupabaseSettings()
    const merged = { ...DEFAULT_SETTINGS, ...(currentCloud || memoryCache || {}), ...newSettings }
    memoryCache = merged

    // Persist to Supabase Cloud Database immediately
    await persistSupabaseSettings(merged)

    return NextResponse.json({ success: true, data: merged }, { headers: NO_CACHE_HEADERS })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500, headers: NO_CACHE_HEADERS })
  }
}
