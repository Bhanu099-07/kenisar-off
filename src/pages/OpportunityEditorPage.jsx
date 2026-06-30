import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../components/auth/useAuth'
import { Button } from '../components/ui/Button'
import { FormStatus } from '../components/ui/FormStatus'
import { PageHero } from '../components/ui/PageHero'
import { StatusBadge } from '../components/ui/StatusBadge'
import { getOpportunityById, getOrganizationProfile, upsertOpportunity } from '../lib/kenisarApi'
import { emailField, required } from '../forms/formValidation'

function getOpportunitySearchId() {
  return new URLSearchParams(window.location.search).get('id')
}

export function OpportunityEditorPage({ currentPath, onNavigate }) {
  const { user } = useAuth()
  const [values, setValues] = useState({
    application_link: '',
    commitment: '',
    contact_email: user?.email ?? '',
    deadline: '',
    description: '',
    eligibility: '',
    id: '',
    location: '',
    opportunity_type: '',
    remote_or_in_person: '',
    skills_gained: '',
    status: 'draft',
    title: '',
  })
  const [organizationProfile, setOrganizationProfile] = useState(null)
  const [pageStatus, setPageStatus] = useState('loading')
  const [submitStatus, setSubmitStatus] = useState('idle')
  const [message, setMessage] = useState('')
  const [errors, setErrors] = useState({})
  const editingId = useMemo(() => getOpportunitySearchId(), [])

  useEffect(() => {
    if (!user) return

    let isMounted = true

    async function load() {
      setPageStatus('loading')
      setMessage('')

      try {
        const profile = await getOrganizationProfile(user.id)
        const existing = editingId ? await getOpportunityById(editingId) : null

        if (!isMounted) return

        setOrganizationProfile(profile)

        if (existing) {
          setValues({
            application_link: existing.application_link ?? '',
            commitment: existing.commitment ?? '',
            contact_email: existing.contact_email ?? user.email ?? '',
            deadline: existing.deadline ?? '',
            description: existing.description ?? '',
            eligibility: existing.eligibility ?? '',
            id: existing.id,
            location: existing.location ?? '',
            opportunity_type: existing.opportunity_type ?? '',
            remote_or_in_person: existing.remote_or_in_person ?? '',
            skills_gained: existing.skills_gained ?? '',
            status: existing.status ?? 'draft',
            title: existing.title ?? '',
          })
        }

        setPageStatus('ready')
      } catch (error) {
        if (!isMounted) return
        setPageStatus('error')
        setMessage(error.message || 'Unable to load this listing editor.')
      }
    }

    load()

    return () => {
      isMounted = false
    }
  }, [editingId, user])

  function updateField(name, value) {
    setValues((current) => ({ ...current, [name]: value }))
    setErrors((current) => {
      const next = { ...current }
      delete next[name]
      return next
    })
    if (submitStatus !== 'idle') {
      setSubmitStatus('idle')
      setMessage('')
    }
  }

  function validate() {
    const nextErrors = {}

    for (const [field, label] of [
      ['title', 'title'],
      ['description', 'description'],
      ['opportunity_type', 'opportunity type'],
      ['location', 'location'],
      ['remote_or_in_person', 'delivery format'],
      ['commitment', 'commitment'],
    ]) {
      const error = required(values[field], `Please enter the ${label}.`)
      if (error) nextErrors[field] = error
    }

    const emailError = emailField(values.contact_email)
    if (emailError) nextErrors.contact_email = emailError

    return nextErrors
  }

  async function saveWithStatus(nextStatus) {
    const nextErrors = validate()

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }

    setSubmitStatus('loading')
    setMessage('')

    try {
      await upsertOpportunity(user.id, {
        ...values,
        status: nextStatus,
      })

      setSubmitStatus('success')
      setValues((current) => ({ ...current, status: nextStatus }))
      setMessage(
        nextStatus === 'pending'
          ? 'Your listing has been submitted for review.'
          : 'Your listing has been saved as a draft.',
      )
    } catch (error) {
      setSubmitStatus('error')
      setMessage(error.message || 'Unable to save this listing.')
    }
  }

  async function handleSubmit(event) {
    event.preventDefault()
    await saveWithStatus(values.status === 'pending' ? 'pending' : 'draft')
  }

  if (pageStatus === 'loading') {
    return (
      <div className="page">
        <PageHero
          label="Opportunity Editor"
          title="Loading your listing editor."
          description="Kenisar is preparing the fields for your opportunity."
          theme="partners"
        />
      </div>
    )
  }

  if (pageStatus === 'error') {
    return (
      <div className="page">
        <PageHero
          label="Opportunity Editor"
          title="We couldn't load this listing editor."
          description={message}
          theme="partners"
        />
      </div>
    )
  }

  if (!organizationProfile?.organization_name) {
    return (
      <div className="page">
        <PageHero
          label="Opportunity Editor"
          title="Complete your organization profile first."
          description="Kenisar needs your organization details before you can submit opportunity listings."
          theme="partners"
        />
        <section className="section section--narrow" data-reveal="section">
          <div className="empty-state-card" data-tilt>
            <h2>Your organization profile isn't ready yet.</h2>
            <p>Add your organization details so Kenisar can review your listings with the right context.</p>
            <div className="button-row">
              <Button href="/profile/organization" onNavigate={onNavigate} currentPath={currentPath}>
                Complete organization profile
              </Button>
            </div>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="page">
      <PageHero
        label="Opportunity Editor"
        title={editingId ? 'Edit your opportunity listing.' : 'Create a new opportunity listing.'}
        description="Save a private draft or submit a listing for Kenisar review. Only approved listings appear publicly."
        theme="partners"
      />

      <section className="section section--narrow" data-reveal="section">
        <form className="form-card" onSubmit={handleSubmit} noValidate data-tilt>
          <div className="dashboard-record__header dashboard-record__header--editor">
            <div>
              <h2>{organizationProfile.organization_name}</h2>
              <p>Current listing status</p>
            </div>
            <StatusBadge status={values.status} />
          </div>

          {submitStatus === 'success' ? (
            <div className="form-status form-status--success" role="status">
              <p>{message}</p>
            </div>
          ) : (
            <FormStatus status={submitStatus === 'error' ? 'error' : submitStatus === 'loading' ? 'loading' : 'idle'} message={message} />
          )}

          <div className="field-grid">
            <label>
              Opportunity title
              <input value={values.title} onChange={(event) => updateField('title', event.target.value)} placeholder="Marketing intern, design mentor, student volunteer coordinator" />
              {errors.title ? <small className="field-error">{errors.title}</small> : null}
            </label>
            <label>
              Opportunity type
              <input value={values.opportunity_type} onChange={(event) => updateField('opportunity_type', event.target.value)} placeholder="Internship, volunteering, mentorship, workshop, project" />
              {errors.opportunity_type ? <small className="field-error">{errors.opportunity_type}</small> : null}
            </label>
            <label>
              Location
              <input value={values.location} onChange={(event) => updateField('location', event.target.value)} placeholder="City, region, or remote" />
              {errors.location ? <small className="field-error">{errors.location}</small> : null}
            </label>
            <label>
              Remote or in person
              <input value={values.remote_or_in_person} onChange={(event) => updateField('remote_or_in_person', event.target.value)} placeholder="Remote, in person, or hybrid" />
              {errors.remote_or_in_person ? <small className="field-error">{errors.remote_or_in_person}</small> : null}
            </label>
            <label>
              Commitment
              <input value={values.commitment} onChange={(event) => updateField('commitment', event.target.value)} placeholder="10 hours per week, weekends, 4-week workshop" />
              {errors.commitment ? <small className="field-error">{errors.commitment}</small> : null}
            </label>
            <label>
              Deadline
              <input type="date" value={values.deadline} onChange={(event) => updateField('deadline', event.target.value)} />
            </label>
            <label>
              Contact email
              <input value={values.contact_email} onChange={(event) => updateField('contact_email', event.target.value)} placeholder="Where students should reach you" />
              {errors.contact_email ? <small className="field-error">{errors.contact_email}</small> : null}
            </label>
            <label>
              Application link
              <input value={values.application_link} onChange={(event) => updateField('application_link', event.target.value)} placeholder="Optional external application link" />
            </label>
          </div>

          <label>
            Description
            <textarea rows="6" value={values.description} onChange={(event) => updateField('description', event.target.value)} placeholder="Explain what students will do, learn, and contribute." />
            {errors.description ? <small className="field-error">{errors.description}</small> : null}
          </label>

          <label>
            Eligibility
            <textarea rows="4" value={values.eligibility} onChange={(event) => updateField('eligibility', event.target.value)} placeholder="Who can apply? Mention student level, scheduling limits, or any prerequisites." />
          </label>

          <label>
            Skills gained
            <textarea rows="4" value={values.skills_gained} onChange={(event) => updateField('skills_gained', event.target.value)} placeholder="What practical skills or exposure will students build?" />
          </label>

          <div className="button-row">
            <Button currentPath={currentPath} type="submit" variant="outline">
              Save draft
            </Button>
            <button
              type="button"
              className="button button--filled motion-magnetic"
              onClick={() => saveWithStatus('pending')}
              disabled={submitStatus === 'loading'}
            >
              <span>Submit for review</span>
            </button>
            <Button href="/opportunities/manage" onNavigate={onNavigate} currentPath={currentPath} variant="accent">
              Manage listings
            </Button>
          </div>
        </form>
      </section>
    </div>
  )
}
