import { useEffect, useState } from 'react'
import { OpportunitySummaryCard } from '../components/opportunities/OpportunitySummaryCard'
import { useAuth } from '../components/auth/useAuth'
import { Button } from '../components/ui/Button'
import { PageHero } from '../components/ui/PageHero'
import { SectionLabel } from '../components/ui/SectionLabel'
import { StatusBadge } from '../components/ui/StatusBadge'
import { formatDateLabel } from '../lib/opportunityPresentation'
import { getStudentApplications } from '../lib/kenisarApi'

function ApplicationMeta({ item }) {
  return (
    <div className="application-meta-row">
      <StatusBadge status={item.action_type} />
      <StatusBadge status={item.status} />
      <span className="application-meta-row__date">Submitted {formatDateLabel(item.created_at)}</span>
    </div>
  )
}

export function ApplicationsPage({ currentPath, onNavigate }) {
  const { user } = useAuth()
  const [applications, setApplications] = useState([])
  const [status, setStatus] = useState('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!user) return

    let isMounted = true

    async function load() {
      setStatus('loading')
      setMessage('')

      try {
        const data = await getStudentApplications(user.id)
        if (!isMounted) return
        setApplications(data)
        setStatus('ready')
      } catch (error) {
        if (!isMounted) return
        setStatus('error')
        setMessage(error.message || 'Unable to load your applications.')
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
          label="Applications"
          title="Loading your opportunity activity."
          description="Kenisar is gathering the opportunities where you already applied or showed interest."
          theme="students"
        />
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="page">
        <PageHero
          label="Applications"
          title="We couldn't load your opportunity activity."
          description={message}
          theme="students"
        />
      </div>
    )
  }

  return (
    <div className="page">
      <PageHero
        label="Applications"
        title="Track where you have already taken action."
        description="Kenisar keeps your submitted interest in one place so you can see what you applied to and what still needs follow-up."
        theme="students"
      />

      <section className="section section--narrow" data-reveal="section">
        <div className="button-row">
          <Button href="/dashboard/student" onNavigate={onNavigate} currentPath={currentPath} variant="outline">
            Back to dashboard
          </Button>
          <Button href="/opportunities" onNavigate={onNavigate} currentPath={currentPath}>
            Browse opportunities
          </Button>
        </div>
      </section>

      <section className="section" data-reveal="section">
        <SectionLabel>Your activity</SectionLabel>
        {message ? (
          <div className="form-status form-status--error" role="alert">
            <p>{message}</p>
          </div>
        ) : null}

        <div className="dashboard-stack">
          {applications.length > 0 ? (
            applications.map((entry) => (
              <OpportunitySummaryCard
                key={entry.id}
                item={entry.opportunities}
                currentPath={currentPath}
                onNavigate={onNavigate}
                opportunityHref={`/opportunities/${entry.opportunity_id}`}
                organizationHref={
                  entry.opportunities?.organization_id ? `/organizations/${entry.opportunities.organization_id}` : null
                }
                secondaryMeta={[`Updated ${formatDateLabel(entry.updated_at || entry.created_at)}`]}
              >
                <ApplicationMeta item={entry} />
                <Button href={`/opportunities/${entry.opportunity_id}`} onNavigate={onNavigate} currentPath={currentPath}>
                  View opportunity
                </Button>
              </OpportunitySummaryCard>
            ))
          ) : (
            <div className="empty-state-card" data-tilt>
              <h2>No applications yet.</h2>
              <p>When you apply or show interest in an opportunity, it will appear here.</p>
              <div className="button-row">
                <Button href="/opportunities" onNavigate={onNavigate} currentPath={currentPath}>
                  Browse opportunities
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
