'use client'

import { useEffect, useRef } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'

/**
 * Initialises a Lenis smooth-scroll instance and synchronises it with GSAP's
 * RAF ticker so both systems share a single animation frame.
 *
 * - `duration: 1.2` with a custom exponential-decay easing curve.
 * - Ticker callback is stored in a variable so it can be properly removed on
 *   cleanup (anonymous arrow functions cannot be de-registered by reference).
 * - `gsap.ticker.lagSmoothing(0)` prevents GSAP from skipping frames after
 *   the tab loses focus and regains it.
 *
 * Validates: Requirements 2.4, 13.2
 */
export function useLenis(): React.MutableRefObject<Lenis | null> {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    // Bypass Lenis on mobile/touch screens to restore native, hardware-accelerated momentum scrolling.
    const isTouch = window.matchMedia('(pointer: coarse)').matches
    const isMobileUA = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)
    if (isTouch || isMobileUA) {
      return
    }

    const lenis = new Lenis({
      lerp: 0.1, // Smoother, more consistent interpolation
      smoothWheel: true,
      syncTouch: true,
    })
    lenisRef.current = lenis

    // Store the callback so the exact same reference can be removed on cleanup.
    const tickerCallback = (time: number) => lenis.raf(time * 1000)

    gsap.ticker.add(tickerCallback)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(tickerCallback)
      lenis.destroy()
    }
  }, [])

  return lenisRef
}
