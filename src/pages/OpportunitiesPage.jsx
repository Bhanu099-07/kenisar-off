import { useEffect, useMemo, useState } from 'react'
import { OpportunitySummaryCard } from '../components/opportunities/OpportunitySummaryCard'
import { useAuth } from '../components/auth/useAuth'
import { Button } from '../components/ui/Button'
import { PageHero } from '../components/ui/PageHero'
import { SectionLabel } from '../components/ui/SectionLabel'
import { getDashboardPathForRole } from '../config/admin'
import { formatDateLabel } from '../lib/opportunityPresentation'
import {
  getApprovedOpportunities,
  getStudentApplications,
  getStudentSavedOpportunities,
  recordOpportunityAction,
  removeSavedOpportunity,
  saveOpportunity,
} from '../lib/kenisarApi'

const filters = [
  'Volunteer',
  'Internship',
  'Mentorship',
  'Project',
  'Remote',
  'In Person',
  'Hybrid',
  'High School',
  'College',
  'University',
]

function matchesFilter(item, filterLabel) {
  const typeText = item.opportunity_type?.toLowerCase() ?? ''
  const modeText = item.remote_or_in_person?.toLowerCase() ?? ''
  const eligibilityText = item.eligibility?.toLowerCase() ?? ''

  switch (filterLabel) {
    case 'Volunteer':
      return typeText.includes('volunteer')
    case 'Internship':
      return typeText.includes('intern')
    case 'Mentorship':
      return typeText.includes('mentor')
    case 'Project':
      return typeText.includes('project')
    case 'Remote':
      return modeText.includes('remote')
    case 'In Person':
      return modeText.includes('person') || modeText.includes('on-site') || modeText.includes('onsite')
    case 'Hybrid':
      return modeText.includes('hybrid')
    case 'High School':
      return eligibilityText.includes('high school')
    case 'College':
      return eligibilityText.includes('college')
    case 'University':
      return eligibilityText.includes('university')
    default:
      return true
  }
}

function searchOpportunity(item, searchQuery) {
  if (!searchQuery) return true

  const content = [
    item.title,
    item.description,
    item.opportunity_type,
    item.location,
    item.remote_or_in_person,
    item.commitment,
    item.skills_gained,
    item.eligibility,
    item.organization_profiles?.organization_name,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()

  return content.includes(searchQuery.toLowerCase())
}

export function OpportunitiesPage({ onNavigate, currentPath }) {
  const { role, user } = useAuth()
  const [status, setStatus] = useState('loading')
  const [message, setMessage] = useState('')
  const [messageTone, setMessageTone] = useState('idle')
  const [opportunities, setOpportunities] = useState([])
  const [savedIds, setSavedIds] = useState([])
  const [applicationsByOpportunityId, setApplicationsByOpportunityId] = useState({})
  const [searchValue, setSearchValue] = useState('')
  const [activeFilters, setActiveFilters] = useState([])

  useEffect(() => {
    let isMounted = true

    async function load() {
      setStatus('loading')
      setMessage('')
      setMessageTone('idle')

      try {
        const approved = await getApprovedOpportunities()
        if (!isMounted) return

        setOpportunities(approved)

        if (user && role === 'student') {
          const [saved, applications] = await Promise.all([
            getStudentSavedOpportunities(user.id),
            getStudentApplications(user.id),
          ])

          if (!isMounted) return

          setSavedIds(saved.map((item) => item.opportunity_id))
          setApplicationsByOpportunityId(
            applications.reduce((accumulator, item) => {
              accumulator[item.opportunity_id] = item
              return accumulator
            }, {}),
          )
        } else {
          setSavedIds([])
          setApplicationsByOpportunityId({})
        }

        setStatus('ready')
      } catch (error) {
        if (!isMounted) return
        setStatus('error')
        setMessage(error.message || 'Unable to load opportunities.')
      }
    }

    load()

    return () => {
      isMounted = false
    }
  }, [role, user])

  const filteredOpportunities = useMemo(
    () =>
      opportunities.filter((item) => {
        const matchesSearch = searchOpportunity(item, searchValue)
        const matchesChips =
          activeFilters.length === 0 || activeFilters.every((filterLabel) => matchesFilter(item, filterLabel))

        return matchesSearch && matchesChips
      }),
    [activeFilters, opportunities, searchValue],
  )

  function toggleFilter(filterLabel) {
    setActiveFilters((current) =>
      current.includes(filterLabel) ? current.filter((item) => item !== filterLabel) : [...current, filterLabel],
    )
  }

  async function handleToggleSave(opportunityId, isSaved) {
    if (!user) {
      onNavigate('/auth?role=student')
      return
    }

    try {
      if (isSaved) {
        await removeSavedOpportunity(user.id, opportunityId)
        setSavedIds((current) => current.filter((item) => item !== opportunityId))
        setMessage('Removed from your saved opportunities.')
        setMessageTone('success')
      } else {
        await saveOpportunity(user.id, opportunityId)
        setSavedIds((current) => [...new Set([...current, opportunityId])])
        setMessage('Saved to your opportunities list.')
        setMessageTone('success')
      }
    } catch (error) {
      setMessage(error.message || 'Unable to update saved opportunities.')
      setMessageTone('error')
    }
  }

  async function handleApply(item) {
    if (!user) {
      onNavigate('/auth?role=student')
      return
    }

    const existing = applicationsByOpportunityId[item.id]
    if (existing) {
      setMessage(existing.action_type === 'applied' ? 'You already applied to this opportunity.' : 'You already recorded interest in this opportunity.')
      setMessageTone('success')
      return
    }

    try {
      const created = await recordOpportunityAction(user.id, item.id, item.application_link ? 'applied' : 'interested')
      setApplicationsByOpportunityId((current) => ({
        ...current,
        [item.id]: created,
      }))
      setMessage(
        created.duplicate
          ? 'Your opportunity activity was already recorded.'
          : item.application_link
            ? 'Application recorded. The external application link opened in a new tab.'
            : 'Your interest was recorded successfully.',
      )
      setMessageTone('success')

      if (item.application_link) {
        window.open(item.application_link, '_blank', 'noopener,noreferrer')
      }
    } catch (error) {
      setMessage(error.message || 'Unable to record your opportunity activity.')
      setMessageTone('error')
    }
  }

  function renderSidebarActions() {
    if (!user) {
      return (
        <div className="button-row">
          <Button href="/auth" onNavigate={onNavigate} currentPath={currentPath}>
            Get started
          </Button>
          <Button href="/partners" onNavigate={onNavigate} currentPath={currentPath} variant="outline">
            For organizations
          </Button>
        </div>
      )
    }

    if (role === 'student') {
      return (
        <div className="button-row">
          <Button href="/dashboard/student" onNavigate={onNavigate} currentPath={currentPath}>
            Student dashboard
          </Button>
          <Button href="/saved" onNavigate={onNavigate} currentPath={currentPath} variant="outline">
            Saved opportunities
          </Button>
        </div>
      )
    }

    if (role === 'organization') {
      return (
        <div className="button-row">
          <Button href="/dashboard/organization" onNavigate={onNavigate} currentPath={currentPath}>
            Organization dashboard
          </Button>
          <Button href="/opportunities/manage" onNavigate={onNavigate} currentPath={currentPath} variant="outline">
            Manage listings
          </Button>
        </div>
      )
    }

    return (
      <div className="button-row">
        <Button href="/admin" onNavigate={onNavigate} currentPath={currentPath}>
          Review listings
        </Button>
        <Button
          href={getDashboardPathForRole(role)}
          onNavigate={onNavigate}
          currentPath={currentPath}
          variant="outline"
        >
          Admin dashboard
        </Button>
      </div>
    )
  }

  if (status === 'loading') {
    return (
      <div className="page">
        <PageHero
          label="Opportunities"
          title="Loading approved opportunities."
          description="Kenisar is checking which reviewed listings are ready for students to browse."
          theme="opportunities"
        />
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="page">
        <PageHero
          label="Opportunities"
          title="We couldn't load opportunities."
          description={message}
          theme="opportunities"
        />
      </div>
    )
  }

  return (
    <div className="page">
      <PageHero
        label="Opportunities"
        title="Student opportunities, reviewed and ready to browse."
        description="Search approved listings, filter by opportunity type and format, and take action when a role fits your direction."
        theme="opportunities"
      />

      <section className="section section--narrow" data-reveal="section">
        <div className="page-cluster page-cluster--opportunities">
          <div className="content-card content-card--light opportunity-toolbar" data-reveal="card" data-tilt>
            <SectionLabel>Search and filter</SectionLabel>
            <h2>Browse the marketplace with more signal.</h2>
            <label className="search-field">
              <span>Search opportunities</span>
              <input
                type="search"
                value={searchValue}
                onChange={(event) => setSearchValue(event.target.value)}
                placeholder="Search by title, organization, skill, or location"
              />
            </label>

            <div className="filter-chip-row">
              {filters.map((filterLabel) => (
                <button
                  key={filterLabel}
                  type="button"
                  className={`filter-chip ${activeFilters.includes(filterLabel) ? 'filter-chip--active' : ''}`}
                  onClick={() => toggleFilter(filterLabel)}
                >
                  {filterLabel}
                </button>
              ))}
            </div>
          </div>

          <aside className="content-card content-card--light content-card--support" data-reveal="card" data-tilt>
            <SectionLabel>Quick actions</SectionLabel>
            <h2>{user ? 'Use the right account workflow.' : 'Take the next honest step.'}</h2>
            <p>
              Only approved listings appear here. Students can save and apply. Organizations can manage submitted
              listings. Admins can review what goes public.
            </p>
            {renderSidebarActions()}
          </aside>
        </div>
      </section>

      <section className="section" data-reveal="section">
        <SectionLabel>Approved listings</SectionLabel>
        {message ? (
          <div className={`form-status ${messageTone === 'error' ? 'form-status--error' : 'form-status--success'}`} role={messageTone === 'error' ? 'alert' : 'status'}>
            <p>{message}</p>
          </div>
        ) : null}

        <div className="dashboard-stack">
          {filteredOpportunities.length > 0 ? (
            filteredOpportunities.map((item) => {
              const isSaved = savedIds.includes(item.id)
              const application = applicationsByOpportunityId[item.id]

              return (
                <OpportunitySummaryCard
                  key={item.id}
                  item={item}
                  currentPath={currentPath}
                  onNavigate={onNavigate}
                  opportunityHref={`/opportunities/${item.id}`}
                  organizationHref={item.organization_id ? `/organizations/${item.organization_id}` : null}
                  secondaryMeta={[`Listed ${formatDateLabel(item.created_at)}`]}
                >
                  <Button href={`/opportunities/${item.id}`} onNavigate={onNavigate} currentPath={currentPath} variant="outline">
                    View details
                  </Button>
                  {user && role === 'student' ? (
                    <>
                      <Button variant="accent" onClick={() => handleToggleSave(item.id, isSaved)}>
                        {isSaved ? 'Remove save' : 'Save'}
                      </Button>
                      <Button onClick={() => handleApply(item)} disabled={Boolean(application)}>
                        {application
                          ? application.action_type === 'applied'
                            ? 'Already applied'
                            : 'Interest recorded'
                          : item.application_link
                            ? 'Apply now'
                            : 'Show interest'}
                      </Button>
                    </>
                  ) : !user ? (
                    <Button href="/auth?role=student" onNavigate={onNavigate} currentPath={currentPath}>
                      Log in to apply
                    </Button>
                  ) : role === 'organization' ? (
                    <Button href="/opportunities/manage" onNavigate={onNavigate} currentPath={currentPath}>
                      Manage listings
                    </Button>
                  ) : (
                    <Button href="/admin" onNavigate={onNavigate} currentPath={currentPath}>
                      Review listing
                    </Button>
                  )}
                </OpportunitySummaryCard>
              )
            })
          ) : (
            <div className="empty-state-card" data-tilt>
              <h2>No opportunities match your filters yet.</h2>
              <p>
                Try clearing the search or filters, or come back as more approved student-friendly opportunities are
                published.
              </p>
              <div className="button-row">
                <Button variant="outline" onClick={() => setActiveFilters([])}>
                  Clear filters
                </Button>
                <Button variant="accent" onClick={() => setSearchValue('')}>
                  Clear search
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
