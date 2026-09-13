import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

const DEFAULT_SUPABASE_URL = 'https://vgbrjmqiigqjuyeowvfo.supabase.co'
const DEFAULT_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZnYnJqbXFpaWdxanV5ZW93dmZvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkxOTk1MTcsImV4cCI6MjEwNDc3NTUxN30.c_7rPTiLUSdgbvNv7O7wGv2tcm9VDYjKKJCPlwV2Kmc'

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || DEFAULT_ANON_KEY
  return createClient(url, key)
}

function generateSlug(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '') + '-' + Math.random().toString(36).substring(2, 6)
}

export async function GET(request) {
  try {
    const supabase = getSupabase()
    const { searchParams } = new URL(request.url)
    const checkSlug = searchParams.get('u') || searchParams.get('slug')
    const checkName = searchParams.get('to') || searchParams.get('name') || searchParams.get('nama')
    const checkId = searchParams.get('id') || searchParams.get('guest_id')
    const isCheck = searchParams.get('check') === '1' || Boolean(checkSlug || checkName || checkId)

    // Verification mode: check if a specific guest exists in database
    if (isCheck && (checkSlug || checkName || checkId)) {
      let guest = null

      // 1. Match by ID
      if (checkId) {
        const { data } = await supabase
          .from('guests')
          .select('id, name, slug, has_opened, opened_at')
          .eq('id', checkId)
          .neq('name', 'SYSTEM_SETTINGS')
          .maybeSingle()
        if (data) guest = data
      }

      // 2. Match by Slug
      if (!guest && checkSlug) {
        const { data } = await supabase
          .from('guests')
          .select('id, name, slug, has_opened, opened_at')
          .eq('slug', checkSlug)
          .neq('name', 'SYSTEM_SETTINGS')
          .maybeSingle()
        if (data) guest = data
      }

      // 3. Match by Name (Exact or ILIKE)
      if (!guest && checkName) {
        const cleanName = decodeURIComponent(checkName.replace(/\+/g, ' ')).trim()
        const { data } = await supabase
          .from('guests')
          .select('id, name, slug, has_opened, opened_at')
          .ilike('name', cleanName)
          .neq('name', 'SYSTEM_SETTINGS')
          .maybeSingle()
        if (data) guest = data

        if (!guest) {
          const { data: loose } = await supabase
            .from('guests')
            .select('id, name, slug, has_opened, opened_at')
            .ilike('name', `%${cleanName}%`)
            .neq('name', 'SYSTEM_SETTINGS')
            .limit(1)
          if (loose && loose.length > 0) guest = loose[0]
        }
      }

      if (guest) {
        return NextResponse.json({ valid: true, guest })
      } else {
        return NextResponse.json({ valid: false, message: 'Tamu tidak terdaftar atau telah dihapus' })
      }
    }

    // Default: fetch all guests for admin dashboard
    const { data, error } = await supabase
      .from('guests')
      .select('*')
      .neq('name', 'SYSTEM_SETTINGS')
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const supabase = getSupabase()
    const body = await request.json()
    const { name, phone, invited_by, bulkNames } = body

    // Bulk creation support
    if (bulkNames && Array.isArray(bulkNames) && bulkNames.length > 0) {
      const items = bulkNames
        .filter(n => n.trim().length > 0)
        .map(n => ({
          name: n.trim(),
          slug: generateSlug(n),
          phone: null,
          invited_by: invited_by || 'Irsyad & Adisty',
        }))

      const { data, error } = await supabase.from('guests').insert(items).select()
      if (error) throw error
      return NextResponse.json({ success: true, count: data.length, data })
    }

    if (!name) {
      return NextResponse.json({ error: 'Nama tamu wajib diisi' }, { status: 400 })
    }

    const newGuest = {
      name: name.trim(),
      slug: generateSlug(name),
      phone: phone ? phone.trim() : null,
      invited_by: invited_by || 'Irsyad & Adisty',
    }

    const { data, error } = await supabase.from('guests').insert([newGuest]).select()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, data: data?.[0] })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function PATCH(request) {
  try {
    const supabase = getSupabase()
    const body = await request.json()
    const { id, slug, name, has_opened } = body

    if (!id && !slug && !name) {
      return NextResponse.json({ error: 'ID, slug, or name is required' }, { status: 400 })
    }

    const isOpened = typeof has_opened === 'boolean' ? has_opened : true
    const updateData = {
      has_opened: isOpened,
      opened_at: isOpened ? new Date().toISOString() : null,
    }

    let updatedData = null

    // 1. Try by ID if available
    if (id) {
      const { data, error } = await supabase
        .from('guests')
        .update(updateData)
        .eq('id', id)
        .select()
      if (!error && data && data.length > 0) {
        updatedData = data[0]
      }
    }

    // 2. Try by Slug if not updated yet
    if (!updatedData && slug) {
      const { data, error } = await supabase
        .from('guests')
        .update(updateData)
        .eq('slug', slug)
        .select()
      if (!error && data && data.length > 0) {
        updatedData = data[0]
      }
    }

    // 3. Try by Name (Exact or ILIKE) if not updated yet
    if (!updatedData && name) {
      const cleanName = name.trim()
      // Try exact case-insensitive match
      const { data, error } = await supabase
        .from('guests')
        .update(updateData)
        .ilike('name', cleanName)
        .select()
      if (!error && data && data.length > 0) {
        updatedData = data[0]
      }

      // If still not matched, try searching loose name
      if (!updatedData) {
        const { data: found } = await supabase
          .from('guests')
          .select('id')
          .ilike('name', `%${cleanName}%`)
          .limit(1)

        if (found && found.length > 0) {
          const { data: d2 } = await supabase
            .from('guests')
            .update(updateData)
            .eq('id', found[0].id)
            .select()
          if (d2 && d2.length > 0) {
            updatedData = d2[0]
          }
        }
      }
    }

    if (!updatedData) {
      return NextResponse.json({ success: false, message: 'Tamu tidak ditemukan di database' })
    }

    return NextResponse.json({ success: true, data: updatedData })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function DELETE(request) {
  try {
    const supabase = getSupabase()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }

    const { error } = await supabase.from('guests').delete().eq('id', id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
