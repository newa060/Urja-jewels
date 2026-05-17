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
<<<<<<< HEAD

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

    
    // Scoped GSAP context to prevent 'removeChild' errors on unmount/reload
    const ctx = gsap.context(() => {
      drawFrame(0)
      ScrollTrigger.refresh()

      if (isMobile) {
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.1, // immediate, fast response to finger scrolls
          onUpdate: (self) => {
            const maxFrames = Math.round(TOTAL_FRAMES / 2)
            const index = Math.round(self.progress * (maxFrames - 1))
            currentFrameRef.current = index
            drawFrame(index)

            // Subtle focus entrance/exit transition as mobile scrolls
            let opacity = 1
            let blur = 0
            if (self.progress < 0.2) {
              opacity = 0.7 + (self.progress / 0.2) * 0.3
              blur = 4 * (1 - self.progress / 0.2)
            } else if (self.progress > 0.8) {
              opacity = 0.7 + ((1 - self.progress) / 0.2) * 0.3
              blur = 4 * (1 - (1 - self.progress) / 0.2)
            }

            const content = sectionRef.current?.querySelector('.cinematic-content') as HTMLElement
            if (content) {
              gsap.set(content, { opacity, filter: `blur(${blur}px)` })
            }
          },
        })
      } else {
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start:   'top top',
          end:     `+=${window.innerHeight * 2}`,
          pin:     true,
          scrub:   0.4,
          anticipatePin: 1,
          onUpdate: (self) => {
            const index = Math.round(self.progress * (TOTAL_FRAMES - 1))
            currentFrameRef.current = index
            drawFrame(index)

            // Subtle Focus Transition
            let opacity = 1
            let blur = 0
            if (self.progress < 0.05) {
              opacity = 0.7 + (self.progress / 0.05) * 0.3
              blur = 4 * (1 - self.progress / 0.05)
            }

            const content = sectionRef.current?.querySelector('.cinematic-content') as HTMLElement
            const textBlock = sectionRef.current?.querySelector('.parallax-text') as HTMLElement
            
            if (content) {
              gsap.set(content, { opacity, filter: `blur(${blur}px)` })
            }
            if (textBlock) {
              gsap.set(textBlock, { y: (self.progress - 0.5) * -60 })
            }
          },
        })
      }
      
      ScrollTrigger.refresh()
    }, sectionRef)

    return () => ctx.revert() // Cleanly removes all pins and animations
  }, [ready, drawFrame])
>>>>>>> 104fc4e1b24fe32d24bebb461ae61a505d7c120e

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-screen overflow-hidden"
      style={{ backgroundColor: '#e2ceb9' }} // Matches the image's dominant stone color
    >
      <div 
        className="cinematic-content w-full h-full"
        style={{ 
          opacity: 0.7, 
          filter: 'blur(4px)',
          willChange: 'transform, opacity', 
          backfaceVisibility: 'hidden' 
        }}
      >
        {/* Hairlines */}
        <div className="absolute inset-x-0 top-0 h-px bg-black/5" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-black/5" />

        {/* Two-column — stacks on mobile */}
        <div className="absolute inset-0 flex flex-col md:flex-row items-center justify-center md:justify-start pt-16 md:pt-0">

          {/* CANVAS BLOCK — Now stacks on mobile */}
          <div className="flex items-center justify-center flex-1 w-full order-1 h-[45vh] md:h-full">
            <div
              style={{
                position: 'relative',
                height: '100%',
                width: '100%',
                maxWidth: '85vw',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
<<<<<<< HEAD
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
=======
>>>>>>> 104fc4e1b24fe32d24bebb461ae61a505d7c120e
            >
              <canvas
                ref={canvasRef}
                aria-label="Diamond Engagement Ring — Cinematic View"
                style={{ 
                  display: 'block', 
                  maxWidth: '100%',
                  maxHeight: '100%',
                  width: 'auto',
                  height: 'auto',
                  objectFit: 'contain',
                  willChange: 'transform',
                  backfaceVisibility: 'hidden'
                }}
              />
            </div>
          </div>

          {/* TEXT BLOCK — Now stacks on mobile */}
          <div
            className="parallax-text flex flex-col justify-center gap-4 md:gap-6 px-8 md:pr-20 lg:pr-32 order-2 md:order-2 w-full md:w-[42%] max-w-[500px]"
          >
            {/* Label */}
            <p
              className="text-[9px] md:text-[10px] uppercase tracking-[0.5em] font-body text-center md:text-left"
              style={{ color: 'rgba(160,120,40,0.7)' }}
            >
              Signature Atelier
            </p>

            {/* Product name */}
            <h2
              className="text-[clamp(2rem,6vw,4.5rem)] font-light leading-[1.05] tracking-tight text-center md:text-left"
              style={{ color: '#1a1410', fontFamily: 'var(--font-cormorant)' }}
            >
              Yellow Gold<br />Diamond<br /><span className="italic">Engagement</span>
            </h2>

            {/* Hairline */}
            <div className="w-12 h-px bg-gradient-to-r from-black/10 to-transparent mx-auto md:mx-0" />

            {/* Description */}
            <div className="space-y-4">
              <p
                className="text-[12px] md:text-[13px] leading-relaxed font-body text-center md:text-left"
                style={{ color: 'rgba(26,20,16,0.5)', maxWidth: 300, margin: '0 auto' }}
              >
                A brilliant-cut diamond of exceptional clarity, set in a meticulously hand-crafted 18k yellow gold band. A promise made for eternity.
              </p>
            </div>

            {/* Scroll hint */}
            <div className="flex items-center justify-center md:justify-start gap-4 mt-2 md:mt-4">
              <span
                className="text-[9px] uppercase tracking-[0.4em] font-body"
                style={{ color: 'rgba(160,120,40,0.5)' }}
              >
                Crafted to order
              </span>
              <div className="w-6 h-px bg-black/10" />
            </div>
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
