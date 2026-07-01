import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../components/auth/useAuth'
import { Button } from '../components/ui/Button'
import { PageHero } from '../components/ui/PageHero'
import { SectionLabel } from '../components/ui/SectionLabel'
import { StatusBadge } from '../components/ui/StatusBadge'
import { formatDateLabel, formatListText, getOpportunityTitle } from '../lib/opportunityPresentation'
import {
  getOpportunityById,
  getOrganizationOpportunityApplicants,
  updateOpportunityApplicationStatus,
} from '../lib/kenisarApi'

const applicationStatuses = ['reviewed', 'accepted', 'rejected']

function ApplicantCard({ applicant, currentPath, onNavigate, onUpdateStatus, updatingId }) {
  const student = applicant.student_profiles

  return (
    <article className="content-card content-card--light applicant-card" data-reveal="card" data-tilt>
      <div className="dashboard-record__header">
        <div>
          <h2>{student?.full_name?.trim() || 'Not provided'}</h2>
          <p>{student?.email?.trim() || 'Not provided'}</p>
        </div>
        <div className="application-meta-row">
          <StatusBadge status={applicant.action_type} />
          <StatusBadge status={applicant.status} />
        </div>
      </div>

      <div className="detail-grid detail-grid--two">
        <div className="detail-grid__item">
          <span>School</span>
          <strong>{student?.school?.trim() || 'Not provided'}</strong>
        </div>
        <div className="detail-grid__item">
          <span>Grade or year</span>
          <strong>{student?.grade_or_year?.trim() || 'Not provided'}</strong>
        </div>
        <div className="detail-grid__item">
          <span>Location</span>
          <strong>{student?.city?.trim() || 'Not provided'}</strong>
        </div>
        <div className="detail-grid__item">
          <span>Applied</span>
          <strong>{formatDateLabel(applicant.created_at)}</strong>
        </div>
      </div>

      <div className="page-stack applicant-card__details">
        <p>
          <strong>Interests:</strong> {formatListText(student?.interests, 'Not provided')}
        </p>
        <p>
          <strong>Skills:</strong> {formatListText(student?.skills, 'Not provided')}
        </p>
        <p>
          <strong>Experience goals:</strong> {student?.experience_goals?.trim() || 'Not provided'}
        </p>
        <p>
          <strong>Availability:</strong> {student?.availability?.trim() || 'Not provided'}
        </p>
        {student?.resume_link ? (
          <p>
            <strong>Resume:</strong>{' '}
            <a href={student.resume_link} target="_blank" rel="noopener noreferrer">
              View resume
            </a>
          </p>
        ) : null}
      </div>

      <div className="button-row">
        {applicationStatuses.map((statusOption) => (
          <Button
            key={statusOption}
            variant={applicant.status === statusOption ? 'filled' : 'outline'}
            onClick={() => onUpdateStatus(applicant.id, statusOption)}
            disabled={updatingId === applicant.id || applicant.status === statusOption}
          >
            Mark {statusOption}
          </Button>
        ))}
        <Button href={`/opportunities/${applicant.opportunity_id}`} onNavigate={onNavigate} currentPath={currentPath}>
          View listing
        </Button>
      </div>
    </article>
  )
}

export function OpportunityApplicantsPage({ currentPath, onNavigate, opportunityId }) {
  const { role } = useAuth()
  const [opportunity, setOpportunity] = useState(null)
  const [applications, setApplications] = useState([])
  const [status, setStatus] = useState('loading')
  const [message, setMessage] = useState('')
  const [messageTone, setMessageTone] = useState('idle')
  const [updatingId, setUpdatingId] = useState('')

  useEffect(() => {
    let isMounted = true

    async function load() {
      setStatus('loading')
      setMessage('')
      setMessageTone('idle')

      try {
        const [opportunityResult, applicantResults] = await Promise.all([
          getOpportunityById(opportunityId),
          getOrganizationOpportunityApplicants(opportunityId),
        ])

        if (!isMounted) return

        setOpportunity(opportunityResult)
        setApplications(applicantResults)
        setStatus('ready')
      } catch (error) {
        if (!isMounted) return
        setStatus('error')
        setMessage(error.message || 'Unable to load applicants for this opportunity.')
        setMessageTone('error')
      }
    }

    load()

    return () => {
      isMounted = false
    }
  }, [opportunityId])

  const applicantCount = applications.length
  const applicantTitle = useMemo(() => getOpportunityTitle(opportunity), [opportunity])

  async function handleUpdateStatus(applicationId, nextStatus) {
    setUpdatingId(applicationId)
    setMessage('')
    setMessageTone('idle')

    try {
      await updateOpportunityApplicationStatus(applicationId, nextStatus)
      setApplications((current) =>
        current.map((entry) => (entry.id === applicationId ? { ...entry, status: nextStatus } : entry)),
      )
      setMessage(`Applicant status updated to ${nextStatus}.`)
      setMessageTone('success')
    } catch (error) {
      setMessage(error.message || 'Unable to update this applicant.')
      setMessageTone('error')
    } finally {
      setUpdatingId('')
    }
  }

  if (status === 'loading') {
    return (
      <div className="page">
        <PageHero
          label="Applicants"
          title="Loading applicants."
          description="Kenisar is gathering the students who already showed interest in this opportunity."
          theme="partners"
        />
      </div>
    )
  }

  return (
    <div className="page">
      <PageHero
        label="Applicants"
        title={applicantTitle}
        description={
          status === 'error'
            ? 'Review access is available here when applicant data can be loaded.'
            : `Review applicants, track interest, and keep the next steps for ${applicantCount} student${applicantCount === 1 ? '' : 's'} moving.`
        }
        theme={role === 'admin' ? 'opportunities' : 'partners'}
      />

      <section className="section section--narrow" data-reveal="section">
        <div className="button-row">
          <Button
            href={role === 'admin' ? '/admin' : '/opportunities/manage'}
            onNavigate={onNavigate}
            currentPath={currentPath}
            variant="outline"
          >
            {role === 'admin' ? 'Back to review' : 'Manage listings'}
          </Button>
          <Button href={`/opportunities/${opportunityId}`} onNavigate={onNavigate} currentPath={currentPath}>
            View public listing
          </Button>
        </div>
      </section>

      <section className="section" data-reveal="section">
        <SectionLabel>Applicant queue</SectionLabel>
        {message ? (
          <div className={`form-status ${messageTone === 'error' ? 'form-status--error' : 'form-status--success'}`} role={messageTone === 'error' ? 'alert' : 'status'}>
            <p>{message}</p>
          </div>
        ) : null}

        <div className="dashboard-stack">
          {status === 'error' ? (
            <div className="empty-state-card" data-tilt>
              <h2>Applicants could not be loaded.</h2>
              <p>{message || 'Please try again after refreshing this page.'}</p>
              <div className="button-row">
                <Button
                  href={role === 'admin' ? '/admin' : '/opportunities/manage'}
                  onNavigate={onNavigate}
                  currentPath={currentPath}
                >
                  {role === 'admin' ? 'Back to review' : 'Back to listings'}
                </Button>
              </div>
            </div>
          ) : applications.length > 0 ? (
            applications.map((application) => (
              <ApplicantCard
                key={application.id}
                applicant={application}
                currentPath={currentPath}
                onNavigate={onNavigate}
                onUpdateStatus={handleUpdateStatus}
                updatingId={updatingId}
              />
            ))
          ) : (
            <div className="empty-state-card" data-tilt>
              <h2>No applicants yet.</h2>
              <p>When students apply or show interest, they will appear here for review.</p>
              <div className="button-row">
                <Button
                  href={role === 'admin' ? '/admin' : '/opportunities/manage'}
                  onNavigate={onNavigate}
                  currentPath={currentPath}
                >
                  {role === 'admin' ? 'Back to review' : 'Back to listings'}
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
