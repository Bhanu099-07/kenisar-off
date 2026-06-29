export function SectionLabel({ children, centered = false }) {
  return <p className={`section-label ${centered ? 'section-label--centered' : ''}`}>{children}</p>
}
