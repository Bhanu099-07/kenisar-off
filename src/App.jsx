import { startTransition, useEffect, useState } from 'react'
import heroStudent from './assets/kenisar-student-hero.png'
import './App.css'

const routes = {
  '/': 'home',
  '/students': 'students',
  '/opportunities': 'opportunities',
  '/partners': 'partners',
  '/about': 'about',
}

const navigation = [
  { label: 'Home', href: '/' },
  { label: 'Students', href: '/students' },
  { label: 'Opportunities', href: '/opportunities' },
  { label: 'Partners', href: '/partners' },
  { label: 'About', href: '/about' },
]

const studentBenefits = [
  {
    title: 'Find beginner-friendly opportunities',
    description:
      'Explore internships, volunteering, mentorships, workshops, and project-based experiences designed for students.',
  },
  {
    title: 'Build experience before graduation',
    description:
      'Start building your resume, confidence, and practical skills early instead of waiting until after school.',
  },
  {
    title: 'Connect with real organizations',
    description:
      'Get closer to businesses, mentors, and organizations that want to support student growth and career discovery.',
  },
]

const whoItsForCards = [
  {
    title: 'High School Students',
    description: 'Volunteer roles, mentorship, first resume experience, and school-friendly opportunities.',
  },
  {
    title: 'College Students',
    description: 'Internships, practical projects, workshops, and portfolio-building experience.',
  },
  {
    title: 'University Students',
    description: 'Career exposure, part-time roles, networking, mentorship, and industry experience.',
  },
]

const howItWorksSteps = [
  {
    title: 'Create a student profile',
    description: 'Share your basics, school level, interests, and the types of opportunities you want to explore.',
  },
  {
    title: 'Choose your focus areas',
    description: 'Tell Kenisar which experiences fit your goals, from volunteering and mentorship to internships.',
  },
  {
    title: 'Watch for opportunities',
    description: 'As student-friendly partners are added, Kenisar can notify you when relevant opportunities open.',
  },
]

const opportunityCategories = [
  'Internships',
  'Volunteering',
  'Mentorships',
  'Part-time roles',
  'Workshops',
  'Project-based experiences',
]

const partnerBenefits = [
  {
    title: 'Reach motivated students early',
    description: 'Meet students who are actively looking for meaningful first experience and guided career exposure.',
  },
  {
    title: 'Offer beginner-friendly roles',
    description: 'Share internships, volunteer roles, mentorships, workshops, or project-based opportunities.',
  },
  {
    title: 'Build community impact',
    description: 'Support student growth while creating more accessible pathways into real-world experience.',
  },
  {
    title: 'Create a future talent pipeline',
    description: 'Build early relationships with students who may grow into strong future contributors.',
  },
]

const partnerOpportunityTypes = [
  'Internships',
  'Volunteer roles',
  'Mentorships',
  'Part-time roles',
  'Workshops',
  'Project-based experiences',
]

const studentPreferenceOptions = [
  'Internships',
  'Volunteering',
  'Mentorships',
  'Part-time roles',
  'Workshops',
  'Projects',
]

const schoolLevels = ['High School', 'College', 'University']

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

function BrandMark() {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2">
        <path d="M10 18.5 31.8 8.2l22.2 10.3-22.2 10.2L10 18.5Z" />
        <path d="M21.4 24.1c2.8 1.5 6.5 2.4 10.4 2.4 4 0 7.8-.9 10.7-2.5" />
        <path d="M18.1 25.8v8c0 9 6.2 15.9 13.9 15.9s13.9-6.9 13.9-15.9v-8" />
        <path d="M54 18.4v8.8" />
        <path d="M54 27.2c0 1.3-.8 2.2-1.8 2.2s-1.8-.9-1.8-2.2.8-2.1 1.8-2.1 1.8.8 1.8 2.1Z" />
        <circle cx="18.4" cy="24.3" r="3.1" />
        <circle cx="45.6" cy="24.3" r="3.1" />
        <path d="M20.6 38.3c1-5.6 5.3-9.3 11.4-9.3 6 0 10.4 3.7 11.4 9.3" />
        <path d="M24.9 34.4c1.1-1.5 2.5-2.2 4.3-2.2" />
        <path d="M39.1 34.4c-1.1-1.5-2.5-2.2-4.3-2.2" />
        <circle cx="24.6" cy="40.2" r="2.1" fill="currentColor" stroke="none" />
        <circle cx="39.4" cy="40.2" r="2.1" fill="currentColor" stroke="none" />
        <path d="M29.2 38.9c.7-.8 1.6-1.2 2.8-1.2 1.2 0 2.1.4 2.8 1.2" />
        <path d="M30.4 41.3c.5.7 1 1 1.6 1 .6 0 1.1-.3 1.6-1" />
      </g>
    </svg>
  )
}

function Brand({ compact = false }) {
  return (
    <span className={`brand ${compact ? 'brand--compact' : ''}`}>
      <span className="brand-mark">
        <BrandMark />
      </span>
      <span className="brand-copy">
        <span className="brand-wordmark">KENISAR</span>
        {!compact ? <span className="brand-subline">Early-career opportunities for students</span> : null}
      </span>
    </span>
  )
}

function AppLink({ href, children, className, onNavigate, currentPath, onClick }) {
  const isActive = href === currentPath

  function handleClick(event) {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return
    }

    event.preventDefault()
    onClick?.()
    onNavigate(href)
  }

  return (
    <a
      href={href}
      onClick={handleClick}
      className={`${className ?? ''} ${isActive ? 'is-active' : ''}`.trim()}
      aria-current={isActive ? 'page' : undefined}
    >
      {children}
    </a>
  )
}

function PrimaryButton({ href, children, onNavigate, currentPath, variant = 'filled', onClick }) {
  return (
    <AppLink
      href={href}
      onNavigate={onNavigate}
      currentPath={currentPath}
      className={`button button--${variant}`}
      onClick={onClick}
    >
      <span>{children}</span>
      <ArrowIcon />
    </AppLink>
  )
}

function SectionLabel({ children, centered = false }) {
  return <p className={`section-label ${centered ? 'section-label--centered' : ''}`}>{children}</p>
}

function Hero({ onNavigate, currentPath }) {
  return (
    <section className="hero">
      <div className="hero__copy">
        <SectionLabel>Kenisar</SectionLabel>
        <h1>Find real opportunities before you graduate.</h1>
        <p>
          Kenisar helps high school, college, and university students discover beginner-friendly internships,
          volunteering, mentorships, part-time roles, workshops, and hands-on experiences.
        </p>
        <div className="button-row">
          <PrimaryButton href="/students" onNavigate={onNavigate} currentPath={currentPath}>
            Create Student Profile
          </PrimaryButton>
          <PrimaryButton href="/partners" onNavigate={onNavigate} currentPath={currentPath} variant="outline">
            For Partners
          </PrimaryButton>
        </div>
      </div>

      <div className="hero__media">
        <div className="hero__image-frame">
          <img src={heroStudent} alt="Student working on a laptop" />
        </div>
        <div className="hero__note-card">
          <strong>Built for first experience</strong>
          <p>Student onboarding, partner submissions, and a clean opportunities flow without fake listings.</p>
        </div>
      </div>
    </section>
  )
}

function HomePage({ onNavigate, currentPath }) {
  return (
    <div className="page page--home">
      <Hero onNavigate={onNavigate} currentPath={currentPath} />

      <section className="section">
        <SectionLabel>What Kenisar Helps Students Do</SectionLabel>
        <div className="card-grid card-grid--three">
          {studentBenefits.map((item) => (
            <article key={item.title} className="content-card">
              <h2>{item.title}</h2>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <SectionLabel centered>Who It Is For</SectionLabel>
        <div className="card-grid card-grid--three">
          {whoItsForCards.map((card) => (
            <article key={card.title} className="content-card content-card--light">
              <h2>{card.title}</h2>
              <p>{card.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <SectionLabel centered>How It Works</SectionLabel>
        <div className="card-grid card-grid--three">
          {howItWorksSteps.map((step, index) => (
            <article key={step.title} className="content-card content-card--light">
              <span className="step-number">0{index + 1}</span>
              <h2>{step.title}</h2>
              <p>{step.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section section--cta">
        <div className="cta-card">
          <div>
            <SectionLabel>Get Started</SectionLabel>
            <h2>Build a student profile or submit an opportunity for students.</h2>
            <p>Kenisar is structured like a real early-stage product, with simple onboarding and clear next steps.</p>
          </div>
          <div className="button-row">
            <PrimaryButton href="/students" onNavigate={onNavigate} currentPath={currentPath}>
              Get Started as a Student
            </PrimaryButton>
            <PrimaryButton href="/partners" onNavigate={onNavigate} currentPath={currentPath} variant="dark">
              Submit Partner Interest
            </PrimaryButton>
          </div>
        </div>
      </section>
    </div>
  )
}

function StudentForm() {
  const [values, setValues] = useState({
    name: '',
    email: '',
    schoolLevel: '',
    interests: '',
    location: '',
    preferences: [],
  })
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)

  function updateField(name, value) {
    setValues((current) => ({ ...current, [name]: value }))
    setErrors((current) => {
      const next = { ...current }
      delete next[name]
      delete next.preferences
      return next
    })
  }

  function togglePreference(preference) {
    setValues((current) => ({
      ...current,
      preferences: current.preferences.includes(preference)
        ? current.preferences.filter((item) => item !== preference)
        : [...current.preferences, preference],
    }))

    setErrors((current) => {
      const next = { ...current }
      delete next.preferences
      return next
    })
  }

  function validate() {
    const nextErrors = {}

    if (!values.name.trim()) {
      nextErrors.name = 'Please enter your full name.'
    }

    if (!values.email.trim()) {
      nextErrors.email = 'Please enter your email.'
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      nextErrors.email = 'Please enter a valid email address.'
    }

    if (!values.schoolLevel) {
      nextErrors.schoolLevel = 'Please select your school level.'
    }

    if (!values.interests.trim()) {
      nextErrors.interests = 'Please tell us your interests.'
    }

    if (!values.location.trim()) {
      nextErrors.location = 'Please add your location.'
    }

    if (values.preferences.length === 0) {
      nextErrors.preferences = 'Choose at least one opportunity preference.'
    }

    return nextErrors
  }

  function handleSubmit(event) {
    event.preventDefault()
    const nextErrors = validate()

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }

    startTransition(() => {
      setSubmitted(true)
    })
  }

  if (submitted) {
    return (
      <div className="success-state" role="status">
        <h2>Student profile submitted</h2>
        <p>Thanks - your interest has been submitted. Kenisar will contact you as opportunities open.</p>
      </div>
    )
  }

  return (
    <form className="form-card" onSubmit={handleSubmit} noValidate>
      <div className="field-grid">
        <label>
          Full name
          <input
            type="text"
            value={values.name}
            onChange={(event) => updateField('name', event.target.value)}
            placeholder="Enter your full name"
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
          />
          {errors.email ? <small className="field-error">{errors.email}</small> : null}
        </label>

        <label>
          School level
          <select value={values.schoolLevel} onChange={(event) => updateField('schoolLevel', event.target.value)}>
            <option value="">Select your school level</option>
            {schoolLevels.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
          {errors.schoolLevel ? <small className="field-error">{errors.schoolLevel}</small> : null}
        </label>

        <label>
          Location
          <input
            type="text"
            value={values.location}
            onChange={(event) => updateField('location', event.target.value)}
            placeholder="City, region, or country"
          />
          {errors.location ? <small className="field-error">{errors.location}</small> : null}
        </label>
      </div>

      <label>
        Interests
        <textarea
          rows="4"
          value={values.interests}
          onChange={(event) => updateField('interests', event.target.value)}
          placeholder="Tell us what industries, skills, or experiences interest you."
        />
        {errors.interests ? <small className="field-error">{errors.interests}</small> : null}
      </label>

      <div className="field-stack">
        <span className="field-label">Opportunity preferences</span>
        <div className="choice-grid">
          {studentPreferenceOptions.map((preference) => (
            <button
              key={preference}
              type="button"
              className={`choice-chip ${values.preferences.includes(preference) ? 'choice-chip--selected' : ''}`}
              onClick={() => togglePreference(preference)}
            >
              {preference}
            </button>
          ))}
        </div>
        {errors.preferences ? <small className="field-error">{errors.preferences}</small> : null}
      </div>

      <button type="submit" className="button button--filled button--submit">
        <span>Submit Student Profile</span>
        <ArrowIcon />
      </button>
    </form>
  )
}

function StudentsPage() {
  return (
    <div className="page">
      <section className="page-hero">
        <SectionLabel>Students</SectionLabel>
        <h1>Create your student profile.</h1>
        <p>
          Kenisar is built for students who want a clearer path into internships, volunteering, mentorships, workshops,
          and early practical experience.
        </p>
      </section>

      <section className="section section--narrow">
        <StudentForm />
      </section>
    </div>
  )
}

function OpportunitiesPage({ onNavigate, currentPath }) {
  return (
    <div className="page">
      <section className="page-hero">
        <SectionLabel>Opportunities</SectionLabel>
        <h1>No opportunities are live yet.</h1>
        <p>
          Kenisar is currently onboarding student-friendly partners. Create a student profile to be notified when
          opportunities are available.
        </p>
      </section>

      <section className="section section--narrow">
        <div className="empty-state-card">
          <div>
            <SectionLabel>Current Focus</SectionLabel>
            <h2>Student opportunities, built for real first experience.</h2>
            <p>
              Kenisar helps students discover beginner-friendly internships, volunteering, mentorships, part-time
              roles, workshops, and project-based experiences as partner opportunities become available.
            </p>
          </div>

          <div className="tag-list">
            {opportunityCategories.map((category) => (
              <span key={category} className="tag-pill">
                {category}
              </span>
            ))}
          </div>

          <div className="button-row">
            <PrimaryButton href="/students" onNavigate={onNavigate} currentPath={currentPath}>
              Create Student Profile
            </PrimaryButton>
            <PrimaryButton href="/partners" onNavigate={onNavigate} currentPath={currentPath} variant="dark">
              For Partners
            </PrimaryButton>
          </div>
        </div>
      </section>
    </div>
  )
}

function PartnerForm() {
  const [values, setValues] = useState({
    organizationName: '',
    contactName: '',
    email: '',
    opportunityType: '',
    studentLevel: '',
    description: '',
  })
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)

  function updateField(name, value) {
    setValues((current) => ({ ...current, [name]: value }))
    setErrors((current) => {
      const next = { ...current }
      delete next[name]
      return next
    })
  }

  function validate() {
    const nextErrors = {}

    if (!values.organizationName.trim()) {
      nextErrors.organizationName = 'Please enter your organization name.'
    }

    if (!values.contactName.trim()) {
      nextErrors.contactName = 'Please enter a contact name.'
    }

    if (!values.email.trim()) {
      nextErrors.email = 'Please enter your email.'
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      nextErrors.email = 'Please enter a valid email address.'
    }

    if (!values.opportunityType) {
      nextErrors.opportunityType = 'Please select an opportunity type.'
    }

    if (!values.studentLevel) {
      nextErrors.studentLevel = 'Please select a student level.'
    }

    if (!values.description.trim()) {
      nextErrors.description = 'Please describe the opportunity.'
    }

    return nextErrors
  }

  function handleSubmit(event) {
    event.preventDefault()
    const nextErrors = validate()

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }

    startTransition(() => {
      setSubmitted(true)
    })
  }

  if (submitted) {
    return (
      <div className="success-state success-state--light" role="status">
        <h2>Partner interest submitted</h2>
        <p>Thanks - your interest has been submitted. Kenisar will contact you as opportunities open.</p>
      </div>
    )
  }

  return (
    <form className="form-card form-card--light" onSubmit={handleSubmit} noValidate>
      <div className="field-grid">
        <label>
          Organization name
          <input
            type="text"
            value={values.organizationName}
            onChange={(event) => updateField('organizationName', event.target.value)}
            placeholder="Enter organization name"
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
          />
          {errors.email ? <small className="field-error">{errors.email}</small> : null}
        </label>

        <label>
          Opportunity type
          <select value={values.opportunityType} onChange={(event) => updateField('opportunityType', event.target.value)}>
            <option value="">Select opportunity type</option>
            {partnerOpportunityTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          {errors.opportunityType ? <small className="field-error">{errors.opportunityType}</small> : null}
        </label>

        <label className="field-grid__wide">
          Student level
          <select value={values.studentLevel} onChange={(event) => updateField('studentLevel', event.target.value)}>
            <option value="">Select student level</option>
            {schoolLevels.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
          {errors.studentLevel ? <small className="field-error">{errors.studentLevel}</small> : null}
        </label>
      </div>

      <label>
        Description
        <textarea
          rows="5"
          value={values.description}
          onChange={(event) => updateField('description', event.target.value)}
          placeholder="Describe the opportunity, what students will learn, and how your team can support them."
        />
        {errors.description ? <small className="field-error">{errors.description}</small> : null}
      </label>

      <button type="submit" className="button button--filled button--submit">
        <span>Submit Partner Interest</span>
        <ArrowIcon />
      </button>
    </form>
  )
}

function PartnersPage() {
  return (
    <div className="page">
      <section className="page-hero page-hero--dark">
        <SectionLabel>Partners</SectionLabel>
        <h1>Submit opportunities built for students.</h1>
        <p>
          Kenisar is for organizations that want to offer internships, volunteer roles, mentorships, workshops, and
          project-based experiences that are genuinely beginner-friendly.
        </p>
      </section>

      <section className="section">
        <SectionLabel>Why Partner With Kenisar</SectionLabel>
        <div className="card-grid card-grid--four">
          {partnerBenefits.map((benefit) => (
            <article key={benefit.title} className="content-card content-card--light">
              <h2>{benefit.title}</h2>
              <p>{benefit.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <SectionLabel>Opportunity Types</SectionLabel>
        <div className="tag-list tag-list--dense">
          {partnerOpportunityTypes.map((type) => (
            <span key={type} className="tag-pill tag-pill--dark">
              {type}
            </span>
          ))}
        </div>
      </section>

      <section className="section section--narrow">
        <PartnerForm />
      </section>
    </div>
  )
}

function AboutPage() {
  return (
    <div className="page">
      <section className="page-hero">
        <SectionLabel>About</SectionLabel>
        <h1>What Kenisar is and why it exists.</h1>
        <p>
          Kenisar is an early-career opportunity platform for students. It exists to help high school, college, and
          university students find clearer paths into real-world experience before graduation.
        </p>
      </section>

      <section className="section section--narrow">
        <div className="content-stack">
          <article className="content-card content-card--light">
            <h2>What Kenisar is</h2>
            <p>
              A student-focused product that connects early learners with internships, volunteering, mentorships,
              workshops, part-time roles, and project-based opportunities.
            </p>
          </article>

          <article className="content-card content-card--light">
            <h2>Why it exists</h2>
            <p>
              Many students need first experience, but most platforms are built for people who already have it. Kenisar
              is designed to close that gap.
            </p>
          </article>

          <article className="content-card content-card--light">
            <h2>What problem it solves</h2>
            <p>
              It gives students and partners a cleaner place to start, with honest onboarding and a structure that can
              grow into a real opportunity platform.
            </p>
          </article>
        </div>
      </section>
    </div>
  )
}

function PageContent({ routeKey, onNavigate, currentPath }) {
  if (routeKey === 'students') {
    return <StudentsPage />
  }

  if (routeKey === 'opportunities') {
    return <OpportunitiesPage onNavigate={onNavigate} currentPath={currentPath} />
  }

  if (routeKey === 'partners') {
    return <PartnersPage />
  }

  if (routeKey === 'about') {
    return <AboutPage />
  }

  return <HomePage onNavigate={onNavigate} currentPath={currentPath} />
}

function AppShell({ routeKey, currentPath, onNavigate }) {
  const [menuOpen, setMenuOpen] = useState(false)

  function closeMenu() {
    setMenuOpen(false)
  }

  return (
    <div className="page-shell">
      <header className="site-header">
        <AppLink href="/" onNavigate={onNavigate} currentPath={currentPath} className="brand-link" onClick={closeMenu}>
          <Brand compact />
        </AppLink>

        <button
          type="button"
          className="menu-toggle"
          aria-expanded={menuOpen}
          aria-controls="site-nav"
          onClick={() => setMenuOpen((current) => !current)}
        >
          Menu
        </button>

        <nav id="site-nav" className={`site-nav ${menuOpen ? 'site-nav--open' : ''}`} aria-label="Primary">
          {navigation.map((item) => (
            <AppLink
              key={item.href}
              href={item.href}
              onNavigate={onNavigate}
              currentPath={currentPath}
              onClick={closeMenu}
            >
              {item.label}
            </AppLink>
          ))}
        </nav>

        <div className="header-cta">
          <PrimaryButton href="/students" onNavigate={onNavigate} currentPath={currentPath} onClick={closeMenu}>
            Create Student Profile
          </PrimaryButton>
        </div>
      </header>

      <main>
        <PageContent routeKey={routeKey} onNavigate={onNavigate} currentPath={currentPath} />
      </main>

      <footer className="site-footer">
        <div className="footer-brand">
          <Brand />
          <p>Kenisar helps students move toward real early-career experience with clear onboarding and honest product flows.</p>
        </div>

        <div className="footer-column">
          <h3>About</h3>
          <AppLink href="/about" onNavigate={onNavigate} currentPath={currentPath}>
            About Kenisar
          </AppLink>
        </div>

        <div className="footer-column">
          <h3>For Students</h3>
          <AppLink href="/students" onNavigate={onNavigate} currentPath={currentPath}>
            Create Student Profile
          </AppLink>
          <AppLink href="/opportunities" onNavigate={onNavigate} currentPath={currentPath}>
            Opportunities
          </AppLink>
        </div>

        <div className="footer-column">
          <h3>For Partners</h3>
          <AppLink href="/partners" onNavigate={onNavigate} currentPath={currentPath}>
            Submit Partner Interest
          </AppLink>
        </div>

        <div className="footer-column">
          <h3>Contact</h3>
          <p>Contact details coming soon.</p>
          <p>Privacy / Terms</p>
        </div>
      </footer>
    </div>
  )
}

function getRouteKey(pathname) {
  return routes[pathname] ?? 'home'
}

function App() {
  const [currentPath, setCurrentPath] = useState(() => window.location.pathname)

  useEffect(() => {
    const handlePopState = () => {
      startTransition(() => {
        setCurrentPath(window.location.pathname)
      })
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  useEffect(() => {
    const titleMap = {
      home: 'Kenisar | Early-Career Opportunities for Students',
      students: 'Students | Kenisar',
      opportunities: 'Opportunities | Kenisar',
      partners: 'Partners | Kenisar',
      about: 'About | Kenisar',
    }

    document.title = titleMap[getRouteKey(currentPath)]
  }, [currentPath])

  function navigate(nextPath) {
    if (nextPath === currentPath) {
      return
    }

    window.history.pushState({}, '', nextPath)
    startTransition(() => {
      setCurrentPath(nextPath)
    })
    window.scrollTo({ top: 0, behavior: 'auto' })
  }

  return <AppShell routeKey={getRouteKey(currentPath)} currentPath={currentPath} onNavigate={navigate} />
}

export default App
