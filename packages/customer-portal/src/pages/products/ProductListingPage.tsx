import { useTranslation } from 'react-i18next'
import { usePageTitle } from '@/hooks/usePageTitle'
import ProductCard from '@/components/product/ProductCard'
import { useState } from 'react'

export default function ProductListingPage() {
  const { t } = useTranslation()
  usePageTitle('Products')
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
  const [priceRange, setPriceRange] = useState({ min: 0, max: 5000 })

  const products = [
    {
      id: 1,
      name: 'Red Roses Bunch',
      image: 'https://images.unsplash.com/photo-1519915212116-7cfef71f910d?w=500&h=500&fit=crop',
      price: 499,
      discountedPrice: 349,
      rating: 4.5,
      reviews: 123,
      isFresh: true,
    },
    {
      id: 2,
      name: 'Jasmine Flowers',
      image: 'https://images.unsplash.com/photo-1613545882494-85ad14f74b9b?w=500&h=500&fit=crop',
      price: 299,
      rating: 4.8,
      reviews: 89,
      isFresh: true,
    },
    {
      id: 3,
      name: 'Marigold Garland',
      image: 'https://images.unsplash.com/photo-1520763185298-1b434c919abe?w=500&h=500&fit=crop',
      price: 199,
      discountedPrice: 149,
      rating: 4.3,
      reviews: 56,
    },
    {
      id: 4,
      name: 'Mixed Pooja Flowers',
      image: 'https://images.unsplash.com/photo-1549514464-16872c0564e0?w=500&h=500&fit=crop',
      price: 599,
      rating: 4.9,
      reviews: 234,
      isSeasonalSpecial: true,
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">{t('common.products')}</h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="card p-6 space-y-6">
              {/* Categories */}
              <div>
                <h3 className="font-bold mb-3">Categories</h3>
                <div className="space-y-2">
                  {['Fresh Flowers', 'Pooja Items', 'Garlands', 'Seasonal'].map((category) => (
                    <label key={category} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="w-4 h-4" />
                      <span className="text-sm text-gray-700">{category}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h3 className="font-bold mb-3">{t('common.price')}</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="0"
                      max="5000"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange({ ...priceRange, min: parseInt(e.target.value) })}
                      className="w-full"
                    />
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>₹{priceRange.min}</span>
                    <span>₹{priceRange.max}</span>
                  </div>
                </div>
              </div>

              {/* Rating */}
              <div>
                <h3 className="font-bold mb-3">Rating</h3>
                <div className="space-y-2">
                  {[4, 3, 2, 1].map((rating) => (
                    <label key={rating} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="w-4 h-4" />
                      <span className="text-sm">★★★★★ {rating}+</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Other Filters */}
              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4" />
                  <span className="text-sm text-gray-700">Fresh Flowers Only</span>
                </label>
              </div>

              <button className="btn btn-secondary w-full">Reset Filters</button>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            <div className="flex justify-between items-center mb-6">
              <span className="text-gray-600">Showing 4 products</span>
              <select className="px-3 py-2 border border-gray-300 rounded-lg">
                <option>Sort by: Latest</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Rating</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
