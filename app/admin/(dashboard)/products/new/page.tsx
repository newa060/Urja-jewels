'use client'

import { addProduct } from '@/app/actions/products'
import Link from 'next/link'
import { useActionState, useState } from 'react'
import { MdCloudUpload, MdChevronRight, MdClose } from 'react-icons/md'

export default function NewProductPage() {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  
  const [state, formAction, pending] = useActionState(
    async (prevState: unknown, formData: FormData) => {
      await addProduct(formData)
    },
    null
  )

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    }
  }

  const clearImage = (e: React.MouseEvent) => {
    e.preventDefault()
    setPreviewUrl(null)
    const fileInput = document.getElementById('image') as HTMLInputElement
    if (fileInput) fileInput.value = ''
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#0f172a]">Add New Product</h1>
        <p className="text-[#64748b] mt-1">Create a new product listing by filling out the information below.</p>
      </div>

      <form action={formAction} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Product Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-2xl border border-[#e5eeff] shadow-sm space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-bold text-[#0f172a] mb-2">
                Product Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                id="name"
                required
                placeholder="e.g. Premium Wireless Headphones"
                className="w-full bg-white border border-[#e5eeff] rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#4f46e5]/20 focus:border-[#4f46e5] transition-all outline-none"
              />
            </div>

            <div>
              <label htmlFor="slug" className="block text-sm font-bold text-[#0f172a] mb-2">
                Slug <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="slug"
                id="slug"
                required
                placeholder="product-name-slug"
                className="w-full bg-white border border-[#e5eeff] rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#4f46e5]/20 focus:border-[#4f46e5] transition-all outline-none"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-bold text-[#0f172a] mb-2">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={6}
                required
                placeholder="Describe the product details, features, and benefits..."
                className="w-full bg-white border border-[#e5eeff] rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#4f46e5]/20 focus:border-[#4f46e5] transition-all outline-none resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="category" className="block text-sm font-bold text-[#0f172a] mb-2">
                  Category
                </label>
                <div className="relative">
                  <select
                    id="category"
                    name="category"
                    required
                    className="w-full bg-white border border-[#e5eeff] rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#4f46e5]/20 focus:border-[#4f46e5] transition-all outline-none appearance-none cursor-pointer"
                  >
                    <option value="rings">Rings</option>
                    <option value="necklaces">Necklaces</option>
                    <option value="bracelets">Bracelets</option>
                    <option value="earrings">Earrings</option>
                  </select>
                  <MdChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 text-[#94a3b8] rotate-90" />
                </div>
              </div>

              <div>
                <label htmlFor="price" className="block text-sm font-bold text-[#0f172a] mb-2">
                  Price <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94a3b8] text-sm">$</span>
                  <input
                    type="number"
                    name="price"
                    id="price"
                    required
                    placeholder="0.00"
                    className="w-full bg-white border border-[#e5eeff] rounded-xl pl-8 pr-4 py-3 text-sm focus:ring-2 focus:ring-[#4f46e5]/20 focus:border-[#4f46e5] transition-all outline-none"
                  />
                </div>
                <p className="text-[10px] text-[#94a3b8] mt-1 ml-1">Enter price in cents (e.g. 1000 for $10.00)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Image and Status */}
        <div className="space-y-6">
          {/* Image Upload */}
          <div className="bg-white p-8 rounded-2xl border border-[#e5eeff] shadow-sm">
            <label className="block text-sm font-bold text-[#0f172a] mb-4">Product Image</label>
            <div className="border-2 border-dashed border-[#e5eeff] rounded-2xl flex flex-col items-center justify-center text-center group hover:border-[#4f46e5] transition-colors cursor-pointer relative overflow-hidden min-h-[240px]">
              <input
                type="file"
                name="image"
                id="image"
                accept="image/*"
                required
                onChange={handleImageChange}
                className="absolute inset-0 opacity-0 cursor-pointer z-20"
              />
              
              {previewUrl ? (
                <div className="absolute inset-0 z-10 bg-white">
                  <img 
                    src={previewUrl} 
                    alt="Preview" 
                    className="w-full h-full object-cover"
                  />
                  <button 
                    onClick={clearImage}
                    className="absolute top-2 right-2 p-1 bg-white/80 backdrop-blur-sm rounded-full text-[#0f172a] shadow-sm z-30 hover:bg-white transition-colors"
                  >
                    <MdClose className="text-xl" />
                  </button>
                  <div className="absolute bottom-0 inset-x-0 bg-black/50 backdrop-blur-sm p-2 z-30 text-white text-[10px] font-bold uppercase tracking-wider">
                    Click to change image
                  </div>
                </div>
              ) : (
                <>
                  <div className="w-12 h-12 bg-[#f1f5f9] rounded-full flex items-center justify-center mb-4 group-hover:bg-[#4f46e5]/10 transition-colors">
                    <MdCloudUpload className="text-2xl text-[#64748b] group-hover:text-[#4f46e5]" />
                  </div>
                  <p className="text-sm font-bold text-[#0f172a]">Click to upload or drag and drop</p>
                  <p className="text-xs text-[#94a3b8] mt-1">SVG, PNG, JPG or GIF (max. 800x400px)</p>
                </>
              )}
            </div>
          </div>

          {/* Status Selection */}
          <div className="bg-white p-8 rounded-2xl border border-[#e5eeff] shadow-sm">
            <label className="block text-sm font-bold text-[#0f172a] mb-4">Status</label>
            <div className="space-y-3">
              <label className="flex items-center justify-between p-4 rounded-xl border border-[#e5eeff] cursor-pointer hover:bg-[#f8f9ff] transition-all group has-[:checked]:border-[#4f46e5] has-[:checked]:bg-[#4f46e5]/5">
                <div className="flex items-center gap-3">
                  <div className="relative flex items-center justify-center">
                    <input type="checkbox" name="featured" value="true" className="peer opacity-0 absolute" defaultChecked />
                    <div className="w-10 h-6 bg-[#cbd5e1] rounded-full peer-checked:bg-[#4f46e5] transition-all relative after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4"></div>
                  </div>
                  <span className="text-sm font-bold text-[#0f172a]">Featured Product</span>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 bg-[#dcfce7] text-[#166534] rounded-lg">Featured</span>
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-4 pt-4">
            <Link
              href="/admin/products"
              className="flex-1 bg-white border border-[#e5eeff] text-[#0f172a] font-bold py-3 px-6 rounded-xl hover:bg-[#f8f9ff] transition-all text-center text-sm"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={pending}
              className="flex-1 bg-[#3525cd] text-white font-bold py-3 px-6 rounded-xl hover:bg-[#4338ca] transition-all shadow-lg shadow-[#4f46e5]/20 disabled:opacity-50 text-sm"
            >
              {pending ? 'Saving...' : 'Save Product'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
