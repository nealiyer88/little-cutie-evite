import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

const supabase = createServerClient()

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { name, status, guest_count, note } = body

  if (!name?.trim() || !status) {
    return NextResponse.json({ error: 'Name and status are required.' }, { status: 400 })
  }
  if (!['attending', 'declined'].includes(status)) {
    return NextResponse.json({ error: 'Invalid status.' }, { status: 400 })
  }

  // Check for existing RSVP (case-insensitive)
  const { data: existing } = await supabase
    .from('rsvps')
    .select('*')
    .ilike('name', name.trim())
    .maybeSingle()

  if (existing) {
    return NextResponse.json({ existing }, { status: 409 })
  }

  const { data, error } = await supabase
    .from('rsvps')
    .insert({
      name: name.trim(),
      status,
      guest_count: status === 'attending' ? (guest_count ?? 1) : 1,
      note: note || null,
    })
    .select()
    .single()

  if (error) {
    // Unique constraint violation (race condition)
    if (error.code === '23505') {
      const { data: existing2 } = await supabase
        .from('rsvps')
        .select('*')
        .ilike('name', name.trim())
        .maybeSingle()
      return NextResponse.json({ existing: existing2 }, { status: 409 })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ rsvp: data })
}

export async function PUT(req: NextRequest) {
  const body = await req.json()
  const { name, status, guest_count, note } = body

  if (!name?.trim() || !status) {
    return NextResponse.json({ error: 'Name and status are required.' }, { status: 400 })
  }
  if (!['attending', 'declined'].includes(status)) {
    return NextResponse.json({ error: 'Invalid status.' }, { status: 400 })
  }

  // Find by name first to get the id
  const { data: existing, error: findErr } = await supabase
    .from('rsvps')
    .select('id')
    .ilike('name', name.trim())
    .maybeSingle()

  if (findErr || !existing) {
    return NextResponse.json({ error: 'RSVP not found.' }, { status: 404 })
  }

  const { data, error } = await supabase
    .from('rsvps')
    .update({
      status,
      guest_count: status === 'attending' ? (guest_count ?? 1) : 1,
      note: note || null,
    })
    .eq('id', existing.id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ rsvp: data })
}
