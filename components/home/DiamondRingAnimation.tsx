'use client'

import { useRef, useEffect, useCallback, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useFrameAnimation } from '@/hooks/useFrameAnimation'

gsap.registerPlugin(ScrollTrigger)

interface DiamondRingAnimationProps {
  onLoadProgress?: (progress: number) => void
  onLoadComplete?: () => void
  isPageReady?: boolean
}

export default function DiamondRingAnimation({
  onLoadProgress,
  onLoadComplete,
  isPageReady = true,
}: DiamondRingAnimationProps = {}) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const canvasRef  = useRef<HTMLCanvasElement>(null)
  const currentFrameRef = useRef(0)
  const prevWidthRef = useRef(0)
  const prevIsMobileRef = useRef<boolean | null>(null)
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
  const effectiveTotalFrames = isClient ? TOTAL_FRAMES : 0

  const customGetFileName = useCallback((index: number) => {
    return `Yellow_gold_diamond_engagement_ring_202605130931_${String(index).padStart(3, '0')}.webp`
  }, [])

  const { frames, progress, ready } = useFrameAnimation(
    effectiveTotalFrames,
    '/frames/Yellow_gold_diamond',
    customGetFileName
  )

  useEffect(() => {
    if (onLoadProgress) onLoadProgress(progress)
  }, [progress, onLoadProgress])

  useEffect(() => {
    if (ready && onLoadComplete) onLoadComplete()
  }, [ready, onLoadComplete])

  /* ── Draw ──────────────────────────────────────────────────────────── */
  const drawFrame = useCallback((index: number) => {
    const img    = frames[index]
    const canvas = canvasRef.current
    if (!canvas || !img) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    // Ensure high quality image scaling
    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = 'high'

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
      const isMobileChanged = prevIsMobileRef.current !== isMobile
      // On mobile, height changes due to URL bar show/hide. Only trigger a full canvas resize if the width actually changes.
      if (!isMobileChanged && prevWidthRef.current && prevWidthRef.current === currentWidth) {
        drawFrame(currentFrameRef.current)
        return
      }
      prevWidthRef.current = currentWidth
      prevIsMobileRef.current = isMobile

      if (isMobile) {
        // High quality pixel buffer: fill the screen width scaled by device pixel ratio for crystal clear cover rendering
        const dpr = window.devicePixelRatio || 1
        const targetWidth = window.innerWidth
        canvas.width = Math.round(targetWidth * dpr)
        canvas.height = Math.round((targetWidth / 0.75) * dpr)
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

  const tweenRef = useRef<gsap.core.Tween | null>(null)
  const playMobileAnimation = useCallback(() => {
    if (!ready || !sectionRef.current) return
    if (tweenRef.current) tweenRef.current.kill()
    const playObj = { progress: 0 }
    tweenRef.current = gsap.to(playObj, {
      progress: 1,
      duration: 3.0, // Cinematic 3.0s flow
      ease: 'power1.inOut', // Super smooth deceleration and acceleration curve
      onUpdate: () => {
        const index = Math.min(TOTAL_FRAMES - 1, Math.floor(playObj.progress * TOTAL_FRAMES))
        currentFrameRef.current = index
        drawFrame(index)

        // Subtle cinematic lens focus on the canvas during autoplay
        const progress = playObj.progress
        const canvas = canvasRef.current
        if (canvas) {
          let canvasBlur = 0
          let canvasOpacity = 1
          if (progress < 0.15) {
            const ratio = progress / 0.15
            canvasBlur = 3.5 * (1 - ratio)
            canvasOpacity = 0.8 + 0.2 * ratio
          }
          gsap.set(canvas, { 
            filter: canvasBlur > 0 ? `blur(${canvasBlur}px)` : 'none',
            opacity: canvasOpacity
          })
        }
      }
    })
  }, [ready, TOTAL_FRAMES, drawFrame])

  useEffect(() => {
    if (!ready || !isPageReady || !sectionRef.current) return

    // Scoped GSAP context to prevent 'removeChild' errors on unmount/reload
    const ctx = gsap.context(() => {
      drawFrame(0)
      ScrollTrigger.refresh()

      // ── Premium Cinematic Entrance Animation ──
      const entranceTl = gsap.timeline()
      
      // Smooth fade & slide up for text elements
      entranceTl.fromTo(
        sectionRef.current?.querySelectorAll('.parallax-text > *') || [],
        { opacity: 0, y: 35 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 1.4, 
          ease: 'power3.out', 
          stagger: 0.12 
        }
      )

      // Soft cinematic lens pull and fade/zoom in for the canvas
      if (canvasRef.current) {
        entranceTl.fromTo(
          canvasRef.current,
          { opacity: 0, scale: 0.94, filter: 'blur(6px)' },
          { 
            opacity: 1, 
            scale: 1, 
            filter: 'blur(0px)', 
            duration: 1.8, 
            ease: 'power2.out' 
          },
          '-=1.4' // overlay beautifully with the text reveal
        )
      }

      if (isMobile) {
        // Mobile: No pinning, no scroll-scrub. Auto-play when section enters or re-enters viewport.
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: 'top 80%',
          onEnter: playMobileAnimation,
          onEnterBack: playMobileAnimation,
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
            const index = Math.min(TOTAL_FRAMES - 1, Math.floor(self.progress * TOTAL_FRAMES))
            currentFrameRef.current = index
            drawFrame(index)

            // Subtle cinematic lens focus on the canvas at the very start of pinning/scrolling
            const canvas = canvasRef.current
            if (canvas) {
              let canvasBlur = 0
              let canvasOpacity = 1
              if (self.progress < 0.12) {
                const ratio = self.progress / 0.12
                canvasBlur = 3.5 * (1 - ratio)
                canvasOpacity = 0.8 + 0.2 * ratio
              }
              gsap.set(canvas, { 
                filter: canvasBlur > 0 ? `blur(${canvasBlur}px)` : 'none',
                opacity: canvasOpacity
              })
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
  }, [ready, isMobile, TOTAL_FRAMES, drawFrame, playMobileAnimation, isPageReady])

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-screen overflow-hidden"
      style={{ backgroundColor: '#e0d6cb' }} // Matches the image's dominant stone color & Gold Dome section
    >
      <div 
        className="cinematic-content w-full h-full"
        style={{ 
          willChange: 'transform, opacity', 
          backfaceVisibility: 'hidden' 
        }}
      >
        {/* Hairlines */}
        <div className="absolute inset-x-0 top-0 h-px bg-black/5" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-black/5" />

        {/* Two-column — stacks on mobile with perfect spacing */}
        <div className="absolute inset-0 flex flex-col md:flex-row items-center justify-center md:justify-start pt-8 pb-12 md:py-0 gap-6 md:gap-0">

          {/* CANVAS BLOCK — Now stacks on mobile, taking up consistent height */}
          <div 
            className="flex items-center justify-center flex-1 w-full order-1 min-h-[50vh] md:min-h-0 md:h-full"
            onClick={isMobile ? playMobileAnimation : undefined}
            style={{ cursor: isMobile ? 'pointer' : 'default' }}
          >
            <div
              style={{
                position: 'relative',
                height: isMobile ? 'auto' : '100%',
                width: '100%',
                aspectRatio: isMobile ? '3/4' : 'auto',
                maxWidth: isMobile ? '100%' : '85vw',
                display: 'flex',
                alignItems: isMobile ? 'flex-start' : 'center',
                justifyContent: 'center',
                overflow: 'hidden'
              }}
            >
              <canvas
                ref={canvasRef}
                aria-label="Diamond Engagement Ring — Cinematic View"
                style={{ 
                  display: 'block', 
                  width: isMobile ? '100%' : 'auto',
                  height: isMobile ? '100%' : 'auto',
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: isMobile ? 'cover' : 'contain',
                  objectPosition: isMobile ? 'top' : 'center',
                  willChange: 'transform',
                  transform: isMobile ? 'translate3d(0, 0, 0)' : 'none',
                  backfaceVisibility: 'hidden'
                }}
              />
            </div>
          </div>

          {/* TEXT BLOCK — Now stacks on mobile with safe spacing */}
          <div
            className="parallax-text flex flex-col justify-center gap-3 md:gap-6 px-6 md:pr-20 lg:pr-32 order-2 md:order-2 w-full md:w-[42%] max-w-[500px] shrink-0"
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
        className="hidden md:block absolute bottom-8 left-10 text-[10px] tracking-[0.25em] tabular-nums"
        style={{ color: 'rgba(26,20,16,0.18)' }}
      >
        Yellow Gold Diamond — Urja Jewels
      </div>
    </section>
  )
}
