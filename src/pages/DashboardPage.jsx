import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../components/auth/useAuth'
import { Button } from '../components/ui/Button'
import { PageHero } from '../components/ui/PageHero'
import { SectionLabel } from '../components/ui/SectionLabel'
import { StatusBadge } from '../components/ui/StatusBadge'
import {
  calculateProfileCompletion,
  getOrganizationOpportunities,
  getOrganizationProfile,
  getStudentApplications,
  getStudentProfile,
  getStudentSavedOpportunities,
} from '../lib/kenisarApi'

const studentCompletionFields = [
  'full_name',
  'school',
  'grade_or_year',
  'city',
  'interests',
  'skills',
  'experience_goals',
  'availability',
]

const organizationCompletionFields = [
  'organization_name',
  'contact_name',
  'email',
  'website',
  'organization_type',
  'city',
  'description',
]

function MetricCard({ label, value, hint }) {
  return (
    <article className="content-card content-card--light dashboard-metric" data-reveal="card" data-tilt>
      <span className="dashboard-metric__label">{label}</span>
      <strong className="dashboard-metric__value">{value}</strong>
      <p>{hint}</p>
    </article>
  )
}

function OpportunityRecord({ actionLabel, item }) {
  const opportunity = item?.opportunities

  if (!opportunity) return null

  return (
    <article className="content-card content-card--light dashboard-record" data-reveal="card" data-tilt>
      <div className="dashboard-record__header">
        <div>
          <h2>{opportunity.title}</h2>
          <p>{opportunity.organization_profiles?.organization_name ?? 'Kenisar partner'}</p>
        </div>
        {item.action_type ? <StatusBadge status={item.action_type} /> : null}
      </div>
      <div className="tag-list tag-list--dense">
        <span className="tag-pill tag-pill--dark">{opportunity.opportunity_type}</span>
        <span className="tag-pill tag-pill--dark">{opportunity.location}</span>
        <span className="tag-pill tag-pill--dark">{opportunity.remote_or_in_person}</span>
      </div>
      {actionLabel ? <p>{actionLabel}</p> : null}
    </article>
  )
}

export function DashboardPage({ currentPath, onNavigate, role }) {
  const { signOut, user } = useAuth()
  const [data, setData] = useState({
    applications: [],
    opportunities: [],
    profile: null,
    saved: [],
  })
  const [status, setStatus] = useState('loading')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    if (!user) return

    let isMounted = true

    async function load() {
      setStatus('loading')
      setErrorMessage('')

      try {
        if (role === 'student') {
          const [profile, saved, applications] = await Promise.all([
            getStudentProfile(user.id),
            getStudentSavedOpportunities(user.id),
            getStudentApplications(user.id),
          ])

          if (!isMounted) return
          setData({
            applications,
            opportunities: [],
            profile,
            saved,
          })
        } else {
          const [profile, opportunities] = await Promise.all([
            getOrganizationProfile(user.id),
            getOrganizationOpportunities(user.id),
          ])

          if (!isMounted) return
          setData({
            applications: [],
            opportunities,
            profile,
            saved: [],
          })
        }

        setStatus('ready')
      } catch (error) {
        if (!isMounted) return
        setStatus('error')
        setErrorMessage(error.message || 'Unable to load this dashboard.')
      }
    }

    load()

    return () => {
      isMounted = false
    }
  }, [role, user])

  const completion = useMemo(
    () =>
      calculateProfileCompletion(
        data.profile,
        role === 'student' ? studentCompletionFields : organizationCompletionFields,
      ),
    [data.profile, role],
  )

  const opportunitySummary = useMemo(() => {
    if (role !== 'organization') return null

    return data.opportunities.reduce(
      (summary, item) => {
        summary.total += 1
        summary[item.status] = (summary[item.status] ?? 0) + 1
        return summary
      },
      {
        approved: 0,
        draft: 0,
        pending: 0,
        rejected: 0,
        total: 0,
      },
    )
  }, [data.opportunities, role])

  async function handleSignOut() {
    await signOut()
    onNavigate('/')
  }

  const studentNextSteps = [
    completion < 100 ? 'Complete the remaining profile fields so Kenisar can match you more accurately.' : null,
    data.saved.length === 0 ? 'Browse approved opportunities and save the ones you want to revisit.' : null,
    data.applications.length === 0 ? 'Show interest in your first opportunity to start building momentum.' : null,
  ].filter(Boolean)

  if (status === 'loading') {
    return (
      <div className="page">
        <PageHero
          label={role === 'student' ? 'Student Dashboard' : 'Organization Dashboard'}
          title="Loading your dashboard."
          description="Kenisar is pulling together your profile and opportunity activity."
          theme={role === 'student' ? 'students' : 'partners'}
        />
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="page">
        <PageHero
          label={role === 'student' ? 'Student Dashboard' : 'Organization Dashboard'}
          title="We couldn't load this dashboard."
          description={errorMessage}
          theme={role === 'student' ? 'students' : 'partners'}
        />
      </div>
    )
  }

  return (
    <div className="page">
      <PageHero
        label={role === 'student' ? 'Student Dashboard' : 'Organization Dashboard'}
        title={role === 'student' ? 'Your early-career dashboard.' : 'Manage your organization account.'}
        description={
          role === 'student'
            ? 'Track your profile, saved opportunities, and application activity in one place.'
            : 'Keep your profile current, submit listings, and monitor review status from one dashboard.'
        }
        theme={role === 'student' ? 'students' : 'partners'}
      />

      <section className="section" data-reveal="section">
        <div className="button-row">
          <Button
            href={role === 'student' ? '/profile/student' : '/profile/organization'}
            onNavigate={onNavigate}
            currentPath={currentPath}
          >
            {role === 'student' ? 'Edit profile' : 'Edit organization profile'}
          </Button>
          <Button
            href={role === 'student' ? '/opportunities' : '/opportunities/new'}
            onNavigate={onNavigate}
            currentPath={currentPath}
            variant="accent"
          >
            {role === 'student' ? 'Find opportunities' : 'Create opportunity listing'}
          </Button>
          <Button variant="outline" onClick={handleSignOut}>
            Sign out
          </Button>
        </div>
      </section>

      <section className="section" data-reveal="section">
        <div className="card-grid card-grid--three">
          <MetricCard
            label="Profile completion"
            value={`${completion}%`}
            hint={
              role === 'student'
                ? 'A stronger profile helps Kenisar surface more relevant opportunities.'
                : 'A complete organization profile makes listings easier to review.'
            }
          />
          <MetricCard
            label={role === 'student' ? 'Saved opportunities' : 'Total listings'}
            value={role === 'student' ? data.saved.length : opportunitySummary?.total ?? 0}
            hint={
              role === 'student'
                ? 'Saved opportunities stay here so you can revisit them later.'
                : 'Every listing stays private until Kenisar reviews it.'
            }
          />
          <MetricCard
            label={role === 'student' ? 'Applied or interested' : 'Pending review'}
            value={role === 'student' ? data.applications.length : opportunitySummary?.pending ?? 0}
            hint={
              role === 'student'
                ? 'Track the opportunities where you have already taken action.'
                : 'Pending listings are waiting for Kenisar approval before going public.'
            }
          />
        </div>
      </section>

      {role === 'student' ? (
        <>
          <section className="section" data-reveal="section">
            <div className="section-panel section-panel--light">
              <SectionLabel>Recommended next steps</SectionLabel>
              <h2 className="section-heading">Keep building your profile and activity.</h2>
              {studentNextSteps.length > 0 ? (
                <ul className="detail-list">
                  {studentNextSteps.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ul>
              ) : (
                <p className="section-intro">Your account is in a strong place. Keep checking approved opportunities.</p>
              )}
            </div>
          </section>

          <section className="section" data-reveal="section">
            <SectionLabel>Saved opportunities</SectionLabel>
            <div className="dashboard-stack">
              {data.saved.length > 0 ? (
                data.saved.map((item) => <OpportunityRecord key={item.id} actionLabel="Saved for later." item={item} />)
              ) : (
                <div className="empty-state-card" data-tilt>
                  <h2>You haven't saved any opportunities yet.</h2>
                  <p>Browse approved listings and save the ones you want to revisit.</p>
                </div>
              )}
            </div>
          </section>

          <section className="section" data-reveal="section">
            <SectionLabel>Applied or interested</SectionLabel>
            <div className="dashboard-stack">
              {data.applications.length > 0 ? (
                data.applications.map((item) => (
                  <OpportunityRecord
                    key={item.id}
                    actionLabel={item.action_type === 'applied' ? 'Application recorded.' : 'Interest recorded.'}
                    item={item}
                  />
                ))
              ) : (
                <div className="empty-state-card" data-tilt>
                  <h2>You haven't applied or shown interest yet.</h2>
                  <p>When you take action on an opportunity, it will appear here.</p>
                </div>
              )}
            </div>
          </section>
        </>
      ) : (
        <>
          <section className="section" data-reveal="section">
            <div className="card-grid card-grid--four">
              <MetricCard label="Draft" value={opportunitySummary?.draft ?? 0} hint="Private to your organization." />
              <MetricCard label="Pending" value={opportunitySummary?.pending ?? 0} hint="Submitted for Kenisar review." />
              <MetricCard label="Approved" value={opportunitySummary?.approved ?? 0} hint="Visible on the public opportunities page." />
              <MetricCard label="Rejected" value={opportunitySummary?.rejected ?? 0} hint="Needs edits before it can be reconsidered." />
            </div>
          </section>

          <section className="section" data-reveal="section">
            <div className="page-cluster page-cluster--opportunities">
              <div className="content-card content-card--light" data-reveal="card" data-tilt>
                <SectionLabel>Organization profile</SectionLabel>
                <h2>{data.profile?.organization_name || 'Complete your organization profile.'}</h2>
                <p>
                  {data.profile?.description ||
                    'Add your organization details so Kenisar can review your listings with the right context.'}
                </p>
                <ul className="detail-list">
                  <li>{data.profile?.contact_name || 'Add a contact name for approvals and follow-up.'}</li>
                  <li>{data.profile?.organization_type || 'Choose the kind of organization you represent.'}</li>
                  <li>{data.profile?.city || 'Add your city to clarify where students can work with you.'}</li>
                </ul>
              </div>

              <aside className="content-card content-card--light content-card--support" data-reveal="card" data-tilt>
                <SectionLabel>Listings</SectionLabel>
                <h2>{data.opportunities.length > 0 ? 'Manage submitted listings.' : 'Create your first opportunity listing.'}</h2>
                <p>
                  Drafts stay private. Submitted listings move to pending review, and only approved listings appear
                  publicly.
                </p>
                <div className="button-row">
                  <Button href="/opportunities/new" onNavigate={onNavigate} currentPath={currentPath}>
                    New listing
                  </Button>
                  <Button href="/opportunities/manage" onNavigate={onNavigate} currentPath={currentPath} variant="outline">
                    Manage listings
                  </Button>
                </div>
              </aside>
            </div>
          </section>

          <section className="section" data-reveal="section">
            <SectionLabel>Recent listings</SectionLabel>
            <div className="dashboard-stack">
              {data.opportunities.length > 0 ? (
                data.opportunities.slice(0, 4).map((opportunity) => (
                  <article className="content-card content-card--light dashboard-record" key={opportunity.id} data-reveal="card" data-tilt>
                    <div className="dashboard-record__header">
                      <div>
                        <h2>{opportunity.title}</h2>
                        <p>
                          {opportunity.opportunity_type} · {opportunity.location}
                        </p>
                      </div>
                      <StatusBadge status={opportunity.status} />
                    </div>
                    <p>{opportunity.description}</p>
                  </article>
                ))
              ) : (
                <div className="empty-state-card" data-tilt>
                  <h2>Create your first opportunity listing.</h2>
                  <p>Organizations can save drafts or submit beginner-friendly roles for review.</p>
                </div>
              )}
            </div>
          </section>
        </>
      )}
    </div>
  )
}
