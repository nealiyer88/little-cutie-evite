const ORANGE_MAIN = '#E8914F'
const ORANGE_DARK = '#D4793A'
const ORANGE_CHEEK = '#F2A66A'
const LEAF_GREEN = '#7A8E6F'
const SAGE = '#8B9E82'
const TEXT_DARK = '#2D3A28'

type Props = {
  size?: number
  x?: number | string
  y?: number | string
  rotation?: number
  style?: React.CSSProperties
}

export default function CuteOrange({ size = 60, x, y, rotation = 0, style = {} }: Props) {
  const r = size / 2
  const leafH = size * 0.3

  return (
    <svg
      width={size * 1.2}
      height={size * 1.4}
      viewBox={`0 0 ${size * 1.2} ${size * 1.4}`}
      style={{ position: 'absolute', left: x, top: y, transform: `rotate(${rotation}deg)`, ...style }}
    >
      {/* stem */}
      <line
        x1={size * 0.6} y1={leafH + 2}
        x2={size * 0.6} y2={leafH + size * 0.15}
        stroke={LEAF_GREEN} strokeWidth={2.5} strokeLinecap="round"
      />
      {/* leaf left */}
      <ellipse
        cx={size * 0.45} cy={leafH * 0.6}
        rx={size * 0.14} ry={size * 0.08}
        fill={LEAF_GREEN}
        transform={`rotate(-30 ${size * 0.45} ${leafH * 0.6})`}
      />
      {/* leaf right */}
      <ellipse
        cx={size * 0.75} cy={leafH * 0.5}
        rx={size * 0.12} ry={size * 0.07}
        fill={SAGE}
        transform={`rotate(25 ${size * 0.75} ${leafH * 0.5})`}
      />
      {/* body */}
      <circle cx={size * 0.6} cy={leafH + r} r={r} fill={ORANGE_MAIN} />
      <circle cx={size * 0.6} cy={leafH + r} r={r * 0.92} fill="none" stroke={ORANGE_DARK} strokeWidth={1} opacity={0.3} />
      {/* cheeks */}
      <circle cx={size * 0.38} cy={leafH + r + size * 0.1} r={size * 0.08} fill={ORANGE_CHEEK} opacity={0.6} />
      <circle cx={size * 0.82} cy={leafH + r + size * 0.1} r={size * 0.08} fill={ORANGE_CHEEK} opacity={0.6} />
      {/* eyes */}
      <circle cx={size * 0.47} cy={leafH + r - size * 0.04} r={size * 0.035} fill={TEXT_DARK} />
      <circle cx={size * 0.73} cy={leafH + r - size * 0.04} r={size * 0.035} fill={TEXT_DARK} />
      {/* eye shine */}
      <circle cx={size * 0.48} cy={leafH + r - size * 0.06} r={size * 0.012} fill="white" />
      <circle cx={size * 0.74} cy={leafH + r - size * 0.06} r={size * 0.012} fill="white" />
      {/* smile */}
      <path
        d={`M ${size * 0.52} ${leafH + r + size * 0.06} Q ${size * 0.6} ${leafH + r + size * 0.14} ${size * 0.68} ${leafH + r + size * 0.06}`}
        fill="none" stroke={TEXT_DARK} strokeWidth={1.8} strokeLinecap="round"
      />
    </svg>
  )
}
