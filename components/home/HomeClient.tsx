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
  const [heroProgress, setHeroProgress] = useState(0)
  const [showcaseProgress, setShowcaseProgress] = useState(0)
  const [diamondProgress, setDiamondProgress] = useState(0)

  const [heroReady, setHeroReady] = useState(false)
  const [showcaseReady, setShowcaseReady] = useState(false)
  const [diamondReady, setDiamondReady] = useState(false)

  const handleHeroProgress = useCallback((p: number) => setHeroProgress(p), [])
  const handleShowcaseProgress = useCallback((p: number) => setShowcaseProgress(p), [])
  const handleDiamondProgress = useCallback((p: number) => setDiamondProgress(p), [])

  const handleHeroComplete = useCallback(() => setHeroReady(true), [])
  const handleShowcaseComplete = useCallback(() => setShowcaseReady(true), [])
  const handleDiamondComplete = useCallback(() => setDiamondReady(true), [])

  // Coordinated page readiness
  const isPageReady = heroReady && showcaseReady && diamondReady

  // Calculate combined loading progress
  const aggregateProgress = (heroProgress + showcaseProgress + diamondProgress) / 3

  // loading screen is Complete when isPageReady is true. We force progress to 1 when isPageReady is true, otherwise keep it below 0.9.
  const loadProgress = isPageReady ? 1 : aggregateProgress * 0.89

  const handleScreenComplete = useCallback(() => {
    import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
      ScrollTrigger.refresh()
    })
  }, [])

  return (
    <>
      <LoadingScreen progress={loadProgress} onComplete={handleScreenComplete} />

      <PageTransition>
      <main className="bg-ivory min-h-screen overflow-x-hidden">
          <HeroCanvas
            onLoadProgress={handleHeroProgress}
            onLoadComplete={handleHeroComplete}
            isPageReady={isPageReady}
          />

          <MarqueeTicker items={MARQUEE_TAGS} />

          <FeaturedCollection products={featuredProducts} />

          <ProductShowcaseAnimation
            onLoadProgress={handleShowcaseProgress}
            onLoadComplete={handleShowcaseComplete}
            isPageReady={isPageReady}
          />

          <DiamondRingAnimation
            onLoadProgress={handleDiamondProgress}
            onLoadComplete={handleDiamondComplete}
            isPageReady={isPageReady}
          />

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
