import { useEffect } from 'react'
import { SiteFooter } from './SiteFooter'
import { SiteHeader } from './SiteHeader'

export function AppShell({ currentPath, onNavigate, children }) {
  const themeKey =
    currentPath === '/'
      ? 'home'
      : currentPath === '/students' ||
          currentPath === '/apply' ||
          currentPath === '/auth/student' ||
          currentPath === '/dashboard/student' ||
          currentPath === '/profile/student'
        ? 'students'
        : currentPath === '/opportunities' ||
            currentPath === '/opportunities/manage' ||
            currentPath === '/admin' ||
            currentPath === '/dashboard/admin'
          ? 'opportunities'
          : currentPath === '/partners' ||
              currentPath === '/auth/organization' ||
              currentPath === '/dashboard/organization' ||
              currentPath === '/profile/organization' ||
              currentPath === '/opportunities/new'
            ? 'partners'
            : 'about'

  const shellClassName = `page-shell page-shell--${themeKey}`

  useEffect(() => {
    const shell = document.querySelector('.page-shell')
    if (!shell) return undefined

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const supportsPointerEffects = window.matchMedia('(pointer: fine)').matches && !prefersReducedMotion
    const revealTargets = Array.from(shell.querySelectorAll('[data-reveal]'))
    const tiltTargets = supportsPointerEffects ? Array.from(shell.querySelectorAll('[data-tilt]')) : []
    const magneticTargets = supportsPointerEffects ? Array.from(shell.querySelectorAll('.motion-magnetic')) : []

    revealTargets.forEach((target, index) => {
      if (!target.style.getPropertyValue('--reveal-delay')) {
        target.style.setProperty('--reveal-delay', `${Math.min(index * 50, 260)}ms`)
      }
    })

    let observer
    if (!prefersReducedMotion) {
      shell.classList.add('shell-motion-ready')
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible')
              observer?.unobserve(entry.target)
            }
          })
        },
        { threshold: 0.14, rootMargin: '0px 0px -10% 0px' },
      )

      revealTargets.forEach((target) => observer.observe(target))
    } else {
      revealTargets.forEach((target) => target.classList.add('is-visible'))
    }

    function handleScroll() {
      const scrollValue = Math.min(window.scrollY / Math.max(window.innerHeight * 1.5, 1), 1.2)
      shell.style.setProperty('--shell-scroll', `${scrollValue}`)
      shell.classList.toggle('shell-is-scrolled', scrollValue > 0.05)
    }

    function attachTilt(target, strength = { x: 6, y: 8 }) {
      function handleMove(event) {
        const rect = target.getBoundingClientRect()
        const px = (event.clientX - rect.left) / rect.width
        const py = (event.clientY - rect.top) / rect.height
        const rotateY = (px - 0.5) * strength.y
        const rotateX = (0.5 - py) * strength.x

        target.style.setProperty('--tilt-rotate-x', `${rotateX}deg`)
        target.style.setProperty('--tilt-rotate-y', `${rotateY}deg`)
        target.style.setProperty('--tilt-pointer-x', `${px * 100}%`)
        target.style.setProperty('--tilt-pointer-y', `${py * 100}%`)
      }

      function handleLeave() {
        target.style.setProperty('--tilt-rotate-x', '0deg')
        target.style.setProperty('--tilt-rotate-y', '0deg')
        target.style.setProperty('--tilt-pointer-x', '50%')
        target.style.setProperty('--tilt-pointer-y', '50%')
      }

      target.addEventListener('pointermove', handleMove)
      target.addEventListener('pointerleave', handleLeave)

      return () => {
        target.removeEventListener('pointermove', handleMove)
        target.removeEventListener('pointerleave', handleLeave)
      }
    }

    function attachMagnet(target) {
      function handleMove(event) {
        const rect = target.getBoundingClientRect()
        const px = (event.clientX - rect.left) / rect.width
        const py = (event.clientY - rect.top) / rect.height
        const shiftX = (px - 0.5) * 10
        const shiftY = (py - 0.5) * 8

        target.style.setProperty('--magnet-x', `${shiftX}px`)
        target.style.setProperty('--magnet-y', `${shiftY}px`)
      }

      function handleLeave() {
        target.style.setProperty('--magnet-x', '0px')
        target.style.setProperty('--magnet-y', '0px')
      }

      target.addEventListener('pointermove', handleMove)
      target.addEventListener('pointerleave', handleLeave)

      return () => {
        target.removeEventListener('pointermove', handleMove)
        target.removeEventListener('pointerleave', handleLeave)
      }
    }

    const tiltCleanups = tiltTargets.map((target) => attachTilt(target))
    const magneticCleanups = magneticTargets.map((target) => attachMagnet(target))

    if (!prefersReducedMotion) {
      window.addEventListener('scroll', handleScroll, { passive: true })
      handleScroll()
    }

    return () => {
      observer?.disconnect()
      shell.classList.remove('shell-motion-ready')
      shell.classList.remove('shell-is-scrolled')
      window.removeEventListener('scroll', handleScroll)
      tiltCleanups.forEach((cleanup) => cleanup())
      magneticCleanups.forEach((cleanup) => cleanup())
    }
  }, [currentPath])

  return (
    <div className={shellClassName}>
      <div className={`shell-atmosphere shell-atmosphere--${themeKey}`} aria-hidden="true">
        <span className="shell-atmosphere__mesh shell-atmosphere__mesh--one" />
        <span className="shell-atmosphere__mesh shell-atmosphere__mesh--two" />
        <span className="shell-atmosphere__orb shell-atmosphere__orb--one" />
        <span className="shell-atmosphere__orb shell-atmosphere__orb--two" />
        <span className="shell-atmosphere__orb shell-atmosphere__orb--three" />
        <span className="shell-atmosphere__ring shell-atmosphere__ring--one" />
        <span className="shell-atmosphere__ring shell-atmosphere__ring--two" />
        <span className="shell-atmosphere__line shell-atmosphere__line--one" />
        <span className="shell-atmosphere__line shell-atmosphere__line--two" />
        <span className="shell-atmosphere__line shell-atmosphere__line--three" />
        <span className="shell-atmosphere__particle shell-atmosphere__particle--one" />
        <span className="shell-atmosphere__particle shell-atmosphere__particle--two" />
        <span className="shell-atmosphere__particle shell-atmosphere__particle--three" />
        <span className="shell-atmosphere__particle shell-atmosphere__particle--four" />
        <span className="shell-atmosphere__node shell-atmosphere__node--one" />
        <span className="shell-atmosphere__node shell-atmosphere__node--two" />
        <span className="shell-atmosphere__node shell-atmosphere__node--three" />
      </div>
      <SiteHeader currentPath={currentPath} onNavigate={onNavigate} />
      <main>{children}</main>
      <SiteFooter currentPath={currentPath} onNavigate={onNavigate} />
    </div>
  )
}
