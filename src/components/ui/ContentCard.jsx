export function ContentCard({ title, description, variant = 'default', stepNumber }) {
  return (
    <article className={`content-card ${variant === 'light' ? 'content-card--light' : ''}`}>
      {stepNumber ? <span className="step-number">{stepNumber}</span> : null}
      <h2>{title}</h2>
      <p>{description}</p>
    </article>
  )
}
