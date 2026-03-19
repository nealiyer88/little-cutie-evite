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

const inputStyle: React.CSSProperties = {
  fontFamily: "'Cormorant Garamond', serif",
  fontSize: 16,
  padding: '10px 16px',
  width: '100%',
  boxSizing: 'border-box',
  border: `1.5px solid ${SAGE_LIGHT}`,
  borderRadius: 4,
  background: 'white',
  color: TEXT_DARK,
  outline: 'none',
  marginBottom: 10,
  textAlign: 'center' as const,
}

type Page = 'front' | 'details' | 'confirmation'

export default function EvitePage() {
  const [page, setPage] = useState<Page>('front')
  const [rsvp, setRsvp] = useState<'attending' | 'declining' | null>(null)
  const [name, setName] = useState('')
  const [guests, setGuests] = useState('1')
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [existingRsvp, setExistingRsvp] = useState<Rsvp | null>(null)
  const [hoverAttend, setHoverAttend] = useState(false)
  const [hoverDecline, setHoverDecline] = useState(false)

  const resetForm = () => {
    setExistingRsvp(null)
    setError(null)
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
          guest_count: rsvp === 'attending' ? parseInt(guests) : 1,
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

  return (
    <div
      style={{
        minHeight: '100vh',
        background: `linear-gradient(145deg, ${SAGE_BG} 0%, #C5D1BF 50%, ${SAGE_BG} 100%)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 16px',
        fontFamily: "'Cormorant Garamond', 'Lora', Georgia, serif",
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background decorations */}
      <Leaf x="5%" y="8%" rotation={-25} size={1.4} />
      <Leaf x="88%" y="12%" rotation={40} size={1.1} color={SAGE} />
      <Leaf x="3%" y="75%" rotation={15} size={1.2} />
      <Leaf x="92%" y="68%" rotation={-35} size={1.3} color={SAGE} />
      <Leaf x="15%" y="92%" rotation={50} size={1} />
      <Leaf x="80%" y="88%" rotation={-15} size={1.1} />
      <CuteOrange size={32} x="2%" y="30%" rotation={-10} style={{ opacity: 0.25 }} />
      <CuteOrange size={28} x="90%" y="40%" rotation={15} style={{ opacity: 0.2 }} />

      <div style={{ maxWidth: 420, width: '100%', position: 'relative', zIndex: 1 }}>

        {/* ── FRONT CARD ─────────────────────────────────── */}
        {page === 'front' && (
          <div
            className="fade-in"
            style={{
              background: CREAM,
              borderRadius: 16,
              padding: '50px 32px 40px',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 8px 40px rgba(45,58,40,0.12), 0 2px 8px rgba(45,58,40,0.06)',
              textAlign: 'center',
              border: `3px solid ${SAGE_LIGHT}`,
              cursor: 'pointer',
            }}
            onClick={() => setPage('details')}
          >
            {/* Scallop edge top */}
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: 20,
              background: `radial-gradient(circle 10px at 10px 0, transparent 10px, ${SAGE_LIGHT} 10px)`,
              backgroundSize: '20px 20px',
            }} />
            {/* Scallop edge bottom */}
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0, height: 20,
              background: `radial-gradient(circle 10px at 10px 20px, transparent 10px, ${SAGE_LIGHT} 10px)`,
              backgroundSize: '20px 20px',
            }} />

            {/* Oranges */}
            <CuteOrange size={48} x={-8} y={40} rotation={-12} />
            <CuteOrange size={40} x={20} y={280} rotation={8} />
            <CuteOrange size={44} x="75%" y={20} rotation={15} />
            <CuteOrange size={38} x="80%" y={240} rotation={-5} />
            <CuteOrange size={50} x="38%" y={350} rotation={3} />
            <CuteOrange size={36} x="55%" y={30} rotation={-18} />

            {/* Leaves */}
            <Leaf x={60} y={80} rotation={-40} size={0.9} />
            <Leaf x="70%" y={100} rotation={30} size={0.8} />
            <Leaf x={40} y={200} rotation={60} size={0.7} color={SAGE} />
            <Leaf x="65%" y={190} rotation={-20} size={0.85} />
            <Leaf x={80} y={340} rotation={45} size={0.75} color={SAGE} />
            <Leaf x="58%" y={310} rotation={-55} size={0.8} />
            <Leaf x={30} y={130} rotation={20} size={0.7} />
            <Leaf x="78%" y={340} rotation={35} size={0.9} />
            <Leaf x="20%" y={360} rotation={-30} size={0.65} color={SAGE} />

            <div style={{ position: 'relative', zIndex: 2, padding: '40px 10px' }}>
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

            <p style={{
              position: 'relative', zIndex: 2,
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 13, color: SAGE, marginTop: 30,
              letterSpacing: '1px', textTransform: 'uppercase',
              animation: 'pulse 2s ease-in-out infinite',
            }}>
              tap to open ›
            </p>
          </div>
        )}

        {/* ── DETAILS + RSVP ─────────────────────────────── */}
        {page === 'details' && (
          <div
            className="fade-in"
            style={{
              background: CREAM,
              borderRadius: 16,
              padding: '40px 28px',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 8px 40px rgba(45,58,40,0.12), 0 2px 8px rgba(45,58,40,0.06)',
              textAlign: 'center',
              border: `3px solid ${SAGE_LIGHT}`,
            }}
          >
            <CuteOrange size={34} x={-4} y={-4} rotation={-10} />
            <CuteOrange size={30} x="84%" y={-2} rotation={12} />

            <div style={{ position: 'relative', zIndex: 2 }}>
              {/* Back */}
              <p
                onClick={() => setPage('front')}
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 13, color: SAGE, cursor: 'pointer',
                  textAlign: 'left', marginBottom: 16, letterSpacing: '0.5px',
                }}
              >
                ‹ back
              </p>

              <p style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 15, color: TEXT_MED, letterSpacing: '0.5px', marginBottom: 4,
              }}>
                You&apos;re Invited
              </p>

              <div style={{ width: 40, height: 2, background: SAGE_LIGHT, margin: '12px auto 20px', borderRadius: 1 }} />

              {/* RSVP toggle buttons */}
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginBottom: 28 }}>
                <button
                  onClick={() => setRsvp('attending')}
                  onMouseEnter={() => setHoverAttend(true)}
                  onMouseLeave={() => setHoverAttend(false)}
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 13, fontWeight: 600, letterSpacing: '2px',
                    textTransform: 'uppercase', padding: '12px 24px',
                    border: `2px solid ${TEXT_DARK}`,
                    background: rsvp === 'attending' ? TEXT_DARK : hoverAttend ? TEXT_DARK : 'transparent',
                    color: rsvp === 'attending' ? CREAM : hoverAttend ? CREAM : TEXT_DARK,
                    cursor: 'pointer', transition: 'all 0.25s ease', borderRadius: 2,
                  }}
                >
                  Will Attend
                </button>
                <button
                  onClick={() => setRsvp('declining')}
                  onMouseEnter={() => setHoverDecline(true)}
                  onMouseLeave={() => setHoverDecline(false)}
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 13, fontWeight: 600, letterSpacing: '2px',
                    textTransform: 'uppercase', padding: '12px 24px',
                    border: `2px solid ${TEXT_DARK}`,
                    background: rsvp === 'declining' ? TEXT_DARK : hoverDecline ? TEXT_DARK : 'transparent',
                    color: rsvp === 'declining' ? CREAM : hoverDecline ? CREAM : TEXT_DARK,
                    cursor: 'pointer', transition: 'all 0.25s ease', borderRadius: 2,
                  }}
                >
                  Will Not Attend
                </button>
              </div>

              {/* Event details */}
              <div style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 16, lineHeight: 1.7, color: TEXT_MED, marginBottom: 24,
              }}>
                <p style={{ fontWeight: 500, marginBottom: 2 }}>
                  Join us in celebrating our little one&apos;s<br />
                  very first birthday! 🍊
                </p>

                <div style={{ width: 30, height: 1, background: SAGE_LIGHT, margin: '16px auto' }} />

                <p style={{ fontSize: 15, marginBottom: 14 }}>
                  <strong style={{ fontWeight: 600, color: TEXT_DARK }}>Sunday, May 17th, 2026</strong><br />
                  10:30 AM – 1:30 PM<br />
                  414 North Fillmore Street<br />
                  Arlington, VA 22201
                </p>

                <div style={{ width: 30, height: 1, background: SAGE_LIGHT, margin: '16px auto' }} />

                <p style={{ fontSize: 15 }}>
                  Come enjoy an afternoon filled with<br />
                  plenty of fun activities for kids of all ages.
                </p>
                <p style={{ fontSize: 15, marginTop: 8 }}>
                  Lunch will be provided, featuring a selection<br />
                  of Indian and Vietnamese dishes.
                </p>
                <p style={{ fontSize: 14, marginTop: 8, color: SAGE }}>
                  Ample free street parking
                </p>

                <div style={{ width: 30, height: 1, background: SAGE_LIGHT, margin: '16px auto' }} />

                <p style={{ fontSize: 15, fontStyle: 'italic' }}>
                  Come anytime and stay as long as you&apos;d like<br />
                  <strong style={{ fontWeight: 500 }}>No gifts please!</strong>
                </p>
              </div>

              {/* RSVP form (appears after toggle) */}
              {rsvp && (
                <div style={{ borderTop: `1px solid ${SAGE_LIGHT}`, paddingTop: 20, marginTop: 8 }}>
                  <p style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 14, color: TEXT_MED, letterSpacing: '1px',
                    textTransform: 'uppercase', marginBottom: 16, fontWeight: 600,
                  }}>
                    {rsvp === 'attending' ? "We'd love to see you!" : "We'll miss you!"}
                  </p>

                  <input
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={e => { setName(e.target.value); resetForm() }}
                    style={inputStyle}
                  />

                  {rsvp === 'attending' && (
                    <select
                      value={guests}
                      onChange={e => setGuests(e.target.value)}
                      style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }}
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                        <option key={n} value={n}>{n} {n === 1 ? 'guest' : 'guests'} attending</option>
                      ))}
                    </select>
                  )}

                  <textarea
                    placeholder={rsvp === 'attending' ? 'Any dietary needs or notes? (optional)' : 'Send a note (optional)'}
                    value={note}
                    onChange={e => setNote(e.target.value)}
                    rows={2}
                    style={{ ...inputStyle, resize: 'none', marginBottom: 14 }}
                  />

                  {/* Duplicate warning */}
                  {existingRsvp && (
                    <div style={{
                      background: '#FFF8F0',
                      border: `1px solid ${ORANGE_MAIN}`,
                      borderRadius: 6,
                      padding: '14px 16px',
                      marginBottom: 14,
                      textAlign: 'left',
                    }}>
                      <p style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontSize: 15, color: TEXT_DARK, marginBottom: 12, lineHeight: 1.5,
                      }}>
                        <strong>{existingRsvp.name}</strong> already RSVPed as{' '}
                        <strong>{existingRsvp.status}</strong>
                        {existingRsvp.status === 'attending' &&
                          ` with ${existingRsvp.guest_count} ${existingRsvp.guest_count === 1 ? 'guest' : 'guests'}`
                        }. Want to update?
                      </p>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button
                          onClick={() => handleSubmit(true)}
                          disabled={loading}
                          style={{
                            fontFamily: "'Cormorant Garamond', serif",
                            fontSize: 13, fontWeight: 600, letterSpacing: '1.5px',
                            textTransform: 'uppercase', padding: '10px 20px',
                            border: `2px solid ${ORANGE_MAIN}`,
                            background: ORANGE_MAIN, color: CREAM,
                            cursor: loading ? 'not-allowed' : 'pointer',
                            borderRadius: 4, opacity: loading ? 0.7 : 1,
                            transition: 'opacity 0.2s',
                          }}
                        >
                          {loading ? 'Updating…' : 'Yes, Update'}
                        </button>
                        <button
                          onClick={() => setExistingRsvp(null)}
                          style={{
                            fontFamily: "'Cormorant Garamond', serif",
                            fontSize: 13, letterSpacing: '1px',
                            padding: '10px 16px', border: 'none',
                            background: 'transparent', color: TEXT_MED, cursor: 'pointer',
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
                    }}>
                      {error}
                    </p>
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
                        borderRadius: 4,
                        opacity: (loading || !name.trim()) ? 0.5 : 1,
                        transition: 'opacity 0.2s',
                        width: '100%',
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

        {/* ── CONFIRMATION ───────────────────────────────── */}
        {page === 'confirmation' && (
          <div
            className="fade-in"
            style={{
              background: CREAM,
              borderRadius: 16,
              padding: '50px 28px',
              boxShadow: '0 8px 40px rgba(45,58,40,0.12), 0 2px 8px rgba(45,58,40,0.06)',
              textAlign: 'center',
              border: `3px solid ${SAGE_LIGHT}`,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <CuteOrange size={60} x="33%" y={20} rotation={0} />

            <div style={{ position: 'relative', zIndex: 2, marginTop: 80 }}>
              <h2 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 32, fontWeight: 700, color: TEXT_DARK, marginBottom: 12,
              }}>
                {rsvp === 'attending' ? 'See you there!' : "We'll miss you!"}
              </h2>
              <p style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 17, color: TEXT_MED, lineHeight: 1.6,
              }}>
                {rsvp === 'attending' ? (
                  <>
                    Thanks, {name}! We&apos;ve got you down<br />
                    for {guests} {parseInt(guests) === 1 ? 'guest' : 'guests'}.<br />
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
            <Leaf x={40} y="80%" rotation={40} size={0.8} />
            <Leaf x="70%" y="75%" rotation={-20} size={1} />
          </div>
        )}
      </div>
    </div>
  )
}
