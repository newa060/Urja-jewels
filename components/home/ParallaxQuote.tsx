'use client'

import { useRef, useEffect } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface ParallaxQuoteProps {
  quote: string
  author?: string
  imageSrc: string   // <!-- REPLACE IMAGE -->
  imageAlt: string   // <!-- REPLACE ALT -->
}

export default function ParallaxQuote({ quote, author, imageSrc, imageAlt }: ParallaxQuoteProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const bgRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!sectionRef.current || !bgRef.current) return

    const tween = gsap.fromTo(
      bgRef.current,
      { yPercent: -15 },
      {
        yPercent: 15,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      }
    )

    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden h-[60vh] flex items-center justify-center"
    >
      {/* Parallax background — scaled up so yPercent travel doesn't expose edges */}
      <div 
        ref={bgRef} 
        className="absolute inset-0 scale-125"
        style={{ willChange: 'transform', transform: 'translate3d(0, 0, 0)' }}
      >
        {/* <!-- REPLACE IMAGE --> */}
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          className="object-cover"
          sizes="100vw"
        />
      </div>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-obsidian/50" />

      {/* Quote */}
      <div className="relative z-10 text-center px-8 max-w-3xl">
        <blockquote>
          <p className="font-display text-3xl md:text-5xl text-ivory leading-relaxed italic">
            &ldquo;{quote}&rdquo;
          </p>
          {author && (
            <footer className="mt-6 font-body text-sm uppercase tracking-widest text-fog">
              — {author}
            </footer>
          )}
        </blockquote>
      </div>
    </section>
  )
}
