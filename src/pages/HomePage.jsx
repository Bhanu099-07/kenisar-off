import {
  howItWorksSteps,
  studentBenefits,
  whoItsForCards,
} from '../data/content'
import { BrandMark } from '../components/ui/Brand'
import { Button } from '../components/ui/Button'
import { ContentCard } from '../components/ui/ContentCard'
import { SectionLabel } from '../components/ui/SectionLabel'

function Hero({ onNavigate, currentPath }) {
  return (
    <section className="hero">
      <div className="hero__copy">
        <SectionLabel>Kenisar</SectionLabel>
        <h1>Real opportunities for students, before graduation.</h1>
        <p>
          Kenisar helps high school, college, and university students discover internships, volunteering,
          mentorships, workshops, and hands-on experiences. We are building with students and organizations.
        </p>
        <div className="button-row">
          <Button href="/apply" onNavigate={onNavigate} currentPath={currentPath}>
            Join the waitlist
          </Button>
          <Button href="/partners" onNavigate={onNavigate} currentPath={currentPath} variant="secondary">
            Partner with Kenisar
          </Button>
        </div>
      </div>

      <div className="hero__visual" aria-hidden="true">
        <div className="hero__visual-inner">
          <div className="hero__brand-mark">
            <BrandMark />
          </div>
          <p className="hero__visual-tagline">Built for first experience</p>
          <p className="hero__visual-copy">
            Honest onboarding, partner submissions, and a clean opportunities flow — no fake listings.
          </p>
        </div>
      </div>
    </section>
  )
}

export function HomePage({ onNavigate, currentPath }) {
  return (
    <div className="page page--home">
      <Hero onNavigate={onNavigate} currentPath={currentPath} />

      <section className="section">
        <SectionLabel>What Kenisar Helps Students Do</SectionLabel>
        <div className="card-grid card-grid--three">
          {studentBenefits.map((item) => (
            <ContentCard key={item.title} title={item.title} description={item.description} />
          ))}
        </div>
      </section>

      <section className="section">
        <SectionLabel centered>Who It Is For</SectionLabel>
        <div className="card-grid card-grid--three">
          {whoItsForCards.map((card) => (
            <ContentCard key={card.title} title={card.title} description={card.description} variant="light" />
          ))}
        </div>
      </section>

      <section className="section">
        <SectionLabel centered>How It Works</SectionLabel>
        <div className="card-grid card-grid--three">
          {howItWorksSteps.map((step, index) => (
            <ContentCard
              key={step.title}
              title={step.title}
              description={step.description}
              variant="light"
              stepNumber={`0${index + 1}`}
            />
          ))}
        </div>
      </section>

      <section className="section section--cta">
        <div className="cta-card">
          <div>
            <SectionLabel>Get Started</SectionLabel>
            <h2>Join the waitlist or partner with Kenisar.</h2>
            <p>
              Opportunities are coming soon. Students can join the waitlist now, and organizations can share their
              interest in partnering.
            </p>
          </div>
          <div className="button-row">
            <Button href="/apply" onNavigate={onNavigate} currentPath={currentPath}>
              Join the waitlist
            </Button>
            <Button href="/partners" onNavigate={onNavigate} currentPath={currentPath} variant="accent">
              Partner with Kenisar
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
