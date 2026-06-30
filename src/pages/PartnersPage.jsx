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
        label="Partners"
        title="Create an organization account and start posting through Kenisar."
        description="Organizations can sign up, complete an organization profile, and create beginner-friendly listings that stay pending until Kenisar reviews them."
        theme="partners"
      />

      <section className="section" data-reveal="section">
        <div className="section-panel section-panel--dark">
          <SectionLabel centered>Why Partner With Kenisar</SectionLabel>
          <h2 className="section-heading section-heading--centered">
            Offer early opportunities through a student-first platform.
          </h2>
          <p className="section-intro section-intro--centered">
            The normal organization path is simple: create an account, complete your organization profile, submit
            listings, and manage their review status from your dashboard.
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
              <Button href="/auth/organization" onNavigate={onNavigate} currentPath={currentPath}>
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

          <div className="content-card content-card--light page-intro-card" data-reveal="card" data-tilt>
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
