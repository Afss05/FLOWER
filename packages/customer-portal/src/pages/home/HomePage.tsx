import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { CalendarDays, Bell, ChevronRight } from 'lucide-react'
import { usePageTitle } from '@/hooks/usePageTitle'
import ProductCard from '@/components/product/ProductCard'
import { getUpcomingFestivals, daysUntil, isPreOrderOpen } from '@/data/festivals'

export default function HomePage() {
  const { t } = useTranslation()
  usePageTitle('Home')

  const upcomingFestivals = getUpcomingFestivals(60)

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
    <div className="min-h-screen bg-app">
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
        <h2 className="text-3xl font-bold mb-8 text-ink">{t('home.featured_products')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 px-4" style={{ backgroundColor: 'var(--bg-subtle)' }}>
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-ink">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['Fresh Flowers', 'Pooja Items', 'Garlands', 'Subscriptions'].map((category) => (
              <a
                key={category}
                href="/products"
                className="p-6 rounded-xl text-center transition-all hover:-translate-y-0.5 card-token"
              >
                <h3 className="font-semibold text-ink">{category}</h3>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Festival Calendar Banner */}
      {upcomingFestivals.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-16">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <CalendarDays size={24} className="text-red-700 dark:text-red-400" />
              <h2 className="text-3xl font-bold text-ink">Upcoming Festivals</h2>
            </div>
            <Link
              to="/festivals"
              className="flex items-center gap-1 text-brand text-sm font-semibold hover:gap-2 transition-all"
            >
              View Full Calendar <ChevronRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcomingFestivals.slice(0, 3).map((festival) => {
              const days = daysUntil(festival.date)
              const urgent = days <= festival.orderByDays && days >= 0
              return (
                <Link
                  key={festival.id}
                  to="/festivals"
                  className="relative flex items-center gap-4 p-4 rounded-xl transition-all hover:-translate-y-0.5 card-token"
                  style={urgent ? { borderColor: 'var(--brand)', boxShadow: '0 0 0 1px var(--brand)' } : {}}
                >
                  <div
                    className={`text-2xl w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${festival.color} shadow-md shrink-0`}
                  >
                    {festival.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-ink text-sm truncate">{festival.name}</h3>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      {new Date(festival.date).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'long',
                      })}
                    </p>
                    <div className="mt-1">
                      {days === 0 ? (
                        <span className="text-xs font-bold" style={{ color: '#10b981' }}>🎉 Today!</span>
                      ) : urgent ? (
                        <span className="text-xs font-bold text-brand flex items-center gap-1">
                          <Bell size={11} /> Order today for timely delivery
                        </span>
                      ) : (
                        <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                          {days} days away
                        </span>
                      )}
                    </div>
                    {isPreOrderOpen(festival) && (
                      <span
                        className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full font-semibold"
                        style={{ backgroundColor: 'rgba(245,158,11,.1)', color: '#d97706' }}
                      >
                        Pre-order Open
                      </span>
                    )}
                  </div>
                  <ChevronRight size={14} style={{ color: 'var(--text-muted)' }} className="shrink-0" />
                </Link>
              )
            })}
          </div>
        </section>
      )}

      {/* Subscription Plans */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-8 text-ink">{t('home.subscriptions')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: 'Daily', price: '₹29', description: 'Fresh flowers daily' },
            { name: 'Weekly', price: '₹99', description: '3 deliveries per week' },
            { name: 'Monthly', price: '₹249', description: 'Unlimited deliveries' },
          ].map((plan) => (
            <div key={plan.name} className="card-token p-6 text-center">
              <h3 className="text-xl font-bold mb-2 text-ink">{plan.name}</h3>
              <p className="text-3xl font-bold text-brand mb-2">{plan.price}</p>
              <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>{plan.description}</p>
              <button className="btn btn-primary">Subscribe</button>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
