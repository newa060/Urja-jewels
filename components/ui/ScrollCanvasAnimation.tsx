'use client'

import { useRef, useEffect, useCallback, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useFrameAnimation } from '@/hooks/useFrameAnimation'

gsap.registerPlugin(ScrollTrigger)

interface ScrollCanvasAnimationProps {
  totalFrames: number
  basePath: string
  getFileName: (index: number) => string
  scrollDistance?: number // in viewport heights (vh)
  className?: string
  onLoadProgress?: (progress: number) => void
  onLoadComplete?: () => void
  ariaLabel?: string
  portrait?: boolean // renders canvas in a centered portrait card
  children?: React.ReactNode
}

export default function ScrollCanvasAnimation({
  totalFrames,
  basePath,
  getFileName,
  scrollDistance = 4,
  className = '',
  onLoadProgress,
  onLoadComplete,
  ariaLabel = 'Scroll animation',
  portrait = false,
  children,
}: ScrollCanvasAnimationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const currentFrameRef = useRef(0)
  const prevWidthRef = useRef(0)

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
  const effectiveTotalFrames = isClient ? totalFrames : 0

  const customGetFileName = useCallback((index: number) => {
    return getFileName(index)
  }, [getFileName])

  const { frames, progress, ready } = useFrameAnimation(
    effectiveTotalFrames,
    basePath,
    customGetFileName
  )

  const drawFrame = useCallback(
    (index: number) => {
      const img = frames[index]
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

      if (portrait) {
        // object-fit: contain — image fills the portrait card without clipping
        const scale = Math.min(cw / iw, ch / ih)
        const x = (cw - iw * scale) / 2
        const y = (ch - ih * scale) / 2
        ctx.clearRect(0, 0, cw, ch)
        ctx.drawImage(img, x, y, iw * scale, ih * scale)
      } else {
        // object-fit: cover — fills full-screen canvas
        const scale = Math.max(cw / iw, ch / ih)
        const x = (cw - iw * scale) / 2
        const y = (ch - ih * scale) / 2
        ctx.clearRect(0, 0, cw, ch)
        ctx.drawImage(img, x, y, iw * scale, ih * scale)
      }
    },
    [frames, portrait],
  )

  const tweenRef = useRef<gsap.core.Tween | null>(null)
  const playMobileAnimation = useCallback(() => {
    if (!ready) return
    if (tweenRef.current) tweenRef.current.kill()
    const playObj = { progress: 0 }
    tweenRef.current = gsap.to(playObj, {
      progress: 1,
      duration: 3.0, // Cinematic 3.0s flow
      ease: 'power1.inOut', // Super smooth deceleration and acceleration curve
      onUpdate: () => {
        const index = Math.min(totalFrames - 1, Math.floor(playObj.progress * totalFrames))
        currentFrameRef.current = index
        drawFrame(index)
      }
    })
  }, [ready, totalFrames, drawFrame])

  useEffect(() => {
    if (onLoadProgress) onLoadProgress(progress)
  }, [progress, onLoadProgress])

  useEffect(() => {
    if (ready && onLoadComplete) onLoadComplete()
  }, [ready, onLoadComplete])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const updateSize = () => {
      const currentWidth = window.innerWidth
      // On mobile, height changes due to URL bar show/hide. Only trigger a full canvas resize if the width actually changes.
      if (prevWidthRef.current && prevWidthRef.current === currentWidth) {
        // Just redraw the current frame
        drawFrame(currentFrameRef.current)
        return
      }
      prevWidthRef.current = currentWidth

      if (portrait) {
        // Portrait card: 45% of viewport height as width, 80% of viewport height as height
        const h = Math.round(window.innerHeight * 0.8)
        const w = Math.round(h * 0.65) // ~2:3 portrait ratio
        canvas.width = w
        canvas.height = h
      } else {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
      }
      drawFrame(currentFrameRef.current)
    }

    updateSize()

    const observer = new ResizeObserver(updateSize)
    observer.observe(document.documentElement)

    return () => observer.disconnect()
  }, [drawFrame, portrait])

  useEffect(() => {
    if (!ready || !wrapperRef.current) return

    // Scoped GSAP context to prevent 'removeChild' errors
    const ctx = gsap.context(() => {
      drawFrame(0)

      if (isMobile) {
        // Mobile: No pinning, no scroll-scrub. Auto-play when section enters or re-enters viewport.
        ScrollTrigger.create({
          trigger: wrapperRef.current,
          start: 'top 80%', // starts when top of element is 80% down viewport
          onEnter: playMobileAnimation,
          onEnterBack: playMobileAnimation,
        })
      } else {
        // Desktop: High-fidelity scroll pinning and scrubbing
        ScrollTrigger.create({
          trigger: wrapperRef.current,
          start: 'top top',
          end: `+=${window.innerHeight * scrollDistance}`,
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
          onUpdate: (self) => {
            const index = Math.min(totalFrames - 1, Math.floor(self.progress * totalFrames))
            currentFrameRef.current = index
            drawFrame(index)
          },
        })
      }
    }, wrapperRef)

    return () => ctx.revert()
  }, [ready, isMobile, totalFrames, scrollDistance, drawFrame, playMobileAnimation])

  if (portrait) {
    return (
      // Full-screen wrapper for scroll pinning
      <div ref={wrapperRef} className={`relative w-full h-screen flex items-center justify-center ${className}`}>
        {/* Subtle background behind the portrait card */}
        <div className="absolute inset-0 bg-[#0a0805]" />

        {/* Portrait card — responsive sizing for mobile */}
        <div
          className="relative z-10 flex items-center justify-center h-[65vh] md:h-[80vh] aspect-[2/3] max-w-[90vw]"
          onClick={isMobile ? playMobileAnimation : undefined}
          style={{
            boxShadow: '0 32px 96px rgba(0,0,0,0.85), 0 0 0 1px rgba(212,175,55,0.15)',
            borderRadius: '4px',
            cursor: isMobile ? 'pointer' : 'default',
          }}
        >
          <canvas
            ref={canvasRef}
            className="w-full h-full rounded-[4px]"
            style={{ 
              display: 'block',
              willChange: isMobile ? 'transform' : 'auto',
              transform: isMobile ? 'translate3d(0, 0, 0)' : 'none'
            }}
            aria-label={ariaLabel}
          />
        </div>
      </div>
    )
  }

  return (
    <div 
      ref={wrapperRef} 
      className={`relative w-full h-screen ${className}`}
      onClick={isMobile ? playMobileAnimation : undefined}
      style={{ cursor: isMobile ? 'pointer' : 'default' }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{
          willChange: isMobile ? 'transform' : 'auto',
          transform: isMobile ? 'translate3d(0, 0, 0)' : 'none'
        }}
        aria-label={ariaLabel}
      />
      {children}
    </div>
  )
}
