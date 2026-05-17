'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { fadeUp } from '@/lib/animations'
import type { Product } from '@/lib/constants'

interface ProductCardProps {
  product: Product
  className?: string
  priority?: boolean
}

const formatPrice = (cents: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(cents / 100)

export default function ProductCard({ product, className = '', priority = false }: ProductCardProps) {
  const [isLoaded, setIsLoaded] = useState(false)

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className={`group ${className}`}
    >
      <Link
        href={`/product/${product.slug}`}
        className="block bg-white border border-[#E8DCC8] rounded-none transition-all duration-700 hover:shadow-sm focus-visible:outline-2 focus-visible:outline-gold focus-visible:outline-offset-2"
      >
        {/* Image container */}
        <div
          className="relative overflow-hidden aspect-[3/4] md:aspect-auto md:h-[400px] bg-[#FAF7F2]"
        >
          {/* Shimmer effect */}
          {!isLoaded && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite] pointer-events-none" />
          )}

          <Image
            src={product.imageSrc}
            alt={product.name}
            fill
            priority={priority}
            className={`object-cover transition-all duration-700 group-hover:scale-105 ${
              isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
            }`}
            onLoad={() => setIsLoaded(true)}
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />

          {/* Faint gold tint overlay on hover */}
          <div className="absolute inset-0 bg-[#d4af37]/[0.08] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-10" />
        </div>

        {/* Card info */}
        <div className="p-6 pt-5 pb-4">
          <p className="font-body text-[10px] uppercase tracking-[0.2em] text-[#8C8C80] mb-2">
            {product.category}
          </p>
          <h3 className="font-display text-2xl text-obsidian leading-snug">
            {product.name}
          </h3>
          <p className="font-body text-sm text-[#B8960C] mt-2 font-medium">
            {formatPrice(product.price)}
          </p>
        </div>
      </Link>
    </motion.div>
  )
}
