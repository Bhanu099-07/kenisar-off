import { useState } from 'react'
import { useAuth } from '../auth/useAuth'
import { navigation } from '../../data/content'
import { AppLink } from '../ui/AppLink'
import { Brand } from '../ui/Brand'
import { Button } from '../ui/Button'

export function SiteHeader({ currentPath, onNavigate }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const { role, signOut, user } = useAuth()

  function closeMenu() {
    setMenuOpen(false)
  }

  async function handleSignOut() {
    await signOut()
    closeMenu()
    onNavigate('/')
  }

  const isOrganizationPath =
    currentPath === '/partners' ||
    currentPath === '/auth/organization' ||
    currentPath === '/dashboard/organization' ||
    currentPath === '/profile/organization' ||
    currentPath === '/opportunities/new' ||
    currentPath === '/opportunities/manage'

  const primaryHref = user
    ? role === 'organization'
      ? '/dashboard/organization'
      : '/dashboard/student'
    : isOrganizationPath
      ? '/auth/organization'
      : '/auth/student'

  const primaryLabel = user ? 'Dashboard' : isOrganizationPath ? 'Create organization account' : 'Create student profile'

  return (
    <header className={`site-header ${menuOpen ? 'site-header--menu-open' : ''}`}>
      <AppLink href="/" onNavigate={onNavigate} currentPath={currentPath} className="brand-link" onClick={closeMenu}>
        <Brand compact />
      </AppLink>

      <button
        type="button"
        className="menu-toggle"
        aria-expanded={menuOpen}
        aria-controls="site-nav"
        onClick={() => setMenuOpen((current) => !current)}
      >
        Menu
      </button>

      <nav id="site-nav" className={`site-nav ${menuOpen ? 'site-nav--open' : ''}`} aria-label="Primary">
        {navigation.map((item) => (
          <AppLink
            key={item.href}
            href={item.href}
            onNavigate={onNavigate}
            currentPath={currentPath}
            onClick={closeMenu}
          >
            {item.label}
          </AppLink>
        ))}
      </nav>

      <div className="header-cta">
        <div className="header-cta__row">
          <Button href={primaryHref} onNavigate={onNavigate} currentPath={currentPath} onClick={closeMenu}>
            {primaryLabel}
          </Button>
          {user ? (
            <button type="button" className="header-link-action" onClick={handleSignOut}>
              Sign out
            </button>
          ) : null}
        </div>
      </div>
    </header>
  )
}
