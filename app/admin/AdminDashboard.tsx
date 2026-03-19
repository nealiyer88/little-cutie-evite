'use client'

import { useState, useEffect, useCallback } from 'react'
import { createBrowserClient, type Rsvp } from '@/lib/supabase'

const SAGE = '#8B9E82'
const SAGE_LIGHT = '#C5D1BF'
const SAGE_BG = '#D4DDD0'
const CREAM = '#FDFBF7'
const ORANGE_MAIN = '#E8914F'
const TEXT_DARK = '#2D3A28'
const TEXT_MED = '#4A5A42'

type SortKey = 'name' | 'status' | 'adult_count' | 'child_count' | 'email' | 'note' | 'created_at'
type SortDir = 'asc' | 'desc'

const COL_LABELS: { key: SortKey; label: string; width?: string }[] = [
  { key: 'name',        label: 'Name',      width: '17%' },
  { key: 'status',      label: 'Status',    width: '11%' },
  { key: 'adult_count', label: 'Adults',    width: '7%'  },
  { key: 'child_count', label: 'Kids',      width: '6%'  },
  { key: 'email',       label: 'Email',     width: '19%' },
  { key: 'note',        label: 'Note',      width: '19%' },
  { key: 'created_at',  label: 'Submitted', width: '14%' },
]

function Stat({ label, value, accent }: { label: string; value: number | string; accent?: boolean }) {
  return (
    <div style={{
      background: accent ? TEXT_DARK : 'white',
      borderRadius: 10,
      padding: '16px 20px',
      textAlign: 'center',
      border: `1.5px solid ${accent ? TEXT_DARK : SAGE_LIGHT}`,
      flex: '1 1 120px',
    }}>
      <div style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: 32, fontWeight: 700,
        color: accent ? CREAM : TEXT_DARK,
        lineHeight: 1,
      }}>
        {value}
      </div>
      <div style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: 12, letterSpacing: '1px', textTransform: 'uppercase',
        color: accent ? SAGE_LIGHT : TEXT_MED, marginTop: 4,
      }}>
        {label}
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  const [rsvps, setRsvps] = useState<Rsvp[]>([])
  const [loading, setLoading] = useState(true)
  const [sortKey, setSortKey] = useState<SortKey>('created_at')
  const [sortDir, setSortDir] = useState<SortDir>('desc')
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  const markUpdate = useCallback(() => setLastUpdate(new Date()), [])

  useEffect(() => {
    fetch('/api/admin/rsvps')
      .then(r => r.json())
      .then(data => {
        if (data.rsvps) setRsvps(data.rsvps)
        setLoading(false)
        markUpdate()
      })
      .catch(() => setLoading(false))

    // Realtime subscription
    const supabase = createBrowserClient()
    const channel = supabase
      .channel('admin-rsvps')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'rsvps' }, payload => {
        if (payload.eventType === 'INSERT') {
          setRsvps(prev => [payload.new as Rsvp, ...prev])
        } else if (payload.eventType === 'UPDATE') {
          setRsvps(prev => prev.map(r => r.id === (payload.new as Rsvp).id ? payload.new as Rsvp : r))
        } else if (payload.eventType === 'DELETE') {
          setRsvps(prev => prev.filter(r => r.id !== (payload.old as { id: string }).id))
        }
        markUpdate()
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [markUpdate])

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('asc') }
  }

  const sorted = [...rsvps].sort((a, b) => {
    const av = a[sortKey]
    const bv = b[sortKey]
    const dir = sortDir === 'asc' ? 1 : -1
    if (av == null && bv == null) return 0
    if (av == null) return dir
    if (bv == null) return -dir
    if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * dir
    return String(av).localeCompare(String(bv)) * dir
  })

  const attending = rsvps.filter(r => r.status === 'attending')
  const declined  = rsvps.filter(r => r.status === 'declined')
  const totalGuests = attending.reduce((s, r) => s + r.guest_count, 0)

  const exportCSV = () => {
    const headers = ['Name', 'Status', 'Adults', 'Children', 'Email', 'Note', 'Submitted At']
    const rows = rsvps.map(r => [
      r.name, r.status,
      r.adult_count ?? r.guest_count, r.child_count ?? 0,
      r.email ?? '', r.note ?? '',
      new Date(r.created_at).toLocaleString(),
    ])
    const csv = [headers, ...rows]
      .map(row => row.map(c => `"${String(c).replace(/"/g, '""')}"`).join(','))
      .join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'olivia-birthday-rsvps.csv'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete RSVP for ${name}?`)) return
    await fetch('/api/admin/rsvps', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    setRsvps(prev => prev.filter(r => r.id !== id))
  }

  const logout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' })
    window.location.href = '/admin'
  }

  const arrow = (key: SortKey) => {
    if (sortKey !== key) return <span style={{ opacity: 0.3, fontSize: 10 }}>↕</span>
    return <span style={{ fontSize: 10 }}>{sortDir === 'asc' ? '↑' : '↓'}</span>
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: `linear-gradient(160deg, ${SAGE_BG} 0%, #C5D1BF 100%)`,
      padding: '24px 16px 60px',
      fontFamily: "'Cormorant Garamond', Georgia, serif",
    }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>

        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: 28, flexWrap: 'wrap', gap: 12,
        }}>
          <div>
            <h1 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 26, fontWeight: 700, color: TEXT_DARK,
            }}>
              🍊 Olivia&apos;s Birthday RSVPs
            </h1>
            <p style={{ fontSize: 13, color: SAGE, marginTop: 2 }}>
              May 17th, 2026 · Arlington, VA
              {lastUpdate && (
                <span style={{ marginLeft: 10, opacity: 0.8 }}>
                  · updated {lastUpdate.toLocaleTimeString()}
                </span>
              )}
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={exportCSV}
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 13, fontWeight: 600, letterSpacing: '1.5px',
                textTransform: 'uppercase', padding: '9px 18px',
                border: `2px solid ${TEXT_DARK}`, background: 'transparent',
                color: TEXT_DARK, cursor: 'pointer', borderRadius: 4,
                transition: 'all 0.2s',
              }}
            >
              Export CSV
            </button>
            <button
              onClick={logout}
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 13, letterSpacing: '1px',
                textTransform: 'uppercase', padding: '9px 18px',
                border: `1.5px solid ${SAGE_LIGHT}`, background: 'transparent',
                color: TEXT_MED, cursor: 'pointer', borderRadius: 4,
              }}
            >
              Log out
            </button>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 28, flexWrap: 'wrap' }}>
          <Stat label="Total Guests" value={totalGuests} accent />
          <Stat label="Adults" value={attending.reduce((s,r) => s + (r.adult_count ?? r.guest_count), 0)} />
          <Stat label="Children" value={attending.reduce((s,r) => s + (r.child_count ?? 0), 0)} />
          <Stat label="Attending" value={attending.length} />
          <Stat label="Declined" value={declined.length} />
        </div>

        {/* Table card */}
        <div style={{
          background: CREAM,
          borderRadius: 12,
          border: `1.5px solid ${SAGE_LIGHT}`,
          boxShadow: '0 4px 24px rgba(45,58,40,0.08)',
          overflow: 'hidden',
        }}>
          {loading ? (
            <div style={{ padding: 48, textAlign: 'center', color: TEXT_MED, fontSize: 16 }}>
              Loading RSVPs…
            </div>
          ) : rsvps.length === 0 ? (
            <div style={{ padding: 48, textAlign: 'center', color: TEXT_MED, fontSize: 16, fontStyle: 'italic' }}>
              No RSVPs yet — share that link! 🍊
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 15 }}>
                <thead>
                  <tr style={{ background: SAGE_BG, borderBottom: `1.5px solid ${SAGE_LIGHT}` }}>
                    {COL_LABELS.map(col => (
                      <th
                        key={col.key}
                        onClick={() => handleSort(col.key)}
                        style={{
                          fontFamily: "'Cormorant Garamond', serif",
                          fontSize: 11, fontWeight: 700, letterSpacing: '1.5px',
                          textTransform: 'uppercase', color: TEXT_MED,
                          padding: '12px 14px', textAlign: 'left',
                          cursor: 'pointer', userSelect: 'none',
                          width: col.width,
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {col.label} {arrow(col.key)}
                      </th>
                    ))}
                    <th style={{ width: '7%', padding: '12px 14px' }} />
                  </tr>
                </thead>
                <tbody>
                  {sorted.map((r, i) => (
                    <tr
                      key={r.id}
                      style={{
                        background: i % 2 === 0 ? 'white' : '#FAFAF8',
                        borderBottom: `1px solid ${SAGE_LIGHT}`,
                        transition: 'background 0.15s',
                      }}
                    >
                      <td style={{ padding: '12px 14px', color: TEXT_DARK, fontWeight: 500 }}>
                        {r.name}
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <span style={{
                          display: 'inline-block',
                          padding: '3px 10px',
                          borderRadius: 20,
                          fontSize: 12,
                          fontWeight: 600,
                          letterSpacing: '0.5px',
                          background: r.status === 'attending' ? '#EAF4E8' : '#F5E8E8',
                          color: r.status === 'attending' ? '#3A7A34' : '#A03030',
                        }}>
                          {r.status === 'attending' ? 'Attending' : 'Declined'}
                        </span>
                      </td>
                      <td style={{ padding: '12px 14px', color: TEXT_DARK, textAlign: 'center' }}>
                        {r.status === 'attending' ? (r.adult_count ?? r.guest_count) : '—'}
                      </td>
                      <td style={{ padding: '12px 14px', color: TEXT_DARK, textAlign: 'center' }}>
                        {r.status === 'attending' ? (r.child_count ?? 0) : '—'}
                      </td>
                      <td style={{ padding: '12px 14px', color: TEXT_MED, fontSize: 13 }}>
                        {r.email || <span style={{ opacity: 0.4 }}>—</span>}
                      </td>
                      <td style={{ padding: '12px 14px', color: TEXT_MED, fontStyle: r.note ? 'normal' : 'italic', fontSize: 14 }}>
                        {r.note || <span style={{ opacity: 0.4 }}>—</span>}
                      </td>
                      <td style={{ padding: '12px 14px', color: TEXT_MED, fontSize: 13, whiteSpace: 'nowrap' }}>
                        {new Date(r.created_at).toLocaleDateString('en-US', {
                          month: 'short', day: 'numeric',
                        })}{' '}
                        <span style={{ opacity: 0.6 }}>
                          {new Date(r.created_at).toLocaleTimeString('en-US', {
                            hour: 'numeric', minute: '2-digit',
                          })}
                        </span>
                      </td>
                      <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                        <button
                          onClick={() => handleDelete(r.id, r.name)}
                          style={{
                            background: 'none', border: 'none',
                            cursor: 'pointer', color: '#A03030',
                            fontSize: 15, opacity: 0.6,
                            padding: '2px 6px', borderRadius: 4,
                            transition: 'opacity 0.15s',
                          }}
                          onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
                          onMouseLeave={e => (e.currentTarget.style.opacity = '0.6')}
                          title="Delete"
                        >
                          ✕
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <p style={{
          textAlign: 'center', marginTop: 20,
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 13, color: SAGE, fontStyle: 'italic',
        }}>
          Table updates in real-time ✦
        </p>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        button:hover { opacity: 0.85; }
      `}</style>
    </div>
  )
}
