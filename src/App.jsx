import { startTransition, useEffect, useState } from 'react'
import { flushSync } from 'react-dom'
import { AppShell } from './components/layout/AppShell'
import { routes, titleMap } from './data/content'
import { AboutPage } from './pages/AboutPage'
import { ApplyPage } from './pages/ApplyPage'
import { HomePage } from './pages/HomePage'
import { OpportunitiesPage } from './pages/OpportunitiesPage'
import { PartnersPage } from './pages/PartnersPage'
import { StudentsPage } from './pages/StudentsPage'
import './App.css'

function getRouteKey(pathname) {
  const path = pathname.split('#')[0]
  return routes[path] ?? 'home'
}

function getPathname(path) {
  return path.split('#')[0]
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

function PageContent({ routeKey, onNavigate, currentPath }) {
  switch (routeKey) {
    case 'students':
      return <StudentsPage onNavigate={onNavigate} currentPath={currentPath} />
    case 'apply':
      return <ApplyPage />
    case 'opportunities':
      return <OpportunitiesPage onNavigate={onNavigate} currentPath={currentPath} />
    case 'partners':
      return <PartnersPage />
    case 'about':
      return <AboutPage />
    default:
      return <HomePage onNavigate={onNavigate} currentPath={currentPath} />
  }
}

function App() {
  const [currentPath, setCurrentPath] = useState(() => getPathname(window.location.pathname))

  useEffect(() => {
    const handlePopState = () => {
      applyRouteTransition(() => {
        setCurrentPath(getPathname(window.location.pathname))
      })
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  useEffect(() => {
    document.title = titleMap[getRouteKey(currentPath)] ?? titleMap.home
    const hash = window.location.hash.slice(1)
    if (hash) scrollToHash(hash)
  }, [currentPath])

  function navigate(nextPath) {
    const pathname = getPathname(nextPath)
    const hash = nextPath.includes('#') ? `#${nextPath.split('#')[1]}` : ''

    if (pathname === currentPath && !hash) {
      return
    }

    window.history.pushState({}, '', `${pathname}${hash}`)
    applyRouteTransition(() => {
      setCurrentPath(pathname)
    })

    if (hash) {
      scrollToHash(hash.slice(1))
    } else {
      window.scrollTo({ top: 0, behavior: 'auto' })
    }
  }

  const routeKey = getRouteKey(currentPath)

  return (
    <AppShell currentPath={currentPath} onNavigate={navigate}>
      <PageContent key={currentPath} routeKey={routeKey} onNavigate={navigate} currentPath={currentPath} />
    </AppShell>
  )
}

export default App
