import { useEffect, useMemo, useState } from 'react'
import { AppLink } from '../components/ui/AppLink'
import { useAuth } from '../components/auth/useAuth'
import { Button } from '../components/ui/Button'
import { PageHero } from '../components/ui/PageHero'
import { SectionLabel } from '../components/ui/SectionLabel'
import { StatusBadge } from '../components/ui/StatusBadge'
import { getDashboardPathForRole } from '../config/admin'
import {
  formatDateLabel,
  getOpportunityCommitment,
  getOpportunityDescription,
  getOpportunityEligibility,
  getOpportunityLocation,
  getOpportunityMode,
  getOpportunitySkills,
  getOpportunityTitle,
  getOpportunityType,
  getOrganizationName,
} from '../lib/opportunityPresentation'
import {
  getApprovedOpportunityById,
  getStudentApplications,
  getStudentSavedOpportunities,
  recordOpportunityAction,
  removeSavedOpportunity,
  saveOpportunity,
} from '../lib/kenisarApi'

export function OpportunityDetailPage({ currentPath, onNavigate, opportunityId }) {
  const { role, user } = useAuth()
  const [opportunity, setOpportunity] = useState(null)
  const [status, setStatus] = useState('loading')
  const [message, setMessage] = useState('')
  const [messageTone, setMessageTone] = useState('idle')
  const [saved, setSaved] = useState(false)
  const [application, setApplication] = useState(null)

  useEffect(() => {
    let isMounted = true

    async function load() {
      setStatus('loading')
      setMessage('')
      setMessageTone('idle')

      try {
        const opportunityResult = await getApprovedOpportunityById(opportunityId)

        if (!isMounted) return

        if (!opportunityResult) {
          setOpportunity(null)
          setStatus('empty')
          return
        }

        setOpportunity(opportunityResult)

        if (user && role === 'student') {
          const [savedItems, applicationItems] = await Promise.all([
            getStudentSavedOpportunities(user.id),
            getStudentApplications(user.id),
          ])

          if (!isMounted) return

          setSaved(savedItems.some((entry) => entry.opportunity_id === opportunityId))
          setApplication(applicationItems.find((entry) => entry.opportunity_id === opportunityId) ?? null)
        } else {
          setSaved(false)
          setApplication(null)
        }

        setStatus('ready')
      } catch (error) {
        if (!isMounted) return
        setStatus('error')
        setMessage(error.message || 'Unable to load this opportunity.')
      }
    }

    load()

    return () => {
      isMounted = false
    }
  }, [opportunityId, role, user])

  const detailItems = useMemo(
    () => [
      { label: 'Opportunity type', value: getOpportunityType(opportunity) },
      { label: 'Location', value: getOpportunityLocation(opportunity) },
      { label: 'Format', value: getOpportunityMode(opportunity) },
      { label: 'Commitment', value: getOpportunityCommitment(opportunity) },
      { label: 'Deadline', value: formatDateLabel(opportunity?.deadline) },
    ],
    [opportunity],
  )

  async function handleToggleSave() {
    if (!user) {
      onNavigate('/auth?role=student')
      return
    }

    try {
      if (saved) {
        await removeSavedOpportunity(user.id, opportunityId)
        setSaved(false)
        setMessage('Removed from saved opportunities.')
        setMessageTone('success')
      } else {
        await saveOpportunity(user.id, opportunityId)
        setSaved(true)
        setMessage('Saved to your opportunity list.')
        setMessageTone('success')
      }
    } catch (error) {
      setMessage(error.message || 'Unable to update this saved opportunity.')
      setMessageTone('error')
    }
  }

  async function handleApply() {
    if (!user) {
      onNavigate('/auth?role=student')
      return
    }

    if (application) {
      setMessage(
        application.action_type === 'applied'
          ? 'You already applied to this opportunity.'
          : 'You already recorded interest in this opportunity.',
      )
      setMessageTone('success')
      return
    }

    try {
      const created = await recordOpportunityAction(
        user.id,
        opportunityId,
        opportunity?.application_link ? 'applied' : 'interested',
      )

      setApplication(created)
      setMessage(
        created.duplicate
          ? 'Your opportunity activity was already recorded.'
          : opportunity?.application_link
            ? 'Application recorded. The external application link opened in a new tab.'
            : 'Your interest was recorded successfully.',
      )
      setMessageTone('success')

      if (opportunity?.application_link) {
        window.open(opportunity.application_link, '_blank', 'noopener,noreferrer')
      }
    } catch (error) {
      setMessage(error.message || 'Unable to record your application activity.')
      setMessageTone('error')
    }
  }

  if (status === 'loading') {
    return (
      <div className="page">
        <PageHero
          label="Opportunity"
          title="Loading opportunity details."
          description="Kenisar is preparing the full opportunity information."
          theme="opportunities"
        />
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="page">
        <PageHero
          label="Opportunity"
          title="We couldn't load this opportunity."
          description={message}
          theme="opportunities"
        />
      </div>
    )
  }

  if (status === 'empty' || !opportunity) {
    return (
      <div className="page">
        <PageHero
          label="Opportunity"
          title="This opportunity is not available."
          description="Only approved public opportunities can be viewed here."
          theme="opportunities"
        />
      </div>
    )
  }

  const organizationPath = `/organizations/${opportunity.organization_id}`

  return (
    <div className="page">
      <PageHero
        label="Opportunity Details"
        title={getOpportunityTitle(opportunity)}
        description={getOpportunityDescription(opportunity)}
        theme="opportunities"
      />

      <section className="section section--narrow" data-reveal="section">
        <div className="button-row">
          <Button href="/opportunities" onNavigate={onNavigate} currentPath={currentPath} variant="outline">
            Back to opportunities
          </Button>
          <Button href={organizationPath} onNavigate={onNavigate} currentPath={currentPath}>
            View organization
          </Button>
        </div>
      </section>

      <section className="section" data-reveal="section">
        <div className="page-cluster page-cluster--opportunities">
          <div className="content-card content-card--light opportunity-detail-card" data-reveal="card" data-tilt>
            <div className="dashboard-record__header">
              <div>
                <SectionLabel>About this opportunity</SectionLabel>
                <h2>{getOpportunityTitle(opportunity)}</h2>
                <p className="opportunity-detail-card__organization">
                  <AppLink href={organizationPath} onNavigate={onNavigate} currentPath={currentPath}>
                    {getOrganizationName(opportunity)}
                  </AppLink>
                </p>
              </div>
              <StatusBadge status={opportunity.status} />
            </div>

            <div className="detail-grid detail-grid--two">
              {detailItems.map((item) => (
                <div key={item.label} className="detail-grid__item">
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                </div>
              ))}
            </div>

            <div className="page-stack">
              <div>
                <h3>Description</h3>
                <p>{getOpportunityDescription(opportunity)}</p>
              </div>
              <div>
                <h3>Eligibility</h3>
                <p>{getOpportunityEligibility(opportunity)}</p>
              </div>
              <div>
                <h3>Skills gained</h3>
                <p>{getOpportunitySkills(opportunity)}</p>
              </div>
              {opportunity.contact_email ? (
                <div>
                  <h3>Contact</h3>
                  <p>{opportunity.contact_email}</p>
                </div>
              ) : null}
            </div>
          </div>

          <aside className="content-card content-card--light content-card--support" data-reveal="card" data-tilt>
            <SectionLabel>Take action</SectionLabel>
            <h2>Move this opportunity forward.</h2>
            <p>
              Students can save this listing, record their interest, or use the organization&apos;s application link
              when one is provided.
            </p>

            {message ? (
              <div className={`form-status ${messageTone === 'error' ? 'form-status--error' : 'form-status--success'}`} role={messageTone === 'error' ? 'alert' : 'status'}>
                <p>{message}</p>
              </div>
            ) : null}

            {user && role === 'student' ? (
              <div className="button-row">
                <Button variant="outline" onClick={handleToggleSave}>
                  {saved ? 'Remove save' : 'Save opportunity'}
                </Button>
                <Button onClick={handleApply} disabled={Boolean(application)}>
                  {application
                    ? application.action_type === 'applied'
                      ? 'Already applied'
                      : 'Interest recorded'
                    : opportunity.application_link
                      ? 'Apply now'
                      : 'Show interest'}
                </Button>
              </div>
            ) : user && role === 'admin' ? (
              <div className="button-row">
                <Button href="/admin" onNavigate={onNavigate} currentPath={currentPath}>
                  Review listings
                </Button>
                <Button
                  href={getDashboardPathForRole(role)}
                  onNavigate={onNavigate}
                  currentPath={currentPath}
                  variant="outline"
                >
                  Admin dashboard
                </Button>
              </div>
            ) : user ? (
              <div className="button-row">
                <Button
                  href={getDashboardPathForRole(role)}
                  onNavigate={onNavigate}
                  currentPath={currentPath}
                  variant="outline"
                >
                  Open dashboard
                </Button>
              </div>
            ) : (
              <div className="button-row">
                <Button href="/auth?role=student" onNavigate={onNavigate} currentPath={currentPath}>
                  Log in to apply
                </Button>
              </div>
            )}
          </aside>
        </div>
      </section>
    </div>
  )
}
