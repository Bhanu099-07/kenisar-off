import { useEffect, useState } from 'react'
import { Button } from '../components/ui/Button'
import { FormStatus } from '../components/ui/FormStatus'
import { PageHero } from '../components/ui/PageHero'
import { SectionLabel } from '../components/ui/SectionLabel'
import { useAuth } from '../components/auth/useAuth'
import { getDashboardPathForRole } from '../config/admin'
import { emailField, required } from '../forms/formValidation'
import {
  signInWithPassword,
  signUpOrganization,
  signUpStudent,
  SUPABASE_CONFIG_ERROR,
} from '../lib/kenisarApi'

const authCopy = {
  organization: {
    dashboardPath: '/dashboard/organization',
    helper: 'Create an organization account to submit beginner-friendly opportunity listings and manage review status.',
    label: 'For Organizations',
    profilePath: '/profile/organization',
    signInTitle: 'Sign in as an organization',
    signUpTitle: 'Create your organization account',
    title: 'Organization accounts for real opportunity posting.',
  },
  student: {
    dashboardPath: '/dashboard/student',
    helper: 'Create a student account to build your profile, save opportunities, and track your applications in one place.',
    label: 'For Students',
    profilePath: '/profile/student',
    signInTitle: 'Sign in as a student',
    signUpTitle: 'Create your student account',
    title: 'Student accounts built for real early-career momentum.',
  },
}

function AuthToggle({ isActive, label, onClick }) {
  return (
    <button
      type="button"
      className={`auth-toggle ${isActive ? 'auth-toggle--active' : ''}`}
      onClick={onClick}
      aria-pressed={isActive}
    >
      {label}
    </button>
  )
}

export function AuthPage({ currentPath, onNavigate, role }) {
  const authConfig = authCopy[role]
  const { loading, role: currentRole, user } = useAuth()
  const [mode, setMode] = useState('signup')
  const [values, setValues] = useState({
    confirmPassword: '',
    contactName: '',
    email: '',
    fullName: '',
    organizationName: '',
    password: '',
  })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (loading || !user) return

    const targetRole = currentRole ?? role
    onNavigate(getDashboardPathForRole(targetRole))
  }, [currentRole, loading, onNavigate, role, user])

  function updateField(name, value) {
    setValues((current) => ({ ...current, [name]: value }))
    setErrors((current) => {
      const next = { ...current }
      delete next[name]
      return next
    })
    if (status !== 'idle') {
      setStatus('idle')
      setMessage('')
    }
  }

  function validate() {
    const nextErrors = {}

    const emailError = emailField(values.email)
    if (emailError) nextErrors.email = emailError

    const passwordError = required(values.password, 'Please enter a password.')
    if (passwordError) nextErrors.password = passwordError

    if (mode === 'signup') {
      if (values.password.trim().length < 8) {
        nextErrors.password = 'Use at least 8 characters for your password.'
      }

      if (values.password !== values.confirmPassword) {
        nextErrors.confirmPassword = 'Your passwords do not match.'
      }

      if (role === 'student') {
        const nameError = required(values.fullName, 'Please enter your full name.')
        if (nameError) nextErrors.fullName = nameError
      }

      if (role === 'organization') {
        const orgError = required(values.organizationName, 'Please enter your organization name.')
        if (orgError) nextErrors.organizationName = orgError

        const contactError = required(values.contactName, 'Please enter a contact name.')
        if (contactError) nextErrors.contactName = contactError
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

    setStatus('loading')
    setMessage('')

    try {
      if (mode === 'login') {
        const { resolvedRole } = await signInWithPassword({
          email: values.email.trim(),
          password: values.password,
        })

        onNavigate(getDashboardPathForRole(resolvedRole ?? role))
        return
      }

      const result =
        role === 'student'
          ? await signUpStudent({
              email: values.email.trim(),
              fullName: values.fullName.trim(),
              password: values.password,
            })
          : await signUpOrganization({
              contactName: values.contactName.trim(),
              email: values.email.trim(),
              organizationName: values.organizationName.trim(),
              password: values.password,
            })

      if (result.session) {
        onNavigate(result.assignedRole === 'admin' ? '/dashboard/admin' : authConfig.profilePath)
        return
      }

      setStatus('success')
      setMessage('Account created. Check your email, confirm your address, then sign in to continue.')
    } catch (error) {
      setStatus('error')
      setMessage(error.message || SUPABASE_CONFIG_ERROR)
    }
  }

  if (loading && user) {
    return (
      <div className="page">
        <PageHero
          label={authConfig.label}
          title="Loading your account."
          description="Kenisar is getting your dashboard ready."
          theme={role === 'student' ? 'students' : 'partners'}
        />
      </div>
    )
  }

  return (
    <div className="page">
      <PageHero
        label={authConfig.label}
        title={authConfig.title}
        description={authConfig.helper}
        theme={role === 'student' ? 'students' : 'partners'}
      />

      <section className="section section--narrow" data-reveal="section">
        <div className="page-stack">
          <div className="content-card content-card--light" data-reveal="card" data-tilt>
            <SectionLabel>Account Access</SectionLabel>
            <h2>{mode === 'signup' ? authConfig.signUpTitle : authConfig.signInTitle}</h2>
            <p>Use your account to move from interest forms into a real profile and dashboard workflow.</p>
          </div>

          <form className="form-card form-card--light" onSubmit={handleSubmit} noValidate data-reveal="card" data-tilt>
            <div className="auth-toggle-row">
              <AuthToggle isActive={mode === 'signup'} label="Create account" onClick={() => setMode('signup')} />
              <AuthToggle isActive={mode === 'login'} label="Sign in" onClick={() => setMode('login')} />
            </div>

            {status === 'success' ? (
              <div className="form-status form-status--success" role="status">
                <p>{message}</p>
              </div>
            ) : (
              <FormStatus status={status === 'error' ? 'error' : status === 'loading' ? 'loading' : 'idle'} message={message} />
            )}

            <div className="field-grid">
              {mode === 'signup' && role === 'student' ? (
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
              ) : null}

              {mode === 'signup' && role === 'organization' ? (
                <>
                  <label>
                    Organization name
                    <input
                      type="text"
                      value={values.organizationName}
                      onChange={(event) => updateField('organizationName', event.target.value)}
                      placeholder="Enter your organization name"
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
                      placeholder="Enter a contact name"
                      disabled={status === 'loading'}
                    />
                    {errors.contactName ? <small className="field-error">{errors.contactName}</small> : null}
                  </label>
                </>
              ) : null}

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
                Password
                <input
                  type="password"
                  value={values.password}
                  onChange={(event) => updateField('password', event.target.value)}
                  placeholder="Enter your password"
                  disabled={status === 'loading'}
                />
                {errors.password ? <small className="field-error">{errors.password}</small> : null}
              </label>

              {mode === 'signup' ? (
                <label>
                  Confirm password
                  <input
                    type="password"
                    value={values.confirmPassword}
                    onChange={(event) => updateField('confirmPassword', event.target.value)}
                    placeholder="Confirm your password"
                    disabled={status === 'loading'}
                  />
                  {errors.confirmPassword ? <small className="field-error">{errors.confirmPassword}</small> : null}
                </label>
              ) : null}
            </div>

            <div className="button-row button-row--auth">
              <Button currentPath={currentPath} type="submit">
                {mode === 'signup' ? 'Create account' : 'Sign in'}
              </Button>
            </div>
          </form>
        </div>
      </section>
    </div>
  )
}
