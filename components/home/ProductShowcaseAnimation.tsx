'use client'

import { useRef, useEffect, useCallback, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useFrameAnimation } from '@/hooks/useFrameAnimation'

gsap.registerPlugin(ScrollTrigger)

export default function ProductShowcaseAnimation() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
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
    return `Gold_dome_ring_on_stone_202605130855_${String(actualIndex).padStart(3, '0')}.webp`
  }, [isMobile])

  const { frames, ready } = useFrameAnimation(
    effectiveTotalFrames,
    '/frames/Gold_dome_ring',
    customGetFileName
  )

  /* ── Draw helpers ─────────────────────────────────────────────────── */
  const drawFrame = useCallback(
    (index: number) => {
      const img = frames[index]
      const canvas = canvasRef.current
      if (!canvas || !img) return
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      const { width: cw, height: ch } = canvas
      const { naturalWidth: iw, naturalHeight: ih } = img
      if (!iw || !ih) return
      // object-fit: contain — no clipping
      const scale = Math.min(cw / iw, ch / ih)
      const x = (cw - iw * scale) / 2
      const y = (ch - ih * scale) / 2
      ctx.clearRect(0, 0, cw, ch)
      ctx.drawImage(img, x, y, iw * scale, ih * scale)
    },
    [frames],
  )

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
        // Taller portrait card for mobile, filling more space
        const targetWidth = window.innerWidth * 0.9;
        const targetHeight = window.innerHeight * 0.55;
        const w = Math.min(targetWidth, targetHeight * 0.75); // ~3:4 aspect ratio
        canvas.width = Math.round(w);
        canvas.height = Math.round(w / 0.75);
      } else {
        // Portrait card: 52% of viewport height wide, 85% tall → ~3:5 ratio
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

  /* ── GSAP scroll animation ────────────────────────────────────────── */
  useEffect(() => {
    if (!ready || !sectionRef.current) return

    // Scoped GSAP context to prevent 'removeChild' errors on unmount/reload
    const ctx = gsap.context(() => {
      drawFrame(0)
      ScrollTrigger.refresh()

      if (isMobile) {
        const maxFrames = Math.round(TOTAL_FRAMES / 2)
        // Mobile: No pinning, no scroll-scrub. Auto-play once when section enters viewport.
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: 'top 80%',
          once: true,
          onEnter: () => {
            const playObj = { frame: 0 }
            gsap.to(playObj, {
              frame: maxFrames - 1,
              duration: 2.2, // Play smoothly over 2.2s
              ease: 'power1.out',
              onUpdate: () => {
                const index = Math.round(playObj.frame)
                currentFrameRef.current = index
                drawFrame(index)

                // Subtle Focus Transition based on animation progress
                const progress = playObj.frame / (maxFrames - 1)
                let opacity = 1
                let blur = 0
                if (progress < 0.1) {
                  opacity = 0.7 + (progress / 0.1) * 0.3
                  blur = 4 * (1 - progress / 0.1)
                }

                const content = sectionRef.current?.querySelector('.cinematic-content') as HTMLElement
                if (content) {
                  gsap.set(content, { opacity, filter: `blur(${blur}px)` })
                }
              }
            })
          }
        })
      } else {
        // Desktop: High-fidelity scroll pinning and scrubbing
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: 'top top',
          end: `+=${window.innerHeight * 2}`,
          pin: true,
          scrub: 0.4,
          anticipatePin: 1,
          onUpdate: (self) => {
            const index = Math.round(self.progress * (TOTAL_FRAMES - 1))
            currentFrameRef.current = index
            drawFrame(index)

            // Subtle Focus Transition based on scroll progress
            let opacity = 1
            let blur = 0
            if (self.progress < 0.05) {
              opacity = 0.7 + (self.progress / 0.05) * 0.3
              blur = 4 * (1 - self.progress / 0.05)
            }

            const content = sectionRef.current?.querySelector('.cinematic-content') as HTMLElement
            if (content) {
              gsap.set(content, { opacity, filter: `blur(${blur}px)` })
            }

            const textBlock = sectionRef.current?.querySelector('.parallax-text') as HTMLElement
            if (textBlock) {
              gsap.set(textBlock, { y: (self.progress - 0.5) * -60 })
            }
          },
        })
      }
      
      ScrollTrigger.refresh()
    }, sectionRef)

    return () => ctx.revert() // Cleanly removes all pins and animations
  }, [ready, isMobile, TOTAL_FRAMES, drawFrame])

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-screen overflow-hidden"
      style={{ backgroundColor: '#e0d6cb' }} // Matches the image's dominant stone color & Diamond section
    >
      <div 
        className="cinematic-content w-full h-full"
        style={{ 
          willChange: 'transform, opacity', 
          backfaceVisibility: 'hidden' 
        }}
      >
        {/* ── faint top / bottom hairlines ── */}
        <div className="absolute inset-x-0 top-0 h-px bg-black/5" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-black/5" />

        {/* ── Two-column layout ── */}
        <div className="absolute inset-0 flex flex-col md:flex-row items-center justify-center md:justify-start pt-8 pb-12 md:py-0 gap-6 md:gap-0">

          {/* TEXT BLOCK — Now stacks on mobile */}
          <div
            className="parallax-text flex flex-col justify-center gap-3 md:gap-6 px-6 md:pl-20 lg:pl-32 order-2 md:order-1 w-full md:w-[42%] max-w-[500px] shrink-0"
          >
            {/* Label */}
            <p
              className="text-[9px] md:text-[10px] uppercase tracking-[0.5em] font-body text-center md:text-left"
              style={{ color: 'rgba(160,120,40,0.7)' }}
            >
              The 2026 Collection
            </p>

            {/* Product name */}
            <h2
              className="text-[clamp(2rem,6vw,4.5rem)] font-light leading-[1.1] tracking-tight text-center md:text-left"
              style={{ color: '#1a1410', fontFamily: 'var(--font-cormorant)' }}
            >
              Gold Dome<br /><span className="italic">Ring</span>
            </h2>

            {/* Hairline */}
            <div className="w-12 h-px bg-gradient-to-r from-black/10 to-transparent mx-auto md:mx-0" />

            {/* Description */}
            <div className="space-y-4">
              <p className="text-[13px] leading-relaxed font-body text-center md:text-left mx-auto md:mx-0 max-w-[320px]" style={{ color: 'rgba(26,20,16,0.5)' }}>
                A sculptural masterpiece hand-set on natural basalt stone. 18k polished gold, meticulously refined for a seamless silhouette.
              </p>
            </div>

            {/* Scroll hint */}
            <div className="flex items-center justify-center md:justify-start gap-4 mt-2 md:mt-4">
              <span
                className="text-[9px] uppercase tracking-[0.4em] font-body"
                style={{ color: 'rgba(160,120,40,0.5)' }}
              >
                Rotate 360°
              </span>
              <div className="w-6 h-px bg-black/10" />
            </div>
          </div>

          {/* CANVAS BLOCK — Now stacks on mobile */}
          <div
            className="flex items-center justify-center flex-1 w-full order-1 md:order-2 md:h-full min-h-[50vh] md:min-h-0"
          >
            <div
              style={{
                position: 'relative',
                height: '100%',
                width: '100%',
                maxWidth: '95vw',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <canvas
                ref={canvasRef}
                aria-label="Gold Dome Ring — Cinematic 360° View"
                style={{
                  display: 'block',
                  maxWidth: '100%',
                  maxHeight: '100%',
                  width: 'auto',
                  height: 'auto',
                  objectFit: 'contain',
                  willChange: 'transform',
                  transform: isMobile ? 'translate3d(0, 0, 0)' : 'none',
                  backfaceVisibility: 'hidden'
                }}
              />
            </div>
          </div>
        </div>
      </div>
      {/* ── Frame counter (tiny, bottom-right, like a film roll) ── */}
      <div
        className="hidden md:block absolute bottom-8 right-10 text-[10px] tracking-[0.25em] tabular-nums"
        style={{ color: 'rgba(26,20,16,0.18)' }}
      >
        Gold Dome Ring — Urja Jewels
      </div>
    </section>
  )
}
