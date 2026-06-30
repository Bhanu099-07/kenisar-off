export function StatusBadge({ status }) {
  const label = status ? status.replace('_', ' ') : 'unknown'

  return <span className={`status-badge status-badge--${status ?? 'unknown'}`}>{label}</span>
}
