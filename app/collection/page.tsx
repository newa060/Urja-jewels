import PageTransition from '@/components/layout/PageTransition'
import CollectionClient from '@/components/collection/CollectionClient'
import { getStaticProducts } from '@/lib/db'

export const revalidate = 3600 // Revalidate cache every hour for peak speed

export default async function CollectionPage() {
  // Fetch data on the server — served instantly from cache after the first hit
  const products = await getStaticProducts()

  return (
    <PageTransition>
      <CollectionClient initialProducts={products} />
    </PageTransition>
  )
}
