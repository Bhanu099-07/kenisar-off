import { opportunityCategories, partnerBenefits } from '../data/content'
import { Button } from '../components/ui/Button'
import { PartnerInterestForm } from '../forms/PartnerInterestForm'
import { ContentCard } from '../components/ui/ContentCard'
import { PageHero } from '../components/ui/PageHero'
import { SectionLabel } from '../components/ui/SectionLabel'

export function PartnersPage({ onNavigate, currentPath }) {
  return (
    <div className="page">
      <PageHero
        label="For Organizations"
        title="Help students build real early-career experience."
        description="Kenisar helps organizations reach students for volunteering, internships, mentorship, projects, and other beginner-friendly opportunities."
        theme="partners"
      />

      <section className="section" data-reveal="section">
        <div className="section-panel section-panel--dark">
          <SectionLabel centered>For Organizations</SectionLabel>
          <h2 className="section-heading section-heading--centered">
            Reach students through a clearer early-career platform.
          </h2>
          <p className="section-intro section-intro--centered">
            Create an organization account, complete your profile, and share volunteering, internship, mentorship,
            project-based, and other early-career opportunities with students through Kenisar.
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
            <SectionLabel>Organization Accounts</SectionLabel>
            <h2>Use a real organization account for normal onboarding.</h2>
            <p>
              Standard organizations should create an account through Kenisar, complete an organization profile, and
              submit opportunities for review. Listings can move from draft to pending, then approved or rejected after
              review.
            </p>
            <div className="button-row">
              <Button href="/auth?role=organization" onNavigate={onNavigate} currentPath={currentPath}>
                Create organization account
              </Button>
              <Button href="/dashboard/organization" onNavigate={onNavigate} currentPath={currentPath} variant="outline">
                Organization dashboard
              </Button>
            </div>
            <div className="tag-list tag-list--dense">
              {opportunityCategories.map((type) => (
                <span key={type} className="tag-pill tag-pill--dark">
                  {type}
                </span>
              ))}
            </div>
          </div>

          <div className="content-card content-card--light page-intro-card" id="partnership-inquiry" data-reveal="card" data-tilt>
            <SectionLabel>Partnership Inquiry</SectionLabel>
            <h2>Need something beyond a standard organization account?</h2>
            <p>
              Use this secondary inquiry form for sponsorships, school collaborations, community partnerships, or other
              special relationship requests. It is not required for normal organization account creation.
            </p>
          </div>

          <PartnerInterestForm />
        </div>
      </section>
    </div>
  )
}
