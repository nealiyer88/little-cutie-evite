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
      {/* Leaves */}
      <ellipse cx="35" cy="19" rx="17" ry="9" fill="#7A9070" transform="rotate(-40 35 19)" />
      <ellipse cx="65" cy="19" rx="17" ry="9" fill="#A0BA9A" transform="rotate(40 65 19)" />

      {/* Body */}
      <circle cx="50" cy="70" r="44" fill="#F0A272" />

      {/* Cheeks — single rosy dot, no halo */}
      <circle cx="23" cy="79" r="9" fill="#E87878" opacity="0.65" />
      <circle cx="77" cy="79" r="9" fill="#E87878" opacity="0.65" />

      {/* Eyes — small U arcs, well separated */}
      <path d="M 24 63 Q 32 72 40 63" fill="none" stroke="#3A2818" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M 60 63 Q 68 72 76 63" fill="none" stroke="#3A2818" strokeWidth="3.5" strokeLinecap="round" />

      {/* Nose — tiny U */}
      <path d="M 46 75 Q 50 80 54 75" fill="none" stroke="#3A2818" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  )
}
