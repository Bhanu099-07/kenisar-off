export function AppLink({ href, children, className, onNavigate, currentPath, onClick }) {
  const path = href.split('#')[0]
  const isActive = path === currentPath

  function handleClick(event) {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return
    }

    event.preventDefault()
    onClick?.()
    onNavigate(href)
  }

  return (
    <a
      href={href}
      onClick={handleClick}
      className={`${className ?? ''} ${isActive ? 'is-active' : ''}`.trim()}
      aria-current={isActive ? 'page' : undefined}
    >
      {children}
    </a>
  )
}
