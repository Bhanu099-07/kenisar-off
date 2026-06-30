import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../components/auth/useAuth'
import { Button } from '../components/ui/Button'
import { PageHero } from '../components/ui/PageHero'
import { SectionLabel } from '../components/ui/SectionLabel'
import { StatusBadge } from '../components/ui/StatusBadge'
import {
  getApprovedOpportunities,
  getStudentApplications,
  getStudentSavedOpportunities,
  recordOpportunityAction,
  removeSavedOpportunity,
  saveOpportunity,
} from '../lib/kenisarApi'

function OpportunityCard({
  currentPath,
  isApplied,
  isSaved,
  item,
  onApply,
  onNavigate,
  onToggleSave,
  role,
  user,
}) {
  const organizationName = item.organization_profiles?.organization_name ?? 'Kenisar partner'

  return (
    <article className="content-card content-card--light opportunity-card" data-reveal="card" data-tilt>
      <div className="dashboard-record__header">
        <div>
          <h2>{item.title}</h2>
          <p>
            {organizationName} · {item.location}
          </p>
        </div>
        <StatusBadge status={item.status} />
      </div>

      <p>{item.description}</p>

      <div className="tag-list tag-list--dense">
        <span className="tag-pill tag-pill--dark">{item.opportunity_type}</span>
        <span className="tag-pill tag-pill--dark">{item.remote_or_in_person}</span>
        <span className="tag-pill tag-pill--dark">{item.commitment}</span>
        {item.deadline ? <span className="tag-pill tag-pill--dark">Deadline {item.deadline}</span> : null}
      </div>

      {item.skills_gained ? (
        <p className="opportunity-card__meta">
          <strong>Skills gained:</strong> {item.skills_gained}
        </p>
      ) : null}

      {user && role === 'student' ? (
        <div className="button-row">
          <button type="button" className="button button--outline motion-magnetic" onClick={() => onToggleSave(item.id, isSaved)}>
            <span>{isSaved ? 'Remove save' : 'Save opportunity'}</span>
          </button>
          <button type="button" className="button button--filled motion-magnetic" onClick={() => onApply(item)}>
            <span>{isApplied ? 'Update application activity' : 'Apply or show interest'}</span>
          </button>
        </div>
      ) : (
        <div className="button-row">
          <Button
            href={role === 'organization' ? '/dashboard/organization' : '/auth/student'}
            onNavigate={onNavigate}
            currentPath={currentPath}
          >
            {role === 'organization' ? 'Go to dashboard' : 'Create student profile'}
          </Button>
        </div>
      )}
    </article>
  )
}

export function OpportunitiesPage({ onNavigate, currentPath }) {
  const { role, user } = useAuth()
  const [status, setStatus] = useState('loading')
  const [message, setMessage] = useState('')
  const [opportunities, setOpportunities] = useState([])
  const [savedIds, setSavedIds] = useState([])
  const [appliedIds, setAppliedIds] = useState([])

  useEffect(() => {
    let isMounted = true

    async function load() {
      setStatus('loading')
      setMessage('')

      try {
        const approved = await getApprovedOpportunities()

        if (!isMounted) return

        setOpportunities(approved)

        if (user && role === 'student') {
          const [saved, applications] = await Promise.all([
            getStudentSavedOpportunities(user.id),
            getStudentApplications(user.id),
          ])

          if (!isMounted) return

          setSavedIds(saved.map((item) => item.opportunity_id))
          setAppliedIds(applications.map((item) => item.opportunity_id))
        } else {
          setSavedIds([])
          setAppliedIds([])
        }

        setStatus('ready')
      } catch (error) {
        if (!isMounted) return
        setStatus('error')
        setMessage(error.message || 'Unable to load opportunities.')
      }
    }

    load()

    return () => {
      isMounted = false
    }
  }, [role, user])

  const emptyDescription = useMemo(() => {
    if (role === 'student') {
      return 'No approved opportunities are live yet. Create your profile so Kenisar can notify you as partner listings become available.'
    }

    return 'No approved opportunities are live yet. Kenisar is still onboarding and reviewing student-friendly partner listings.'
  }, [role])

  async function handleToggleSave(opportunityId, isSaved) {
    if (!user) {
      onNavigate('/auth/student')
      return
    }

    try {
      if (isSaved) {
        await removeSavedOpportunity(user.id, opportunityId)
        setSavedIds((current) => current.filter((item) => item !== opportunityId))
      } else {
        await saveOpportunity(user.id, opportunityId)
        setSavedIds((current) => [...new Set([...current, opportunityId])])
      }
    } catch (error) {
      setMessage(error.message || 'Unable to update saved opportunities.')
    }
  }

  async function handleApply(item) {
    if (!user) {
      onNavigate('/auth/student')
      return
    }

    try {
      await recordOpportunityAction(user.id, item.id, item.application_link ? 'applied' : 'interested')
      setAppliedIds((current) => [...new Set([...current, item.id])])

      if (item.application_link) {
        window.open(item.application_link, '_blank', 'noopener,noreferrer')
      }
    } catch (error) {
      setMessage(error.message || 'Unable to record your opportunity activity.')
    }
  }

  if (status === 'loading') {
    return (
      <div className="page">
        <PageHero
          label="Opportunities"
          title="Loading approved opportunities."
          description="Kenisar is checking which reviewed listings are ready for students to browse."
          theme="opportunities"
        />
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="page">
        <PageHero
          label="Opportunities"
          title="We couldn't load opportunities."
          description={message}
          theme="opportunities"
        />
      </div>
    )
  }

  return (
    <div className="page">
      <PageHero
        label="Opportunities"
        title="Browse approved student opportunities."
        description="Only approved listings appear here. Students can save opportunities, apply, or show interest once they have an account."
        theme="opportunities"
      />

      <section className="section section--narrow" data-reveal="section">
        <div className="page-cluster page-cluster--opportunities">
          <div className="content-card content-card--light content-card--support" data-reveal="card" data-tilt>
            <SectionLabel>How it works</SectionLabel>
            <h2>Kenisar publishes only approved listings.</h2>
            <p>
              Organization listings stay private until Kenisar reviews them. That keeps the public opportunities page
              honest and student-friendly.
            </p>
            <ul className="detail-list">
              <li>Students can create profiles, save listings, and track where they have shown interest.</li>
              <li>Organizations can save drafts and submit listings for review.</li>
              <li>Only approved listings appear publicly.</li>
            </ul>
          </div>

          <aside className="content-card content-card--light content-card--support" data-reveal="card" data-tilt>
            <SectionLabel>Quick actions</SectionLabel>
            <h2>{user && role === 'student' ? 'Keep moving inside your account.' : 'Create an account to take action.'}</h2>
            <div className="button-row">
              <Button
                href={user && role === 'student' ? '/dashboard/student' : '/auth/student'}
                onNavigate={onNavigate}
                currentPath={currentPath}
              >
                {user && role === 'student' ? 'Student dashboard' : 'Create student profile'}
              </Button>
              <Button href="/auth/organization" onNavigate={onNavigate} currentPath={currentPath} variant="accent">
                Create organization account
              </Button>
            </div>
          </aside>
        </div>
      </section>

      <section className="section" data-reveal="section">
        <SectionLabel>Approved listings</SectionLabel>
        {message ? (
          <div className="form-status form-status--error" role="alert">
            <p>{message}</p>
          </div>
        ) : null}

        <div className="dashboard-stack">
          {opportunities.length > 0 ? (
            opportunities.map((item) => (
              <OpportunityCard
                key={item.id}
                currentPath={currentPath}
                isApplied={appliedIds.includes(item.id)}
                isSaved={savedIds.includes(item.id)}
                item={item}
                onApply={handleApply}
                onNavigate={onNavigate}
                onToggleSave={handleToggleSave}
                role={role}
                user={user}
              />
            ))
          ) : (
            <div className="empty-state-card" data-tilt>
              <h2>No opportunities are live yet.</h2>
              <p>{emptyDescription}</p>
              <div className="button-row">
                <Button href="/auth/student" onNavigate={onNavigate} currentPath={currentPath}>
                  Create student profile
                </Button>
                <Button href="/auth/organization" onNavigate={onNavigate} currentPath={currentPath} variant="accent">
                  Create organization account
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
