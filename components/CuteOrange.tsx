// Matches the reference: round body, two splayed leaves, closed sleepy eyes, rosy cheeks

type Props = {
  size?: number
  x?: number | string
  y?: number | string
  rotation?: number
  style?: React.CSSProperties
}

export default function CuteOrange({ size = 60, x, y, rotation = 0, style = {} }: Props) {
  const r = size / 2
  // Center of the orange body — pushed down to leave room for leaves
  const cx = size * 0.55
  const cy = size * 0.62 + r

  // Leaf bases sit just above the top of the circle
  const leafBaseY = cy - r + size * 0.04

  return (
    <svg
      width={size * 1.1}
      height={size * 1.35}
      viewBox={`0 0 ${size * 1.1} ${size * 1.35}`}
      style={{ position: 'absolute', left: x, top: y, transform: `rotate(${rotation}deg)`, ...style }}
    >
      {/* Left leaf */}
      <ellipse
        cx={cx - size * 0.13}
        cy={leafBaseY - size * 0.08}
        rx={size * 0.17}
        ry={size * 0.1}
        fill="#7A8E6F"
        transform={`rotate(-40 ${cx - size * 0.13} ${leafBaseY - size * 0.08})`}
      />
      {/* Right leaf */}
      <ellipse
        cx={cx + size * 0.13}
        cy={leafBaseY - size * 0.08}
        rx={size * 0.17}
        ry={size * 0.1}
        fill="#8B9E82"
        transform={`rotate(40 ${cx + size * 0.13} ${leafBaseY - size * 0.08})`}
      />

      {/* Orange body */}
      <circle cx={cx} cy={cy} r={r} fill="#E8914F" />

      {/* Subtle darker ring for depth */}
      <circle cx={cx} cy={cy} r={r * 0.93} fill="none" stroke="#D4793A" strokeWidth={1} opacity={0.18} />

      {/* Rosy cheeks */}
      <circle cx={cx - r * 0.44} cy={cy + r * 0.18} r={r * 0.26} fill="#F4A8A8" opacity={0.65} />
      <circle cx={cx + r * 0.44} cy={cy + r * 0.18} r={r * 0.26} fill="#F4A8A8" opacity={0.65} />

      {/* Eyes — closed sleepy arcs (∩ shaped) */}
      <path
        d={`M ${cx - r * 0.38} ${cy - r * 0.08}
            Q ${cx - r * 0.22} ${cy - r * 0.28}
              ${cx - r * 0.06} ${cy - r * 0.08}`}
        fill="none"
        stroke="#3A2A1A"
        strokeWidth={size * 0.045}
        strokeLinecap="round"
      />
      <path
        d={`M ${cx + r * 0.06} ${cy - r * 0.08}
            Q ${cx + r * 0.22} ${cy - r * 0.28}
              ${cx + r * 0.38} ${cy - r * 0.08}`}
        fill="none"
        stroke="#3A2A1A"
        strokeWidth={size * 0.045}
        strokeLinecap="round"
      />
    </svg>
  )
}
