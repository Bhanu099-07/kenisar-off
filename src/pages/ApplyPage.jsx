import { StudentWaitlistForm } from '../forms/StudentWaitlistForm'
import { PageHero } from '../components/ui/PageHero'

export function ApplyPage() {
  return (
    <div className="page">
      <PageHero
        label="Join the Waitlist"
        title="Be first to know when opportunities open."
        description="Share a few details and we will contact you as student-friendly internships, volunteering, mentorships, and workshops become available."
      />

      <section className="section section--narrow">
        <StudentWaitlistForm />
      </section>
    </div>
  )
}
