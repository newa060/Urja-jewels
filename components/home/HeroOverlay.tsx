'use client'

import { useEffect, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'

export default function HeroOverlay() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  return (
    <div ref={containerRef} className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
      {/* Background Vignette for visibility */}
      <div 
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.5)_0%,transparent_85%)]"
      />

      {/* Corner Ornaments */}
      <div className="absolute top-12 left-12 w-12 h-12 border-t border-l border-gold/40" />
      <div className="absolute top-12 right-12 w-12 h-12 border-t border-r border-gold/40" />
      <div className="absolute bottom-12 left-12 w-12 h-12 border-b border-l border-gold/40" />
      <div className="absolute bottom-12 right-12 w-12 h-12 border-b border-r border-gold/40" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2, ease: [0.22, 1, 0.36, 1], delay: 0.8 }}
        className="w-full h-full flex flex-col items-center justify-center text-center px-8 relative"
      >
        {/* Top Eyebrow */}
        <div className="flex items-center gap-6 mb-10">
          <div className="h-[1px] w-12 bg-gold/40" />
          <span className="font-body text-[10px] md:text-xs uppercase tracking-[0.5em] text-gold/90 font-medium">
            New Collection 2025
          </span>
          <div className="h-[1px] w-12 bg-gold/40" />
        </div>

        {/* Main Headings */}
        <div className="max-w-5xl space-y-3 md:space-y-4 mb-10 md:mb-14">
          <h1 className="font-display text-4xl sm:text-5xl md:text-[110px] text-ivory tracking-tight leading-[1.1] md:leading-[0.9]">
            Where Gold Meets <span className="italic text-gold font-light opacity-90">Grace</span>
          </h1>
          <p className="font-display text-lg sm:text-2xl md:text-5xl text-ivory/90 tracking-wide font-light">
            Crafted for the Timeless Woman
          </p>
        </div>

        {/* Center Ornament */}
        <div className="flex items-center gap-4 md:gap-8 mb-10 md:mb-14">
          <div className="h-[1px] w-12 md:w-24 bg-stone-500/20" />
          <div className="w-1.5 h-1.5 rotate-45 bg-gold/50" />
          <div className="h-[1px] w-12 md:w-24 bg-stone-500/20" />
        </div>

        {/* Footer Subtext */}
        <div className="mb-10 md:mb-14">
           <p className="font-body text-[9px] md:text-xs uppercase tracking-[0.3em] md:tracking-[0.4em] text-stone-400/80 font-light">
             Handcrafted Fine Jewellery &middot; Since 2010
           </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-8 pointer-events-auto">
          <Link 
            href="/collection"
            className="px-12 py-4 border border-ivory/20 bg-black/10 backdrop-blur-md text-ivory font-body text-xs uppercase tracking-[0.3em] hover:bg-ivory hover:text-obsidian transition-all duration-700 rounded-sm min-w-[240px]"
          >
            Explore Collection
          </Link>
          <Link 
            href="/about"
            className="px-12 py-4 border border-gold/30 bg-black/10 backdrop-blur-md text-gold font-body text-xs uppercase tracking-[0.3em] hover:bg-gold hover:text-obsidian transition-all duration-700 rounded-sm min-w-[240px] flex items-center justify-center gap-3 group"
          >
            Our Story <span className="group-hover:translate-x-2 transition-transform duration-500 font-serif text-lg">&rarr;</span>
          </Link>
        </div>

        {/* Vertical Line Bottom */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1px] h-24 bg-gradient-to-b from-stone-500/30 to-transparent" />
      </motion.div>
    </div>
  )
}
