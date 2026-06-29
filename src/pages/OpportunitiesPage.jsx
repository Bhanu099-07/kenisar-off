import { opportunityCategories } from '../data/content'
import { Button } from '../components/ui/Button'
import { PageHero } from '../components/ui/PageHero'
import { SectionLabel } from '../components/ui/SectionLabel'

export function OpportunitiesPage({ onNavigate, currentPath }) {
  return (
    <div className="page">
      <PageHero
        label="Opportunities"
        title="Opportunities coming soon."
        description="Kenisar is currently onboarding student-friendly partners. Create your student profile to be notified when opportunities are available."
        theme="opportunities"
      />

      <section className="section section--narrow">
        <div className="empty-state-card" data-reveal="section" data-tilt>
          <div>
            <SectionLabel>Current Focus</SectionLabel>
            <h2>Student opportunities, built for real first experience.</h2>
            <p>
              Kenisar helps students discover beginner-friendly internships, volunteering, mentorships, part-time roles,
              workshops, and project-based experiences as partner opportunities become available.
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
            <Button href="/apply" onNavigate={onNavigate} currentPath={currentPath}>
              Create student profile
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
