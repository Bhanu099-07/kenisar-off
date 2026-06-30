import { useEffect, useMemo, useState } from 'react'
import { Button } from '../components/ui/Button'
import { FormStatus } from '../components/ui/FormStatus'
import { PageHero } from '../components/ui/PageHero'
import { SectionLabel } from '../components/ui/SectionLabel'
import { StatusBadge } from '../components/ui/StatusBadge'
import { getAdminReviewOpportunities, reviewOpportunityStatus } from '../lib/kenisarApi'

const adminTabs = [
  { key: 'pending', label: 'Pending Opportunities' },
  { key: 'approved', label: 'Approved Opportunities' },
  { key: 'rejected', label: 'Rejected Opportunities' },
]

function formatDate(value) {
  if (!value) return 'Not set'

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  return date.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function truncateText(value, maxLength = 220) {
  if (!value) return 'No description provided.'
  if (value.length <= maxLength) return value
  return `${value.slice(0, maxLength).trimEnd()}...`
}

function AdminMetric({ label, value, hint }) {
  return (
    <article className="content-card content-card--light dashboard-metric" data-reveal="card" data-tilt>
      <span className="dashboard-metric__label">{label}</span>
      <strong className="dashboard-metric__value">{value}</strong>
      <p>{hint}</p>
    </article>
  )
}

function AdminOpportunityCard({ actionState, item, onApprove, onReject }) {
  const isApproving = actionState === 'approving'
  const isRejecting = actionState === 'rejecting'

  return (
    <article className="content-card content-card--light dashboard-record admin-opportunity-card" data-reveal="card" data-tilt>
      <div className="dashboard-record__header">
        <div>
          <h2>{item.title}</h2>
          <p>{item.organization_name}</p>
        </div>
        <StatusBadge status={item.status} />
      </div>

      <div className="tag-list tag-list--dense">
        <span className="tag-pill tag-pill--dark">{item.opportunity_type}</span>
        <span className="tag-pill tag-pill--dark">{item.location}</span>
        <span className="tag-pill tag-pill--dark">Created {formatDate(item.created_at)}</span>
        <span className="tag-pill tag-pill--dark">Deadline {formatDate(item.deadline)}</span>
      </div>

      <p className="admin-opportunity-card__description">{truncateText(item.description)}</p>

      <div className="admin-opportunity-card__actions">
        <Button variant="filled" onClick={() => onApprove(item)} disabled={isApproving || isRejecting || item.status === 'approved'}>
          {isApproving ? 'Approving...' : 'Approve'}
        </Button>
        <Button variant="outline" onClick={() => onReject(item)} disabled={isApproving || isRejecting || item.status === 'rejected'}>
          {isRejecting ? 'Rejecting...' : 'Reject'}
        </Button>
      </div>
    </article>
  )
}

export function AdminPage({ currentPath, onNavigate }) {
  const [status, setStatus] = useState('loading')
  const [message, setMessage] = useState('')
  const [flashStatus, setFlashStatus] = useState('idle')
  const [opportunities, setOpportunities] = useState([])
  const [activeTab, setActiveTab] = useState('pending')
  const [actionState, setActionState] = useState({})

  useEffect(() => {
    let isMounted = true

    async function load() {
      setStatus('loading')
      setMessage('')

      try {
        const data = await getAdminReviewOpportunities()

        if (!isMounted) return
        setOpportunities(data)
        setStatus('ready')
      } catch (error) {
        if (!isMounted) return
        setStatus('error')
        setMessage(error.message || 'Unable to load the admin review dashboard.')
      }
    }

    load()

    return () => {
      isMounted = false
    }
  }, [])

  const grouped = useMemo(
    () => ({
      approved: opportunities.filter((item) => item.status === 'approved'),
      pending: opportunities.filter((item) => item.status === 'pending'),
      rejected: opportunities.filter((item) => item.status === 'rejected'),
    }),
    [opportunities],
  )

  const activeItems = grouped[activeTab] ?? []

  async function handleReview(item, nextStatus) {
    const actionKey = nextStatus === 'approved' ? 'approving' : 'rejecting'
    setActionState((current) => ({ ...current, [item.id]: actionKey }))
    setFlashStatus('idle')
    setMessage('')

    try {
      const updated = await reviewOpportunityStatus(item.id, nextStatus)
      setOpportunities((current) => current.map((entry) => (entry.id === item.id ? { ...entry, ...updated } : entry)))
      setFlashStatus('success')
      setMessage(
        nextStatus === 'approved'
          ? 'Opportunity approved successfully.'
          : 'Opportunity rejected successfully.',
      )
    } catch (error) {
      setFlashStatus('error')
      setMessage(error.message || 'Unable to update this opportunity status.')
    } finally {
      setActionState((current) => {
        const next = { ...current }
        delete next[item.id]
        return next
      })
    }
  }

  if (status === 'loading') {
    return (
      <div className="page">
        <PageHero
          label="Admin"
          title="Loading opportunity approvals."
          description="Kenisar is preparing the admin review queue."
          theme="opportunities"
        />
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="page">
        <PageHero
          label="Admin"
          title="We couldn't load the admin dashboard."
          description={message}
          theme="opportunities"
        />
      </div>
    )
  }

  return (
    <div className="page">
      <PageHero
        label="Admin"
        title="Review opportunity submissions."
        description="Approve or reject organization-submitted opportunities without leaving Kenisar. Pending listings stay private until you review them."
        theme="opportunities"
      />

      <section className="section" data-reveal="section">
        <div className="card-grid card-grid--three">
          <AdminMetric label="Pending" value={grouped.pending.length} hint="Listings waiting for review." />
          <AdminMetric label="Approved" value={grouped.approved.length} hint="Listings visible to students." />
          <AdminMetric label="Rejected" value={grouped.rejected.length} hint="Listings sent back or declined." />
        </div>
      </section>

      <section className="section section--narrow" data-reveal="section">
        <div className="section-panel section-panel--dark">
          <SectionLabel>Review Queue</SectionLabel>
          <h2 className="section-heading">Move listings through the approval flow.</h2>
          <p className="section-intro">
            Use the tabs to switch between pending, approved, and rejected opportunities. Changes update the live
            opportunity status immediately.
          </p>

          <div className="admin-tab-row" role="tablist" aria-label="Opportunity approval status tabs">
            {adminTabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                className={`admin-tab ${activeTab === tab.key ? 'admin-tab--active' : ''}`}
                onClick={() => setActiveTab(tab.key)}
                role="tab"
                aria-selected={activeTab === tab.key}
              >
                <span>{tab.label}</span>
                <strong>{grouped[tab.key].length}</strong>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="section" data-reveal="section">
        {flashStatus === 'success' ? (
          <div className="form-status form-status--success" role="status">
            <p>{message}</p>
          </div>
        ) : (
          <FormStatus status={flashStatus === 'error' ? 'error' : 'idle'} message={message} />
        )}

        <div className="dashboard-stack">
          {activeItems.length > 0 ? (
            activeItems.map((item) => (
              <AdminOpportunityCard
                key={item.id}
                actionState={actionState[item.id]}
                item={item}
                onApprove={(nextItem) => handleReview(nextItem, 'approved')}
                onReject={(nextItem) => handleReview(nextItem, 'rejected')}
              />
            ))
          ) : (
            <div className="empty-state-card" data-tilt>
              <h2>No {activeTab} opportunities right now.</h2>
              <p>
                {activeTab === 'pending'
                  ? 'New organization submissions will appear here when they are ready for review.'
                  : activeTab === 'approved'
                    ? 'Approved opportunities will appear here after review.'
                    : 'Rejected opportunities will appear here after review.'}
              </p>
              <div className="button-row">
                <Button href="/opportunities" onNavigate={onNavigate} currentPath={currentPath} variant="outline">
                  View public opportunities
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
