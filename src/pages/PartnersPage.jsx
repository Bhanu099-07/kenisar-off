import { opportunityCategories, partnerBenefits } from '../data/content'
import { PartnerInterestForm } from '../forms/PartnerInterestForm'
import { ContentCard } from '../components/ui/ContentCard'
import { PageHero } from '../components/ui/PageHero'
import { SectionLabel } from '../components/ui/SectionLabel'

export function PartnersPage() {
  return (
    <div className="page">
      <PageHero
        label="Partners"
        title="Partner with Kenisar."
        description="Kenisar is for organizations that want to offer internships, volunteer roles, mentorships, workshops, and project-based experiences that are genuinely beginner-friendly."
        theme="partners"
      />

      <section className="section" data-reveal="section">
        <div className="section-panel section-panel--dark">
          <SectionLabel centered>Why Partner With Kenisar</SectionLabel>
          <h2 className="section-heading section-heading--centered">
            Offer early opportunities through a student-first platform.
          </h2>
          <p className="section-intro section-intro--centered">
            Kenisar is designed for organizations that want to reach motivated students with roles, mentorship, and
            hands-on experience that are genuinely beginner-friendly.
          </p>
          <div className="card-grid card-grid--four">
            {partnerBenefits.map((benefit) => (
              <ContentCard key={benefit.title} title={benefit.title} description={benefit.description} variant="light" />
            ))}
          </div>
        </div>
      </section>

      <section className="section section--narrow" data-reveal="section">
        <div className="page-stack">
          <div className="content-card content-card--light page-intro-card" data-reveal="card" data-tilt>
            <SectionLabel>Opportunity Types</SectionLabel>
            <h2>Share opportunities students can realistically begin with.</h2>
            <p>
              Kenisar is built for internships, volunteering, mentorship, workshops, part-time roles, and projects
              that help students build experience before graduation.
            </p>
            <div className="tag-list tag-list--dense">
              {opportunityCategories.map((type) => (
                <span key={type} className="tag-pill tag-pill--dark">
                  {type}
                </span>
              ))}
            </div>
          </div>

          <PartnerInterestForm />
        </div>
      </section>
    </div>
  )
}
