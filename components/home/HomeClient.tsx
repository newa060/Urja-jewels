'use client'

import { useState, useCallback } from 'react'
import PageTransition from '@/components/layout/PageTransition'
import LoadingScreen from '@/components/ui/LoadingScreen'
import HeroCanvas from '@/components/home/HeroCanvas'
import MarqueeTicker from '@/components/home/MarqueeTicker'
import FeaturedCollection from '@/components/home/FeaturedCollection'
import ProductShowcaseAnimation from '@/components/home/ProductShowcaseAnimation'
import DiamondRingAnimation from '@/components/home/DiamondRingAnimation'
import ParallaxQuote from '@/components/home/ParallaxQuote'
import Newsletter from '@/components/home/Newsletter'
import { MARQUEE_TAGS, Product } from '@/lib/constants'

interface HomeClientProps {
  heroQuote: {
    quote: string
    author: string
    imageSrc: string
  }
  featuredProducts: Product[]
}

export default function HomeClient({ heroQuote, featuredProducts }: HomeClientProps) {
  const [loadProgress, setLoadProgress] = useState(0)
  const [loadComplete, setLoadComplete] = useState(false)

  const handleLoadProgress = useCallback((p: number) => {
    setLoadProgress(p)
  }, [])

  const handleLoadComplete = useCallback(() => {
    setLoadProgress(1)
  }, [])

  const handleScreenComplete = useCallback(() => {
    setLoadComplete(true)
    // Force a refresh and normalize scroll to stop vibration
    import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
      ScrollTrigger.normalizeScroll(true)
      ScrollTrigger.refresh()
    })
  }, [])

  return (
    <>
      <LoadingScreen progress={loadProgress} onComplete={handleScreenComplete} />

      <PageTransition>
      <main className="bg-obsidian min-h-screen overflow-x-hidden">
          <HeroCanvas
            onLoadProgress={handleLoadProgress}
            onLoadComplete={handleLoadComplete}
          />

          <MarqueeTicker items={MARQUEE_TAGS} />

          <FeaturedCollection products={featuredProducts} />

          <ProductShowcaseAnimation />

          <DiamondRingAnimation />

          <ParallaxQuote
            quote={heroQuote.quote}
            author={heroQuote.author}
            imageSrc={heroQuote.imageSrc}
            imageAlt="Luxury jewelry atelier"
          />

          <Newsletter />
        </main>
      </PageTransition>
    </>
  )
}
