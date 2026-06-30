import { useEffect, useState } from 'react'
import { OpportunitySummaryCard } from '../components/opportunities/OpportunitySummaryCard'
import { useAuth } from '../components/auth/useAuth'
import { Button } from '../components/ui/Button'
import { PageHero } from '../components/ui/PageHero'
import { SectionLabel } from '../components/ui/SectionLabel'
import { formatDateLabel } from '../lib/opportunityPresentation'
import { getStudentSavedOpportunities, removeSavedOpportunity } from '../lib/kenisarApi'

export function SavedOpportunitiesPage({ currentPath, onNavigate }) {
  const { user } = useAuth()
  const [savedOpportunities, setSavedOpportunities] = useState([])
  const [status, setStatus] = useState('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!user) return

    let isMounted = true

    async function load() {
      setStatus('loading')
      setMessage('')

      try {
        const data = await getStudentSavedOpportunities(user.id)
        if (!isMounted) return
        setSavedOpportunities(data)
        setStatus('ready')
      } catch (error) {
        if (!isMounted) return
        setStatus('error')
        setMessage(error.message || 'Unable to load your saved opportunities.')
      }
    }

    load()

    return () => {
      isMounted = false
    }
  }, [user])

  async function handleRemove(opportunityId) {
    try {
      await removeSavedOpportunity(user.id, opportunityId)
      setSavedOpportunities((current) => current.filter((item) => item.opportunity_id !== opportunityId))
    } catch (error) {
      setMessage(error.message || 'Unable to remove this saved opportunity.')
    }
  }

  if (status === 'loading') {
    return (
      <div className="page">
        <PageHero
          label="Saved Opportunities"
          title="Loading your saved opportunities."
          description="Kenisar is gathering the listings you bookmarked for later."
          theme="students"
        />
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="page">
        <PageHero
          label="Saved Opportunities"
          title="We couldn't load your saved opportunities."
          description={message}
          theme="students"
        />
      </div>
    )
  }

  return (
    <div className="page">
      <PageHero
        label="Saved Opportunities"
        title="Revisit the roles you bookmarked."
        description="Keep track of interesting opportunities, then return when you are ready to read more or apply."
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
        <SectionLabel>Your saved list</SectionLabel>
        {message ? (
          <div className="form-status form-status--error" role="alert">
            <p>{message}</p>
          </div>
        ) : null}

        <div className="dashboard-stack">
          {savedOpportunities.length > 0 ? (
            savedOpportunities.map((entry) => (
              <OpportunitySummaryCard
                key={entry.id}
                item={entry.opportunities}
                currentPath={currentPath}
                onNavigate={onNavigate}
                opportunityHref={`/opportunities/${entry.opportunity_id}`}
                organizationHref={
                  entry.opportunities?.organization_id ? `/organizations/${entry.opportunities.organization_id}` : null
                }
                secondaryMeta={[`Saved ${formatDateLabel(entry.created_at)}`]}
              >
                <Button
                  href={`/opportunities/${entry.opportunity_id}`}
                  onNavigate={onNavigate}
                  currentPath={currentPath}
                  variant="outline"
                >
                  View details
                </Button>
                <Button variant="accent" onClick={() => handleRemove(entry.opportunity_id)}>
                  Remove save
                </Button>
              </OpportunitySummaryCard>
            ))
          ) : (
            <div className="empty-state-card" data-tilt>
              <h2>No saved opportunities yet.</h2>
              <p>Browse approved listings and save the ones you want to revisit later.</p>
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
