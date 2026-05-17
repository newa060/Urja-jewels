import { notFound } from 'next/navigation'
import PageTransition from '@/components/layout/PageTransition'
import ProductImageGallery from '@/components/product/ProductImageGallery'
import ProductInfo from '@/components/product/ProductInfo'
import RelatedProducts from '@/components/product/RelatedProducts'
import MobileBackButton from '@/components/product/MobileBackButton'
import { getProducts, getProductBySlug, getStaticProducts, getStaticProductBySlug } from '@/lib/db'

export async function generateStaticParams() {
  const products = await getStaticProducts()
  return products.map((p) => ({ slug: p.slug }))
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const decodedSlug = decodeURIComponent(slug)
  const product = await getStaticProductBySlug(decodedSlug)

  if (!product) {
    notFound()
  }

  return (
    <PageTransition>
      <div className="bg-ivory min-h-screen">
        <div className="max-w-6xl mx-auto px-8 py-24">
          <MobileBackButton />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
            <ProductImageGallery
              imageSrc={product.imageSrc}
              imageAlt={product.name}
              name={product.name}
            />
            <ProductInfo product={product} />
          </div>
        </div>
        <RelatedProducts currentSlug={product.slug} category={product.category} />
      </div>
    </PageTransition>
  )
}
