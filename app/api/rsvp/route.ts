import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { sendConfirmationEmail } from '@/lib/email'

const supabase = createServerClient()

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { name, status, adult_count, child_count, email, note } = body

  if (!name?.trim() || !status) {
    return NextResponse.json({ error: 'Name and status are required.' }, { status: 400 })
  }
  if (!['attending', 'declined'].includes(status)) {
    return NextResponse.json({ error: 'Invalid status.' }, { status: 400 })
  }

  const adults = status === 'attending' ? (adult_count ?? 1) : 0
  const children = status === 'attending' ? (child_count ?? 0) : 0

  // Check for existing RSVP
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
      adult_count: adults,
      child_count: children,
      guest_count: adults + children,
      email: email?.trim() || null,
      note: note?.trim() || null,
    })
    .select()
    .single()

  if (error) {
    if (error.code === '23505') {
      const { data: existing2 } = await supabase
        .from('rsvps').select('*').ilike('name', name.trim()).maybeSingle()
      return NextResponse.json({ existing: existing2 }, { status: 409 })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Send confirmation email (no-op if RESEND_API_KEY not set)
  if (email?.trim()) {
    await sendConfirmationEmail({ to: email.trim(), name: name.trim(), status, adult_count: adults, child_count: children })
      .catch(() => {}) // never fail the RSVP over email
  }

  return NextResponse.json({ rsvp: data })
}

export async function PUT(req: NextRequest) {
  const body = await req.json()
  const { name, status, adult_count, child_count, email, note } = body

  if (!name?.trim() || !status) {
    return NextResponse.json({ error: 'Name and status are required.' }, { status: 400 })
  }

  const adults = status === 'attending' ? (adult_count ?? 1) : 0
  const children = status === 'attending' ? (child_count ?? 0) : 0

  const { data: existing } = await supabase
    .from('rsvps').select('id').ilike('name', name.trim()).maybeSingle()

  if (!existing) {
    return NextResponse.json({ error: 'RSVP not found.' }, { status: 404 })
  }

  const { data, error } = await supabase
    .from('rsvps')
    .update({
      status,
      adult_count: adults,
      child_count: children,
      guest_count: adults + children,
      email: email?.trim() || null,
      note: note?.trim() || null,
    })
    .eq('id', existing.id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (email?.trim()) {
    await sendConfirmationEmail({ to: email.trim(), name: name.trim(), status, adult_count: adults, child_count: children })
      .catch(() => {})
  }

  return NextResponse.json({ rsvp: data })
}
