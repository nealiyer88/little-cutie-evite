'use client'

import { useState } from 'react'

const SAGE = '#8B9E82'
const SAGE_LIGHT = '#C5D1BF'
const SAGE_BG = '#D4DDD0'
const CREAM = '#FDFBF7'
const TEXT_DARK = '#2D3A28'
const TEXT_MED = '#4A5A42'

export default function LoginForm() {
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!password.trim()) return
    setLoading(true)
    setError(null)

    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })

    if (res.ok) {
      window.location.href = '/admin'
    } else {
      setError('Incorrect password.')
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: `linear-gradient(145deg, ${SAGE_BG}, #C5D1BF, ${SAGE_BG})`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px 16px',
      fontFamily: "'Cormorant Garamond', Georgia, serif",
    }}>
      <div style={{
        background: CREAM,
        borderRadius: 12,
        padding: '40px 32px',
        maxWidth: 360,
        width: '100%',
        boxShadow: '0 8px 40px rgba(45,58,40,0.12)',
        border: `2px solid ${SAGE_LIGHT}`,
        textAlign: 'center',
      }}>
        <p style={{ fontSize: 28, marginBottom: 6 }}>🍊</p>
        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 22, fontWeight: 700, color: TEXT_DARK, marginBottom: 6,
        }}>
          Admin
        </h1>
        <p style={{ fontSize: 14, color: TEXT_MED, marginBottom: 28, letterSpacing: '0.5px' }}>
          Olivia&apos;s Birthday — RSVP Dashboard
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => { setPassword(e.target.value); setError(null) }}
            autoFocus
            style={{
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
              textAlign: 'center',
            }}
          />

          {error && (
            <p style={{ fontSize: 14, color: '#C0392B', marginBottom: 10 }}>{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || !password.trim()}
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 14, fontWeight: 600, letterSpacing: '2px',
              textTransform: 'uppercase', padding: '12px 32px',
              border: 'none', background: TEXT_DARK, color: CREAM,
              cursor: (loading || !password.trim()) ? 'not-allowed' : 'pointer',
              borderRadius: 4,
              opacity: (loading || !password.trim()) ? 0.5 : 1,
              width: '100%',
              transition: 'opacity 0.2s',
            }}
          >
            {loading ? 'Entering…' : 'Enter'}
          </button>
        </form>
      </div>

      <style>{`
        input:focus { border-color: ${SAGE} !important; outline: none; }
        * { margin: 0; padding: 0; box-sizing: border-box; }
      `}</style>
    </div>
  )
}
