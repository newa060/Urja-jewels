'use client'

import { useEffect, useRef } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'

/**
 * Initialises a Lenis smooth-scroll instance and synchronises it with GSAP's
 * RAF ticker so both systems share a single animation frame.
 *
 * Mobile-optimized: Disables Lenis on touch devices to use native scroll,
 * which is faster and more natural on mobile. Lenis only runs on desktop.
 *
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
    // Detect if device is touch-capable (mobile/tablet)
    const isTouchDevice = 
      'ontouchstart' in window || 
      navigator.maxTouchPoints > 0 ||
      window.matchMedia('(pointer: coarse)').matches

    // Skip Lenis on mobile - use native scroll for best performance
    if (isTouchDevice) {
      return
    }

    // Desktop: Use Lenis with optimized settings
    const lenis = new Lenis({
      duration: 1.2, // Slightly faster for better responsiveness
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      syncTouch: false, // Disabled - not needed on desktop
      lerp: 0.1, // Increased for snappier response
      touchMultiplier: 0, // Disable touch handling completely
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
