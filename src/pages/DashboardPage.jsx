import { useEffect, useMemo, useState } from 'react'
import { OpportunitySummaryCard } from '../components/opportunities/OpportunitySummaryCard'
import { useAuth } from '../components/auth/useAuth'
import { Button } from '../components/ui/Button'
import { PageHero } from '../components/ui/PageHero'
import { SectionLabel } from '../components/ui/SectionLabel'
import { StatusBadge } from '../components/ui/StatusBadge'
import {
  calculateProfileCompletion,
  ensureOrganizationProfileExists,
  ensureStudentProfileExists,
  getApprovedOpportunities,
  getOrganizationOpportunities,
  getStudentApplications,
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

function QuickActionCard({ description, href, label, onNavigate, currentPath, variant = 'outline' }) {
  return (
    <article className="content-card content-card--light quick-action-card" data-reveal="card" data-tilt>
      <p>{description}</p>
      <Button href={href} onNavigate={onNavigate} currentPath={currentPath} variant={variant}>
        {label}
      </Button>
    </article>
  )
}

export function DashboardPage({ currentPath, onNavigate, role }) {
  const { signOut, user } = useAuth()
  const [data, setData] = useState({
    applications: [],
    opportunities: [],
    profile: null,
    recommended: [],
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
          const [profile, saved, applications, approved] = await Promise.all([
            ensureStudentProfileExists(user),
            getStudentSavedOpportunities(user.id),
            getStudentApplications(user.id),
            getApprovedOpportunities(),
          ])

          if (!isMounted) return

          const applicationIds = new Set(applications.map((item) => item.opportunity_id))
          const savedIds = new Set(saved.map((item) => item.opportunity_id))
          const recommended = approved
            .filter((item) => !applicationIds.has(item.id))
            .sort((left, right) => {
              const leftSaved = savedIds.has(left.id) ? 1 : 0
              const rightSaved = savedIds.has(right.id) ? 1 : 0
              return rightSaved - leftSaved
            })
            .slice(0, 3)

          setData({
            applications,
            opportunities: [],
            profile,
            recommended,
            saved,
          })
        } else {
          const [profile, opportunities] = await Promise.all([
            ensureOrganizationProfileExists(user),
            getOrganizationOpportunities(user.id),
          ])

          if (!isMounted) return

          setData({
            applications: [],
            opportunities,
            profile,
            recommended: [],
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
        title={
          role === 'student'
            ? `Welcome back${data.profile?.full_name ? `, ${data.profile.full_name}` : ''}.`
            : data.profile?.organization_name || 'Manage your organization account.'
        }
        description={
          role === 'student'
            ? 'Track your profile, saved opportunities, recommendations, and application activity in one place.'
            : 'Keep your organization profile current, create listings, and manage reviewed opportunities from one dashboard.'
        }
        theme={role === 'student' ? 'students' : 'partners'}
      />

      <section className="section section--narrow" data-reveal="section">
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
            {role === 'student' ? 'Browse opportunities' : 'Create opportunity'}
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
                ? 'A stronger profile helps Kenisar surface better-fit opportunities.'
                : 'A complete organization profile helps reviewers understand your listings faster.'
            }
          />
          <MetricCard
            label={role === 'student' ? 'Saved opportunities' : 'Total listings'}
            value={role === 'student' ? data.saved.length : opportunitySummary?.total ?? 0}
            hint={
              role === 'student'
                ? 'Saved opportunities stay here so you can return with more context.'
                : 'Every listing starts as a draft or pending review before it can go public.'
            }
          />
          <MetricCard
            label={role === 'student' ? 'Applications' : 'Pending review'}
            value={role === 'student' ? data.applications.length : opportunitySummary?.pending ?? 0}
            hint={
              role === 'student'
                ? 'Track where you already applied or showed interest.'
                : 'Pending opportunities are waiting for Kenisar review.'
            }
          />
        </div>
      </section>

      {role === 'student' ? (
        <>
          <section className="section" data-reveal="section">
            <SectionLabel>Quick actions</SectionLabel>
            <div className="card-grid card-grid--four">
              <QuickActionCard
                description="Keep browsing approved roles that match your interests."
                href="/opportunities"
                label="Browse opportunities"
                onNavigate={onNavigate}
                currentPath={currentPath}
              />
              <QuickActionCard
                description="Refine your details so opportunities can fit you better."
                href="/profile/student"
                label="Edit profile"
                onNavigate={onNavigate}
                currentPath={currentPath}
                variant="accent"
              />
              <QuickActionCard
                description="Return to the listings you bookmarked for later."
                href="/saved"
                label="View saved opportunities"
                onNavigate={onNavigate}
                currentPath={currentPath}
              />
              <QuickActionCard
                description="Track every application and interest submission."
                href="/applications"
                label="View applications"
                onNavigate={onNavigate}
                currentPath={currentPath}
              />
            </div>
          </section>

          <section className="section" data-reveal="section">
            <SectionLabel>Recommended opportunities</SectionLabel>
            <div className="dashboard-stack">
              {data.recommended.length > 0 ? (
                data.recommended.map((opportunity) => (
                  <OpportunitySummaryCard
                    key={opportunity.id}
                    item={opportunity}
                    currentPath={currentPath}
                    onNavigate={onNavigate}
                    opportunityHref={`/opportunities/${opportunity.id}`}
                    organizationHref={
                      opportunity.organization_id ? `/organizations/${opportunity.organization_id}` : null
                    }
                  >
                    <Button href={`/opportunities/${opportunity.id}`} onNavigate={onNavigate} currentPath={currentPath}>
                      View opportunity
                    </Button>
                  </OpportunitySummaryCard>
                ))
              ) : (
                <div className="empty-state-card" data-tilt>
                  <h2>No recommendations yet.</h2>
                  <p>As more approved opportunities are published, Kenisar will surface stronger matches here.</p>
                  <div className="button-row">
                    <Button href="/opportunities" onNavigate={onNavigate} currentPath={currentPath}>
                      Browse opportunities
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </section>

          <section className="section" data-reveal="section">
            <SectionLabel>Recent applications</SectionLabel>
            <div className="dashboard-stack">
              {data.applications.length > 0 ? (
                data.applications.slice(0, 3).map((application) => (
                  <OpportunitySummaryCard
                    key={application.id}
                    item={application.opportunities}
                    currentPath={currentPath}
                    onNavigate={onNavigate}
                    opportunityHref={`/opportunities/${application.opportunity_id}`}
                    organizationHref={
                      application.opportunities?.organization_id
                        ? `/organizations/${application.opportunities.organization_id}`
                        : null
                    }
                    secondaryMeta={[`Submitted ${application.created_at ? new Date(application.created_at).toLocaleDateString() : 'recently'}`]}
                  >
                    <StatusBadge status={application.action_type} />
                    <StatusBadge status={application.status} />
                    <Button
                      href={`/opportunities/${application.opportunity_id}`}
                      onNavigate={onNavigate}
                      currentPath={currentPath}
                    >
                      View listing
                    </Button>
                  </OpportunitySummaryCard>
                ))
              ) : (
                <div className="empty-state-card" data-tilt>
                  <h2>No applications yet.</h2>
                  <p>When you apply or show interest in a listing, it will show up here.</p>
                  <div className="button-row">
                    <Button href="/opportunities" onNavigate={onNavigate} currentPath={currentPath}>
                      Browse opportunities
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </section>
        </>
      ) : (
        <>
          <section className="section" data-reveal="section">
            <div className="card-grid card-grid--four">
              <MetricCard label="Draft" value={opportunitySummary?.draft ?? 0} hint="Private until you submit for review." />
              <MetricCard label="Pending" value={opportunitySummary?.pending ?? 0} hint="Waiting for Kenisar approval." />
              <MetricCard label="Approved" value={opportunitySummary?.approved ?? 0} hint="Visible on the public opportunities page." />
              <MetricCard label="Rejected" value={opportunitySummary?.rejected ?? 0} hint="Needs edits before it can return to review." />
            </div>
          </section>

          <section className="section" data-reveal="section">
            <SectionLabel>Organization quick actions</SectionLabel>
            <div className="card-grid card-grid--three">
              <QuickActionCard
                description="Publish a new beginner-friendly role, project, or mentorship."
                href="/opportunities/new"
                label="Create opportunity"
                onNavigate={onNavigate}
                currentPath={currentPath}
                variant="accent"
              />
              <QuickActionCard
                description="Review drafts, pending items, approvals, and public visibility."
                href="/opportunities/manage"
                label="Manage listings"
                onNavigate={onNavigate}
                currentPath={currentPath}
              />
              <QuickActionCard
                description="Keep your organization details current for better review context."
                href="/profile/organization"
                label="Edit organization profile"
                onNavigate={onNavigate}
                currentPath={currentPath}
              />
            </div>
          </section>

          <section className="section" data-reveal="section">
            <SectionLabel>Recent listings</SectionLabel>
            <div className="dashboard-stack">
              {data.opportunities.length > 0 ? (
                data.opportunities.slice(0, 4).map((opportunity) => (
                  <OpportunitySummaryCard
                    key={opportunity.id}
                    item={opportunity}
                    currentPath={currentPath}
                    onNavigate={onNavigate}
                    opportunityHref={`/opportunities/${opportunity.id}`}
                    secondaryMeta={[
                      opportunity.status === 'approved' ? 'Publicly visible' : 'Not public yet',
                    ]}
                  >
                    <Button
                      href={`/opportunities/new?id=${opportunity.id}`}
                      onNavigate={onNavigate}
                      currentPath={currentPath}
                      variant="outline"
                    >
                      Edit listing
                    </Button>
                    <Button
                      href={`/opportunities/${opportunity.id}/applicants`}
                      onNavigate={onNavigate}
                      currentPath={currentPath}
                      variant="accent"
                    >
                      View applicants
                    </Button>
                  </OpportunitySummaryCard>
                ))
              ) : (
                <div className="empty-state-card" data-tilt>
                  <h2>Create your first opportunity listing.</h2>
                  <p>Drafts, pending listings, and approved opportunities will appear here once you start publishing.</p>
                  <div className="button-row">
                    <Button href="/opportunities/new" onNavigate={onNavigate} currentPath={currentPath}>
                      Create opportunity
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </section>
        </>
      )}
    </div>
  )
}
