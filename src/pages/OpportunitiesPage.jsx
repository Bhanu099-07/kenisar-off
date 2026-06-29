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
        <div className="page-cluster page-cluster--opportunities" data-reveal="section">
          <div className="empty-state-card" data-tilt>
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
              <Button href="/apply" onNavigate={onNavigate} currentPath={currentPath}>
                Create student profile
              </Button>
              <Button href="/partners" onNavigate={onNavigate} currentPath={currentPath} variant="accent">
                Partner with Kenisar
              </Button>
            </div>
          </div>

          <aside className="content-card content-card--light content-card--support" data-reveal="card" data-tilt>
            <SectionLabel>What to do now</SectionLabel>
            <h2>Create your profile before opportunities go live.</h2>
            <p>
              Students can get started now by sharing their interests, school level, and preferences so Kenisar can
              reach out as verified partner opportunities open.
            </p>
            <ul className="detail-list">
              <li>Tell Kenisar which kinds of experience you want to explore.</li>
              <li>Choose interests that help shape your first direction.</li>
              <li>Check back as student-friendly partner opportunities begin to appear.</li>
            </ul>
          </aside>
        </div>
      </section>
    </div>
  )
}
