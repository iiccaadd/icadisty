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

export async function GET(request) {
  try {
    const supabase = getSupabase()
    const { searchParams } = new URL(request.url)
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')) : 100
    const onlyWishes = searchParams.get('wishes') === 'true'

    let query = supabase
      .from('rsvp')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)

    if (onlyWishes) {
      query = query.not('wishes', 'is', null).neq('wishes', '')
    }

    const { data, error } = await query

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
    const { name, phone, attending, guest_count, message, wishes } = body

    if (!name) {
      return NextResponse.json({ error: 'Nama wajib diisi' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('rsvp')
      .insert([
        {
          name: name.trim(),
          phone: phone || null,
          attending: attending || 'yes',
          guest_count: parseInt(guest_count) || 1,
          message: message || null,
          wishes: wishes || null,
        },
      ])
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
    const supabase = getSupabase()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }

    const { error } = await supabase.from('rsvp').delete().eq('id', id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
