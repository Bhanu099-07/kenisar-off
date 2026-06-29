import { useState } from 'react'
import { gradeLevels } from '../data/content'
import { emailField, required } from './formValidation'
import { isSupabaseConfigured, supabase } from '../lib/supabaseClient'
import { ArrowIcon } from '../components/ui/ArrowIcon'
import { FormStatus } from '../components/ui/FormStatus'

const CONFIG_ERROR =
  'Form submissions are not configured yet. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your environment.'

export function StudentWaitlistForm() {
  const [values, setValues] = useState({
    fullName: '',
    email: '',
    school: '',
    gradeLevel: '',
    interests: '',
  })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')
  const [errorMessage, setErrorMessage] = useState('')

  function updateField(name, value) {
    setValues((current) => ({ ...current, [name]: value }))
    setErrors((current) => {
      const next = { ...current }
      delete next[name]
      return next
    })
    if (status === 'error') {
      setStatus('idle')
      setErrorMessage('')
    }
  }

  function validate() {
    const nextErrors = {}

    const fullNameError = required(values.fullName, 'Please enter your full name.')
    if (fullNameError) nextErrors.fullName = fullNameError

    const emailError = emailField(values.email)
    if (emailError) nextErrors.email = emailError

    const schoolError = required(values.school, 'Please enter your school.')
    if (schoolError) nextErrors.school = schoolError

    if (!values.gradeLevel) {
      nextErrors.gradeLevel = 'Please select your grade level.'
    }

    const interestsError = required(values.interests, 'Please tell us your interests.')
    if (interestsError) nextErrors.interests = interestsError

    return nextErrors
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const nextErrors = validate()

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }

    if (!isSupabaseConfigured) {
      setStatus('error')
      setErrorMessage(CONFIG_ERROR)
      return
    }

    setStatus('loading')
    setErrorMessage('')

    const { error } = await supabase.from('student_waitlist').insert({
      full_name: values.fullName.trim(),
      email: values.email.trim(),
      school: values.school.trim(),
      grade_level: values.gradeLevel,
      interests: values.interests.trim(),
    })

    if (error) {
      setStatus('error')
      setErrorMessage(error.message || 'Something went wrong. Please try again.')
      return
    }

    setStatus('success')
  }

  if (status === 'success') {
    return (
      <FormStatus
        status="success"
        successTitle="You are on the waitlist"
        successMessage="Thanks for joining. We will contact you as student-friendly opportunities become available."
      />
    )
  }

  return (
    <form className="form-card" onSubmit={handleSubmit} noValidate>
      <FormStatus status={status === 'error' ? 'error' : status === 'loading' ? 'loading' : 'idle'} message={errorMessage} />

      <div className="field-grid">
        <label>
          Full name
          <input
            type="text"
            value={values.fullName}
            onChange={(event) => updateField('fullName', event.target.value)}
            placeholder="Enter your full name"
            disabled={status === 'loading'}
          />
          {errors.fullName ? <small className="field-error">{errors.fullName}</small> : null}
        </label>

        <label>
          Email
          <input
            type="email"
            value={values.email}
            onChange={(event) => updateField('email', event.target.value)}
            placeholder="Enter your email address"
            disabled={status === 'loading'}
          />
          {errors.email ? <small className="field-error">{errors.email}</small> : null}
        </label>

        <label>
          School
          <input
            type="text"
            value={values.school}
            onChange={(event) => updateField('school', event.target.value)}
            placeholder="Enter your school name"
            disabled={status === 'loading'}
          />
          {errors.school ? <small className="field-error">{errors.school}</small> : null}
        </label>

        <label>
          Grade level
          <select
            value={values.gradeLevel}
            onChange={(event) => updateField('gradeLevel', event.target.value)}
            disabled={status === 'loading'}
          >
            <option value="">Select your grade level</option>
            {gradeLevels.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
          {errors.gradeLevel ? <small className="field-error">{errors.gradeLevel}</small> : null}
        </label>
      </div>

      <label>
        Interests
        <textarea
          rows="4"
          value={values.interests}
          onChange={(event) => updateField('interests', event.target.value)}
          placeholder="Tell us what industries, skills, or experiences interest you."
          disabled={status === 'loading'}
        />
        {errors.interests ? <small className="field-error">{errors.interests}</small> : null}
      </label>

      <button type="submit" className="button button--filled button--submit" disabled={status === 'loading'}>
        <span>{status === 'loading' ? 'Submitting…' : 'Join the waitlist'}</span>
        <ArrowIcon />
      </button>
    </form>
  )
}
