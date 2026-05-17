'use client'

import { useState } from 'react'
import CollectionHero from '@/components/collection/CollectionHero'
import ProductFilter from '@/components/collection/ProductFilter'
import ProductMasonryGrid from '@/components/collection/ProductMasonryGrid'
import { Product } from '@/lib/constants'

interface CollectionClientProps {
  initialProducts: Product[]
}

export default function CollectionClient({ initialProducts }: CollectionClientProps) {
  const [activeCategory, setActiveCategory] = useState('All')

  const ALL_CATEGORIES = Array.from(new Set(initialProducts.map((p) => p.category)))

  const filtered =
    activeCategory === 'All'
      ? initialProducts
      : initialProducts.filter((p) => p.category === activeCategory)

  return (
    <>
      <CollectionHero
        title="All Collections"
        subtitle="Discover our complete range of handcrafted pieces."
      />
      <ProductFilter
        categories={ALL_CATEGORIES}
        active={activeCategory}
        onChange={setActiveCategory}
      />
      
      {filtered.length > 0 ? (
        <ProductMasonryGrid products={filtered} />
      ) : (
        <div className="bg-ivory py-24 text-center">
          <p className="font-body text-stone-500 italic">No products found in this collection.</p>
        </div>
      )}
    </>
  )
}
