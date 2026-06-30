import { useAuth } from '../auth/useAuth'
import { AppLink } from '../ui/AppLink'
import { Brand } from '../ui/Brand'
import { footerPolicyLinks } from '../../data/content'

export function SiteFooter({ currentPath, onNavigate }) {
  const { role, user } = useAuth()

  const footerSections = !user
    ? [
        {
          heading: 'Explore',
          links: [
            { href: '/about', label: 'About Kenisar' },
            { href: '/students', label: 'Students' },
            { href: '/partners', label: 'For Organizations' },
            { href: '/opportunities', label: 'Opportunities' },
          ],
        },
      ]
    : role === 'admin'
      ? [
          {
            heading: 'Admin',
            links: [
              { href: '/dashboard/admin', label: 'Admin Dashboard' },
              { href: '/admin', label: 'Review Listings' },
              { href: '/opportunities', label: 'Opportunities' },
            ],
          },
        ]
      : role === 'organization'
        ? [
            {
              heading: 'Organization',
              links: [
                { href: '/dashboard/organization', label: 'Dashboard' },
                { href: '/profile/organization', label: 'Organization Profile' },
                { href: '/opportunities/new', label: 'Create Opportunity' },
                { href: '/opportunities/manage', label: 'Manage Opportunities' },
                { href: '/opportunities/manage', label: 'Applicants' },
              ],
            },
          ]
        : [
            {
              heading: 'Student',
              links: [
                { href: '/dashboard/student', label: 'Dashboard' },
                { href: '/profile/student', label: 'Profile' },
                { href: '/opportunities', label: 'Opportunities' },
                { href: '/saved', label: 'Saved Opportunities' },
                { href: '/applications', label: 'Applications' },
              ],
            },
          ]

  return (
    <footer className="site-footer">
      <div className="footer-brand">
        <Brand />
        <p>
          Kenisar helps high school, college, and university students find real-world experience through internships,
          volunteering, mentorship, and more.
        </p>
      </div>

      {footerSections.map((section) => (
        <div key={section.heading} className="footer-column">
          <h3>{section.heading}</h3>
          {section.links.map((link) => (
            <AppLink key={link.href + link.label} href={link.href} onNavigate={onNavigate} currentPath={currentPath}>
              {link.label}
            </AppLink>
          ))}
        </div>
      ))}

      <div className="footer-column">
        <h3>Policies</h3>
        {footerPolicyLinks.map((link) => (
          <AppLink key={link.href} href={link.href} onNavigate={onNavigate} currentPath={currentPath}>
            {link.label}
          </AppLink>
        ))}
      </div>

      <div className="footer-column">
        <h3>Contact</h3>
        <AppLink href="/about#contact" onNavigate={onNavigate} currentPath={currentPath}>
          Contact
        </AppLink>
        <p>Contact details coming soon.</p>
        <p>We are building with students and organizations.</p>
      </div>
    </footer>
  )
}
