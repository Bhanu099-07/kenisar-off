import { StudentWaitlistForm } from '../forms/StudentWaitlistForm'
import { PageHero } from '../components/ui/PageHero'

export function ApplyPage() {
  return (
    <div className="page">
      <PageHero
        label="Student Profile"
        title="Create your student profile."
        description="Share your interests, school stage, and the kinds of opportunities you want to explore. Kenisar will use this to contact you as relevant student-friendly opportunities open."
        theme="students"
      />

      <section className="section section--narrow" data-reveal="section">
        <StudentWaitlistForm />
      </section>
    </div>
  )
}
