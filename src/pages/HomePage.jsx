import { useEffect } from 'react'
import { BrandMark } from '../components/ui/Brand'
import { Button } from '../components/ui/Button'
import { SectionLabel } from '../components/ui/SectionLabel'

const whatCards = [
  {
    title: 'Early-career pathways that feel real',
    description:
      'Internships, mentorship, volunteering, projects, and partnerships designed for students building first experience.',
    icon: 'path',
  },
  {
    title: 'A platform built around trust',
    description:
      'Kenisar stays honest about being early-stage while creating a better place for students and organizations to connect.',
    icon: 'shield',
  },
  {
    title: 'Experience that compounds over time',
    description:
      'The goal is simple: help students build confidence, skills, and direction before graduation, not after.',
    icon: 'growth',
  },
]

const whoCards = [
  {
    title: 'High School Students',
    description: 'Volunteering, mentorship, and first resume-building experiences that feel approachable.',
    note: 'Start with confidence.',
    icon: 'cap',
  },
  {
    title: 'College Students',
    description: 'Projects, workshops, internships, and practical opportunities that create momentum.',
    note: 'Build experience early.',
    icon: 'book',
  },
  {
    title: 'University Students',
    description: 'Part-time roles, partnerships, and industry-facing experience that sharpens career direction.',
    note: 'Move toward the real world.',
    icon: 'bridge',
  },
]

const howSteps = [
  {
    title: 'Create your student profile',
    description: 'Tell us where you are in school and what kinds of experience you want to explore.',
  },
  {
    title: 'Share your direction',
    description: 'Mentorship, internships, volunteering, and project-based work all start with clearer intent.',
  },
  {
    title: 'Hear from us as opportunities open',
    description: 'Kenisar is onboarding organizations now and will notify students when relevant opportunities go live.',
  },
]

const orbitCards = [
  {
    title: 'Students',
    description: 'Interests, ambition, and early momentum.',
    icon: 'person',
    className: 'orbit-card--students',
  },
  {
    title: 'Opportunities',
    description: 'Mentorship, projects, volunteering, and internships.',
    icon: 'spark',
    className: 'orbit-card--opportunities',
  },
  {
    title: 'Growth',
    description: 'Confidence, direction, and real-world experience.',
    icon: 'growth',
    className: 'orbit-card--growth',
  },
]

const particlePositions = [
  { x: '8%', y: '16%', size: '0.42rem', delay: '0s', duration: '11s' },
  { x: '18%', y: '68%', size: '0.32rem', delay: '1.2s', duration: '9.5s' },
  { x: '30%', y: '10%', size: '0.22rem', delay: '0.4s', duration: '8.6s' },
  { x: '44%', y: '58%', size: '0.55rem', delay: '2.1s', duration: '12s' },
  { x: '55%', y: '18%', size: '0.36rem', delay: '0.7s', duration: '10.2s' },
  { x: '64%', y: '44%', size: '0.44rem', delay: '1.8s', duration: '8.8s' },
  { x: '76%', y: '12%', size: '0.28rem', delay: '2.4s', duration: '9.2s' },
  { x: '86%', y: '64%', size: '0.5rem', delay: '1s', duration: '12.4s' },
  { x: '92%', y: '26%', size: '0.3rem', delay: '2.8s', duration: '10.8s' },
]

function HomeIcon({ icon }) {
  const commonProps = {
    fill: 'none',
    stroke: 'currentColor',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    strokeWidth: '1.7',
  }

  switch (icon) {
    case 'shield':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path {...commonProps} d="M12 3.5 18.5 6v5.7c0 4-2.6 6.9-6.5 8.8-3.9-1.9-6.5-4.8-6.5-8.8V6L12 3.5Z" />
          <path {...commonProps} d="m9.2 11.9 1.8 1.8 3.8-3.8" />
        </svg>
      )
    case 'growth':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path {...commonProps} d="M4.5 18.5h15" />
          <path {...commonProps} d="M7.5 16v-4.5M12 16v-7M16.5 16v-10" />
          <path {...commonProps} d="m15.3 6.2 3.2-.2-.2 3.1" />
          <path {...commonProps} d="m10.8 10.6 7.3-4.4" />
        </svg>
      )
    case 'cap':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path {...commonProps} d="M3.5 9.2 12 5l8.5 4.2L12 13.3 3.5 9.2Z" />
          <path {...commonProps} d="M7 11.6v3.2c1.3 1.2 3 1.8 5 1.8s3.7-.6 5-1.8v-3.2" />
          <path {...commonProps} d="M20.5 9.2v4.4" />
        </svg>
      )
    case 'book':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path {...commonProps} d="M5 5.8h5.5c1.2 0 2.2.3 3 1v11.4c-.8-.7-1.8-1-3-1H5Z" />
          <path {...commonProps} d="M19 5.8h-5.5c-1.2 0-2.2.3-3 1v11.4c.8-.7 1.8-1 3-1H19Z" />
        </svg>
      )
    case 'bridge':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path {...commonProps} d="M5 18.5V9.8c1.8-1.4 4.1-2.1 7-2.1s5.2.7 7 2.1v8.7" />
          <path {...commonProps} d="M3.8 18.5h16.4" />
          <path {...commonProps} d="M8 18.5v-4.6M12 18.5v-6M16 18.5v-4.6" />
        </svg>
      )
    case 'person':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle {...commonProps} cx="12" cy="8" r="3.3" />
          <path {...commonProps} d="M5.5 18.5c1.3-3 3.7-4.6 6.5-4.6s5.2 1.6 6.5 4.6" />
        </svg>
      )
    case 'spark':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path {...commonProps} d="m12 3.8 1.5 4.7L18.2 10l-4.7 1.5L12 16.2l-1.5-4.7L5.8 10l4.7-1.5L12 3.8Z" />
          <path {...commonProps} d="M18.2 4.8v2.5M19.4 6h-2.4" />
          <path {...commonProps} d="M5.8 16.8v2.4M7 18h-2.4" />
        </svg>
      )
    case 'path':
    default:
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path {...commonProps} d="M6 18.2c3.2-6 5.9-9 8.2-9 2.1 0 3.5 1.4 3.5 3.4 0 2.4-1.8 4.1-4.8 4.1H9.5" />
          <path {...commonProps} d="m13.8 6.3 3.5.2-.2 3.4" />
        </svg>
      )
  }
}

function HomeHeroScene() {
  return (
    <div className="hero-scene" aria-hidden="true" data-reveal="scene">
      <div className="hero-scene__mesh hero-scene__mesh--olive" />
      <div className="hero-scene__mesh hero-scene__mesh--plum" />
      <div className="hero-scene__glow hero-scene__glow--primary" />
      <div className="hero-scene__glow hero-scene__glow--secondary" />

      {particlePositions.map((particle, index) => (
        <span
          key={`${particle.x}-${particle.y}`}
          className="hero-scene__particle"
          style={{
            '--particle-x': particle.x,
            '--particle-y': particle.y,
            '--particle-size': particle.size,
            '--particle-delay': particle.delay,
            '--particle-duration': particle.duration,
            '--particle-index': index,
          }}
        />
      ))}

      <div className="orbit-system">
        <div className="orbit-system__ring orbit-system__ring--outer" />
        <div className="orbit-system__ring orbit-system__ring--middle" />
        <div className="orbit-system__ring orbit-system__ring--inner" />
        <div className="orbit-system__beam orbit-system__beam--one" />
        <div className="orbit-system__beam orbit-system__beam--two" />
        <div className="orbit-system__trail orbit-system__trail--one" />
        <div className="orbit-system__trail orbit-system__trail--two" />

        <div className="orbit-system__core">
          <div className="orbit-system__core-ring" />
          <div className="orbit-system__core-logo">
            <BrandMark />
          </div>
          <div className="orbit-system__core-copy">
            <span>Students</span>
            <span>Opportunities</span>
            <span>Growth</span>
          </div>
        </div>

        {orbitCards.map((card) => (
          <article key={card.title} className={`orbit-card ${card.className}`} data-tilt>
            <span className="orbit-card__icon">
              <HomeIcon icon={card.icon} />
            </span>
            <div>
              <h3>{card.title}</h3>
              <p>{card.description}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}

function Hero({ onNavigate, currentPath }) {
  return (
    <section className="hero hero--cinematic" data-reveal="hero">
      <div className="hero__copy hero__copy--cinematic">
        <h1>
          Real-world experience
          <span>before you graduate.</span>
        </h1>
        <p className="hero__lead hero__lead--cinematic">
          Kenisar helps high school, college, and university students get closer to mentorship, projects,
          volunteering, internships, and partnerships that build real momentum.
        </p>
        <p className="hero__note hero__note--cinematic">
          We are still early. That means no fake listings, no inflated claims, and no pretending the platform is
          further along than it is.
        </p>

        <div className="button-row button-row--hero-cinematic">
          <Button href="/apply" onNavigate={onNavigate} currentPath={currentPath}>
            Create student profile
          </Button>
          <Button href="/partners" onNavigate={onNavigate} currentPath={currentPath} variant="outline">
            Partner with Kenisar
          </Button>
        </div>

        <div className="hero-proof" data-reveal="micro">
          <span className="hero-proof__line" />
          <p>Student-first onboarding. Honest product signals. Built to grow into something real.</p>
        </div>
      </div>

      <HomeHeroScene />
    </section>
  )
}

function PremiumCard({ title, description, icon, note, stepNumber, variant = 'light' }) {
  return (
    <article
      className={`content-card content-card--premium ${variant === 'light' ? 'content-card--light' : ''}`}
      data-tilt
      data-reveal="card"
    >
      <div className="content-card__glow" />
      <div className="content-card__inner">
        {stepNumber ? <span className="step-number step-number--premium">{stepNumber}</span> : null}
        {icon ? (
          <span className="content-card__icon">
            <HomeIcon icon={icon} />
          </span>
        ) : null}
        <h2>{title}</h2>
        <p>{description}</p>
        {note ? <span className="content-card__note">{note}</span> : null}
      </div>
    </article>
  )
}

function PathwaySection() {
  return (
    <section className="section section--home-pathway" id="how-it-works">
      <div className="home-stage home-stage--dark" data-reveal="section">
        <SectionLabel centered>How it works</SectionLabel>
        <h2 className="section-heading section-heading--centered">A clearer path into real-world experience.</h2>
        <p className="section-intro section-intro--centered">
          The platform starts simple: students join early, define their direction, and hear from Kenisar as verified
          partner pathways begin to open.
        </p>

        <div className="pathway-grid">
          {howSteps.map((step, index) => (
            <div key={step.title} className="pathway-grid__item">
              <PremiumCard title={step.title} description={step.description} stepNumber={`0${index + 1}`} />
              {index < howSteps.length - 1 ? <span className="pathway-grid__connector" aria-hidden="true" /> : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function HomeClosing({ onNavigate, currentPath }) {
  return (
    <section className="section section--home-closing">
      <div className="closing-panel" data-reveal="section">
        <div className="closing-panel__copy">
          <SectionLabel>Start here</SectionLabel>
          <h2>Built for the students who want a real first step.</h2>
          <p>
            Kenisar is early, but the mission is clear: help students find more meaningful ways to begin before
            graduation.
          </p>
          <div className="button-row button-row--closing">
            <Button href="/apply" onNavigate={onNavigate} currentPath={currentPath}>
              Create student profile
            </Button>
            <Button href="/partners" onNavigate={onNavigate} currentPath={currentPath} variant="secondary">
              Talk to Kenisar
            </Button>
          </div>
        </div>

        <div className="closing-panel__portal" aria-hidden="true">
          <div className="closing-panel__portal-frame">
            <span className="closing-panel__portal-light" />
          </div>
          <div className="closing-panel__ground" />
        </div>
      </div>
    </section>
  )
}

export function HomePage({ onNavigate, currentPath }) {
  useEffect(() => {
    const page = document.querySelector('.page--home')
    if (!page) return undefined

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const supportsPointerEffects = window.matchMedia('(pointer: fine)').matches && !prefersReducedMotion
    const hero = page.querySelector('.hero--cinematic')
    const revealTargets = Array.from(page.querySelectorAll('[data-reveal]'))
    const tiltTargets = supportsPointerEffects ? Array.from(page.querySelectorAll('[data-tilt]')) : []

    let observer
    if (!prefersReducedMotion) {
      page.classList.add('page--home-motion-ready')
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible')
              observer?.unobserve(entry.target)
            }
          })
        },
        { threshold: 0.16, rootMargin: '0px 0px -8% 0px' },
      )

      revealTargets.forEach((target) => observer.observe(target))
    } else {
      revealTargets.forEach((target) => target.classList.add('is-visible'))
    }

    function handleHeroMove(event) {
      if (!hero) return
      const rect = hero.getBoundingClientRect()
      const x = ((event.clientX - rect.left) / rect.width) * 100
      const y = ((event.clientY - rect.top) / rect.height) * 100
      hero.style.setProperty('--spotlight-x', `${x}%`)
      hero.style.setProperty('--spotlight-y', `${y}%`)
    }

    function resetHeroMove() {
      if (!hero) return
      hero.style.setProperty('--spotlight-x', '70%')
      hero.style.setProperty('--spotlight-y', '28%')
    }

    if (supportsPointerEffects) {
      hero?.addEventListener('pointermove', handleHeroMove)
      hero?.addEventListener('pointerleave', resetHeroMove)
    }

    const tiltCleanups = tiltTargets.map((card) => {
      function handleMove(event) {
        const rect = card.getBoundingClientRect()
        const px = (event.clientX - rect.left) / rect.width
        const py = (event.clientY - rect.top) / rect.height
        const rotateY = (px - 0.5) * 10
        const rotateX = (0.5 - py) * 8

        card.style.setProperty('--tilt-rotate-x', `${rotateX}deg`)
        card.style.setProperty('--tilt-rotate-y', `${rotateY}deg`)
        card.style.setProperty('--tilt-pointer-x', `${px * 100}%`)
        card.style.setProperty('--tilt-pointer-y', `${py * 100}%`)
      }

      function handleLeave() {
        card.style.setProperty('--tilt-rotate-x', '0deg')
        card.style.setProperty('--tilt-rotate-y', '0deg')
        card.style.setProperty('--tilt-pointer-x', '50%')
        card.style.setProperty('--tilt-pointer-y', '50%')
      }

      card.addEventListener('pointermove', handleMove)
      card.addEventListener('pointerleave', handleLeave)

      return () => {
        card.removeEventListener('pointermove', handleMove)
        card.removeEventListener('pointerleave', handleLeave)
      }
    })

    return () => {
      observer?.disconnect()
      page.classList.remove('page--home-motion-ready')
      hero?.removeEventListener('pointermove', handleHeroMove)
      hero?.removeEventListener('pointerleave', resetHeroMove)
      tiltCleanups.forEach((cleanup) => cleanup())
    }
  }, [])

  return (
    <div className="page page--home">
      <Hero onNavigate={onNavigate} currentPath={currentPath} />

      <section className="section section--home-overview" id="what-kenisar-is">
        <div className="home-stage home-stage--glass" data-reveal="section">
          <SectionLabel centered>What Kenisar is</SectionLabel>
          <h2 className="section-heading section-heading--centered">A cleaner way to begin before graduation.</h2>
          <p className="section-intro section-intro--centered">
            Kenisar is building a more thoughtful platform for students who need real-world experience, not a crowded
            job board pretending everyone already has it figured out.
          </p>

          <div className="card-grid card-grid--three card-grid--home-premium">
            {whatCards.map((card) => (
              <PremiumCard
                key={card.title}
                title={card.title}
                description={card.description}
                icon={card.icon}
                variant="dark"
              />
            ))}
          </div>
        </div>
      </section>

      <section className="section section--home-audience" id="who-its-for">
        <div className="home-stage home-stage--light" data-reveal="section">
          <SectionLabel centered>Who it&apos;s for</SectionLabel>
          <h2 className="section-heading section-heading--centered">Designed for students at different starting points.</h2>
          <p className="section-intro section-intro--centered">
            The platform is built to be useful before students feel fully qualified, whether they are exploring their
            first path or looking for more direction.
          </p>

          <div className="card-grid card-grid--three card-grid--home-premium">
            {whoCards.map((card) => (
              <PremiumCard
                key={card.title}
                title={card.title}
                description={card.description}
                note={card.note}
                icon={card.icon}
                variant="light"
              />
            ))}
          </div>
        </div>
      </section>

      <PathwaySection />

      <HomeClosing onNavigate={onNavigate} currentPath={currentPath} />
    </div>
  )
}
