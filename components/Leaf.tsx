const LEAF_GREEN = '#7A8E6F'
const SAGE_BG = '#D4DDD0'

type Props = {
  x?: number | string
  y?: number | string
  rotation?: number
  size?: number
  color?: string
}

export default function Leaf({ x, y, rotation = 0, size = 1, color = LEAF_GREEN }: Props) {
  return (
    <svg
      width={28 * size}
      height={14 * size}
      viewBox="0 0 28 14"
      style={{ position: 'absolute', left: x, top: y, transform: `rotate(${rotation}deg)`, opacity: 0.7 }}
    >
      <ellipse cx="14" cy="7" rx="12" ry="5" fill={color} />
      <line x1="4" y1="7" x2="24" y2="7" stroke={SAGE_BG} strokeWidth={0.8} opacity={0.5} />
    </svg>
  )
}
