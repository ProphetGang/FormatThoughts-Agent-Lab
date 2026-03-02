import { useEffect, useMemo, useState } from 'react'

function getSections() {
  return Array.from(document.querySelectorAll('[data-scroll-section]'))
}

export function useScrollSync(defaultId) {
  const [activeSectionId, setActiveSectionId] = useState(defaultId)
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    let rafId = 0

    const update = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight
      const progress = maxScroll > 0 ? window.scrollY / maxScroll : 0
      setScrollProgress(Math.max(0, Math.min(1, progress)))

      const sections = getSections()
      if (!sections.length) return

      const viewportTarget = window.innerHeight * 0.42
      let winner = sections[0]
      let bestDistance = Number.POSITIVE_INFINITY

      for (const section of sections) {
        const rect = section.getBoundingClientRect()
        const center = rect.top + rect.height / 2
        const distance = Math.abs(center - viewportTarget)
        if (distance < bestDistance) {
          bestDistance = distance
          winner = section
        }
      }

      const nextId = winner.getAttribute('data-scroll-section') || defaultId
      setActiveSectionId(nextId)
      rafId = 0
    }

    const onScroll = () => {
      if (!rafId) {
        rafId = window.requestAnimationFrame(update)
      }
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)

    return () => {
      if (rafId) window.cancelAnimationFrame(rafId)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [defaultId])

  return useMemo(
    () => ({ activeSectionId, scrollProgress }),
    [activeSectionId, scrollProgress],
  )
}
