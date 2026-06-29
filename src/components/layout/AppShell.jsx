import { SiteFooter } from './SiteFooter'
import { SiteHeader } from './SiteHeader'

export function AppShell({ currentPath, onNavigate, children }) {
  return (
    <div className="page-shell">
      <SiteHeader currentPath={currentPath} onNavigate={onNavigate} />
      <main>{children}</main>
      <SiteFooter currentPath={currentPath} onNavigate={onNavigate} />
    </div>
  )
}
