import { SiteFooter } from './SiteFooter'
import { SiteHeader } from './SiteHeader'

export function AppShell({ currentPath, onNavigate, children }) {
  const shellClassName = currentPath === '/' ? 'page-shell page-shell--home' : 'page-shell'

  return (
    <div className={shellClassName}>
      <SiteHeader currentPath={currentPath} onNavigate={onNavigate} />
      <main>{children}</main>
      <SiteFooter currentPath={currentPath} onNavigate={onNavigate} />
    </div>
  )
}
