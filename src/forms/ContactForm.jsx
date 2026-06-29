import { useState } from 'react'
import { emailField, required } from './formValidation'
import { isSupabaseConfigured, supabase } from '../lib/supabaseClient'
import { ArrowIcon } from '../components/ui/ArrowIcon'
import { FormStatus } from '../components/ui/FormStatus'

const CONFIG_ERROR =
  'Form submissions are not configured yet. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your environment.'

export function ContactForm() {
  const [values, setValues] = useState({
    name: '',
    email: '',
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

    const nameError = required(values.name, 'Please enter your name.')
    if (nameError) nextErrors.name = nameError

    const emailError = emailField(values.email)
    if (emailError) nextErrors.email = emailError

    const messageError = required(values.message, 'Please enter a message.')
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

    const { error } = await supabase.from('contact_messages').insert({
      name: values.name.trim(),
      email: values.email.trim(),
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
        successTitle="Message sent"
        successMessage="Thanks for reaching out. We will get back to you as soon as we can."
      />
    )
  }

  return (
    <form className="form-card" onSubmit={handleSubmit} noValidate>
      <FormStatus status={status === 'error' ? 'error' : status === 'loading' ? 'loading' : 'idle'} message={errorMessage} />

      <div className="field-grid">
        <label>
          Name
          <input
            type="text"
            value={values.name}
            onChange={(event) => updateField('name', event.target.value)}
            placeholder="Enter your name"
            disabled={status === 'loading'}
          />
          {errors.name ? <small className="field-error">{errors.name}</small> : null}
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
      </div>

      <label>
        Message
        <textarea
          rows="5"
          value={values.message}
          onChange={(event) => updateField('message', event.target.value)}
          placeholder="How can we help?"
          disabled={status === 'loading'}
        />
        {errors.message ? <small className="field-error">{errors.message}</small> : null}
      </label>

      <button type="submit" className="button button--filled button--submit" disabled={status === 'loading'}>
        <span>{status === 'loading' ? 'Submitting…' : 'Send message'}</span>
        <ArrowIcon />
      </button>
    </form>
  )
}
