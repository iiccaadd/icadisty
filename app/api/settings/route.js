import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

const DEFAULT_SUPABASE_URL = 'https://vgbrjmqiigqjuyeowvfo.supabase.co'
const DEFAULT_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZnYnJqbXFpaWdxanV5ZW93dmZvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkxOTk1MTcsImV4cCI6MjEwNDc3NTUxN30.c_7rPTiLUSdgbvNv7O7wGv2tcm9VDYjKKJCPlwV2Kmc'

export const DEFAULT_SETTINGS = {
  // Photos
  groomPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop',
  bridePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop',
  heroBgPhoto: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1600&auto=format&fit=crop',
  closingBgPhoto: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop',

  // 4 Gallery Moments (3D Perspective Slice Carousel)
  moment1Photo: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop',
  moment1Title: 'Pertama Bertemu',
  moment1Date: 'November 2020',
  moment1Desc: 'Sebuah perjumpaan tak terduga di Muara Tewah yang menjadi awal mula lembaran kisah kasih kami.',

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
  moment4Desc: 'Masjid H. Muhammad Sidik Islamic Center Muara Tewah, mengikat janji suci seumur hidup.',

  // Background & Ambience
  bgOverlayDarkness: 60, // 40 - 90 %
  bgTheme: 'midnight', // 'midnight' | 'amber' | 'espresso' | 'velvet'
  musicUrl: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3',
}

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || DEFAULT_ANON_KEY
  return createClient(url, key)
}

export async function GET() {
  try {
    const supabase = getSupabase()
    const { data, error } = await supabase
      .from('settings')
      .select('data')
      .eq('id', 'general')
      .maybeSingle()

    if (error && error.code !== 'PGRST116') {
      console.warn('Supabase settings query notice:', error.message)
    }

    const merged = { ...DEFAULT_SETTINGS, ...(data?.data || {}) }
    return NextResponse.json({ data: merged })
  } catch (err) {
    return NextResponse.json({ data: DEFAULT_SETTINGS, error: err.message })
  }
}

export async function POST(request) {
  try {
    const supabase = getSupabase()
    const body = await request.json()
    const newSettings = body.settings || body

    const { data, error } = await supabase
      .from('settings')
      .upsert({
        id: 'general',
        data: newSettings,
        updated_at: new Date().toISOString(),
      })
      .select()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, data: newSettings })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
