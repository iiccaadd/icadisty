import { NextResponse } from 'next/server'
import { getSupabaseServer } from '@/lib/supabaseServer'
import { DEFAULT_SETTINGS } from '@/lib/defaultSettings'
export { DEFAULT_SETTINGS }

export const dynamic = 'force-dynamic'

const NO_CACHE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
  'Pragma': 'no-cache',
  'Expires': '0',
}

let memoryCache = null

// Helper to fetch settings from Supabase (tries 'settings' table first, then 'guests' table fallback)
async function fetchSupabaseSettings() {
  const supabase = getSupabaseServer()

  // 1. Try public.settings table
  try {
    const { data, error } = await supabase
      .from('settings')
      .select('data')
      .eq('id', 'general')
      .limit(1)

    if (!error && data && data.length > 0 && data[0]?.data && Object.keys(data[0].data).length > 0) {
      return data[0].data
    }
  } catch (e) {}

  // 2. Fallback to public.guests table row (name = 'SYSTEM_SETTINGS')
  try {
    const { data, error } = await supabase
      .from('guests')
      .select('id, invited_by')
      .eq('name', 'SYSTEM_SETTINGS')
      .order('created_at', { ascending: false })
      .limit(1)

    if (!error && data && data.length > 0 && data[0]?.invited_by) {
      const parsed = JSON.parse(data[0].invited_by)
      if (parsed && typeof parsed === 'object') {
        return parsed
      }
    }
  } catch (e) {}

  return null
}

// Helper to save settings to Supabase (saves to both 'settings' and 'guests' fallback)
async function persistSupabaseSettings(settingsObj) {
  const supabase = getSupabaseServer()

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
    const { data: existingRows } = await supabase
      .from('guests')
      .select('id')
      .eq('name', 'SYSTEM_SETTINGS')
      .order('created_at', { ascending: false })

    if (existingRows && existingRows.length > 0) {
      await supabase
        .from('guests')
        .update({
          invited_by: JSON.stringify(settingsObj),
        })
        .eq('id', existingRows[0].id)

      // Clean up any extraneous duplicates
      if (existingRows.length > 1) {
        for (let i = 1; i < existingRows.length; i++) {
          await supabase.from('guests').delete().eq('id', existingRows[i].id)
        }
      }
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

    // Backward compatibility: If cloud had legacy moment1-4 but no galleryMoments array, synthesize it
    if (!Array.isArray(merged.galleryMoments) || merged.galleryMoments.length === 0) {
      merged.galleryMoments = [
        {
          id: 1,
          photo: merged.moment1Photo || DEFAULT_SETTINGS.moment1Photo,
          title: merged.moment1Title || DEFAULT_SETTINGS.moment1Title,
          date: merged.moment1Date || DEFAULT_SETTINGS.moment1Date,
          desc: merged.moment1Desc || DEFAULT_SETTINGS.moment1Desc,
        },
        {
          id: 2,
          photo: merged.moment2Photo || DEFAULT_SETTINGS.moment2Photo,
          title: merged.moment2Title || DEFAULT_SETTINGS.moment2Title,
          date: merged.moment2Date || DEFAULT_SETTINGS.moment2Date,
          desc: merged.moment2Desc || DEFAULT_SETTINGS.moment2Desc,
        },
        {
          id: 3,
          photo: merged.moment3Photo || DEFAULT_SETTINGS.moment3Photo,
          title: merged.moment3Title || DEFAULT_SETTINGS.moment3Title,
          date: merged.moment3Date || DEFAULT_SETTINGS.moment3Date,
          desc: merged.moment3Desc || DEFAULT_SETTINGS.moment3Desc,
        },
        {
          id: 4,
          photo: merged.moment4Photo || DEFAULT_SETTINGS.moment4Photo,
          title: merged.moment4Title || DEFAULT_SETTINGS.moment4Title,
          date: merged.moment4Date || DEFAULT_SETTINGS.moment4Date,
          desc: merged.moment4Desc || DEFAULT_SETTINGS.moment4Desc,
        },
      ]
    }

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

    // Sync first 4 galleryMoments back to legacy keys for seamless fallback
    if (Array.isArray(merged.galleryMoments) && merged.galleryMoments.length > 0) {
      merged.galleryMoments.slice(0, 4).forEach((item, index) => {
        const num = index + 1
        if (item.photo) merged[`moment${num}Photo`] = item.photo
        if (item.title) merged[`moment${num}Title`] = item.title
        if (item.date) merged[`moment${num}Date`] = item.date
        if (item.desc) merged[`moment${num}Desc`] = item.desc
      })
    }

    memoryCache = merged

    // Persist to Supabase Cloud Database immediately
    await persistSupabaseSettings(merged)

    return NextResponse.json({ success: true, data: merged }, { headers: NO_CACHE_HEADERS })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500, headers: NO_CACHE_HEADERS })
  }
}
