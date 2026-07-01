import { useEffect, useState } from 'react'
import { OpportunitySummaryCard } from '../components/opportunities/OpportunitySummaryCard'
import { useAuth } from '../components/auth/useAuth'
import { Button } from '../components/ui/Button'
import { PageHero } from '../components/ui/PageHero'
import { SectionLabel } from '../components/ui/SectionLabel'
import { deleteOpportunity, getOrganizationOpportunities } from '../lib/kenisarApi'

export function OpportunityManagePage({ currentPath, onNavigate }) {
  const { user } = useAuth()
  const [opportunities, setOpportunities] = useState([])
  const [status, setStatus] = useState('loading')
  const [message, setMessage] = useState('')
  const [messageTone, setMessageTone] = useState('idle')
  const [deletingId, setDeletingId] = useState('')

  useEffect(() => {
    if (!user) return

    let isMounted = true

    async function load() {
      setStatus('loading')
      setMessage('')
      setMessageTone('idle')

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

  async function handleDelete(opportunity) {
    const confirmed = window.confirm(
      `Delete "${opportunity.title || 'this opportunity'}"? This will also remove its saved records and applications.`,
    )

    if (!confirmed) return

    setDeletingId(opportunity.id)
    setMessage('')
    setMessageTone('idle')

    try {
      await deleteOpportunity(user.id, opportunity.id)
      setOpportunities((current) => current.filter((item) => item.id !== opportunity.id))
      setMessage('Opportunity deleted successfully.')
      setMessageTone('success')
    } catch (error) {
      setMessage(error.message || 'Unable to delete this opportunity.')
      setMessageTone('error')
    } finally {
      setDeletingId('')
    }
  }

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
        description="Track draft, pending, approved, and rejected listings from one place and open applicant review when students respond."
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
        {message ? (
          <div className={`form-status ${messageTone === 'error' ? 'form-status--error' : 'form-status--success'}`} role={messageTone === 'error' ? 'alert' : 'status'}>
            <p>{message}</p>
          </div>
        ) : null}
        <div className="dashboard-stack">
          {opportunities.length > 0 ? (
            opportunities.map((opportunity) => (
              <OpportunitySummaryCard
                key={opportunity.id}
                item={opportunity}
                currentPath={currentPath}
                onNavigate={onNavigate}
                opportunityHref={opportunity.status === 'approved' ? `/opportunities/${opportunity.id}` : null}
                secondaryMeta={[opportunity.status === 'approved' ? 'Public listing available' : 'Private until approved']}
              >
                <Button
                  href={`/opportunities/new?id=${opportunity.id}`}
                  onNavigate={onNavigate}
                  currentPath={currentPath}
                  variant="outline"
                >
                  Edit listing
                </Button>
                <Button
                  href={`/opportunities/${opportunity.id}/applicants`}
                  onNavigate={onNavigate}
                  currentPath={currentPath}
                  variant="accent"
                >
                  View applicants
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleDelete(opportunity)}
                  disabled={deletingId === opportunity.id}
                >
                  {deletingId === opportunity.id ? 'Deleting...' : 'Delete listing'}
                </Button>
              </OpportunitySummaryCard>
            ))
          ) : (
            <div className="empty-state-card" data-tilt>
              <h2>Create your first opportunity listing.</h2>
              <p>Drafts, pending listings, and approved opportunities will appear here once you start publishing.</p>
              <div className="button-row">
                <Button href="/opportunities/new" onNavigate={onNavigate} currentPath={currentPath}>
                  Create opportunity
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
