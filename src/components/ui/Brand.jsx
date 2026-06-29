export function BrandMark() {
  return (
    <svg viewBox="0 0 72 72" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" transform="translate(4 5)">
        <path strokeWidth="2.6" d="M13 18.2 32 9.8l19 8.4-19 8.5-19-8.5Z" />
        <path strokeWidth="2.6" d="M20.3 25.4c3.1 1.6 7.3 2.5 11.7 2.5s8.6-.9 11.7-2.5" />
        <path strokeWidth="2.6" d="M49.4 18.4v9.4" />
        <path strokeWidth="2.35" d="M49.4 27.8c0 1-.7 1.8-1.6 1.8s-1.6-.8-1.6-1.8.7-1.8 1.6-1.8 1.6.8 1.6 1.8Z" />
        <path
          strokeWidth="2.6"
          d="M19.8 31.5c0-8.2 5.5-13.7 12.2-13.7s12.2 5.5 12.2 13.7c0 7.6-4.8 13.5-12.2 13.5s-12.2-5.9-12.2-13.5Z"
        />
        <circle cx="19.5" cy="24.6" r="3.9" fill="currentColor" fillOpacity="0.08" strokeWidth="2.15" />
        <circle cx="44.5" cy="24.6" r="3.9" fill="currentColor" fillOpacity="0.08" strokeWidth="2.15" />
        <path strokeWidth="2.1" d="M25.8 32c1.1-1.8 2.8-2.7 4.9-2.7" />
        <path strokeWidth="2.1" d="M38.2 32c-1.1-1.8-2.8-2.7-4.9-2.7" />
        <path strokeWidth="2.1" d="M29.4 36.6c.8-.8 1.7-1.2 2.6-1.2.9 0 1.8.4 2.6 1.2" />
        <path strokeWidth="2.1" d="M30.7 39c.4.7.8 1 1.3 1 .5 0 .9-.3 1.3-1" />
        <circle cx="25.4" cy="37.8" r="2.35" fill="currentColor" fillOpacity="0.16" stroke="none" />
        <circle cx="38.6" cy="37.8" r="2.35" fill="currentColor" fillOpacity="0.16" stroke="none" />
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
