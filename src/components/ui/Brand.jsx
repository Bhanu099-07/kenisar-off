export function BrandMark() {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2">
        <path d="M10 18.5 31.8 8.2l22.2 10.3-22.2 10.2L10 18.5Z" />
        <path d="M21.4 24.1c2.8 1.5 6.5 2.4 10.4 2.4 4 0 7.8-.9 10.7-2.5" />
        <path d="M18.1 25.8v8c0 9 6.2 15.9 13.9 15.9s13.9-6.9 13.9-15.9v-8" />
        <path d="M54 18.4v8.8" />
        <path d="M54 27.2c0 1.3-.8 2.2-1.8 2.2s-1.8-.9-1.8-2.2.8-2.1 1.8-2.1 1.8.8 1.8 2.1Z" />
        <circle cx="18.4" cy="24.3" r="3.1" />
        <circle cx="45.6" cy="24.3" r="3.1" />
        <path d="M20.6 38.3c1-5.6 5.3-9.3 11.4-9.3 6 0 10.4 3.7 11.4 9.3" />
        <path d="M24.9 34.4c1.1-1.5 2.5-2.2 4.3-2.2" />
        <path d="M39.1 34.4c-1.1-1.5-2.5-2.2-4.3-2.2" />
        <circle cx="24.6" cy="40.2" r="2.1" fill="currentColor" stroke="none" />
        <circle cx="39.4" cy="40.2" r="2.1" fill="currentColor" stroke="none" />
        <path d="M29.2 38.9c.7-.8 1.6-1.2 2.8-1.2 1.2 0 2.1.4 2.8 1.2" />
        <path d="M30.4 41.3c.5.7 1 1 1.6 1 .6 0 1.1-.3 1.6-1" />
      </g>
    </svg>
  )
}

export function Brand({ compact = false }) {
  return (
    <span className={`brand ${compact ? 'brand--compact' : ''}`}>
      <span className="brand-mark">
        <BrandMark />
      </span>
      <span className="brand-copy">
        <span className="brand-wordmark">KENISAR</span>
        {!compact ? <span className="brand-subline">Student opportunities platform</span> : null}
      </span>
    </span>
  )
}
