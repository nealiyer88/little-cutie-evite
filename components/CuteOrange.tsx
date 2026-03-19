// Simple decorative orange for RSVP page — same palette, no fuss

type Props = {
  size?: number
  x?: number | string
  y?: number | string
  rotation?: number
  style?: React.CSSProperties
}

export default function CuteOrange({ size = 60, x, y, rotation = 0, style = {} }: Props) {
  const cx = size / 2
  const cy = size / 2 + size * 0.12
  const r  = size * 0.42

  return (
    <svg
      width={size}
      height={size * 1.18}
      viewBox={`0 0 ${size} ${size * 1.18}`}
      style={{ position: 'absolute', left: x, top: y, transform: `rotate(${rotation}deg)`, ...style }}
    >
      {/* Left leaf */}
      <ellipse
        cx={cx - size * 0.1} cy={size * 0.1}
        rx={size * 0.14} ry={size * 0.08}
        fill="#7A9070"
        transform={`rotate(-35 ${cx - size * 0.1} ${size * 0.1})`}
      />
      {/* Right leaf */}
      <ellipse
        cx={cx + size * 0.1} cy={size * 0.08}
        rx={size * 0.13} ry={size * 0.07}
        fill="#9DB59D"
        transform={`rotate(35 ${cx + size * 0.1} ${size * 0.08})`}
      />

      {/* Body */}
      <circle cx={cx} cy={cy} r={r} fill="#F0A272" />

      {/* Cheeks */}
      <circle cx={cx - r * 0.52} cy={cy + r * 0.18} r={r * 0.18} fill="#E87878" opacity={0.6} />
      <circle cx={cx + r * 0.52} cy={cy + r * 0.18} r={r * 0.18} fill="#E87878" opacity={0.6} />

      {/* Eyes — two simple dots */}
      <circle cx={cx - r * 0.32} cy={cy - r * 0.12} r={r * 0.07} fill="#3A2818" />
      <circle cx={cx + r * 0.32} cy={cy - r * 0.12} r={r * 0.07} fill="#3A2818" />

      {/* Smile */}
      <path
        d={`M ${cx - r * 0.22} ${cy + r * 0.18} Q ${cx} ${cy + r * 0.38} ${cx + r * 0.22} ${cy + r * 0.18}`}
        fill="none" stroke="#3A2818" strokeWidth={r * 0.09} strokeLinecap="round"
      />
    </svg>
  )
}
