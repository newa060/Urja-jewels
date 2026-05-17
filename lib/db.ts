import { createClient } from '@/lib/supabase/server'
import { createStaticClient } from '@/lib/supabase/static'
import { Product } from './constants'
import { unstable_cache } from 'next/cache'

export async function getProducts(): Promise<Product[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase.from('products').select('*')
    
    if (error) {
      console.error('[DB] Error fetching products:', error.message)
      return []
    }
    
    console.log(`[DB] Fetched ${data?.length || 0} products`)
    return (data as Product[]) || []
  } catch (err) {
    console.error('[DB] Unexpected error in getProducts:', err)
    return []
  }
}

export const getStaticProducts = unstable_cache(
  async (): Promise<Product[]> => {
    try {
      const supabase = createStaticClient()
      const { data, error } = await supabase.from('products').select('*')
      
      if (error) {
        console.error('Supabase error in getStaticProducts:', error.message, error.details)
        return []
      }
      
      return (data as Product[]) || []
    } catch (err) {
      console.error('Unexpected error in getStaticProducts:', err)
      return []
    }
  },
  ['products-list'],
  { revalidate: 3600, tags: ['products'] }
)

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .single()
    
  if (error) {
    console.error('Error fetching product by slug:', error)
    return undefined
  }
  
  return data as Product
}

export const getStaticProductBySlug = (slug: string) => unstable_cache(
  async (): Promise<Product | undefined> => {
    const supabase = createStaticClient()
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .single()
      
    if (error) {
      console.error('Error fetching static product by slug:', error)
      return undefined
    }
    
    return data as Product
  },
  [`product-${slug}`],
  { revalidate: 3600, tags: ['products', `product-${slug}`] }
)()

export async function getProductById(id: string): Promise<Product | undefined> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single()
    
  if (error) {
    console.error('Error fetching product by id:', error)
    return undefined
  }
  
  return data as Product
}

export async function createProduct(product: Omit<Product, 'id'>): Promise<Product | null> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('products')
    .insert([product])
    .select()
    .single()
    
  if (error) {
    console.error('Error creating product:', error)
    return null
  }
  
  return data as Product
}

export async function updateProduct(id: string, updates: Partial<Omit<Product, 'id'>>): Promise<Product | null> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('products')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
    
  if (error) {
    console.error('Error updating product:', error)
    return null
  }
  
  return data as Product
}

export async function deleteProduct(id: string): Promise<boolean> {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id)
    
  if (error) {
    console.error('Error deleting product:', error)
    return false
  }
  
  return true
}
