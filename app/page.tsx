'use client'

import { useState } from 'react'
import CuteOrange from '@/components/CuteOrange'
import Leaf from '@/components/Leaf'
import type { Rsvp } from '@/lib/supabase'

const SAGE = '#8B9E82'
const SAGE_LIGHT = '#C5D1BF'
const SAGE_BG = '#D4DDD0'
const CREAM = '#FDFBF7'
const ORANGE_MAIN = '#E8914F'
const TEXT_DARK = '#2D3A28'
const TEXT_MED = '#4A5A42'

const field: React.CSSProperties = {
  fontFamily: "'Cormorant Garamond', serif",
  fontSize: 16,
  padding: '11px 16px',
  width: '100%',
  boxSizing: 'border-box',
  border: `1.5px solid ${SAGE_LIGHT}`,
  borderRadius: 4,
  background: 'white',
  color: TEXT_DARK,
  outline: 'none',
  marginBottom: 10,
  textAlign: 'center' as const,
  display: 'block',
}

type Page = 'front' | 'details' | 'confirmation'

export default function EvitePage() {
  const [page, setPage] = useState<Page>('front')
  const [rsvp, setRsvp] = useState<'attending' | 'declining' | null>(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [adults, setAdults] = useState('1')
  const [children, setChildren] = useState('0')
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [existingRsvp, setExistingRsvp] = useState<Rsvp | null>(null)
  const [hoverAttend, setHoverAttend] = useState(false)
  const [hoverDecline, setHoverDecline] = useState(false)

  const guestSummary = () => {
    const a = parseInt(adults), c = parseInt(children)
    const parts = []
    if (a > 0) parts.push(`${a} adult${a !== 1 ? 's' : ''}`)
    if (c > 0) parts.push(`${c} child${c !== 1 ? 'ren' : ''}`)
    return parts.join(' & ') || '1 adult'
  }

  const handleSubmit = async (forceUpdate = false) => {
    if (!name.trim() || !rsvp) return
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/rsvp', {
        method: forceUpdate ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          status: rsvp === 'attending' ? 'attending' : 'declined',
          adult_count: rsvp === 'attending' ? parseInt(adults) : 0,
          child_count: rsvp === 'attending' ? parseInt(children) : 0,
          email: email.trim() || null,
          note: note.trim() || null,
        }),
      })

      if (res.status === 409) {
        const data = await res.json()
        setExistingRsvp(data.existing)
        return
      }

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Something went wrong. Please try again.')
        return
      }

      setExistingRsvp(null)
      setPage('confirmation')
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const cardBase: React.CSSProperties = {
    background: CREAM,
    borderRadius: 16,
    position: 'relative',
    overflow: 'hidden',
    boxShadow: '0 8px 40px rgba(45,58,40,0.12), 0 2px 8px rgba(45,58,40,0.06)',
    border: `3px solid ${SAGE_LIGHT}`,
    width: '100%',
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: `linear-gradient(145deg, ${SAGE_BG} 0%, #C5D1BF 50%, ${SAGE_BG} 100%)`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 16px',
      fontFamily: "'Cormorant Garamond', 'Lora', Georgia, serif",
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background leaves */}
      <Leaf x="5%" y="8%" rotation={-25} size={1.4} />
      <Leaf x="88%" y="12%" rotation={40} size={1.1} color={SAGE} />
      <Leaf x="3%" y="75%" rotation={15} size={1.2} />
      <Leaf x="92%" y="68%" rotation={-35} size={1.3} color={SAGE} />
      <Leaf x="15%" y="92%" rotation={50} size={1} />
      <Leaf x="80%" y="88%" rotation={-15} size={1.1} />
      <CuteOrange size={32} x="2%" y="30%" rotation={-10} style={{ opacity: 0.22 }} />
      <CuteOrange size={28} x="90%" y="40%" rotation={15} style={{ opacity: 0.18 }} />

      <div style={{ maxWidth: 420, width: '100%', position: 'relative', zIndex: 1 }}>

        {/* ── FRONT CARD ──────────────────────────────────── */}
        {page === 'front' && (
          <div
            className="fade-in"
            style={{ ...cardBase, padding: '48px 32px 36px', textAlign: 'center', cursor: 'pointer' }}
            onClick={() => setPage('details')}
          >
            {/* Scallop top */}
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: 20,
              background: `radial-gradient(circle 10px at 10px 0, transparent 10px, ${SAGE_LIGHT} 10px)`,
              backgroundSize: '20px 20px',
            }} />
            {/* Scallop bottom */}
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0, height: 20,
              background: `radial-gradient(circle 10px at 10px 20px, transparent 10px, ${SAGE_LIGHT} 10px)`,
              backgroundSize: '20px 20px',
            }} />

            {/* Decorative oranges */}
            <CuteOrange size={44} x={-6} y={36} rotation={-12} />
            <CuteOrange size={38} x={18} y={260} rotation={8} />
            <CuteOrange size={42} x="76%" y={18} rotation={15} />
            <CuteOrange size={36} x="81%" y={230} rotation={-5} />
            <CuteOrange size={34} x="55%" y={28} rotation={-18} />
            <Leaf x={58} y={75} rotation={-40} size={0.85} />
            <Leaf x="70%" y={95} rotation={30} size={0.75} />
            <Leaf x={38} y={190} rotation={60} size={0.65} color={SAGE} />
            <Leaf x="66%" y={180} rotation={-20} size={0.8} />
            <Leaf x={28} y={125} rotation={20} size={0.65} />

            <div style={{ position: 'relative', zIndex: 2, padding: '36px 10px 8px' }}>
              <p style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 16, color: TEXT_MED, letterSpacing: '0.5px',
                marginBottom: 8, fontStyle: 'italic',
              }}>
                Please join us in celebrating our
              </p>
              <h1 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 52, fontWeight: 700, color: TEXT_DARK,
                lineHeight: 1.1, margin: '8px 0 4px', letterSpacing: '-0.5px',
              }}>
                little<br />cutie&apos;s
              </h1>
              <p style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 18, color: TEXT_MED, letterSpacing: '1.5px',
                marginTop: 4, fontStyle: 'italic',
              }}>
                first birthday
              </p>
              <p style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 22, fontWeight: 600, color: ORANGE_MAIN,
                marginTop: 10, letterSpacing: '0.5px',
              }}>
                Olivia Iyer
              </p>
            </div>

            <div style={{
              position: 'relative', zIndex: 10,
              display: 'flex', justifyContent: 'center',
              marginTop: 20, paddingBottom: 10,
            }}>
              <span style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 13, color: SAGE,
                letterSpacing: '1.5px', textTransform: 'uppercase',
                animation: 'pulse 2s ease-in-out infinite',
                background: CREAM,
                padding: '6px 20px',
                borderRadius: 20,
                border: `1.5px solid ${SAGE_LIGHT}`,
              }}>
                tap to open ›
              </span>
            </div>
          </div>
        )}

        {/* ── DETAILS + RSVP ──────────────────────────────── */}
        {page === 'details' && (
          <div className="fade-in" style={{ ...cardBase, padding: '36px 28px', textAlign: 'center' }}>
            <CuteOrange size={32} x={-4} y={-4} rotation={-10} />
            <CuteOrange size={28} x="85%" y={-2} rotation={12} />

            <div style={{ position: 'relative', zIndex: 2 }}>
              <p onClick={() => setPage('front')} style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 13, color: SAGE, cursor: 'pointer',
                textAlign: 'left', marginBottom: 16, letterSpacing: '0.5px',
              }}>
                ‹ back
              </p>

              <p style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 15, color: TEXT_MED, letterSpacing: '0.5px', marginBottom: 4,
              }}>
                You&apos;re Invited
              </p>
              <div style={{ width: 40, height: 2, background: SAGE_LIGHT, margin: '12px auto 20px', borderRadius: 1 }} />

              {/* Attend / Decline buttons */}
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginBottom: 28 }}>
                {(['attending', 'declining'] as const).map(val => {
                  const active = rsvp === val
                  const hover = val === 'attending' ? hoverAttend : hoverDecline
                  return (
                    <button
                      key={val}
                      onClick={() => setRsvp(val)}
                      onMouseEnter={() => val === 'attending' ? setHoverAttend(true) : setHoverDecline(true)}
                      onMouseLeave={() => val === 'attending' ? setHoverAttend(false) : setHoverDecline(false)}
                      style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontSize: 13, fontWeight: 600, letterSpacing: '2px',
                        textTransform: 'uppercase', padding: '12px 20px',
                        border: `2px solid ${TEXT_DARK}`,
                        background: (active || hover) ? TEXT_DARK : 'transparent',
                        color: (active || hover) ? CREAM : TEXT_DARK,
                        cursor: 'pointer', transition: 'all 0.25s ease', borderRadius: 2,
                        flex: 1,
                      }}
                    >
                      {val === 'attending' ? 'Will Attend' : 'Will Not Attend'}
                    </button>
                  )
                })}
              </div>

              {/* Event details */}
              <div style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 15, lineHeight: 1.75, color: TEXT_MED, marginBottom: 24,
              }}>
                <p style={{ fontWeight: 500, marginBottom: 2 }}>
                  Join us in celebrating our little one&apos;s<br />very first birthday! 🍊
                </p>
                <div style={{ width: 30, height: 1, background: SAGE_LIGHT, margin: '14px auto' }} />
                <p>
                  <strong style={{ fontWeight: 600, color: TEXT_DARK }}>Sunday, May 17th, 2026</strong><br />
                  10:30 AM – 1:30 PM<br />
                  Lyon Park Community Center<br />
                  414 North Fillmore Street<br />
                  Arlington, VA 22201
                </p>
                <div style={{ width: 30, height: 1, background: SAGE_LIGHT, margin: '14px auto' }} />
                <p>
                  Come enjoy an afternoon filled with<br />fun activities for kids of all ages.
                </p>
                <p style={{ marginTop: 8 }}>
                  Lunch provided — Indian &amp; Vietnamese dishes.
                </p>
                <p style={{ fontSize: 13, marginTop: 6, color: SAGE }}>Ample free street parking</p>
                <div style={{ width: 30, height: 1, background: SAGE_LIGHT, margin: '14px auto' }} />
                <p style={{ fontStyle: 'italic' }}>
                  Come anytime and stay as long as you&apos;d like<br />
                  <strong style={{ fontWeight: 500 }}>No gifts please!</strong>
                </p>
              </div>

              {/* RSVP form */}
              {rsvp && (
                <div style={{ borderTop: `1px solid ${SAGE_LIGHT}`, paddingTop: 20, marginTop: 8 }}>
                  <p style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 14, color: TEXT_MED, letterSpacing: '1px',
                    textTransform: 'uppercase', marginBottom: 16, fontWeight: 600,
                  }}>
                    {rsvp === 'attending' ? "We'd love to see you!" : "We'll miss you!"}
                  </p>

                  {/* Name */}
                  <input
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={e => { setName(e.target.value); setExistingRsvp(null); setError(null) }}
                    style={field}
                  />

                  {/* Email */}
                  <input
                    type="email"
                    placeholder="Email (for confirmation)"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    style={field}
                  />

                  {/* Adults + Children side by side */}
                  {rsvp === 'attending' && (
                    <div style={{ display: 'flex', gap: 10, marginBottom: 0 }}>
                      <select
                        value={adults}
                        onChange={e => setAdults(e.target.value)}
                        style={{ ...field, flex: 1, appearance: 'none', cursor: 'pointer', marginBottom: 10 }}
                      >
                        {[1,2,3,4,5,6,7,8,9,10].map(n => (
                          <option key={n} value={n}>{n} adult{n !== 1 ? 's' : ''}</option>
                        ))}
                      </select>
                      <select
                        value={children}
                        onChange={e => setChildren(e.target.value)}
                        style={{ ...field, flex: 1, appearance: 'none', cursor: 'pointer', marginBottom: 10 }}
                      >
                        {[0,1,2,3,4,5,6,7,8].map(n => (
                          <option key={n} value={n}>{n} child{n !== 1 ? 'ren' : ''}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Note */}
                  <textarea
                    placeholder={rsvp === 'attending' ? 'Dietary needs or notes? (optional)' : 'Send a note (optional)'}
                    value={note}
                    onChange={e => setNote(e.target.value)}
                    rows={2}
                    style={{ ...field, resize: 'none', marginBottom: 14 }}
                  />

                  {/* Duplicate RSVP banner */}
                  {existingRsvp && (
                    <div style={{
                      background: '#FFF8F0', border: `1px solid ${ORANGE_MAIN}`,
                      borderRadius: 6, padding: '14px 16px', marginBottom: 14, textAlign: 'left',
                    }}>
                      <p style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontSize: 15, color: TEXT_DARK, marginBottom: 12, lineHeight: 1.5,
                      }}>
                        <strong>{existingRsvp.name}</strong> already RSVPed as <strong>{existingRsvp.status}</strong>
                        {existingRsvp.status === 'attending' && ` (${existingRsvp.adult_count ?? existingRsvp.guest_count} adults, ${existingRsvp.child_count ?? 0} children)`}. Want to update?
                      </p>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button
                          onClick={() => handleSubmit(true)}
                          disabled={loading}
                          style={{
                            fontFamily: "'Cormorant Garamond', serif",
                            fontSize: 13, fontWeight: 600, letterSpacing: '1.5px',
                            textTransform: 'uppercase', padding: '10px 20px',
                            border: `2px solid ${ORANGE_MAIN}`, background: ORANGE_MAIN, color: CREAM,
                            cursor: loading ? 'not-allowed' : 'pointer', borderRadius: 4,
                            opacity: loading ? 0.7 : 1, transition: 'opacity 0.2s',
                          }}
                        >
                          {loading ? 'Updating…' : 'Yes, Update'}
                        </button>
                        <button
                          onClick={() => setExistingRsvp(null)}
                          style={{
                            fontFamily: "'Cormorant Garamond', serif", fontSize: 13,
                            padding: '10px 16px', border: 'none', background: 'transparent',
                            color: TEXT_MED, cursor: 'pointer',
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  {error && (
                    <p style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: 14, color: '#C0392B', marginBottom: 12,
                    }}>{error}</p>
                  )}

                  {!existingRsvp && (
                    <button
                      onClick={() => handleSubmit(false)}
                      disabled={loading || !name.trim()}
                      style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontSize: 14, fontWeight: 600, letterSpacing: '2px',
                        textTransform: 'uppercase', padding: '14px 40px',
                        border: 'none', background: TEXT_DARK, color: CREAM,
                        cursor: (loading || !name.trim()) ? 'not-allowed' : 'pointer',
                        borderRadius: 4, opacity: (loading || !name.trim()) ? 0.5 : 1,
                        transition: 'opacity 0.2s', width: '100%',
                      }}
                    >
                      {loading ? 'Sending…' : 'Send RSVP'}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── CONFIRMATION ────────────────────────────────── */}
        {page === 'confirmation' && (
          <div className="fade-in" style={{ ...cardBase, padding: '48px 32px', textAlign: 'center' }}>
            <CuteOrange size={56} x="35%" y={20} rotation={0} />
            <div style={{ position: 'relative', zIndex: 2, marginTop: 76 }}>
              <h2 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 32, fontWeight: 700, color: TEXT_DARK, marginBottom: 12,
              }}>
                {rsvp === 'attending' ? 'See you there!' : "We'll miss you!"}
              </h2>
              <p style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 17, color: TEXT_MED, lineHeight: 1.65,
              }}>
                {rsvp === 'attending' ? (
                  <>
                    Thanks, {name}!<br />
                    We&apos;ve got you down for <strong>{guestSummary()}</strong>.<br />
                    {email && <span style={{ fontSize: 14, color: SAGE }}>Confirmation sent to {email}</span>}
                    <span style={{ fontStyle: 'italic', marginTop: 8, display: 'block' }}>
                      We can&apos;t wait to celebrate with you! 🍊
                    </span>
                  </>
                ) : (
                  <>
                    Thanks for letting us know, {name}.<br />
                    <span style={{ fontStyle: 'italic', marginTop: 8, display: 'block' }}>
                      We&apos;ll save you a cutie! 🍊
                    </span>
                  </>
                )}
              </p>
            </div>
            <Leaf x={20} y={30} rotation={-30} size={1} />
            <Leaf x="75%" y={50} rotation={25} size={0.9} color={SAGE} />
          </div>
        )}
      </div>
    </div>
  )
}
