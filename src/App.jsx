import { startTransition, useState } from 'react'
import heroStudent from './assets/kenisar-student-hero.png'
import './App.css'

const navigation = [
  { label: "Who It's For", href: '#who-its-for' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'For Partners', href: '#partners' },
  { label: 'Waitlist', href: '#student-interest' },
]

const whatWeDoPoints = [
  {
    icon: 'search',
    title: 'Find beginner-friendly opportunities',
    description: 'Explore opportunities designed for students who are still building first experience.',
  },
  {
    icon: 'briefcase',
    title: 'Build experience',
    description: 'Get practical exposure that strengthens your confidence, skills, and portfolio.',
  },
  {
    icon: 'cap',
    title: 'Learn real-world skills',
    description: 'Grow through hands-on projects, mentorship, volunteering, and career-building work.',
  },
  {
    icon: 'people',
    title: 'Connect with businesses and mentors',
    description: 'Build relationships with organizations and people who want to support student growth.',
  },
  {
    icon: 'document',
    title: 'Strengthen your resume',
    description: 'Add meaningful experience that helps your resume stand out before graduation.',
  },
]

const whoItsForCards = [
  {
    title: 'High School Students',
    description: 'First experience, volunteering, mentorship, and early resume building.',
  },
  {
    title: 'College Students',
    description: 'Internships, projects, and skill-building opportunities that help you grow faster.',
  },
  {
    title: 'University Students',
    description: 'Career experience, networking, part-time roles, and stronger industry exposure.',
  },
]

const categories = [
  {
    icon: 'briefcase',
    title: 'Internships',
    description: 'Early career experience with real teams and meaningful work.',
  },
  {
    icon: 'heart',
    title: 'Volunteering',
    description: 'Student-friendly ways to contribute, learn, and build experience.',
  },
  {
    icon: 'people',
    title: 'Mentorships',
    description: 'Guidance from professionals who can help students move forward.',
  },
  {
    icon: 'bag',
    title: 'Part-Time Roles',
    description: 'Flexible work that supports income, growth, and practical exposure.',
  },
  {
    icon: 'rocket',
    title: 'Startup Projects',
    description: 'Hands-on work for students who want to help build something new.',
  },
  {
    icon: 'board',
    title: 'Workshops',
    description: 'Focused learning opportunities that turn interest into action.',
  },
]

const howItWorksSteps = [
  {
    icon: 'profile',
    title: 'Join the waitlist',
    description: 'Sign up early so we can notify you when opportunities go live.',
  },
  {
    icon: 'spark',
    title: 'Tell us your interests',
    description: "Share what you want to explore, what level you're at, and where you're based.",
  },
  {
    icon: 'send',
    title: 'Get matched with beginner-friendly opportunities',
    description: 'As partner opportunities launch, Kenisar will connect students with relevant openings.',
  },
  {
    icon: 'growth',
    title: 'Build experience before you graduate',
    description: 'Use early opportunities to grow your skills, resume, and confidence.',
  },
]

const differenceCards = [
  {
    icon: 'student',
    title: 'Built only for students',
    description: 'Kenisar focuses on early-career students, not experienced professionals.',
  },
  {
    icon: 'leaf',
    title: 'Beginner-friendly opportunities',
    description: 'The platform is designed around roles that welcome learners and first-time applicants.',
  },
  {
    icon: 'briefcase',
    title: 'Real-world experience focused',
    description: 'Kenisar is built to help students gain practical experience that actually moves them forward.',
  },
  {
    icon: 'growth',
    title: 'Helps students before they graduate',
    description: 'Students can start building momentum early instead of waiting until after graduation.',
  },
  {
    icon: 'star',
    title: 'Not just another job board',
    description: 'Kenisar is about thoughtful student onboarding, verified partners, and meaningful first opportunities.',
  },
]

const quickLinks = [
  { label: "Who It's For", href: '#who-its-for' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Waitlist', href: '#student-interest' },
  { label: 'For Partners', href: '#partners' },
]

const studentQuickLinks = [
  { label: 'Join Student Waitlist', href: '#student-interest' },
  { label: 'Opportunity Categories', href: '#what-we-do' },
  { label: 'Mentorships', href: '#what-we-do' },
  { label: 'Skill-Building Experiences', href: '#what-we-do' },
]

const partnerQuickLinks = [
  { label: 'Partner Interest Form', href: '#partner-interest' },
  { label: 'Internships', href: '#partners' },
  { label: 'Volunteer Roles', href: '#partners' },
  { label: 'Mentorship Openings', href: '#partners' },
]

const socialIcons = ['linkedin', 'instagram', 'facebook', 'youtube']

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
    case 'send':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M4 11.5 19.5 4l-4.8 16-3.2-5.5L4 11.5Z" {...common} />
          <path d="m11.5 14.5 8-10.5" {...common} />
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
    case 'star':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="m12 4.5 2.3 4.7 5.2.8-3.7 3.7.9 5.2-4.7-2.5-4.7 2.5.9-5.2-3.7-3.7 5.2-.8L12 4.5Z" {...common} />
        </svg>
      )
    case 'linkedin':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M7 9v8M7 6.5h.01M11 17V9h4a3 3 0 0 1 3 3v5M11 12a3 3 0 0 1 3-3" {...common} />
        </svg>
      )
    case 'instagram':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <rect x="4.5" y="4.5" width="15" height="15" rx="4" {...common} />
          <circle cx="12" cy="12" r="3.5" {...common} />
          <circle cx="17.2" cy="6.9" r=".7" fill="currentColor" stroke="none" />
        </svg>
      )
    case 'facebook':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M13.8 19v-6h2.4l.4-2.8h-2.8V8.4c0-.8.2-1.4 1.4-1.4h1.5V4.4c-.3 0-1.1-.1-2.1-.1-2.1 0-3.6 1.3-3.6 3.7v2.2H8.5V13H11v6" {...common} />
        </svg>
      )
    case 'youtube':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <rect x="4" y="6.5" width="16" height="11" rx="3" {...common} />
          <path d="m10 9.5 5 2.5-5 2.5v-5Z" {...common} />
        </svg>
      )
    case 'spark':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 4.2 13.8 9l4.8 1.8-4.8 1.8L12 17.4l-1.8-4.8L5.4 10.8 10.2 9 12 4.2Z" {...common} />
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

function StudentForm({ submitted, onSubmit }) {
  return (
    <form className="interest-form interest-form--dark" onSubmit={onSubmit}>
      <div className="field-grid">
        <label>
          Full name
          <input type="text" name="fullName" placeholder="Enter your full name" required />
        </label>
        <label>
          Email
          <input type="email" name="email" placeholder="Enter your email address" required />
        </label>
      </div>
      <div className="field-grid">
        <label>
          School level
          <select name="schoolLevel" defaultValue="" required>
            <option value="" disabled>
              Select your school level
            </option>
            <option>High School</option>
            <option>College</option>
            <option>University</option>
          </select>
        </label>
        <label>
          Interests
          <input type="text" name="interests" placeholder="e.g., design, tech, volunteering" required />
        </label>
      </div>
      <div className="field-grid">
        <label>
          Location
          <input type="text" name="location" placeholder="City, region, or remote" required />
        </label>
        <label className="file-field">
          Resume upload (optional)
          <input type="file" name="resume" accept=".pdf,.doc,.docx" />
          <small className="field-help">Optional. PDF, DOC, or DOCX up to 5MB.</small>
        </label>
      </div>
      <button type="submit" className="submit-button submit-button--gold">
        <span>Submit Interest</span>
        <ArrowIcon />
      </button>
      {submitted ? (
        <div className="success-banner success-banner--dark" role="status">
          <span className="success-banner__icon">OK</span>
          <p>Thanks! Your interest has been submitted. We'll let you know when student opportunities go live.</p>
        </div>
      ) : null}
    </form>
  )
}

function PartnerForm({ submitted, onSubmit }) {
  return (
    <form className="interest-form" onSubmit={onSubmit}>
      <div className="field-grid">
        <label>
          Organization name
          <input type="text" name="organizationName" placeholder="Enter organization name" required />
        </label>
        <label>
          Contact name
          <input type="text" name="contactName" placeholder="Enter contact name" required />
        </label>
      </div>
      <div className="field-grid">
        <label>
          Email
          <input type="email" name="email" placeholder="Enter your email address" required />
        </label>
        <label>
          Opportunity type
          <select name="opportunityType" defaultValue="" required>
            <option value="" disabled>
              Select opportunity type
            </option>
            <option>Internship</option>
            <option>Volunteer role</option>
            <option>Mentorship</option>
            <option>Part-time role</option>
            <option>Workshop</option>
            <option>Startup project</option>
          </select>
        </label>
      </div>
      <label>
        Description
        <textarea
          name="description"
          rows="4"
          placeholder="Tell us about the opportunity, who it is for, and how students can benefit."
          required
        />
      </label>
      <button type="submit" className="submit-button submit-button--gold">
        <span>Submit Interest</span>
        <ArrowIcon />
      </button>
      {submitted ? (
        <div className="success-banner" role="status">
          <span className="success-banner__icon">OK</span>
          <p>Thanks! Your interest has been submitted. We'll follow up as partner onboarding continues.</p>
        </div>
      ) : null}
    </form>
  )
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [submittedForms, setSubmittedForms] = useState({
    student: false,
    partner: false,
  })

  function handleSubmit(formKey) {
    return (event) => {
      event.preventDefault()
      event.currentTarget.reset()
      startTransition(() => {
        setSubmittedForms((current) => ({
          ...current,
          [formKey]: true,
        }))
      })
    }
  }

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
          <a className="sign-in-button" href="#student-interest" onClick={handleNavigationClick}>
            Join Student Waitlist
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
                Kenisar helps high school, college, and university students discover beginner-friendly internships,
                volunteering, mentorships, part-time roles, and hands-on experiences.
              </p>
              <div className="hero-actions">
                <ActionButton href="#student-interest">Join Student Waitlist</ActionButton>
                <ActionButton href="#partner-interest" variant="outline">
                  Partner With Kenisar
                </ActionButton>
              </div>
            </div>

            <div className="hero-visual">
              <div className="hero-photo-frame">
                <img src={heroStudent} alt="Student working on a laptop" />
              </div>

              <article className="hero-floating-card hero-floating-card--finder">
                <div className="finder-card__header">
                  <h2>Opportunity Paths</h2>
                  <span className="finder-card__search">
                    <Icon name="search" />
                  </span>
                </div>
                <ul className="finder-list">
                  {categories.slice(0, 4).map((category) => (
                    <li key={category.title}>
                      <span className="finder-list__icon">
                        <Icon name={category.icon} />
                      </span>
                      <span className="finder-list__copy">
                        <strong>{category.title}</strong>
                        <small>{category.description}</small>
                      </span>
                      <span className="finder-list__arrow">
                        <ArrowIcon />
                      </span>
                    </li>
                  ))}
                </ul>
              </article>

              <article className="hero-floating-card hero-floating-card--progress">
                <div className="status-dot"></div>
                <div>
                  <strong>Waitlist Open</strong>
                  <small>Students can join now</small>
                </div>
              </article>

              <article className="hero-floating-card hero-floating-card--mentor">
                <h2>Built for students who need a first real start.</h2>
                <p>Kenisar is focused on early opportunities, not inflated claims or fake listings.</p>
                <a href="#student-interest" className="submit-button submit-button--gold submit-button--compact">
                  <span>Join Waitlist</span>
                  <ArrowIcon />
                </a>
              </article>

              <article className="hero-floating-card hero-floating-card--recommended">
                <div className="recommended-header">
                  <span className="recommended-badge">
                    <Icon name="spark" />
                  </span>
                  <div>
                    <strong>Launch Focus</strong>
                    <small>Students + partner onboarding</small>
                  </div>
                </div>
                <ul className="recommended-list recommended-list--launch">
                  <li>
                    <span className="recommended-list__icon recommended-list__icon--blue"></span>
                    <span>
                      <strong>Student waitlist</strong>
                      <small>Join early and share your interests</small>
                    </span>
                  </li>
                  <li>
                    <span className="recommended-list__icon recommended-list__icon--green"></span>
                    <span>
                      <strong>Partner interest</strong>
                      <small>Help shape the first opportunity pipeline</small>
                    </span>
                  </li>
                </ul>
              </article>
            </div>
          </div>
        </section>

        <section className="who-section" id="who-its-for">
          <SectionLabel centered>Who Kenisar Is For</SectionLabel>
          <h2>Built for students at the beginning of their career journey</h2>
          <div className="who-grid">
            {whoItsForCards.map((card) => (
              <article key={card.title} className="who-card">
                <h3>{card.title}</h3>
                <p>{card.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="intro-categories-section" id="what-we-do">
          <div className="intro-categories-grid">
            <div className="intro-copy">
              <SectionLabel>What Kenisar Does</SectionLabel>
              <h2>
                We help students turn
                <br />
                potential into <span>progress.</span>
              </h2>
              <p>
                Kenisar is being built to connect students to beginner-friendly opportunities that build experience,
                teach real-world skills, and open doors before graduation.
              </p>
              <div className="what-we-do-list">
                {whatWeDoPoints.map((item) => (
                  <article key={item.title} className="what-we-do-item">
                    <span className="icon-badge icon-badge--soft">
                      <Icon name={item.icon} />
                    </span>
                    <div>
                      <h3>{item.title}</h3>
                      <p>{item.description}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <div className="categories-surface">
              <SectionLabel>Opportunity Categories</SectionLabel>
              <h2>Explore. Learn. Grow.</h2>
              <p>Kenisar is preparing a student-first set of real opportunity paths.</p>
              <div className="categories-grid">
                {categories.map((category) => (
                  <article key={category.title} className="category-card">
                    <span className="icon-badge">
                      <Icon name={category.icon} />
                    </span>
                    <h3>{category.title}</h3>
                    <p>{category.description}</p>
                  </article>
                ))}
              </div>
              <div className="surface-promo">
                <div className="surface-promo__brand">
                  <span className="surface-promo__logo">
                    <BrandMark />
                  </span>
                  <p>
                    Kenisar is designed to help students build a <span>future they can start early.</span>
                  </p>
                </div>
                <ActionButton href="#student-interest" variant="dark">
                  Join Waitlist
                </ActionButton>
              </div>
            </div>
          </div>
        </section>

        <section className="how-forms-section">
          <div className="journey-panel" id="how-it-works">
            <SectionLabel centered>How It Works</SectionLabel>
            <h2>A clearer path into early experience</h2>
            <div className="journey-steps">
              {howItWorksSteps.map((step, index) => (
                <article key={step.title} className="journey-step">
                  <span className="journey-step__icon">
                    <Icon name={step.icon} />
                  </span>
                  <span className="journey-step__number">0{index + 1}</span>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </article>
              ))}
            </div>
          </div>

          <section className="forms-section" id="interest-forms">
            <div className="forms-heading">
              <div>
                <SectionLabel>Get Started</SectionLabel>
                <h2>
                  Join early, <span>shape what launches.</span>
                </h2>
                <p>
                  Since live opportunities are still being onboarded, the main goal today is simple: students can join
                  the waitlist and partners can submit interest.
                </p>
              </div>
              <div className="forms-heading__aside">
                <span className="icon-badge icon-badge--soft icon-badge--large">
                  <Icon name="people" />
                </span>
                <div>
                  <h3>One platform. Two launch paths.</h3>
                  <p>
                    Students can join early, and businesses, organizations, and mentors can help shape the first wave
                    of opportunities.
                  </p>
                </div>
              </div>
            </div>

            <div className="forms-grid">
              <article className="form-panel form-panel--dark" id="student-interest">
                <div className="form-panel__header">
                  <span className="icon-badge icon-badge--outline-light">
                    <Icon name="student" />
                  </span>
                  <div>
                    <h3>Student Interest Form</h3>
                    <p>Tell us about yourself and the opportunities you're ready to explore.</p>
                  </div>
                </div>
                <StudentForm submitted={submittedForms.student} onSubmit={handleSubmit('student')} />
              </article>

              <article className="form-panel" id="partner-interest">
                <div className="form-panel__header">
                  <span className="icon-badge icon-badge--soft">
                    <Icon name="briefcase" />
                  </span>
                  <div>
                    <h3>Partner Interest Form</h3>
                    <p>Share what kind of beginner-friendly opportunity you want to offer.</p>
                  </div>
                </div>
                <PartnerForm submitted={submittedForms.partner} onSubmit={handleSubmit('partner')} />
              </article>
            </div>
          </section>
        </section>

        <section className="launch-state-section" id="opportunities">
          <div className="launch-state-card">
            <SectionLabel centered>Pre-Launch Update</SectionLabel>
            <h2>Opportunities are launching soon</h2>
            <p>
              We're currently onboarding student-friendly businesses, organizations, and mentors. Join the student
              waitlist to be notified when opportunities go live.
            </p>
            <div className="cta-actions cta-actions--centered">
              <a className="cta-button cta-button--gold" href="#student-interest">
                Join Student Waitlist
              </a>
              <a className="cta-button cta-button--dark" href="#partner-interest">
                Partner With Kenisar
              </a>
            </div>
          </div>
        </section>

        <section className="partner-difference-section" id="partners">
          <div className="partner-showcase partner-showcase--compact">
            <div className="partner-copy">
              <SectionLabel>For Businesses & Organizations</SectionLabel>
              <h2>
                Looking for <span>motivated</span>
                <br />
                student talent?
              </h2>
              <div className="section-underline section-underline--left"></div>
              <p>
                Kenisar is designed for organizations that want to share internships, volunteer roles, mentorships,
                workshops, and other beginner-friendly opportunities with students who are ready to grow.
              </p>
              <div className="partner-feature-list">
                <article>
                  <span className="icon-badge icon-badge--dark">
                    <Icon name="briefcase" />
                  </span>
                  <p>Beginner-friendly opportunities</p>
                </article>
                <article>
                  <span className="icon-badge icon-badge--dark">
                    <Icon name="people" />
                  </span>
                  <p>Student-first onboarding</p>
                </article>
                <article>
                  <span className="icon-badge icon-badge--dark">
                    <Icon name="cap" />
                  </span>
                  <p>Mentorship and growth pathways</p>
                </article>
              </div>
            </div>

            <article className="partner-preview-card">
              <h3>Partner launch focus</h3>
              <div className="preview-steps">
                <span className="preview-step preview-step--active">1</span>
                <span className="preview-step">2</span>
                <span className="preview-step">3</span>
              </div>
              <div className="preview-step-labels">
                <span>Share interest</span>
                <span>Define opportunity</span>
                <span>Launch with students</span>
              </div>
              <div className="preview-note-list">
                <p>Post roles built for early-career students.</p>
                <p>Set clear expectations and learning goals.</p>
                <p>Join the first verified partner wave.</p>
              </div>
              <a className="preview-link" href="#partner-interest">
                Submit Partner Interest
                <ArrowIcon />
              </a>
            </article>
          </div>

          <div className="difference-surface difference-surface--compact">
            <SectionLabel centered>Why Kenisar Is Different</SectionLabel>
            <h2>Student-first by design</h2>
            <div className="section-underline section-underline--center"></div>
            <div className="difference-grid">
              {differenceCards.map((card) => (
                <article key={card.title} className="difference-card">
                  <span className="icon-badge icon-badge--dark">
                    <Icon name={card.icon} />
                  </span>
                  <h3>{card.title}</h3>
                  <p>{card.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="cta-footer-wrap">
          <div className="cta-card">
            <div className="cta-card__copy">
              <h2>Ready to start?</h2>
              <div className="section-underline section-underline--left"></div>
              <p>Join the student waitlist or partner with Kenisar while the first real opportunities are being prepared.</p>
              <div className="cta-actions">
                <a className="cta-button cta-button--gold" href="#student-interest">
                  Join Student Waitlist
                </a>
                <a className="cta-button cta-button--dark" href="#partner-interest">
                  Partner With Kenisar
                </a>
              </div>
            </div>
            <div className="cta-card__illustration" aria-hidden="true">
              <Icon name="cap" />
              <Icon name="briefcase" />
              <Icon name="leaf" />
            </div>
          </div>

          <footer className="site-footer">
            <div className="footer-brand">
              <Brand footer />
              <p>
                Kenisar is an early-career platform for students seeking internships, volunteering, mentorships,
                part-time roles, and real-world experience before graduation.
              </p>
              <div className="social-list">
                {socialIcons.map((name) => (
                  <a key={name} href="#top" aria-label={`${name} placeholder`}>
                    <Icon name={name} />
                  </a>
                ))}
              </div>
            </div>

            <div className="footer-column">
              <h3>Quick Links</h3>
              <ul>
                {quickLinks.map((link) => (
                  <li key={link.label}>
                    <a href={link.href}>{link.label}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer-column">
              <h3>For Students</h3>
              <ul>
                {studentQuickLinks.map((link) => (
                  <li key={link.label}>
                    <a href={link.href}>{link.label}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer-column">
              <h3>For Partners</h3>
              <ul>
                {partnerQuickLinks.map((link) => (
                  <li key={link.label}>
                    <a href={link.href}>{link.label}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer-column">
              <h3>Contact</h3>
              <p>Contact details coming soon.</p>
            </div>

            <div className="footer-bottom">
              <p>&copy; 2026 Kenisar. All rights reserved.</p>
              <div className="footer-bottom__links">
                <a href="#top">Privacy Policy</a>
                <a href="#top">Terms of Service</a>
                <a href="#top">Cookie Policy</a>
              </div>
            </div>
          </footer>
        </section>
      </main>
    </div>
  )
}

export default App
