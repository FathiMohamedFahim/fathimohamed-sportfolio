import { useCallback } from 'react'

/**
 * Returns a stable scrollToSection(id) function that smooth-scrolls to the
 * element with the given id, offset by the fixed header's height so the
 * target isn't hidden underneath it.
 *
 * Previously implemented independently in Header.jsx, Hero.jsx, and
 * Projects.jsx — consolidated here so a fix (or a future change to how the
 * header height is measured) only has to happen once.
 *
 * `id` is the element id without a leading '#' (e.g. "about", not "#about").
 */
export function useScrollToSection() {
  return useCallback(id => {
    const target = document.querySelector(`#${id}`)
    if (!target) return

    const header = document.querySelector('header')
    const headerHeight = header ? header.offsetHeight : 0

    window.scrollTo({
      top: target.offsetTop - headerHeight,
      behavior: 'smooth',
    })
  }, [])
}
