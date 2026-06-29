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
        <SectionLabel>Why Partner With Kenisar</SectionLabel>
        <div className="card-grid card-grid--four">
          {partnerBenefits.map((benefit) => (
            <ContentCard key={benefit.title} title={benefit.title} description={benefit.description} variant="light" />
          ))}
        </div>
      </section>

      <section className="section" data-reveal="section">
        <SectionLabel>Opportunity Types</SectionLabel>
        <div className="tag-list tag-list--dense">
          {opportunityCategories.map((type) => (
            <span key={type} className="tag-pill tag-pill--dark">
              {type}
            </span>
          ))}
        </div>
      </section>

      <section className="section section--narrow" data-reveal="section">
        <PartnerInterestForm />
      </section>
    </div>
  )
}
