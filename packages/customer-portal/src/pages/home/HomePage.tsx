import { useTranslation } from 'react-i18next'
import { usePageTitle } from '@/hooks/usePageTitle'
import ProductCard from '@/components/product/ProductCard'

export default function HomePage() {
  const { t } = useTranslation()
  usePageTitle('Home')

  // Sample featured products
  const featuredProducts = [
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
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-700 to-red-900 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('home.title')}</h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">{t('home.subtitle')}</p>
          <div className="flex gap-4">
            <a href="/products" className="btn btn-primary bg-white text-red-700 hover:bg-gray-100">
              {t('common.products')}
            </a>
            <a
              href="/subscriptions"
              className="btn btn-outline border-white text-white hover:bg-white hover:text-red-700"
            >
              {t('nav.subscriptions')}
            </a>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-8">{t('home.featured_products')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="bg-gray-50 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['Fresh Flowers', 'Pooja Items', 'Garlands', 'Subscriptions'].map((category) => (
              <a
                key={category}
                href="/products"
                className="p-6 bg-white rounded-lg text-center hover:shadow-lg transition"
              >
                <h3 className="font-semibold text-gray-800">{category}</h3>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Subscription Plans */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-8">{t('home.subscriptions')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: 'Daily', price: '₹29', description: 'Fresh flowers daily' },
            { name: 'Weekly', price: '₹99', description: '3 deliveries per week' },
            { name: 'Monthly', price: '₹249', description: 'Unlimited deliveries' },
          ].map((plan) => (
            <div key={plan.name} className="card p-6 text-center hover:shadow-lg transition">
              <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
              <p className="text-3xl font-bold text-red-700 mb-2">{plan.price}</p>
              <p className="text-gray-600 mb-4">{plan.description}</p>
              <button className="btn btn-primary">Subscribe</button>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
