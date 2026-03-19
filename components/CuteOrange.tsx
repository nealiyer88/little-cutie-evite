// Pixel-matched to reference image:
// round peach body, two wide leaves, U-shaped eyes, U-shaped nose,
// soft cheeks with rosy dot, no stem.

type Props = {
  size?: number
  x?: number | string
  y?: number | string
  rotation?: number
  style?: React.CSSProperties
}

export default function CuteOrange({ size = 60, x, y, rotation = 0, style = {} }: Props) {
  return (
    <svg
      width={size}
      height={size * 1.16}
      viewBox="0 0 100 116"
      style={{ position: 'absolute', left: x, top: y, transform: `rotate(${rotation}deg)`, ...style }}
    >
      {/* ── Leaves ─────────────────────────────────────── */}
      <ellipse cx="35" cy="19" rx="17" ry="9" fill="#7A9070" transform="rotate(-40 35 19)" />
      <ellipse cx="65" cy="19" rx="17" ry="9" fill="#A0BA9A" transform="rotate(40 65 19)" />

      {/* ── Body ───────────────────────────────────────── */}
      <circle cx="50" cy="70" r="44" fill="#F0A272" />

      {/* ── Cheeks: soft circle + rosy red dot ─────────── */}
      <circle cx="24" cy="80" r="13" fill="#F9D0C8" opacity="0.75" />
      <circle cx="24" cy="80" r="6"  fill="#E87070" opacity="0.60" />

      <circle cx="76" cy="80" r="13" fill="#F9D0C8" opacity="0.75" />
      <circle cx="76" cy="80" r="6"  fill="#E87070" opacity="0.60" />

      {/* ── Eyes: U shapes (open at top, arc dips down) ── */}
      {/* Left eye */}
      <path
        d="M 31 62 Q 40 73 49 62"
        fill="none" stroke="#3A2818" strokeWidth="4" strokeLinecap="round"
      />
      {/* Right eye */}
      <path
        d="M 51 62 Q 60 73 69 62"
        fill="none" stroke="#3A2818" strokeWidth="4" strokeLinecap="round"
      />

      {/* ── Nose: small U shape centered below eyes ────── */}
      <path
        d="M 44 74 Q 50 81 56 74"
        fill="none" stroke="#3A2818" strokeWidth="3" strokeLinecap="round"
      />
    </svg>
  )
}
