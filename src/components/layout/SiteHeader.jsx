import { useState } from 'react'
import { navigation } from '../../data/content'
import { AppLink } from '../ui/AppLink'
import { Brand } from '../ui/Brand'
import { Button } from '../ui/Button'

export function SiteHeader({ currentPath, onNavigate }) {
  const [menuOpen, setMenuOpen] = useState(false)

  function closeMenu() {
    setMenuOpen(false)
  }

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
        <Button href="/apply" onNavigate={onNavigate} currentPath={currentPath} onClick={closeMenu}>
          Create student profile
        </Button>
      </div>
    </header>
  )
}
