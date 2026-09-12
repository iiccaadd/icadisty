import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://vgbrjmqiigqjuyeowvfo.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

const supabase = createClient(supabaseUrl, supabaseAnonKey)

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

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('guests')
      .select('*')
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
    const body = await request.json()
    const { id, has_opened } = body

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }

    const updateData = {}
    if (typeof has_opened === 'boolean') {
      updateData.has_opened = has_opened
      if (has_opened) updateData.opened_at = new Date().toISOString()
    }

    const { data, error } = await supabase
      .from('guests')
      .update(updateData)
      .eq('id', id)
      .select()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, data: data?.[0] })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function DELETE(request) {
  try {
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
