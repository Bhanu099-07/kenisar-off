import { BrandMark } from '../components/ui/Brand'
import { Button } from '../components/ui/Button'
import { ContentCard } from '../components/ui/ContentCard'
import { SectionLabel } from '../components/ui/SectionLabel'

const homeWhatCards = [
  {
    title: 'Beginner-friendly opportunities',
    description:
      'Internships, volunteering, mentorship, workshops, and projects designed for students starting out.',
  },
  {
    title: 'Experience before graduation',
    description: 'Build skills, confidence, and a real resume while you are still in school.',
  },
  {
    title: 'Real organizations, honest platform',
    description: 'We are onboarding partners now. No fake companies, no fake listings.',
  },
]

const homeWhoCards = [
  {
    title: 'High School Students',
    description: 'Volunteering, mentorship, and your first resume-building experiences.',
  },
  {
    title: 'College Students',
    description: 'Internships, projects, workshops, and portfolio-building experience.',
  },
  {
    title: 'University Students',
    description: 'Career exposure, mentorship, part-time roles, and industry experience.',
  },
]

const homeHowSteps = [
  {
    title: 'Join the student waitlist',
    description: 'Share your school level and interests.',
  },
  {
    title: "Tell us what you're looking for",
    description: 'Volunteering, mentorship, projects, internships, and more.',
  },
  {
    title: 'Get notified when opportunities open',
    description: 'We are building with students and organizations. Opportunities are coming soon.',
  },
]

const opportunityTags = ['Internships', 'Volunteering', 'Mentorship', 'Projects']

function Hero({ onNavigate, currentPath }) {
  return (
    <section className="hero hero--home">
      <div className="hero__copy">
        <p className="hero__eyebrow">For high school, college &amp; university students</p>
        <h1>Find real-world experience before you graduate.</h1>
        <p className="hero__lead">
          Kenisar helps students find beginner-friendly opportunities — volunteering, mentorship, projects, and
          partner programs.
        </p>
        <p className="hero__note">
          Opportunities are coming soon. We are building with students and organizations.
        </p>
        <div className="button-row button-row--hero">
          <Button href="/apply" onNavigate={onNavigate} currentPath={currentPath}>
            Join the student waitlist
          </Button>
          <Button href="/partners" onNavigate={onNavigate} currentPath={currentPath} variant="outline">
            Partner with Kenisar
          </Button>
          <p className="hero__trust">Join early — no listings yet, no fake opportunities.</p>
        </div>
      </div>

      <div className="hero__visual" aria-hidden="true">
        <div className="hero__visual-inner">
          <div className="hero__brand-mark">
            <BrandMark />
          </div>
          <p className="hero__visual-tagline">Built for first experience</p>
          <div className="hero__tag-list">
            {opportunityTags.map((tag) => (
              <span key={tag} className="hero__tag">
                {tag}
              </span>
            ))}
          </div>
          <span className="hero__status">Opportunities coming soon</span>
        </div>
      </div>
    </section>
  )
}

export function HomePage({ onNavigate, currentPath }) {
  return (
    <div className="page page--home">
      <Hero onNavigate={onNavigate} currentPath={currentPath} />

      <section className="section section--home">
        <SectionLabel>What Kenisar is</SectionLabel>
        <p className="section-intro section-intro--home">
          Kenisar is a student opportunity platform for real-world experience — built for beginners, not people who
          already have a resume full of jobs.
        </p>
        <div className="card-grid card-grid--three card-grid--home">
          {homeWhatCards.map((item) => (
            <ContentCard key={item.title} title={item.title} description={item.description} variant="light" />
          ))}
        </div>
      </section>

      <section className="section section--home">
        <SectionLabel centered>Who it&apos;s for</SectionLabel>
        <div className="card-grid card-grid--three card-grid--home">
          {homeWhoCards.map((card) => (
            <ContentCard key={card.title} title={card.title} description={card.description} variant="light" />
          ))}
        </div>
      </section>

      <section className="section section--home">
        <SectionLabel centered>How it works</SectionLabel>
        <div className="card-grid card-grid--three card-grid--home">
          {homeHowSteps.map((step, index) => (
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

      <section className="section section--cta section--home-cta">
        <div className="cta-card cta-card--home">
          <div>
            <SectionLabel>Get started</SectionLabel>
            <h2>Join early while we build with students and organizations.</h2>
            <p>Opportunities are coming soon. Students can join the waitlist now — partners can reach out anytime.</p>
          </div>
          <div className="button-row button-row--cta">
            <Button href="/apply" onNavigate={onNavigate} currentPath={currentPath}>
              Join the student waitlist
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
