import { useEffect, useState } from 'react'
import { useAuth } from '../components/auth/useAuth'
import { Button } from '../components/ui/Button'
import { PageHero } from '../components/ui/PageHero'
import { SectionLabel } from '../components/ui/SectionLabel'
import { StatusBadge } from '../components/ui/StatusBadge'
import { getOrganizationOpportunities } from '../lib/kenisarApi'

export function OpportunityManagePage({ currentPath, onNavigate }) {
  const { user } = useAuth()
  const [opportunities, setOpportunities] = useState([])
  const [status, setStatus] = useState('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!user) return

    let isMounted = true

    async function load() {
      setStatus('loading')
      setMessage('')

      try {
        const data = await getOrganizationOpportunities(user.id)
        if (!isMounted) return
        setOpportunities(data)
        setStatus('ready')
      } catch (error) {
        if (!isMounted) return
        setStatus('error')
        setMessage(error.message || 'Unable to load your listings.')
      }
    }

    load()

    return () => {
      isMounted = false
    }
  }, [user])

  if (status === 'loading') {
    return (
      <div className="page">
        <PageHero
          label="Manage Listings"
          title="Loading your opportunity listings."
          description="Kenisar is gathering your drafts, pending reviews, and approved opportunities."
          theme="partners"
        />
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="page">
        <PageHero label="Manage Listings" title="We couldn't load your listings." description={message} theme="partners" />
      </div>
    )
  }

  return (
    <div className="page">
      <PageHero
        label="Manage Listings"
        title="Manage your opportunity listings."
        description="Track listing status, open drafts for editing, and keep submitted opportunities organized."
        theme="partners"
      />

      <section className="section" data-reveal="section">
        <div className="button-row">
          <Button href="/opportunities/new" onNavigate={onNavigate} currentPath={currentPath}>
            Create new listing
          </Button>
          <Button href="/dashboard/organization" onNavigate={onNavigate} currentPath={currentPath} variant="outline">
            Back to dashboard
          </Button>
        </div>
      </section>

      <section className="section" data-reveal="section">
        <SectionLabel>Your listings</SectionLabel>
        <div className="dashboard-stack">
          {opportunities.length > 0 ? (
            opportunities.map((opportunity) => (
              <article className="content-card content-card--light dashboard-record" key={opportunity.id} data-reveal="card" data-tilt>
                <div className="dashboard-record__header">
                  <div>
                    <h2>{opportunity.title}</h2>
                    <p>
                      {opportunity.opportunity_type} · {opportunity.location} · {opportunity.remote_or_in_person}
                    </p>
                  </div>
                  <StatusBadge status={opportunity.status} />
                </div>
                <p>{opportunity.description}</p>
                <div className="tag-list tag-list--dense">
                  <span className="tag-pill tag-pill--dark">{opportunity.commitment}</span>
                  {opportunity.deadline ? <span className="tag-pill tag-pill--dark">Deadline {opportunity.deadline}</span> : null}
                </div>
                <div className="button-row">
                  <Button
                    href={`/opportunities/new?id=${opportunity.id}`}
                    onNavigate={onNavigate}
                    currentPath={currentPath}
                    variant="accent"
                  >
                    Edit listing
                  </Button>
                </div>
              </article>
            ))
          ) : (
            <div className="empty-state-card" data-tilt>
              <h2>Create your first opportunity listing.</h2>
              <p>Drafts, pending listings, and approved opportunities will appear here once you start publishing.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
