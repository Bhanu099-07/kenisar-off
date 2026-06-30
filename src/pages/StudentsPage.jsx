import { howItWorksSteps, studentBenefits, whoItsForCards } from '../data/content'
import { Button } from '../components/ui/Button'
import { ContentCard } from '../components/ui/ContentCard'
import { PageHero } from '../components/ui/PageHero'
import { SectionLabel } from '../components/ui/SectionLabel'

export function StudentsPage({ onNavigate, currentPath }) {
  return (
    <div className="page">
      <PageHero
        label="Students"
        title="Built for students who want real experience."
        description="Kenisar is for high school, college, and university students who want a clearer path into internships, volunteering, mentorships, workshops, and early practical experience."
        theme="students"
      />

      <section className="section" data-reveal="section">
        <SectionLabel>Why Join Kenisar</SectionLabel>
        <div className="card-grid card-grid--three">
          {studentBenefits.map((item) => (
            <ContentCard key={item.title} title={item.title} description={item.description} variant="light" />
          ))}
        </div>
      </section>

      <section className="section" data-reveal="section">
        <SectionLabel centered>Who It Is For</SectionLabel>
        <div className="card-grid card-grid--three">
          {whoItsForCards.map((card) => (
            <ContentCard key={card.title} title={card.title} description={card.description} variant="light" />
          ))}
        </div>
      </section>

      <section className="section" data-reveal="section">
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
        <div className="cta-card" data-reveal="section" data-tilt>
          <div>
            <SectionLabel>Ready to start?</SectionLabel>
            <h2>Create your profile so Kenisar can notify you when opportunities open.</h2>
            <p>We are building with students and organizations. Opportunities are coming soon.</p>
          </div>
          <div className="button-row">
            <Button href="/auth?role=student" onNavigate={onNavigate} currentPath={currentPath}>
              Create student profile
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
