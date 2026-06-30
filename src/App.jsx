import { startTransition, useEffect, useMemo, useState } from 'react'
import { flushSync } from 'react-dom'
import { AuthProvider } from './components/auth/AuthProvider'
import { useAuth } from './components/auth/useAuth'
import { AppShell } from './components/layout/AppShell'
import { getDashboardPathForRole, isAdminUser } from './config/admin'
import { routes, titleMap } from './data/content'
import { AdminPage } from './pages/AdminPage'
import { AboutPage } from './pages/AboutPage'
import { ApplyPage } from './pages/ApplyPage'
import { ApplicationsPage } from './pages/ApplicationsPage'
import { AuthPage } from './pages/AuthPage'
import { DashboardPage } from './pages/DashboardPage'
import { HomePage } from './pages/HomePage'
import { OpportunityEditorPage } from './pages/OpportunityEditorPage'
import { OpportunityApplicantsPage } from './pages/OpportunityApplicantsPage'
import { OpportunityDetailPage } from './pages/OpportunityDetailPage'
import { OpportunityManagePage } from './pages/OpportunityManagePage'
import { OpportunitiesPage } from './pages/OpportunitiesPage'
import { OrganizationPublicPage } from './pages/OrganizationPublicPage'
import { PartnersPage } from './pages/PartnersPage'
import { PolicyPage } from './pages/PolicyPage'
import { ProfilePage } from './pages/ProfilePage'
import { SavedOpportunitiesPage } from './pages/SavedOpportunitiesPage'
import { StudentsPage } from './pages/StudentsPage'
import { policyPages } from './data/policies'
import './App.css'

function getRouteMatch(pathname) {
  const path = pathname.split('#')[0].split('?')[0]

  if (routes[path]) {
    return { routeKey: routes[path], routeParams: {} }
  }

  const applicantsMatch = path.match(/^\/opportunities\/([^/]+)\/applicants$/)
  if (applicantsMatch) {
    return {
      routeKey: 'opportunityApplicants',
      routeParams: { opportunityId: applicantsMatch[1] },
    }
  }

  const opportunityMatch = path.match(/^\/opportunities\/([^/]+)$/)
  if (opportunityMatch) {
    return {
      routeKey: 'opportunityDetail',
      routeParams: { opportunityId: opportunityMatch[1] },
    }
  }

  const organizationMatch = path.match(/^\/organizations\/([^/]+)$/)
  if (organizationMatch) {
    return {
      routeKey: 'organizationPublic',
      routeParams: { organizationId: organizationMatch[1] },
    }
  }

  return { routeKey: 'home', routeParams: {} }
}

function getPathname(path) {
  return path.split('#')[0].split('?')[0]
}

function scrollToHash(hash) {
  if (!hash) return
  requestAnimationFrame(() => {
    document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' })
  })
}

function applyRouteTransition(update) {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const startViewTransition = document.startViewTransition?.bind(document)

  if (!startViewTransition || prefersReducedMotion) {
    startTransition(update)
    return
  }

  startViewTransition(() => {
    flushSync(update)
  })
}

function ProtectedPage({ children, onNavigate, role, allowedRoles }) {
  const { loading, role: currentRole, user } = useAuth()
  const resolvedAllowedRoles = useMemo(() => allowedRoles ?? (role ? [role] : []), [allowedRoles, role])

  useEffect(() => {
    if (loading) return

    if (!user) {
      if (resolvedAllowedRoles.length === 1 && resolvedAllowedRoles[0] === 'organization') {
        onNavigate('/auth?role=organization')
      } else {
        onNavigate('/auth')
      }
      return
    }

    if (resolvedAllowedRoles.length > 0 && currentRole && !resolvedAllowedRoles.includes(currentRole)) {
      onNavigate(getDashboardPathForRole(currentRole))
    }
  }, [currentRole, loading, onNavigate, resolvedAllowedRoles, user])

  if (loading || !user || (resolvedAllowedRoles.length > 0 && currentRole && !resolvedAllowedRoles.includes(currentRole))) {
    return (
      <div className="page">
        <section className="section section--narrow">
          <div className="empty-state-card">
            <h2>Redirecting you to the right account area.</h2>
            <p>Kenisar is checking your session and role before opening this page.</p>
          </div>
        </section>
      </div>
    )
  }

  return children
}

function LegacyAuthRedirect({ onNavigate, target }) {
  useEffect(() => {
    onNavigate(target)
  }, [onNavigate, target])

  return (
    <div className="page">
      <section className="section section--narrow">
        <div className="empty-state-card">
          <h2>Redirecting to Kenisar account access.</h2>
          <p>Taking you to the unified sign up and log in flow.</p>
        </div>
      </section>
    </div>
  )
}

function ProtectedAdminPage({ children, onNavigate, currentPath }) {
  const { loading, role, user } = useAuth()
  const hasAdminAccess = role === 'admin' || isAdminUser(user)

  useEffect(() => {
    if (loading) return

    if (!user) {
      onNavigate('/auth')
      return
    }

    if (!hasAdminAccess) {
      onNavigate(role ? getDashboardPathForRole(role) : '/')
    }
  }, [hasAdminAccess, loading, onNavigate, role, user])

  if (loading || !user || !hasAdminAccess) {
    return (
      <div className="page">
        <section className="section section--narrow">
          <div className="empty-state-card">
            <h2>Checking admin access.</h2>
            <p>
              Kenisar is verifying whether this account can access the opportunity approval dashboard for{' '}
              {currentPath}.
            </p>
          </div>
        </section>
      </div>
    )
  }

  return children
}

function PageContent({ routeKey, routeParams, onNavigate, currentPath }) {
  switch (routeKey) {
    case 'auth':
      return <AuthPage onNavigate={onNavigate} currentPath={currentPath} />
    case 'authStudent':
      return <LegacyAuthRedirect onNavigate={onNavigate} target="/auth?role=student" />
    case 'authOrganization':
      return <LegacyAuthRedirect onNavigate={onNavigate} target="/auth?role=organization" />
    case 'students':
      return <StudentsPage onNavigate={onNavigate} currentPath={currentPath} />
    case 'apply':
      return <ApplyPage onNavigate={onNavigate} currentPath={currentPath} />
    case 'opportunities':
      return <OpportunitiesPage onNavigate={onNavigate} currentPath={currentPath} />
    case 'opportunityDetail':
      return (
        <OpportunityDetailPage
          onNavigate={onNavigate}
          currentPath={currentPath}
          opportunityId={routeParams.opportunityId}
        />
      )
    case 'organizationPublic':
      return (
        <OrganizationPublicPage
          onNavigate={onNavigate}
          currentPath={currentPath}
          organizationId={routeParams.organizationId}
        />
      )
    case 'opportunityNew':
      return (
        <ProtectedPage role="organization" onNavigate={onNavigate} currentPath={currentPath}>
          <OpportunityEditorPage onNavigate={onNavigate} currentPath={currentPath} />
        </ProtectedPage>
      )
    case 'opportunityManage':
      return (
        <ProtectedPage role="organization" onNavigate={onNavigate} currentPath={currentPath}>
          <OpportunityManagePage onNavigate={onNavigate} currentPath={currentPath} />
        </ProtectedPage>
      )
    case 'admin':
    case 'dashboardAdmin':
      return (
        <ProtectedAdminPage onNavigate={onNavigate} currentPath={currentPath}>
          <AdminPage onNavigate={onNavigate} currentPath={currentPath} />
        </ProtectedAdminPage>
      )
    case 'partners':
      return <PartnersPage onNavigate={onNavigate} currentPath={currentPath} />
    case 'about':
      return <AboutPage />
    case 'privacy':
      return <PolicyPage page={policyPages.privacy} />
    case 'terms':
      return <PolicyPage page={policyPages.terms} />
    case 'communityGuidelines':
      return <PolicyPage page={policyPages.community} />
    case 'organizationPostingGuidelines':
      return <PolicyPage page={policyPages.organizationPosting} />
    case 'safetyTrust':
      return <PolicyPage page={policyPages.safety} />
    case 'dashboardStudent':
      return (
        <ProtectedPage role="student" onNavigate={onNavigate} currentPath={currentPath}>
          <DashboardPage role="student" onNavigate={onNavigate} currentPath={currentPath} />
        </ProtectedPage>
      )
    case 'savedOpportunities':
      return (
        <ProtectedPage role="student" onNavigate={onNavigate} currentPath={currentPath}>
          <SavedOpportunitiesPage onNavigate={onNavigate} currentPath={currentPath} />
        </ProtectedPage>
      )
    case 'studentApplications':
      return (
        <ProtectedPage role="student" onNavigate={onNavigate} currentPath={currentPath}>
          <ApplicationsPage onNavigate={onNavigate} currentPath={currentPath} />
        </ProtectedPage>
      )
    case 'dashboardOrganization':
      return (
        <ProtectedPage role="organization" onNavigate={onNavigate} currentPath={currentPath}>
          <DashboardPage role="organization" onNavigate={onNavigate} currentPath={currentPath} />
        </ProtectedPage>
      )
    case 'opportunityApplicants':
      return (
        <ProtectedPage allowedRoles={['organization', 'admin']} onNavigate={onNavigate} currentPath={currentPath}>
          <OpportunityApplicantsPage
            onNavigate={onNavigate}
            currentPath={currentPath}
            opportunityId={routeParams.opportunityId}
          />
        </ProtectedPage>
      )
    case 'profileStudent':
      return (
        <ProtectedPage role="student" onNavigate={onNavigate} currentPath={currentPath}>
          <ProfilePage role="student" onNavigate={onNavigate} currentPath={currentPath} />
        </ProtectedPage>
      )
    case 'profileOrganization':
      return (
        <ProtectedPage role="organization" onNavigate={onNavigate} currentPath={currentPath}>
          <ProfilePage role="organization" onNavigate={onNavigate} currentPath={currentPath} />
        </ProtectedPage>
      )
    default:
      return <HomePage onNavigate={onNavigate} currentPath={currentPath} />
  }
}

function App() {
  const [currentRoute, setCurrentRoute] = useState(() => `${window.location.pathname}${window.location.search}`)

  useEffect(() => {
    const handlePopState = () => {
      applyRouteTransition(() => {
        setCurrentRoute(`${window.location.pathname}${window.location.search}`)
      })
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const currentPath = getPathname(currentRoute)
  const routeMatch = getRouteMatch(currentPath)
  const { routeKey, routeParams } = routeMatch

  useEffect(() => {
    document.title = titleMap[routeKey] ?? titleMap.home
    const hash = window.location.hash.slice(1)
    if (hash) scrollToHash(hash)
  }, [currentPath, routeKey])

  function navigate(nextPath) {
    const pathname = getPathname(nextPath)
    const search = nextPath.includes('?') ? `?${nextPath.split('?')[1].split('#')[0]}` : ''
    const hash = nextPath.includes('#') ? `#${nextPath.split('#')[1]}` : ''

    if (pathname === currentPath && !hash && !search) {
      return
    }

    window.history.pushState({}, '', `${pathname}${search}${hash}`)
    applyRouteTransition(() => {
      setCurrentRoute(`${pathname}${search}`)
    })

    if (hash) {
      scrollToHash(hash.slice(1))
    } else {
      window.scrollTo({ top: 0, behavior: 'auto' })
    }
  }

  return (
    <AuthProvider>
      <AppShell currentPath={currentPath} onNavigate={navigate}>
        <PageContent
          key={currentRoute}
          routeKey={routeKey}
          routeParams={routeParams}
          onNavigate={navigate}
          currentPath={currentPath}
        />
      </AppShell>
    </AuthProvider>
  )
}

export default App
