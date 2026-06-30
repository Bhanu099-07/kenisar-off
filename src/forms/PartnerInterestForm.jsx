import { useState } from 'react'
import { organizationTypes } from '../data/content'
import { emailField, required } from './formValidation'
import { isSupabaseConfigured, supabase } from '../lib/supabaseClient'
import { ArrowIcon } from '../components/ui/ArrowIcon'
import { FormStatus } from '../components/ui/FormStatus'

const CONFIG_ERROR =
  'Form submissions are not configured yet. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your environment.'

export function PartnerInterestForm() {
  const [values, setValues] = useState({
    organizationName: '',
    contactName: '',
    email: '',
    organizationType: '',
    message: '',
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

    const orgError = required(values.organizationName, 'Please enter your organization name.')
    if (orgError) nextErrors.organizationName = orgError

    const contactError = required(values.contactName, 'Please enter a contact name.')
    if (contactError) nextErrors.contactName = contactError

    const emailError = emailField(values.email)
    if (emailError) nextErrors.email = emailError

    if (!values.organizationType) {
      nextErrors.organizationType = 'Please select an organization type.'
    }

    const messageError = required(values.message, 'Please include a message.')
    if (messageError) nextErrors.message = messageError

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

    const { error } = await supabase.from('partner_interest').insert({
      organization_name: values.organizationName.trim(),
      contact_name: values.contactName.trim(),
      email: values.email.trim(),
      organization_type: values.organizationType,
      message: values.message.trim(),
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
        successTitle="Partnership inquiry received"
        successMessage="Thanks for reaching out. Kenisar will review your inquiry and follow up if it fits a broader partnership conversation."
      />
    )
  }

  return (
    <form className="form-card form-card--light" onSubmit={handleSubmit} noValidate data-reveal="section" data-tilt>
      <div className="page-stack">
        <div>
          <h2>Partnership inquiry</h2>
          <p>
            This form is for sponsorships, collaborations, schools, and special partnerships. Normal organizations
            should create an account through the organization signup flow.
          </p>
        </div>

      <FormStatus status={status === 'error' ? 'error' : status === 'loading' ? 'loading' : 'idle'} message={errorMessage} />

      <div className="field-grid">
        <label>
          Organization name
          <input
            type="text"
            value={values.organizationName}
            onChange={(event) => updateField('organizationName', event.target.value)}
            placeholder="Enter organization name"
            disabled={status === 'loading'}
          />
          {errors.organizationName ? <small className="field-error">{errors.organizationName}</small> : null}
        </label>

        <label>
          Contact name
          <input
            type="text"
            value={values.contactName}
            onChange={(event) => updateField('contactName', event.target.value)}
            placeholder="Enter contact name"
            disabled={status === 'loading'}
          />
          {errors.contactName ? <small className="field-error">{errors.contactName}</small> : null}
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
          Organization type
          <select
            value={values.organizationType}
            onChange={(event) => updateField('organizationType', event.target.value)}
            disabled={status === 'loading'}
          >
            <option value="">Select organization type</option>
            {organizationTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          {errors.organizationType ? <small className="field-error">{errors.organizationType}</small> : null}
        </label>
      </div>

      <label>
        Message
        <textarea
          rows="5"
          value={values.message}
          onChange={(event) => updateField('message', event.target.value)}
          placeholder="Tell us about the partnership, collaboration, sponsorship, or special program you want to discuss."
          disabled={status === 'loading'}
        />
        {errors.message ? <small className="field-error">{errors.message}</small> : null}
      </label>

      <button type="submit" className="button button--accent button--submit" disabled={status === 'loading'}>
        <span>{status === 'loading' ? 'Submitting...' : 'Send partnership inquiry'}</span>
        <ArrowIcon />
      </button>
      </div>
    </form>
  )
}
