/**
 * Illustrated stand-in for the hero photo, shown only when
 * candidate.profile_photo_url is empty. Original vector art (no real
 * photo, no real people) in the brand colors — replace it the moment
 * a real campaign photo is uploaded via Admin → Candidate.
 */
export function HeroPlaceholder({ label }: { label: string }) {
  return (
    <svg
      viewBox="0 0 400 300"
      xmlns="http://www.w3.org/2000/svg"
      className="h-full w-full"
      role="img"
      aria-label={label}
    >
      <defs>
        <linearGradient id="heroBg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#003491" />
          <stop offset="100%" stopColor="#00205A" />
        </linearGradient>
      </defs>
      <rect width="400" height="300" fill="url(#heroBg)" />

      {/* Diagonal red accent band */}
      <polygon points="400,0 400,90 0,180 0,120" fill="#F0181E" opacity="0.9" />

      {/* Simple crowd silhouette, arms raised — abstract, not a real photo */}
      {[60, 120, 180, 240, 300, 340].map((x, i) => (
        <g key={x} opacity={0.85 - (i % 2) * 0.15}>
          <circle cx={x} cy={205} r={14} fill="#FFFFFF" fillOpacity={0.25} />
          <path
            d={`M ${x - 16} 260 Q ${x - 16} 215 ${x} 215 Q ${x + 16} 215 ${x + 16} 260 Z`}
            fill="#FFFFFF"
            fillOpacity={0.25}
          />
          <line x1={x - 14} y1={222} x2={x - 26} y2={195} stroke="#FFFFFF" strokeOpacity={0.25} strokeWidth={6} strokeLinecap="round" />
          <line x1={x + 14} y1={222} x2={x + 26} y2={195} stroke="#FFFFFF" strokeOpacity={0.25} strokeWidth={6} strokeLinecap="round" />
        </g>
      ))}

      {/* Flag */}
      <line x1="200" y1="60" x2="200" y2="150" stroke="#FFFFFF" strokeWidth={3} />
      <path d="M 200 62 L 250 75 L 200 90 Z" fill="#FFFFFF" />

      <text
        x="200"
        y="45"
        textAnchor="middle"
        fill="#FFFFFF"
        fontSize="20"
        fontWeight="800"
        fontFamily="Barlow Condensed, sans-serif"
        letterSpacing="1"
      >
        {label}
      </text>
    </svg>
  );
}
