import { useState } from 'react'
import { useAuth } from '../auth/useAuth'
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

  const navItems = user
    ? role === 'admin'
      ? [
          { href: '/opportunities', label: 'Opportunities' },
          { href: '/dashboard/admin', label: 'Admin Dashboard' },
          { href: '/admin', label: 'Review Listings' },
        ]
      : role === 'organization'
        ? [
            { href: '/opportunities', label: 'Opportunities' },
            { href: '/dashboard/organization', label: 'Dashboard' },
            { href: '/opportunities/manage', label: 'Manage Opportunities' },
            { href: '/opportunities/new', label: 'Create Opportunity' },
            { href: '/profile/organization', label: 'Profile' },
          ]
        : [
            { href: '/opportunities', label: 'Opportunities' },
            { href: '/dashboard/student', label: 'Dashboard' },
            { href: '/profile/student', label: 'Profile' },
          ]
    : [
        { href: '/opportunities', label: 'Opportunities' },
        { href: '/partners', label: 'For Organizations' },
      ]

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
        {navItems.map((item) => (
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
          {!user ? (
            <Button href="/auth" onNavigate={onNavigate} currentPath={currentPath} onClick={closeMenu}>
              Sign Up / Log In
            </Button>
          ) : null}
          {user ? (
            <button type="button" className="header-link-action" onClick={handleSignOut}>
              Log Out
            </button>
          ) : null}
        </div>
      </div>
    </header>
  )
}
