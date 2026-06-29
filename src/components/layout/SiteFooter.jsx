import { AppLink } from '../ui/AppLink'
import { Brand } from '../ui/Brand'

export function SiteFooter({ currentPath, onNavigate }) {
  return (
    <footer className="site-footer">
      <div className="footer-brand">
        <Brand />
        <p>
          Kenisar helps high school, college, and university students find real-world experience through internships,
          volunteering, mentorship, and more.
        </p>
      </div>

      <div className="footer-column">
        <h3>About</h3>
        <AppLink href="/about" onNavigate={onNavigate} currentPath={currentPath}>
          About Kenisar
        </AppLink>
        <AppLink href="/about#contact" onNavigate={onNavigate} currentPath={currentPath}>
          Contact
        </AppLink>
      </div>

      <div className="footer-column">
        <h3>For Students</h3>
        <AppLink href="/students" onNavigate={onNavigate} currentPath={currentPath}>
          Students
        </AppLink>
        <AppLink href="/apply" onNavigate={onNavigate} currentPath={currentPath}>
          Create student profile
        </AppLink>
        <AppLink href="/opportunities" onNavigate={onNavigate} currentPath={currentPath}>
          Opportunities
        </AppLink>
      </div>

      <div className="footer-column">
        <h3>For Partners</h3>
        <AppLink href="/partners" onNavigate={onNavigate} currentPath={currentPath}>
          Partner with Kenisar
        </AppLink>
      </div>

      <div className="footer-column">
        <h3>Status</h3>
        <p>Opportunities coming soon.</p>
        <p>We are building with students and organizations.</p>
      </div>
    </footer>
  )
}
