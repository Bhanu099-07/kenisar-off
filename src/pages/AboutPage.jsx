import { aboutSections } from '../data/content'
import { ContactForm } from '../forms/ContactForm'
import { ContentCard } from '../components/ui/ContentCard'
import { PageHero } from '../components/ui/PageHero'
import { SectionLabel } from '../components/ui/SectionLabel'

export function AboutPage() {
  return (
    <div className="page">
      <PageHero
        label="About"
        title="What Kenisar is and why it exists."
        description="Kenisar is a student opportunity platform for high school, college, and university students who want clearer paths into real-world experience before graduation."
        theme="about"
      />

      <section className="section section--narrow" data-reveal="section">
        <div className="content-stack section-panel section-panel--light">
          {aboutSections.map((section) => (
            <ContentCard key={section.title} title={section.title} description={section.description} variant="light" />
          ))}
        </div>
      </section>

      <section className="section section--narrow" id="contact" data-reveal="section">
        <div className="section-panel section-panel--light">
          <SectionLabel>Contact</SectionLabel>
          <h2 className="section-heading">Get in touch.</h2>
          <p className="section-intro">
            Have a question about Kenisar? Send us a message and we will get back to you.
          </p>
          <ContactForm />
        </div>
      </section>
    </div>
  )
}
