import { Button } from '../components/ui/Button'
import { SectionLabel } from '../components/ui/SectionLabel'
import { StudentWaitlistForm } from '../forms/StudentWaitlistForm'
import { PageHero } from '../components/ui/PageHero'

export function ApplyPage({ onNavigate, currentPath }) {
  return (
    <div className="page">
      <PageHero
        label="Student Profile"
        title="Legacy student waitlist form."
        description="Kenisar now supports real student accounts. This original interest form is still available if you want to leave your details separately."
        theme="students"
      />

      <section className="section section--narrow" data-reveal="section">
        <div className="content-card content-card--light" data-tilt>
          <SectionLabel>Recommended</SectionLabel>
          <h2>Create a real student account instead.</h2>
          <p>Student accounts unlock editable profiles, saved opportunities, applications, and a real dashboard.</p>
          <div className="button-row">
            <Button href="/auth/student" onNavigate={onNavigate} currentPath={currentPath}>
              Create student account
            </Button>
          </div>
        </div>
      </section>

      <section className="section section--narrow" data-reveal="section">
        <StudentWaitlistForm />
      </section>
    </div>
  )
}
