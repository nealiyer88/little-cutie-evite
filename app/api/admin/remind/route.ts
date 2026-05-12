import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { sendReminderEmail } from '@/lib/email'

export async function POST(req: NextRequest) {
  const isAuth = req.cookies.get('admin_auth')?.value === '1'
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
  }

  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('rsvps')
    .select('name, email, adult_count, child_count, guest_count')
    .eq('status', 'attending')

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const recipients = (data ?? []).filter(r => r.email?.trim())
  const results: { email: string; ok: boolean; error?: string }[] = []

  for (const r of recipients) {
    try {
      await sendReminderEmail({
        to: r.email!.trim(),
        name: r.name,
        adult_count: r.adult_count ?? r.guest_count ?? 1,
        child_count: r.child_count ?? 0,
      })
      results.push({ email: r.email!, ok: true })
    } catch (err) {
      results.push({ email: r.email!, ok: false, error: err instanceof Error ? err.message : String(err) })
    }
  }

  const sent = results.filter(r => r.ok).length
  const failed = results.length - sent
  const skipped = (data?.length ?? 0) - recipients.length

  return NextResponse.json({ sent, failed, skipped, results })
}
