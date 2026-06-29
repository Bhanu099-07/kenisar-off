export function BrandMark() {
  return (
    <svg viewBox="0 0 64 64" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        <path strokeWidth="2.5" d="M13 18.2 32 9.8l19 8.4-19 8.5-19-8.5Z" />
        <path strokeWidth="2.5" d="M20.2 25.3c3.1 1.6 7.3 2.6 11.8 2.6 4.4 0 8.6-1 11.8-2.6" />
        <path strokeWidth="2.5" d="M49.4 18.3v9.1" />
        <path strokeWidth="2.3" d="M49.4 27.4c0 1.1-.7 1.9-1.6 1.9s-1.6-.8-1.6-1.9.7-1.9 1.6-1.9 1.6.8 1.6 1.9Z" />
        <path
          strokeWidth="2.5"
          d="M20 31.2c0-8 5.4-13.4 12-13.4s12 5.4 12 13.4c0 7.4-4.7 13.2-12 13.2s-12-5.8-12-13.2Z"
        />
        <circle cx="19.3" cy="24.5" r="3.7" fill="currentColor" fillOpacity="0.1" strokeWidth="2.2" />
        <circle cx="44.7" cy="24.5" r="3.7" fill="currentColor" fillOpacity="0.1" strokeWidth="2.2" />
        <path strokeWidth="2.2" d="M25.8 31.9c1.1-1.7 2.7-2.6 4.8-2.6" />
        <path strokeWidth="2.2" d="M38.2 31.9c-1.1-1.7-2.7-2.6-4.8-2.6" />
        <path strokeWidth="2.2" d="M29.5 36.4c.7-.8 1.6-1.2 2.5-1.2.9 0 1.8.4 2.5 1.2" />
        <path strokeWidth="2.2" d="M30.6 38.7c.5.7.9 1 1.4 1 .5 0 .9-.3 1.4-1" />
        <circle cx="25.3" cy="37.5" r="2.2" fill="currentColor" fillOpacity="0.18" stroke="none" />
        <circle cx="38.7" cy="37.5" r="2.2" fill="currentColor" fillOpacity="0.18" stroke="none" />
      </g>
    </svg>
  )
}

export function Brand({ compact = false }) {
  return (
    <span className={`brand ${compact ? 'brand--compact' : ''}`}>
      <span className="brand-mark-shell">
        <span className="brand-mark">
          <BrandMark />
        </span>
      </span>
      <span className="brand-copy">
        <span className="brand-wordmark">KENISAR</span>
        {!compact ? <span className="brand-subline">Student opportunities platform</span> : null}
      </span>
    </span>
  )
}
