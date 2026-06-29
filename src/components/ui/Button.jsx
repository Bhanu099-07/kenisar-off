import { AppLink } from './AppLink'
import { ArrowIcon } from './ArrowIcon'

export function Button({ href, children, onNavigate, currentPath, variant = 'filled', onClick, type, disabled }) {
  if (type === 'submit' || !href) {
    return (
      <button
        type={type ?? 'button'}
        className={`button button--${variant}`}
        onClick={onClick}
        disabled={disabled}
      >
        <span>{children}</span>
        {type === 'submit' ? <ArrowIcon /> : null}
      </button>
    )
  }

  return (
    <AppLink
      href={href}
      onNavigate={onNavigate}
      currentPath={currentPath}
      className={`button button--${variant}`}
      onClick={onClick}
    >
      <span>{children}</span>
      <ArrowIcon />
    </AppLink>
  )
}
