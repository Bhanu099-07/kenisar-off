import { useEffect, useState } from 'react'
import { OpportunitySummaryCard } from '../components/opportunities/OpportunitySummaryCard'
import { Button } from '../components/ui/Button'
import { PageHero } from '../components/ui/PageHero'
import { SectionLabel } from '../components/ui/SectionLabel'
import { formatOpportunityStatus } from '../lib/opportunityPresentation'
import { getPublicOrganizationProfileById } from '../lib/kenisarApi'

export function OrganizationPublicPage({ currentPath, onNavigate, organizationId }) {
  const [profile, setProfile] = useState(null)
  const [opportunities, setOpportunities] = useState([])
  const [status, setStatus] = useState('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    let isMounted = true

    async function load() {
      setStatus('loading')
      setMessage('')

      try {
        const result = await getPublicOrganizationProfileById(organizationId)

        if (!isMounted) return

        if (!result.profile) {
          setStatus('empty')
          return
        }

        setProfile(result.profile)
        setOpportunities(result.opportunities)
        setStatus('ready')
      } catch (error) {
        if (!isMounted) return
        setStatus('error')
        setMessage(error.message || 'Unable to load this organization.')
      }
    }

    load()

    return () => {
      isMounted = false
    }
  }, [organizationId])

  if (status === 'loading') {
    return (
      <div className="page">
        <PageHero
          label="Organization"
          title="Loading organization profile."
          description="Kenisar is gathering this organization's public information and approved opportunities."
          theme="partners"
        />
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="page">
        <PageHero
          label="Organization"
          title="We couldn't load this organization."
          description={message}
          theme="partners"
        />
      </div>
    )
  }

  if (status === 'empty' || !profile) {
    return (
      <div className="page">
        <PageHero
          label="Organization"
          title="This organization profile is not available."
          description="Public organization pages appear when an organization has approved opportunities available through Kenisar."
          theme="partners"
        />
      </div>
    )
  }

  return (
    <div className="page">
      <PageHero
        label="Organization"
        title={profile.organization_name || 'Organization profile'}
        description={
          profile.description?.trim() ||
          'This organization uses Kenisar to share beginner-friendly opportunities for students.'
        }
        theme="partners"
      />

      <section className="section section--narrow" data-reveal="section">
        <div className="button-row">
          <Button href="/opportunities" onNavigate={onNavigate} currentPath={currentPath} variant="outline">
            Browse all opportunities
          </Button>
          <Button href="/partners" onNavigate={onNavigate} currentPath={currentPath}>
            For organizations
          </Button>
        </div>
      </section>

      <section className="section" data-reveal="section">
        <div className="page-cluster page-cluster--opportunities">
          <div className="content-card content-card--light organization-profile-card" data-reveal="card" data-tilt>
            <SectionLabel>Organization overview</SectionLabel>
            <h2>{profile.organization_name || 'Organization name pending'}</h2>
            <ul className="detail-list detail-list--plain">
              <li>{profile.organization_type || 'Organization type not specified'}</li>
              <li>{profile.city || 'Location not specified'}</li>
              {profile.website ? (
                <li>
                  <a href={profile.website} target="_blank" rel="noopener noreferrer">
                    Visit organization website
                  </a>
                </li>
              ) : null}
            </ul>
            <p>
              {profile.description?.trim() ||
                'This organization has not shared additional public background details yet.'}
            </p>
          </div>

          <aside className="content-card content-card--light content-card--support" data-reveal="card" data-tilt>
            <SectionLabel>Trust note</SectionLabel>
            <h2>Reviewed before public visibility.</h2>
            <p>Opportunities from this organization are reviewed before appearing publicly.</p>
            <div className="tag-list tag-list--dense">
              <span className="tag-pill tag-pill--dark">Approved listings only</span>
              <span className="tag-pill tag-pill--dark">{opportunities.length} public opportunities</span>
            </div>
          </aside>
        </div>
      </section>

      <section className="section" data-reveal="section">
        <SectionLabel>Approved opportunities</SectionLabel>
        <div className="dashboard-stack">
          {opportunities.length > 0 ? (
            opportunities.map((item) => (
              <OpportunitySummaryCard
                key={item.id}
                item={item}
                currentPath={currentPath}
                onNavigate={onNavigate}
                opportunityHref={`/opportunities/${item.id}`}
                secondaryMeta={[`Status ${formatOpportunityStatus(item.status)}`]}
              >
                <Button href={`/opportunities/${item.id}`} onNavigate={onNavigate} currentPath={currentPath}>
                  View opportunity
                </Button>
              </OpportunitySummaryCard>
            ))
          ) : (
            <div className="empty-state-card" data-tilt>
              <h2>No approved opportunities yet.</h2>
              <p>This organization does not have a public opportunity available right now.</p>
              <div className="button-row">
                <Button href="/opportunities" onNavigate={onNavigate} currentPath={currentPath}>
                  Browse other opportunities
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
