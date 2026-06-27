import { startTransition, useState } from 'react'
import heroStudent from './assets/kenisar-student-hero.png'
import './App.css'

const navigation = [
  { label: 'Students', href: '#student-onboarding' },
  { label: 'Partners', href: '#partner-section' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'About', href: '#why-kenisar' },
]

const productTags = ['Internships', 'Mentorships', 'Volunteering', 'Part-time roles', 'Workshops', 'Projects']

const previewCategories = [
  { title: 'Internships', note: 'Hands-on team experience' },
  { title: 'Mentorships', note: 'Guidance from experienced people' },
  { title: 'Volunteering', note: 'School-friendly impact opportunities' },
  { title: 'Projects', note: 'Portfolio and practical skill building' },
]

const previewSteps = [
  'Complete your basic profile',
  'Save your interests and preferred experience types',
  'Review opportunity matches as partner roles become available',
]

const whoItsForCards = [
  {
    title: 'High School Students',
    description:
      'Volunteer roles, mentorship, first resume experience, school-friendly opportunities.',
  },
  {
    title: 'College Students',
    description:
      'Internships, practical projects, workshops, and portfolio-building experience.',
  },
  {
    title: 'University Students',
    description:
      'Career exposure, part-time roles, networking, mentorship, and industry experience.',
  },
]

const howItWorksSteps = [
  {
    icon: 'profile',
    title: 'Create your student profile',
    description: 'Add your basic details so Kenisar understands where you are in your career journey.',
  },
  {
    icon: 'spark',
    title: 'Tell us your interests',
    description: 'Choose the opportunity types, themes, and learning areas you want to focus on.',
  },
  {
    icon: 'compass',
    title: 'See relevant opportunities',
    description: 'Browse beginner-friendly roles and review matches as partner opportunities become available.',
  },
  {
    icon: 'growth',
    title: 'Build real experience',
    description: 'Use each opportunity to strengthen your resume, your confidence, and your next step.',
  },
]

const categories = [
  {
    icon: 'briefcase',
    title: 'Internships',
    description: 'Structured early-career roles where students can learn by contributing to real teams.',
  },
  {
    icon: 'heart',
    title: 'Volunteering',
    description: 'Community-facing experiences that help students build confidence, initiative, and impact.',
  },
  {
    icon: 'people',
    title: 'Mentorships',
    description: 'Support from people who can guide students through career questions and practical next steps.',
  },
  {
    icon: 'bag',
    title: 'Part-Time Roles',
    description: 'Flexible work experiences that help students earn, learn, and gain exposure at the same time.',
  },
  {
    icon: 'rocket',
    title: 'Project-Based Work',
    description: 'Shorter real-world projects that let students build a portfolio and practice useful skills.',
  },
  {
    icon: 'board',
    title: 'Workshops',
    description: 'Focused learning experiences that turn curiosity into action and clearer career direction.',
  },
]

const studentInterests = ['Business', 'Design', 'Technology', 'Marketing', 'Community impact', 'Research']
const studentPreferences = ['Remote', 'Hybrid', 'On-site', 'Flexible schedule']
const studentSchoolLevels = ['High School', 'College', 'University']

const partnerBenefits = [
  'Reach motivated students early',
  'Offer beginner-friendly roles',
  'Build community impact',
  'Create a future talent pipeline',
]

const partnerOpportunityTypes = ['Internship', 'Volunteer role', 'Mentorship', 'Part-time role', 'Workshop', 'Project']
const partnerStudentLevels = ['High School', 'College', 'University']

const differenceCards = [
  {
    icon: 'student',
    title: 'Built only for students',
    description: 'Kenisar focuses on first experience, not mid-career hiring.',
  },
  {
    icon: 'leaf',
    title: 'Beginner-friendly by default',
    description: 'The platform is designed for learners who still need a practical entry point.',
  },
  {
    icon: 'briefcase',
    title: 'Experience over empty promises',
    description: 'Every flow is built around helping students gain useful, real-world exposure.',
  },
  {
    icon: 'growth',
    title: 'Designed before graduation',
    description: 'Students can start earlier, build momentum sooner, and approach the future with more clarity.',
  },
]

const footerColumns = [
  {
    title: 'About',
    items: [{ label: 'Why Kenisar', href: '#why-kenisar' }],
  },
  {
    title: 'For Students',
    items: [
      { label: 'Create Student Profile', href: '#student-onboarding' },
      { label: 'Find Opportunities', href: '#opportunity-categories' },
    ],
  },
  {
    title: 'For Partners',
    items: [{ label: 'Submit Partner Interest', href: '#partner-section' }],
  },
]

function ArrowIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path
        d="M4.5 10h10m-4-4 4 4-4 4"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.6"
      />
    </svg>
  )
}

function Icon({ name }) {
  const common = {
    fill: 'none',
    stroke: 'currentColor',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    strokeWidth: '1.7',
  }

  switch (name) {
    case 'search':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="11" cy="11" r="6.5" {...common} />
          <path d="m16 16 4 4" {...common} />
        </svg>
      )
    case 'briefcase':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M8 7V5.8c0-.99.81-1.8 1.8-1.8h4.4c.99 0 1.8.81 1.8 1.8V7" {...common} />
          <rect x="4" y="7" width="16" height="12.5" rx="2.3" {...common} />
          <path d="M4 11.25h16" {...common} />
        </svg>
      )
    case 'heart':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M12 19.3 5.7 13c-2.3-2.3-2.3-6 0-8.2 2.1-2.1 5.4-2.1 7.5 0l.8.8.8-.8c2.1-2.1 5.4-2.1 7.5 0 2.3 2.3 2.3 6 0 8.2L12 19.3Z"
            {...common}
          />
        </svg>
      )
    case 'people':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="9" cy="9" r="3.2" {...common} />
          <path d="M3.8 18c.5-2.8 2.8-4.8 5.7-4.8s5.2 2 5.7 4.8" {...common} />
          <circle cx="17.5" cy="9.2" r="2.4" {...common} />
          <path d="M15.4 14c1.8.25 3.4 1.46 4.1 3.2" {...common} />
        </svg>
      )
    case 'cap':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M3.5 9.5 12 5l8.5 4.5L12 14 3.5 9.5Z" {...common} />
          <path d="M7 11.6V15c0 1.7 2.2 3 5 3s5-1.3 5-3v-3.4" {...common} />
          <path d="M20.5 9.5v4.8" {...common} />
        </svg>
      )
    case 'document':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M8 3.8h6.8L19 8v11.2A1.8 1.8 0 0 1 17.2 21H8A1.8 1.8 0 0 1 6.2 19.2V5.6A1.8 1.8 0 0 1 8 3.8Z" {...common} />
          <path d="M14.8 3.8V8H19" {...common} />
          <path d="M9.2 12.2h5.8M9.2 15.6h5.8" {...common} />
        </svg>
      )
    case 'bag':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M8.6 8V6.6A3.4 3.4 0 0 1 12 3.2a3.4 3.4 0 0 1 3.4 3.4V8" {...common} />
          <path d="M5.2 8h13.6l-.9 10.3A2 2 0 0 1 15.9 20H8.1a2 2 0 0 1-2-1.7L5.2 8Z" {...common} />
        </svg>
      )
    case 'rocket':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M14.5 4.5c-3 .6-5.6 3.1-7 6.8l5.2 5.2c3.7-1.4 6.2-4 6.8-7-.8-2.2-2.8-4.2-5-5Z" {...common} />
          <path d="m7.5 11.3-2.8 1.2 2.3 2.3-1.1 3 3-1.1 2.3 2.3 1.2-2.8" {...common} />
          <circle cx="14.4" cy="9.6" r="1.2" {...common} />
        </svg>
      )
    case 'board':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <rect x="4.5" y="5" width="15" height="11.5" rx="1.8" {...common} />
          <path d="M8 19.5 12 16.5l4 3M9 9l1.8 2 3-3.5" {...common} />
        </svg>
      )
    case 'profile':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="10" cy="8.3" r="3.6" {...common} />
          <path d="M4.5 18.6c.7-3.1 3.1-5.2 5.9-5.2 2.8 0 5.2 2.1 5.9 5.2" {...common} />
          <circle cx="18.2" cy="15.8" r="2.8" {...common} />
          <path d="m17.1 15.8.8.9 1.5-1.8" {...common} />
        </svg>
      )
    case 'spark':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 4.2 13.8 9l4.8 1.8-4.8 1.8L12 17.4l-1.8-4.8L5.4 10.8 10.2 9 12 4.2Z" {...common} />
        </svg>
      )
    case 'compass':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="8" {...common} />
          <path d="m9 15 1.6-4.6L15 9l-1.6 4.6L9 15Z" {...common} />
        </svg>
      )
    case 'growth':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M5 18.5V13M10 18.5V9.5M15 18.5V12M20 18.5V5.5" {...common} />
          <path d="m8 7 4-3 3 2 4-2.5" {...common} />
        </svg>
      )
    case 'student':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M3.5 8.8 12 4.5l8.5 4.3L12 13 3.5 8.8Z" {...common} />
          <path d="M7.5 11v3.1c0 1.7 2 3 4.5 3s4.5-1.3 4.5-3V11" {...common} />
          <path d="M12 13v3.8M8 19.5c1.2-1.1 2.5-1.7 4-1.7s2.8.6 4 1.7" {...common} />
        </svg>
      )
    case 'leaf':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M18.8 5.2c-4.7-.1-8.3 1.9-10.4 5.7-1.3 2.4-1.7 4.8-1.9 7.9 3-.2 5.5-.7 7.9-1.9 3.8-2 5.8-5.6 5.7-10.3Z" {...common} />
          <path d="M7.2 16.8c2.7-2.9 5.5-5.2 9.4-7.2" {...common} />
        </svg>
      )
    case 'check':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="8.2" {...common} />
          <path d="m8.4 12.2 2.3 2.4 4.8-5" {...common} />
        </svg>
      )
    case 'pin':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 20s6-5.7 6-10a6 6 0 1 0-12 0c0 4.3 6 10 6 10Z" {...common} />
          <circle cx="12" cy="10" r="2.1" {...common} />
        </svg>
      )
    default:
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="7" {...common} />
        </svg>
      )
  }
}

function BrandMark() {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.4">
        <path d="M8 19 32 8l24 11-24 11L8 19Z" />
        <path d="M18 25v10.5c0 7.5 8 13.5 14 13.5s14-6 14-13.5V25" />
        <path d="M56 19v12" />
        <path d="M32 8v7" />
        <path d="M21.5 34.5c1.2-5.5 5.3-9 10.5-9s9.3 3.5 10.5 9" />
        <circle cx="25.5" cy="33" r="1.6" fill="currentColor" stroke="none" />
        <circle cx="38.5" cy="33" r="1.6" fill="currentColor" stroke="none" />
        <path d="M28.5 39c1.7 1.5 5.3 1.5 7 0" />
        <path d="M19.5 37c-2.3-.6-4.5-1.8-6.4-3.5" />
        <path d="M44.5 37c2.3-.6 4.5-1.8 6.4-3.5" />
      </g>
    </svg>
  )
}

function Brand({ footer = false }) {
  return (
    <a className={`brand ${footer ? 'brand--footer' : ''}`} href="#top" aria-label="Kenisar home">
      <span className="brand-mark">
        <BrandMark />
      </span>
      <span className="brand-copy">
        <span className="brand-wordmark">KENISAR</span>
        {footer ? <span className="brand-subline">Early-career opportunities for students</span> : null}
      </span>
    </a>
  )
}

function ActionButton({ href, variant = 'filled', children }) {
  return (
    <a className={`action-button action-button--${variant}`} href={href}>
      <span>{children}</span>
      <ArrowIcon />
    </a>
  )
}

function SectionLabel({ children, centered = false }) {
  return <p className={`section-label ${centered ? 'section-label--centered' : ''}`}>{children}</p>
}

function DashboardPreview() {
  return (
    <section className="product-preview-section" id="product-preview">
      <div className="product-preview-copy">
        <SectionLabel>Platform Preview</SectionLabel>
        <h2>Student opportunities, built for real first experience</h2>
        <p>
          Kenisar helps students discover beginner-friendly internships, volunteering, mentorships, part-time roles,
          workshops, and project-based experiences as partner opportunities become available.
        </p>
        <div className="preview-actions">
          <ActionButton href="#student-onboarding">Create Student Profile</ActionButton>
          <ActionButton href="#partner-section" variant="outline-dark">
            Submit Partner Interest
          </ActionButton>
        </div>
      </div>

      <div className="dashboard-shell" aria-label="Kenisar dashboard preview">
        <aside className="dashboard-sidebar">
          <div>
            <span className="dashboard-sidebar__label">Student profile</span>
            <strong>Ready for matching</strong>
          </div>
          <ul className="dashboard-nav-list">
            <li className="dashboard-nav-item dashboard-nav-item--active">Profile overview</li>
            <li className="dashboard-nav-item">Saved interests</li>
            <li className="dashboard-nav-item">Opportunity categories</li>
            <li className="dashboard-nav-item">Matching status</li>
          </ul>
          <p className="dashboard-sidebar__hint">Partner opportunities will appear when available.</p>
        </aside>

        <div className="dashboard-main">
          <div className="dashboard-card dashboard-card--profile">
            <div className="dashboard-card__header">
              <div>
                <span className="dashboard-eyebrow">Profile progress</span>
                <h3>Profile ready for matching</h3>
              </div>
              <span className="status-pill status-pill--gold">Complete</span>
            </div>
            <div className="progress-meter">
              <span className="progress-meter__value">85%</span>
              <div className="progress-meter__track">
                <span className="progress-meter__fill"></span>
              </div>
            </div>
            <ul className="check-list">
              <li>
                <Icon name="check" />
                Basic info saved
              </li>
              <li>
                <Icon name="check" />
                School level selected
              </li>
              <li>
                <Icon name="check" />
                Opportunity preferences saved
              </li>
            </ul>
          </div>

          <div className="dashboard-card dashboard-card--status">
            <div className="dashboard-card__header">
              <div>
                <span className="dashboard-eyebrow">Matching status</span>
                <h3>Active student profile</h3>
              </div>
              <span className="status-pill status-pill--soft">Live</span>
            </div>
            <p>
              Kenisar keeps your profile ready so you can review relevant opportunities as partner roles open.
            </p>
            <div className="dashboard-tags">
              {productTags.map((tag) => (
                <span key={tag} className="tag-chip">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="dashboard-card dashboard-card--categories">
            <div className="dashboard-card__header">
              <div>
                <span className="dashboard-eyebrow">Opportunity categories</span>
                <h3>Built for beginner-friendly discovery</h3>
              </div>
            </div>
            <div className="dashboard-category-grid">
              {previewCategories.map((category) => (
                <article key={category.title} className="dashboard-mini-card">
                  <strong>{category.title}</strong>
                  <small>{category.note}</small>
                </article>
              ))}
            </div>
          </div>

          <div className="dashboard-card dashboard-card--steps">
            <div className="dashboard-card__header">
              <div>
                <span className="dashboard-eyebrow">Recommended next steps</span>
                <h3>Keep your profile useful</h3>
              </div>
            </div>
            <ol className="next-step-list">
              {previewSteps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  )
}

function StepIndicator({ steps, currentStep }) {
  return (
    <div className="step-indicator" aria-label="Form progress">
      {steps.map((step, index) => {
        const isActive = index === currentStep
        const isComplete = index < currentStep

        return (
          <div
            key={step.title}
            className={`step-indicator__item ${isActive ? 'step-indicator__item--active' : ''} ${
              isComplete ? 'step-indicator__item--complete' : ''
            }`}
          >
            <span className="step-indicator__count">0{index + 1}</span>
            <span className="step-indicator__copy">
              <strong>{step.title}</strong>
              <small>{step.helper}</small>
            </span>
          </div>
        )
      })}
    </div>
  )
}

function StudentOnboardingForm() {
  const steps = [
    { title: 'Basic info', helper: 'Tell us who you are' },
    { title: 'School level', helper: 'Choose your current level' },
    { title: 'Interests', helper: 'Select your focus areas' },
    { title: 'Location preferences', helper: 'Share where and how you want to work' },
    { title: 'Submit profile', helper: 'Review and finish' },
  ]

  const [currentStep, setCurrentStep] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState({})
  const [values, setValues] = useState({
    fullName: '',
    email: '',
    schoolLevel: '',
    interests: [],
    location: '',
    preference: '',
    resumeName: '',
  })

  function setFieldValue(name, value) {
    setValues((current) => ({ ...current, [name]: value }))
    setErrors((current) => {
      if (!current[name] && !(name === 'interests' && current.interests)) {
        return current
      }

      const next = { ...current }
      delete next[name]
      delete next.interests
      return next
    })
  }

  function toggleInterest(interest) {
    setValues((current) => {
      const nextInterests = current.interests.includes(interest)
        ? current.interests.filter((item) => item !== interest)
        : [...current.interests, interest]

      return { ...current, interests: nextInterests }
    })

    setErrors((current) => {
      const next = { ...current }
      delete next.interests
      return next
    })
  }

  function validateStep(stepIndex) {
    const nextErrors = {}

    if (stepIndex === 0) {
      if (!values.fullName.trim()) {
        nextErrors.fullName = 'Please enter your full name.'
      }

      if (!values.email.trim()) {
        nextErrors.email = 'Please enter your email address.'
      }
    }

    if (stepIndex === 1 && !values.schoolLevel) {
      nextErrors.schoolLevel = 'Please select your school level.'
    }

    if (stepIndex === 2 && values.interests.length === 0) {
      nextErrors.interests = 'Choose at least one interest area.'
    }

    if (stepIndex === 3) {
      if (!values.location.trim()) {
        nextErrors.location = 'Please add your location.'
      }

      if (!values.preference) {
        nextErrors.preference = 'Please choose a work preference.'
      }
    }

    return nextErrors
  }

  function handleNext() {
    const nextErrors = validateStep(currentStep)

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }

    setErrors({})
    setCurrentStep((step) => Math.min(step + 1, steps.length - 1))
  }

  function handleBack() {
    setErrors({})
    setCurrentStep((step) => Math.max(step - 1, 0))
  }

  function handleSubmit(event) {
    event.preventDefault()
    const nextErrors = [0, 1, 2, 3].reduce((allErrors, stepIndex) => {
      return { ...allErrors, ...validateStep(stepIndex) }
    }, {})

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      setCurrentStep(Math.max(0, steps.findIndex((_, index) => Object.keys(validateStep(index)).length > 0)))
      return
    }

    startTransition(() => {
      setSubmitted(true)
    })
  }

  if (submitted) {
    return (
      <div className="success-panel" role="status">
        <span className="success-panel__icon">
          <Icon name="check" />
        </span>
        <h3>Profile submitted</h3>
        <p>Thanks - your interest has been submitted. Kenisar will contact you as opportunities open.</p>
      </div>
    )
  }

  return (
    <form className="onboarding-form" onSubmit={handleSubmit}>
      <StepIndicator steps={steps} currentStep={currentStep} />

      <div className="onboarding-form__panel">
        <div className="onboarding-form__header">
          <div>
            <span className="dashboard-eyebrow">Step 0{currentStep + 1}</span>
            <h3>{steps[currentStep].title}</h3>
          </div>
          <p>{steps[currentStep].helper}</p>
        </div>

        {currentStep === 0 ? (
          <div className="field-grid">
            <label>
              Full name
              <input
                type="text"
                name="fullName"
                value={values.fullName}
                onChange={(event) => setFieldValue('fullName', event.target.value)}
                placeholder="Enter your full name"
              />
              {errors.fullName ? <small className="field-error">{errors.fullName}</small> : null}
            </label>
            <label>
              Email
              <input
                type="email"
                name="email"
                value={values.email}
                onChange={(event) => setFieldValue('email', event.target.value)}
                placeholder="Enter your email address"
              />
              {errors.email ? <small className="field-error">{errors.email}</small> : null}
            </label>
          </div>
        ) : null}

        {currentStep === 1 ? (
          <label>
            School level
            <select
              name="schoolLevel"
              value={values.schoolLevel}
              onChange={(event) => setFieldValue('schoolLevel', event.target.value)}
            >
              <option value="">Select your school level</option>
              {studentSchoolLevels.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
            {errors.schoolLevel ? <small className="field-error">{errors.schoolLevel}</small> : null}
          </label>
        ) : null}

        {currentStep === 2 ? (
          <div className="field-stack">
            <label>Interests</label>
            <div className="chip-grid" role="group" aria-label="Student interests">
              {studentInterests.map((interest) => (
                <button
                  key={interest}
                  type="button"
                  className={`choice-chip ${values.interests.includes(interest) ? 'choice-chip--selected' : ''}`}
                  onClick={() => toggleInterest(interest)}
                >
                  {interest}
                </button>
              ))}
            </div>
            {errors.interests ? <small className="field-error">{errors.interests}</small> : null}
          </div>
        ) : null}

        {currentStep === 3 ? (
          <div className="field-grid">
            <label>
              Location
              <input
                type="text"
                name="location"
                value={values.location}
                onChange={(event) => setFieldValue('location', event.target.value)}
                placeholder="City, region, or country"
              />
              {errors.location ? <small className="field-error">{errors.location}</small> : null}
            </label>
            <label>
              Preferred setup
              <select
                name="preference"
                value={values.preference}
                onChange={(event) => setFieldValue('preference', event.target.value)}
              >
                <option value="">Select a preference</option>
                {studentPreferences.map((preference) => (
                  <option key={preference} value={preference}>
                    {preference}
                  </option>
                ))}
              </select>
              {errors.preference ? <small className="field-error">{errors.preference}</small> : null}
            </label>
            <label className="field-grid__wide">
              Resume upload (optional)
              <input
                type="file"
                name="resume"
                accept=".pdf,.doc,.docx"
                onChange={(event) => setFieldValue('resumeName', event.target.files?.[0]?.name ?? '')}
              />
              <small className="field-help">
                {values.resumeName ? `Selected: ${values.resumeName}` : 'Optional. PDF, DOC, or DOCX up to 5MB.'}
              </small>
            </label>
          </div>
        ) : null}

        {currentStep === 4 ? (
          <div className="review-panel">
            <article>
              <span className="review-label">Basic info</span>
              <strong>{values.fullName || 'Not provided yet'}</strong>
              <small>{values.email || 'No email added yet'}</small>
            </article>
            <article>
              <span className="review-label">School level</span>
              <strong>{values.schoolLevel || 'No level selected yet'}</strong>
            </article>
            <article>
              <span className="review-label">Your interests</span>
              <strong>{values.interests.length > 0 ? values.interests.join(', ') : 'No interests selected yet'}</strong>
            </article>
            <article>
              <span className="review-label">Location and preference</span>
              <strong>{values.location || 'No location added yet'}</strong>
              <small>{values.preference || 'No preference selected yet'}</small>
            </article>
          </div>
        ) : null}
      </div>

      <div className="form-actions">
        <button type="button" className="secondary-button" onClick={handleBack} disabled={currentStep === 0}>
          Back
        </button>
        {currentStep < steps.length - 1 ? (
          <button type="button" className="primary-button" onClick={handleNext}>
            Continue
          </button>
        ) : (
          <button type="submit" className="primary-button">
            Submit profile
          </button>
        )}
      </div>
    </form>
  )
}

function PartnerOnboardingForm() {
  const steps = [
    { title: 'Organization info', helper: 'Tell us who is posting' },
    { title: 'Opportunity type', helper: 'Share the role or experience' },
    { title: 'Student level wanted', helper: 'Select who the role is best for' },
    { title: 'Submit interest', helper: 'Review and finish' },
  ]

  const [currentStep, setCurrentStep] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState({})
  const [values, setValues] = useState({
    organizationName: '',
    contactName: '',
    email: '',
    opportunityType: '',
    description: '',
    studentLevels: [],
  })

  function setFieldValue(name, value) {
    setValues((current) => ({ ...current, [name]: value }))
    setErrors((current) => {
      const next = { ...current }
      delete next[name]
      delete next.studentLevels
      return next
    })
  }

  function toggleStudentLevel(level) {
    setValues((current) => {
      const nextLevels = current.studentLevels.includes(level)
        ? current.studentLevels.filter((item) => item !== level)
        : [...current.studentLevels, level]

      return { ...current, studentLevels: nextLevels }
    })

    setErrors((current) => {
      const next = { ...current }
      delete next.studentLevels
      return next
    })
  }

  function validateStep(stepIndex) {
    const nextErrors = {}

    if (stepIndex === 0) {
      if (!values.organizationName.trim()) {
        nextErrors.organizationName = 'Please add your organization name.'
      }

      if (!values.contactName.trim()) {
        nextErrors.contactName = 'Please add a contact name.'
      }

      if (!values.email.trim()) {
        nextErrors.email = 'Please add your email address.'
      }
    }

    if (stepIndex === 1) {
      if (!values.opportunityType) {
        nextErrors.opportunityType = 'Please choose an opportunity type.'
      }

      if (!values.description.trim()) {
        nextErrors.description = 'Please describe the opportunity.'
      }
    }

    if (stepIndex === 2 && values.studentLevels.length === 0) {
      nextErrors.studentLevels = 'Choose at least one student level.'
    }

    return nextErrors
  }

  function handleNext() {
    const nextErrors = validateStep(currentStep)

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }

    setErrors({})
    setCurrentStep((step) => Math.min(step + 1, steps.length - 1))
  }

  function handleBack() {
    setErrors({})
    setCurrentStep((step) => Math.max(step - 1, 0))
  }

  function handleSubmit(event) {
    event.preventDefault()
    const nextErrors = [0, 1, 2].reduce((allErrors, stepIndex) => {
      return { ...allErrors, ...validateStep(stepIndex) }
    }, {})

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      setCurrentStep(Math.max(0, steps.findIndex((_, index) => Object.keys(validateStep(index)).length > 0)))
      return
    }

    startTransition(() => {
      setSubmitted(true)
    })
  }

  if (submitted) {
    return (
      <div className="success-panel success-panel--light" role="status">
        <span className="success-panel__icon">
          <Icon name="check" />
        </span>
        <h3>Partner interest submitted</h3>
        <p>Thanks - your interest has been submitted. Kenisar will contact you as opportunities open.</p>
      </div>
    )
  }

  return (
    <form className="onboarding-form onboarding-form--light" onSubmit={handleSubmit}>
      <StepIndicator steps={steps} currentStep={currentStep} />

      <div className="onboarding-form__panel onboarding-form__panel--light">
        <div className="onboarding-form__header">
          <div>
            <span className="dashboard-eyebrow">Step 0{currentStep + 1}</span>
            <h3>{steps[currentStep].title}</h3>
          </div>
          <p>{steps[currentStep].helper}</p>
        </div>

        {currentStep === 0 ? (
          <div className="field-grid">
            <label>
              Organization name
              <input
                type="text"
                name="organizationName"
                value={values.organizationName}
                onChange={(event) => setFieldValue('organizationName', event.target.value)}
                placeholder="Enter organization name"
              />
              {errors.organizationName ? <small className="field-error">{errors.organizationName}</small> : null}
            </label>
            <label>
              Contact name
              <input
                type="text"
                name="contactName"
                value={values.contactName}
                onChange={(event) => setFieldValue('contactName', event.target.value)}
                placeholder="Enter contact name"
              />
              {errors.contactName ? <small className="field-error">{errors.contactName}</small> : null}
            </label>
            <label className="field-grid__wide">
              Email
              <input
                type="email"
                name="email"
                value={values.email}
                onChange={(event) => setFieldValue('email', event.target.value)}
                placeholder="Enter your email address"
              />
              {errors.email ? <small className="field-error">{errors.email}</small> : null}
            </label>
          </div>
        ) : null}

        {currentStep === 1 ? (
          <div className="field-stack">
            <label>
              Opportunity type
              <select
                name="opportunityType"
                value={values.opportunityType}
                onChange={(event) => setFieldValue('opportunityType', event.target.value)}
              >
                <option value="">Select opportunity type</option>
                {partnerOpportunityTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              {errors.opportunityType ? <small className="field-error">{errors.opportunityType}</small> : null}
            </label>
            <label>
              Description
              <textarea
                name="description"
                rows="5"
                value={values.description}
                onChange={(event) => setFieldValue('description', event.target.value)}
                placeholder="Describe the opportunity, the experience students will gain, and what support you can provide."
              />
              {errors.description ? <small className="field-error">{errors.description}</small> : null}
            </label>
          </div>
        ) : null}

        {currentStep === 2 ? (
          <div className="field-stack">
            <label>Student level wanted</label>
            <div className="chip-grid" role="group" aria-label="Student levels wanted">
              {partnerStudentLevels.map((level) => (
                <button
                  key={level}
                  type="button"
                  className={`choice-chip ${values.studentLevels.includes(level) ? 'choice-chip--selected' : ''}`}
                  onClick={() => toggleStudentLevel(level)}
                >
                  {level}
                </button>
              ))}
            </div>
            {errors.studentLevels ? <small className="field-error">{errors.studentLevels}</small> : null}
          </div>
        ) : null}

        {currentStep === 3 ? (
          <div className="review-panel">
            <article>
              <span className="review-label">Organization</span>
              <strong>{values.organizationName || 'No organization name yet'}</strong>
              <small>{values.contactName || 'No contact name yet'}</small>
            </article>
            <article>
              <span className="review-label">Opportunity type</span>
              <strong>{values.opportunityType || 'No opportunity type yet'}</strong>
            </article>
            <article>
              <span className="review-label">Student level wanted</span>
              <strong>{values.studentLevels.length > 0 ? values.studentLevels.join(', ') : 'No student levels yet'}</strong>
            </article>
            <article>
              <span className="review-label">Opportunity summary</span>
              <strong>{values.description || 'No description yet'}</strong>
            </article>
          </div>
        ) : null}
      </div>

      <div className="form-actions">
        <button type="button" className="secondary-button secondary-button--light" onClick={handleBack} disabled={currentStep === 0}>
          Back
        </button>
        {currentStep < steps.length - 1 ? (
          <button type="button" className="primary-button" onClick={handleNext}>
            Continue
          </button>
        ) : (
          <button type="submit" className="primary-button">
            Submit interest
          </button>
        )}
      </div>
    </form>
  )
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false)

  function handleNavigationClick() {
    setMenuOpen(false)
  }

  return (
    <div className="page-shell" id="top">
      <header className="site-header">
        <Brand />

        <button
          type="button"
          className="menu-toggle"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-controls="site-navigation"
        >
          Menu
        </button>

        <nav
          id="site-navigation"
          className={`site-nav ${menuOpen ? 'site-nav--open' : ''}`}
          aria-label="Primary"
        >
          {navigation.map((item) => (
            <a key={item.label} href={item.href} onClick={handleNavigationClick}>
              {item.label}
            </a>
          ))}
          <a className="sign-in-button" href="#opportunity-categories" onClick={handleNavigationClick}>
            Find Opportunities
          </a>
        </nav>
      </header>

      <main>
        <section className="hero-section">
          <div className="hero-grid">
            <div className="hero-copy">
              <h1>
                <span>Find Real Opportunities</span>
                <span className="hero-copy__accent">Before You Graduate</span>
              </h1>
              <p className="hero-subtitle">
                Kenisar helps high school, college, and university students build early-career momentum through
                internships, volunteering, mentorships, part-time roles, workshops, and project-based experience.
              </p>
              <div className="hero-actions">
                <ActionButton href="#student-onboarding">Create Student Profile</ActionButton>
                <ActionButton href="#partner-section" variant="outline">
                  Submit Partner Interest
                </ActionButton>
              </div>
              <p className="hero-supporting-note">
                Create your profile now, save your interests, and review matches as partner opportunities become
                available.
              </p>
            </div>

            <div className="hero-visual">
              <div className="hero-photo-frame">
                <img src={heroStudent} alt="Student working on a laptop" />
              </div>

              <article className="hero-floating-card hero-floating-card--profile">
                <div className="hero-floating-card__header">
                  <span className="hero-floating-card__label">Student profile</span>
                  <span className="status-pill status-pill--soft">Ready</span>
                </div>
                <h2>Profile ready for matching</h2>
                <p>Basic info, your interests, and your learning goals are saved.</p>
              </article>

              <article className="hero-floating-card hero-floating-card--categories">
                <div className="hero-floating-card__header">
                  <span className="hero-floating-card__label">Saved interests</span>
                </div>
                <div className="hero-chip-list">
                  {productTags.slice(0, 4).map((tag) => (
                    <span key={tag} className="tag-chip tag-chip--dark">
                      {tag}
                    </span>
                  ))}
                </div>
              </article>

              <article className="hero-floating-card hero-floating-card--status">
                <div className="hero-floating-card__header">
                  <span className="hero-floating-card__label">Matching status</span>
                  <span className="status-pill status-pill--gold">Active</span>
                </div>
                <p>Partner opportunities will appear when available.</p>
              </article>
            </div>
          </div>
        </section>

        <DashboardPreview />

        <section className="who-section" id="who-its-for">
          <SectionLabel centered>Who It Is For</SectionLabel>
          <h2>Built for students at every early step</h2>
          <div className="who-grid">
            {whoItsForCards.map((card) => (
              <article key={card.title} className="who-card">
                <h3>{card.title}</h3>
                <p>{card.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="how-section" id="how-it-works">
          <SectionLabel centered>How Kenisar Works</SectionLabel>
          <h2>A clearer path into first experience</h2>
          <div className="how-grid">
            {howItWorksSteps.map((step, index) => (
              <article key={step.title} className="how-card">
                <span className="how-card__icon">
                  <Icon name={step.icon} />
                </span>
                <span className="how-card__number">0{index + 1}</span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="categories-section" id="opportunity-categories">
          <div className="categories-surface">
            <div className="categories-heading">
              <div>
                <SectionLabel>Opportunity Categories</SectionLabel>
                <h2>Find opportunities that build useful momentum</h2>
              </div>
              <ActionButton href="#student-onboarding" variant="dark">
                Get Started as a Student
              </ActionButton>
            </div>
            <div className="categories-grid">
              {categories.map((category) => (
                <article key={category.title} className="category-card">
                  <span className="icon-badge icon-badge--soft">
                    <Icon name={category.icon} />
                  </span>
                  <h3>{category.title}</h3>
                  <p>{category.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="student-section" id="student-onboarding">
          <div className="section-copy">
            <SectionLabel>Student Onboarding</SectionLabel>
            <h2>Create a student profile that is ready for matching</h2>
            <p>
              Save your basic info, school level, interests, and preferences so Kenisar can help you discover the
              right beginner-friendly opportunities as they become available.
            </p>
          </div>
          <StudentOnboardingForm />
        </section>

        <section className="partner-section" id="partner-section">
          <div className="partner-section__intro">
            <div className="section-copy section-copy--dark">
              <SectionLabel>For Partners</SectionLabel>
              <h2>Why partner with Kenisar?</h2>
              <p>
                Kenisar helps organizations reach motivated students earlier, shape beginner-friendly roles, and build
                stronger future talent relationships.
              </p>
            </div>
            <div className="partner-benefit-grid">
              {partnerBenefits.map((benefit) => (
                <article key={benefit} className="partner-benefit-card">
                  <span className="icon-badge icon-badge--dark">
                    <Icon name="check" />
                  </span>
                  <h3>{benefit}</h3>
                </article>
              ))}
            </div>
          </div>

          <div className="partner-form-shell">
            <div className="section-copy section-copy--light">
              <SectionLabel>Partner Onboarding</SectionLabel>
              <h2>Submit a beginner-friendly opportunity</h2>
              <p>
                Share the role, who it is for, and what students can learn. Kenisar uses that detail to shape clearer
                opportunities from the start.
              </p>
            </div>
            <PartnerOnboardingForm />
          </div>
        </section>

        <section className="difference-section" id="why-kenisar">
          <SectionLabel centered>Why Kenisar Is Different</SectionLabel>
          <h2>Purpose-built for student opportunity discovery</h2>
          <div className="difference-grid">
            {differenceCards.map((card) => (
              <article key={card.title} className="difference-card">
                <span className="icon-badge icon-badge--soft">
                  <Icon name={card.icon} />
                </span>
                <h3>{card.title}</h3>
                <p>{card.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="final-cta-section">
          <div className="final-cta-card">
            <div>
              <SectionLabel>Get Started</SectionLabel>
              <h2>Build your future with a profile that is ready for real opportunities.</h2>
              <p>
                Students can start with a clear profile now, and partners can submit opportunities that support real
                first experience.
              </p>
            </div>
            <div className="cta-actions">
              <a className="cta-button cta-button--gold" href="#student-onboarding">
                Get Started as a Student
              </a>
              <a className="cta-button cta-button--dark" href="#partner-section">
                Submit Partner Interest
              </a>
            </div>
          </div>
        </section>

        <footer className="site-footer">
          <div className="footer-brand">
            <Brand footer />
            <p>
              Kenisar is a student opportunity platform focused on helping learners gain practical early-career
              experience before graduation.
            </p>
          </div>

          {footerColumns.map((column) => (
            <div key={column.title} className="footer-column">
              <h3>{column.title}</h3>
              <ul>
                {column.items.map((item) => (
                  <li key={item.label}>
                    <a href={item.href}>{item.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="footer-column">
            <h3>Contact</h3>
            <p>Contact details coming soon.</p>
            <div className="footer-legal">
              <span>Privacy</span>
              <span>Terms</span>
            </div>
          </div>
        </footer>
      </main>
    </div>
  )
}

export default App
