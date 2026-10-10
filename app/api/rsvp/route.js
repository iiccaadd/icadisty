import { NextResponse } from 'next/server'
import { getSupabaseServer } from '@/lib/supabaseServer'
import { isAdmin } from '@/lib/adminAuth'

export const dynamic = 'force-dynamic'

export async function GET(request) {
  try {
    const supabase = getSupabaseServer()
    const { searchParams } = new URL(request.url)
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')) : 100
    const onlyWishes = searchParams.get('wishes') === 'true'

    // Public may only read wishes, never phone numbers or the full RSVP list
    if (!onlyWishes && !(await isAdmin(request))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    let query = supabase
      .from('rsvp')
      .select(onlyWishes ? 'name, wishes, created_at' : '*')
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
    const supabase = getSupabaseServer()
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
    if (!(await isAdmin(request))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const supabase = getSupabaseServer()
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
