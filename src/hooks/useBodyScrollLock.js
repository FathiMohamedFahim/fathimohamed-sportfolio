import { useRef, useCallback } from 'react'

/**
 * Returns stable { lock, unlock } functions that pin the page at its
 * current scroll position and restore it exactly on unlock.
 *
 * Uses position:fixed rather than overflow:hidden — overflow:hidden alone
 * was tried first (see the mobile nav menu fix) and confirmed, via real
 * wheel-scroll testing, not to reliably block scroll/touch input in every
 * case. This is the version that actually holds.
 *
 * Previously implemented twice, differently, in Header.jsx (position:fixed,
 * correct) and Lightbox.jsx (overflow:hidden, the version already shown not
 * to fully work) — consolidated here so there's one lock behavior, not two.
 *
 * Nesting: if both consumers lock at once (e.g. lightbox opened while the
 * mobile menu is open), whichever unlocks first will restore scroll to
 * *its* saved position, not necessarily back to a "still locked" state —
 * this hook doesn't reference-count. That matches the current app's actual
 * usage (opening the lightbox already closes the mobile menu first), so it
 * isn't a regression, but it's not written to be safe for true simultaneous
 * nested locks from unrelated call sites.
 */
export function useBodyScrollLock() {
  const savedScrollY = useRef(0)

  const lock = useCallback(() => {
    savedScrollY.current = window.scrollY
    document.body.classList.add('no-scroll')
    document.body.style.top = `-${savedScrollY.current}px`
  }, [])

  const unlock = useCallback(() => {
    document.body.classList.remove('no-scroll')
    document.body.style.top = ''
    window.scrollTo(0, savedScrollY.current)
  }, [])

  return { lock, unlock }
}
