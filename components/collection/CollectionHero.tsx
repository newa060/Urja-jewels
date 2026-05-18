'use client'

// ---------------------------------------------------------------------------
// CollectionHero
// ---------------------------------------------------------------------------
// Static editorial header for the Collection page. Animates in on mount
// using the shared `fadeUp` variant.
//
// Requirements: 10.1
// ---------------------------------------------------------------------------

import { motion } from 'framer-motion'
import { fadeUp } from '@/lib/animations'
import MobileBackButton from '@/components/product/MobileBackButton'

interface CollectionHeroProps {
  /** Primary heading rendered in Cormorant Garamond. */
  title: string
  /** Optional supporting copy rendered in Jost below the heading. */
  subtitle?: string
}

export default function CollectionHero({ title, subtitle }: CollectionHeroProps) {
  return (
    <section className="bg-ivory pt-32 pb-16 px-8 text-center">
      <div className="max-w-6xl mx-auto text-left mb-4">
        <MobileBackButton href="/" />
      </div>
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
      >
        <p className="font-body text-xs uppercase tracking-widest text-stone mb-4">
          The Collection
        </p>
        <h1 className="font-display text-5xl md:text-6xl text-obsidian mb-4">
          {title}
        </h1>
        {subtitle && (
          <p className="font-body text-stone text-base max-w-md mx-auto">
            {subtitle}
          </p>
        )}
      </motion.div>
    </section>
  )
}
