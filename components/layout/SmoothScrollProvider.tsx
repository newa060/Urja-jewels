'use client'

import { useLenis } from '@/hooks/useLenis'

interface SmoothScrollProviderProps {
  children: React.ReactNode
}

/**
 * Initialises Lenis smooth scroll and syncs it with the GSAP ticker.
 * On mobile devices, uses native scroll.
 * Renders children unchanged — this component exists purely for its side effect.
 */
export default function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  useLenis()
  return <>{children}</>
}
