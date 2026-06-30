import { useEffect, useState } from 'react'
import { useAuth } from '../components/auth/useAuth'
import { Button } from '../components/ui/Button'
import { FormStatus } from '../components/ui/FormStatus'
import { PageHero } from '../components/ui/PageHero'
import { getOrganizationProfile, getStudentProfile, upsertOrganizationProfile, upsertStudentProfile } from '../lib/kenisarApi'
import { emailField, required } from '../forms/formValidation'

function listToText(value) {
  return Array.isArray(value) ? value.join(', ') : value ?? ''
}

export function ProfilePage({ currentPath, onNavigate, role }) {
  const { user } = useAuth()
  const [status, setStatus] = useState('loading')
  const [submitStatus, setSubmitStatus] = useState('idle')
  const [errors, setErrors] = useState({})
  const [message, setMessage] = useState('')
  const [values, setValues] = useState({
    availability: '',
    city: '',
    contact_name: '',
    description: '',
    email: user?.email ?? '',
    experience_goals: '',
    full_name: '',
    grade_or_year: '',
    interests: '',
    organization_name: '',
    organization_type: '',
    resume_link: '',
    school: '',
    skills: '',
    website: '',
  })

  useEffect(() => {
    if (!user) return

    let isMounted = true

    async function load() {
      setStatus('loading')
      setMessage('')

      try {
        const profile =
          role === 'student' ? await getStudentProfile(user.id) : await getOrganizationProfile(user.id)

        if (!isMounted) return

        setValues((current) => ({
          ...current,
          ...(role === 'student'
            ? {
                availability: profile?.availability ?? '',
                city: profile?.city ?? '',
                email: profile?.email ?? user.email ?? '',
                experience_goals: profile?.experience_goals ?? '',
                full_name: profile?.full_name ?? user.user_metadata?.full_name ?? '',
                grade_or_year: profile?.grade_or_year ?? '',
                interests: listToText(profile?.interests),
                resume_link: profile?.resume_link ?? '',
                school: profile?.school ?? '',
                skills: listToText(profile?.skills),
              }
            : {
                city: profile?.city ?? '',
                contact_name: profile?.contact_name ?? user.user_metadata?.contact_name ?? '',
                description: profile?.description ?? '',
                email: profile?.email ?? user.email ?? '',
                organization_name: profile?.organization_name ?? user.user_metadata?.organization_name ?? '',
                organization_type: profile?.organization_type ?? '',
                website: profile?.website ?? '',
              }),
        }))

        setStatus('ready')
      } catch (error) {
        if (!isMounted) return
        setStatus('error')
        setMessage(error.message || 'Unable to load this profile.')
      }
    }

    load()

    return () => {
      isMounted = false
    }
  }, [role, user])

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
    const emailError = emailField(values.email)
    if (emailError) nextErrors.email = emailError

    if (role === 'student') {
      for (const [field, label] of [
        ['full_name', 'full name'],
        ['school', 'school'],
        ['grade_or_year', 'grade or year'],
        ['city', 'city'],
        ['interests', 'interests'],
        ['skills', 'skills'],
        ['experience_goals', 'experience goals'],
        ['availability', 'availability'],
      ]) {
        const error = required(values[field], `Please enter your ${label}.`)
        if (error) nextErrors[field] = error
      }
    } else {
      for (const [field, label] of [
        ['organization_name', 'organization name'],
        ['contact_name', 'contact name'],
        ['organization_type', 'organization type'],
        ['city', 'city'],
        ['description', 'organization description'],
      ]) {
        const error = required(values[field], `Please enter your ${label}.`)
        if (error) nextErrors[field] = error
      }
    }

    return nextErrors
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const nextErrors = validate()

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }

    setSubmitStatus('loading')
    setMessage('')

    try {
      if (role === 'student') {
        await upsertStudentProfile(user.id, values)
      } else {
        await upsertOrganizationProfile(user.id, values)
      }

      setSubmitStatus('success')
      setMessage('Your profile has been saved.')
    } catch (error) {
      setSubmitStatus('error')
      setMessage(error.message || 'Unable to save this profile.')
    }
  }

  if (status === 'loading') {
    return (
      <div className="page">
        <PageHero
          label={role === 'student' ? 'Student Profile' : 'Organization Profile'}
          title="Loading your profile."
          description="Kenisar is preparing your editable profile fields."
          theme={role === 'student' ? 'students' : 'partners'}
        />
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="page">
        <PageHero
          label={role === 'student' ? 'Student Profile' : 'Organization Profile'}
          title="We couldn't load this profile."
          description={message}
          theme={role === 'student' ? 'students' : 'partners'}
        />
      </div>
    )
  }

  return (
    <div className="page">
      <PageHero
        label={role === 'student' ? 'Student Profile' : 'Organization Profile'}
        title={role === 'student' ? 'Create and refine your student profile.' : 'Create and refine your organization profile.'}
        description={
          role === 'student'
            ? 'Tell Kenisar what you want to learn, what you can offer, and where you want to grow next.'
            : 'Give Kenisar the right context for reviewing your opportunities and presenting your organization clearly.'
        }
        theme={role === 'student' ? 'students' : 'partners'}
      />

      <section className="section section--narrow" data-reveal="section">
        <form className="form-card" onSubmit={handleSubmit} noValidate data-tilt>
          {submitStatus === 'success' ? (
            <div className="form-status form-status--success" role="status">
              <p>{message}</p>
            </div>
          ) : (
            <FormStatus status={submitStatus === 'error' ? 'error' : submitStatus === 'loading' ? 'loading' : 'idle'} message={message} />
          )}

          <div className="field-grid">
            {role === 'student' ? (
              <>
                <label>
                  Full name
                  <input value={values.full_name} onChange={(event) => updateField('full_name', event.target.value)} placeholder="Enter your full name" />
                  {errors.full_name ? <small className="field-error">{errors.full_name}</small> : null}
                </label>
                <label>
                  Email
                  <input value={values.email} onChange={(event) => updateField('email', event.target.value)} placeholder="Enter your email address" />
                  {errors.email ? <small className="field-error">{errors.email}</small> : null}
                </label>
                <label>
                  School
                  <input value={values.school} onChange={(event) => updateField('school', event.target.value)} placeholder="Enter your school name" />
                  {errors.school ? <small className="field-error">{errors.school}</small> : null}
                </label>
                <label>
                  Grade or year
                  <input value={values.grade_or_year} onChange={(event) => updateField('grade_or_year', event.target.value)} placeholder="High school year, college year, or university year" />
                  {errors.grade_or_year ? <small className="field-error">{errors.grade_or_year}</small> : null}
                </label>
                <label>
                  City
                  <input value={values.city} onChange={(event) => updateField('city', event.target.value)} placeholder="Enter your city" />
                  {errors.city ? <small className="field-error">{errors.city}</small> : null}
                </label>
                <label>
                  Availability
                  <input value={values.availability} onChange={(event) => updateField('availability', event.target.value)} placeholder="Weekdays, evenings, weekends, part-time, etc." />
                  {errors.availability ? <small className="field-error">{errors.availability}</small> : null}
                </label>
              </>
            ) : (
              <>
                <label>
                  Organization name
                  <input
                    value={values.organization_name}
                    onChange={(event) => updateField('organization_name', event.target.value)}
                    placeholder="Enter your organization name"
                  />
                  {errors.organization_name ? <small className="field-error">{errors.organization_name}</small> : null}
                </label>
                <label>
                  Contact name
                  <input value={values.contact_name} onChange={(event) => updateField('contact_name', event.target.value)} placeholder="Enter your contact name" />
                  {errors.contact_name ? <small className="field-error">{errors.contact_name}</small> : null}
                </label>
                <label>
                  Email
                  <input value={values.email} onChange={(event) => updateField('email', event.target.value)} placeholder="Enter your email address" />
                  {errors.email ? <small className="field-error">{errors.email}</small> : null}
                </label>
                <label>
                  Website
                  <input value={values.website} onChange={(event) => updateField('website', event.target.value)} placeholder="https://your-organization.com" />
                </label>
                <label>
                  Organization type
                  <input
                    value={values.organization_type}
                    onChange={(event) => updateField('organization_type', event.target.value)}
                    placeholder="Nonprofit, business, startup, community organization, etc."
                  />
                  {errors.organization_type ? <small className="field-error">{errors.organization_type}</small> : null}
                </label>
                <label>
                  City
                  <input value={values.city} onChange={(event) => updateField('city', event.target.value)} placeholder="Enter your city" />
                  {errors.city ? <small className="field-error">{errors.city}</small> : null}
                </label>
              </>
            )}
          </div>

          {role === 'student' ? (
            <>
              <label>
                Interests
                <textarea
                  rows="4"
                  value={values.interests}
                  onChange={(event) => updateField('interests', event.target.value)}
                  placeholder="Comma-separated interests like marketing, design, volunteering, startups"
                />
                {errors.interests ? <small className="field-error">{errors.interests}</small> : null}
              </label>

              <label>
                Skills
                <textarea
                  rows="4"
                  value={values.skills}
                  onChange={(event) => updateField('skills', event.target.value)}
                  placeholder="Comma-separated skills like communication, research, Canva, coding"
                />
                {errors.skills ? <small className="field-error">{errors.skills}</small> : null}
              </label>

              <label>
                Experience goals
                <textarea
                  rows="4"
                  value={values.experience_goals}
                  onChange={(event) => updateField('experience_goals', event.target.value)}
                  placeholder="What kind of real-world experience are you trying to build?"
                />
                {errors.experience_goals ? <small className="field-error">{errors.experience_goals}</small> : null}
              </label>

              <label>
                Resume link (optional)
                <input
                  value={values.resume_link}
                  onChange={(event) => updateField('resume_link', event.target.value)}
                  placeholder="Add a shareable resume or portfolio link"
                />
              </label>
            </>
          ) : (
            <label>
              Description
              <textarea
                rows="6"
                value={values.description}
                onChange={(event) => updateField('description', event.target.value)}
                placeholder="Describe your organization and the kinds of student opportunities you want to offer."
              />
              {errors.description ? <small className="field-error">{errors.description}</small> : null}
            </label>
          )}

          <div className="button-row">
            <Button currentPath={currentPath} type="submit">
              Save profile
            </Button>
            <Button
              href={role === 'student' ? '/dashboard/student' : '/dashboard/organization'}
              onNavigate={onNavigate}
              currentPath={currentPath}
              variant="outline"
            >
              View dashboard
            </Button>
          </div>
        </form>
      </section>
    </div>
  )
}
