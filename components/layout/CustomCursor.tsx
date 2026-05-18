'use client'

import { useState, useEffect, useRef } from 'react'

const GOLD = '#B8973A'
const OBSIDIAN = '#1A1A1A'

const DOT_SIZE = 8
const RING_SIZE = 32
const LERP_FACTOR = 0.12

export default function CustomCursor() {
  const [isCoarse, setIsCoarse] = useState<boolean>(true)
  const [mounted, setMounted] = useState(false)
  const [hovered, setHovered] = useState(false)

  // Refs for the DOM elements to update styles directly (bypassing React re-renders)
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  // Position tracking refs
  const mouseRef = useRef({ x: -100, y: -100 })
  const ringPosRef = useRef({ x: -100, y: -100 })
  const rafRef = useRef<number | null>(null)



  useEffect(() => {
    // Detect coarse pointer once
    const coarse = window.matchMedia('(pointer: coarse)').matches
    
    // Defer state to prevent cascading render warning
    const timer = setTimeout(() => {
      setIsCoarse(coarse)
      setMounted(true)
    }, 0)

    if (coarse) {
      return () => clearTimeout(timer)
    }

    // The animation loop updates the DOM nodes directly for performance
    const animate = () => {
      const target = mouseRef.current
      const current = ringPosRef.current

      // Lerp calculation for the ring
      const nextX = current.x + (target.x - current.x) * LERP_FACTOR
      const nextY = current.y + (target.y - current.y) * LERP_FACTOR

      ringPosRef.current = { x: nextX, y: nextY }

      // Update dot position (snaps to mouse)
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${target.x}px, ${target.y}px, 0) translate(-50%, -50%)`
      }

      // Update ring position (trails behind)
      if (ringRef.current) {
        // We use a CSS class or fallback since hovered is not easily tracked here without stale state.
        // Actually, we can just read the hovered state via a ref.
        ringRef.current.style.transform = `translate3d(${nextX}px, ${nextY}px, 0) translate(-50%, -50%)`
      }

      rafRef.current = requestAnimationFrame(animate)
    }

    // Start loop
    rafRef.current = requestAnimationFrame(animate)

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }

    // Use event delegation for hover states
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target && target.closest?.('[data-cursor-hover]')) {
        setHovered(true)
      }
    }

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target && target.closest?.('[data-cursor-hover]')) {
        setHovered(false)
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseover', handleMouseOver)
    window.addEventListener('mouseout', handleMouseOut)

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseover', handleMouseOver)
      window.removeEventListener('mouseout', handleMouseOut)
    }
  }, [isCoarse])

  if (!mounted || isCoarse) return null

  const sharedStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    pointerEvents: 'none',
    zIndex: 9999,
    borderRadius: '50%',
    willChange: 'transform',
    // Initial position off-screen
    transform: 'translate3d(-100px, -100px, 0) translate(-50%, -50%)',
  }

  return (
    <>
      <div
        ref={dotRef}
        aria-hidden="true"
        style={{
          ...sharedStyle,
          width: DOT_SIZE,
          height: DOT_SIZE,
          backgroundColor: OBSIDIAN,
          transition: 'background-color 0.2s ease',
        }}
      />

      <div
        ref={ringRef}
        aria-hidden="true"
        style={{
          ...sharedStyle,
          width: RING_SIZE,
          height: RING_SIZE,
          backgroundColor: 'transparent',
          border: `2px solid ${hovered ? GOLD : OBSIDIAN}`,
          transition: 'border-color 0.2s ease, transform 0.15s ease-out',
        }}
      />
    </>
  )
}
