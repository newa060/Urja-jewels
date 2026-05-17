import { Product } from '@/lib/constants'
import SectionTitle from '@/components/ui/SectionTitle'
import GoldDivider from '@/components/ui/GoldDivider'
import ProductCard from '@/components/home/ProductCard'

// Asymmetric 12-column grid column spans for featured cards (desktop)
// Pattern: 7-5, 5-7 alternating
const COL_SPANS = ['md:col-span-7', 'md:col-span-5', 'md:col-span-5', 'md:col-span-7']

interface FeaturedCollectionProps {
  products: Product[]
}

export default function FeaturedCollection({ products }: FeaturedCollectionProps) {
  return (
    <section className="bg-ivory py-24 px-8">
      <div className="max-w-6xl mx-auto">
        <SectionTitle
          eyebrow="Featured Collection"
          heading="Curated Pieces"
          subheading="A selection of our most celebrated works, each crafted to endure."
          align="center"
        />

        <GoldDivider className="my-12" />

        {/* Asymmetric 12-column grid — single column on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {products.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              priority={index < 2}
              className={`col-span-1 ${COL_SPANS[index % COL_SPANS.length]}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
