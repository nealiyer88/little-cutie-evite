import { createClient } from '@supabase/supabase-js'

export type Rsvp = {
  id: string
  name: string
  status: 'attending' | 'declined'
  guest_count: number
  note: string | null
  created_at: string
  updated_at: string
}

export function createBrowserClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// Server-side client (API routes)
export function createServerClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
