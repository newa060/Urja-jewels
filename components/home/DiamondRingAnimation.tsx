'use client'

import { useRef, useEffect, useCallback, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useFrameAnimation } from '@/hooks/useFrameAnimation'

gsap.registerPlugin(ScrollTrigger)

export default function DiamondRingAnimation() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const canvasRef  = useRef<HTMLCanvasElement>(null)
  const currentFrameRef = useRef(0)
  const prevWidthRef = useRef(0)
  const TOTAL_FRAMES = 82

  // Mobile / Client Detection
  const [isMobile, setIsMobile] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || window.matchMedia('(pointer: coarse)').matches)
    }

    // Defer state updates to satisfy strict react-hooks/set-state-in-effect lint rules
    const timer = setTimeout(() => {
      setIsClient(true)
      checkMobile()
    }, 0)

    window.addEventListener('resize', checkMobile)
    return () => {
      clearTimeout(timer)
      window.removeEventListener('resize', checkMobile)
    }
  }, [])

  // Calculate effective frames and custom mapping
  const effectiveTotalFrames = isClient ? (isMobile ? Math.round(TOTAL_FRAMES / 2) : TOTAL_FRAMES) : 0

  const customGetFileName = useCallback((index: number) => {
    const actualIndex = isMobile ? index * 2 : index
    return `Yellow_gold_diamond_engagement_ring_202605130931_${String(actualIndex).padStart(3, '0')}.webp`
  }, [isMobile])

  const { frames, ready } = useFrameAnimation(
    effectiveTotalFrames,
    '/frames/Yellow_gold_diamond',
    customGetFileName
  )

  /* ── Draw ──────────────────────────────────────────────────────────── */
  const drawFrame = useCallback((index: number) => {
    const img    = frames[index]
    const canvas = canvasRef.current
    if (!canvas || !img) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const { width: cw, height: ch } = canvas
    const { naturalWidth: iw, naturalHeight: ih } = img
    if (!iw || !ih) return
    const scale = Math.min(cw / iw, ch / ih) // contain
    const x = (cw - iw * scale) / 2
    const y = (ch - ih * scale) / 2
    ctx.clearRect(0, 0, cw, ch)
    ctx.drawImage(img, x, y, iw * scale, ih * scale)
  }, [frames])

  /* ── Canvas sizing ────────────────────────────────────────────────── */
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const setSize = () => {
      const currentWidth = window.innerWidth
      // On mobile, height changes due to URL bar show/hide. Only trigger a full canvas resize if the width actually changes.
      if (prevWidthRef.current && prevWidthRef.current === currentWidth) {
        drawFrame(currentFrameRef.current)
        return
      }
      prevWidthRef.current = currentWidth

      if (isMobile) {
        // Square canvas for mobile centered view
        const size = Math.round(Math.min(window.innerWidth * 0.85, window.innerHeight * 0.5))
        canvas.height = size
        canvas.width = size
      } else {
        canvas.height = Math.round(window.innerHeight * 0.85)
        canvas.width  = Math.round(canvas.height * 0.70)
      }
      drawFrame(currentFrameRef.current)
    }

    setSize()
    const ro = new ResizeObserver(setSize)
    ro.observe(document.documentElement)
    return () => ro.disconnect()
  }, [drawFrame, isMobile])

  /* ── GSAP scroll trigger ──────────────────────────────────────────── */
  useEffect(() => {
    if (!ready || !sectionRef.current) return

    if (isMobile) {
      drawFrame(0)

      const trigger = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 0.1, // immediate, fast response to finger scrolls
        onUpdate: (self) => {
          const maxFrames = Math.round(TOTAL_FRAMES / 2)
          const index = Math.round(self.progress * (maxFrames - 1))
          currentFrameRef.current = index
          drawFrame(index)
        },
      })

      return () => trigger.kill()
    } else {
      drawFrame(0)

      const trigger = ScrollTrigger.create({
        trigger: sectionRef.current,
        start:   'top top',
        end:     `+=${window.innerHeight * 3}`,
        pin:     true,
        scrub:   0.6,
        onUpdate: (self) => {
          const index = Math.round(self.progress * (TOTAL_FRAMES - 1))
          currentFrameRef.current = index
          drawFrame(index)
        },
      })

      return () => trigger.kill()
    }
  }, [ready, isMobile, TOTAL_FRAMES, drawFrame])

  // Responsive UI Render
  if (isMobile) {
    return (
      <section
        ref={sectionRef}
        className="relative w-full min-h-screen py-12 px-6 flex flex-col justify-between items-center gap-8 text-center"
        style={{ backgroundColor: '#e2ceb9' }}
      >
        {/* Hairlines */}
        <div className="absolute inset-x-0 top-0 h-px bg-black/10" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-black/10" />

        {/* Header Title */}
        <div className="flex flex-col items-center gap-3 mt-6">
          <p
            className="text-[10px] uppercase tracking-[0.35em]"
            style={{ color: 'rgba(160,120,40,0.8)' }}
          >
            Signature Collection
          </p>
          <div className="w-8 h-px bg-black/15" />
          <h2
            className="text-4xl font-extralight leading-tight tracking-tight text-[#1a1410]"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            Yellow Gold Diamond Engagement Ring
          </h2>
        </div>

        {/* Canvas Center */}
        <div className="relative flex items-center justify-center w-full max-h-[50vh]">
          <div
            style={{
              position: 'relative',
              width: 'min(85vw, 50vh * 0.7)',
              height: 'calc(min(85vw, 50vh * 0.7) / 0.7)',
              maxWidth: '280px',
              maxHeight: '400px',
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: '-6%',
                background: 'radial-gradient(ellipse at 50% 55%, rgba(212,175,55,0.12) 0%, transparent 70%)',
                pointerEvents: 'none',
              }}
            />
            <canvas
              ref={canvasRef}
              aria-label="Yellow Gold Diamond Engagement Ring — 360° auto-rotation"
              style={{
                display: 'block',
                width: '100%',
                height: '100%',
                objectFit: 'contain',
              }}
            />
          </div>
        </div>

        {/* Footer copy */}
        <div className="flex flex-col items-center gap-4 mb-6">
          <p className="text-xs leading-relaxed max-w-xs text-black/60">
            A brilliant-cut diamond set in warm 18k yellow gold.<br />
            Crafted to mark life&apos;s most precious moment — forever yours.
          </p>
          <div className="w-8 h-px bg-black/15" />
          <div className="flex items-center gap-3">
            <span
              className="text-[9px] uppercase tracking-[0.3em]"
              style={{ color: 'rgba(160,120,40,0.6)' }}
            >
              Scroll to explore
            </span>
            <svg
              width="12" height="12" viewBox="0 0 16 16" fill="none"
              className="opacity-50 animate-bounce"
            >
              <path
                d="M4 6l4 4 4-4"
                stroke="#A07828"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        <div
          className="text-[9px] tracking-[0.25em] text-[#1a1410]/30 absolute bottom-4"
        >
          Yellow Gold Diamond — Urja Jewels
        </div>
      </section>
    )
  }

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-screen overflow-hidden"
      style={{ backgroundColor: '#e2ceb9' }} // Matches the image's dominant stone color
    >
      {/* Hairlines */}
      <div className="absolute inset-x-0 top-0 h-px bg-black/10" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-black/10" />

      {/* Two-column — image LEFT, text RIGHT (mirrored from Gold Dome) */}
      <div className="absolute inset-0 flex items-center">

        {/* LEFT — portrait canvas */}
        <div className="flex items-center justify-center flex-1 h-full">
          <div
            style={{
              position: 'relative',
              height: '85vh',
              width: 'calc(85vh * 0.70)',
              maxWidth: '55vw',
            }}
          >
            {/* Warm gold ambient glow */}
            <div
              style={{
                position: 'absolute',
                inset: '-4%',
                background: 'radial-gradient(ellipse at 50% 55%, rgba(212,175,55,0.12) 0%, transparent 70%)',
                pointerEvents: 'none',
              }}
            />
            <canvas
              ref={canvasRef}
              aria-label="Yellow gold diamond engagement ring — 360° scroll showcase"
              style={{ display: 'block', width: '100%', height: '100%', objectFit: 'contain' }}
            />
          </div>
        </div>

        {/* RIGHT — text block */}
        <div
          className="flex flex-col justify-center gap-5 pr-12 md:pr-20 lg:pr-28"
          style={{ width: '38%', minWidth: 240 }}
        >
          {/* Label */}
          <p
            className="text-[10px] uppercase tracking-[0.35em]"
            style={{ color: 'rgba(160,120,40,0.8)' }}
          >
            Signature Collection
          </p>

          {/* Hairline */}
          <div className="w-8 h-px bg-black/15" />

          {/* Product name */}
          <h2
            className="text-[clamp(2rem,3.5vw,3.5rem)] font-extralight leading-[1.1] tracking-tight"
            style={{ color: '#1a1410', fontFamily: 'Georgia, serif' }}
          >
            Yellow Gold<br />Diamond<br />Engagement Ring
          </h2>

          {/* Description */}
          <p
            className="text-sm leading-relaxed"
            style={{ color: 'rgba(26,20,16,0.45)', maxWidth: 280 }}
          >
            A brilliant-cut diamond set in warm 18k yellow gold.
            <br />
            Crafted to mark life&apos;s most precious moment —
            <br />
            forever yours.
          </p>

          {/* Hairline */}
          <div className="w-8 h-px bg-black/15" />

          {/* Scroll hint */}
          <div className="flex items-center gap-3">
            <span
              className="text-[10px] uppercase tracking-[0.3em]"
              style={{ color: 'rgba(160,120,40,0.55)' }}
            >
              Scroll to explore
            </span>
            <svg
              width="16" height="16" viewBox="0 0 16 16" fill="none"
              className="opacity-50 animate-bounce"
            >
              <path
                d="M4 6l4 4 4-4"
                stroke="#A07828"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Watermark */}
      <div
        className="absolute bottom-8 left-10 text-[10px] tracking-[0.25em] tabular-nums"
        style={{ color: 'rgba(26,20,16,0.18)' }}
      >
        Yellow Gold Diamond — Urja Jewels
      </div>
    </section>
  )
}
