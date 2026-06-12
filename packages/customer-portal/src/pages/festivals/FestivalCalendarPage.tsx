import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CalendarDays,
  Clock,
  ShoppingCart,
  ChevronRight,
  Bell,
  Star,
  CheckCircle2,
  X,
  Info,
} from 'lucide-react'
import { festivals2026, daysUntil, isPreOrderOpen, type Festival } from '@/data/festivals'

// ─────────────────────────────────────────────
// Countdown chip
// ─────────────────────────────────────────────
function CountdownChip({ dateStr, orderByDays }: { dateStr: string; orderByDays: number }) {
  const days = daysUntil(dateStr)
  if (days < 0) return <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Passed</span>
  if (days === 0)
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(16,185,129,.12)', color: '#10b981' }}>
        🎉 Today!
      </span>
    )
  const urgentStyle = { backgroundColor: 'rgba(220,38,38,.12)', color: 'var(--brand-text)' }
  const normalStyle = { backgroundColor: 'rgba(245,158,11,.12)', color: '#d97706' }
  return (
    <span
      className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full"
      style={days <= orderByDays ? urgentStyle : normalStyle}
    >
      <Clock size={11} />
      {days === 1 ? 'Tomorrow!' : `${days} days away`}
    </span>
  )
}

// ─────────────────────────────────────────────
// Pre-order badge
// ─────────────────────────────────────────────
function PreOrderBadge({ festival }: { festival: Festival }) {
  const days = daysUntil(festival.date)
  if (!isPreOrderOpen(festival)) return null
  const isUrgent = days <= festival.orderByDays
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full animate-pulse ${
        isUrgent
          ? 'bg-red-600 text-white'
          : 'bg-yellow-400 text-gray-900'
      }`}
    >
      <Bell size={11} />
      {isUrgent ? 'Order Today!' : 'Pre-order Open'}
    </span>
  )
}

// ─────────────────────────────────────────────
// Festival detail drawer / modal
// ─────────────────────────────────────────────
function FestivalModal({ festival, onClose }: { festival: Festival; onClose: () => void }) {
  const [addedIds, setAddedIds] = useState<number[]>([])

  const handleAddToCart = (id: number) => {
    setAddedIds((prev) => [...prev, id])
  }

  const days = daysUntil(festival.date)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 60, opacity: 0 }}
        transition={{ type: 'spring', damping: 22 }}
        className="rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
        style={{ backgroundColor: 'var(--surface)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header gradient */}
        <div className={`bg-gradient-to-r ${festival.color} p-6 rounded-t-2xl relative`}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 rounded-full p-1 text-white transition"
          >
            <X size={18} />
          </button>
          <div className="text-4xl mb-2">{festival.emoji}</div>
          <h2 className="text-2xl font-bold text-white">{festival.name}</h2>
          <p className="text-white/70 text-sm">{festival.nameTa}</p>
          <div className="flex items-center gap-3 mt-3 flex-wrap">
            <span className="flex items-center gap-1 text-white/90 text-sm">
              <CalendarDays size={14} />
              {new Date(festival.date).toLocaleDateString('en-IN', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </span>
            <CountdownChip dateStr={festival.date} orderByDays={festival.orderByDays} />
            <PreOrderBadge festival={festival} />
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Description */}
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{festival.description}</p>

          {/* Order deadline warning */}
          {days > 0 && days <= 7 && (
            <div
              className="flex items-start gap-3 rounded-xl p-4"
              style={{
                backgroundColor: 'rgba(220,38,38,.08)',
                border: '1px solid rgba(220,38,38,.2)',
              }}
            >
              <Info size={18} className="mt-0.5 shrink-0" style={{ color: 'var(--brand)' }} />
              <div>
                <p className="font-semibold text-sm" style={{ color: 'var(--brand-text)' }}>
                  Order by {new Date(
                    new Date(festival.date).getTime() - festival.orderByDays * 86400000
                  ).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} for guaranteed delivery
                </p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--brand-text)', opacity: 0.8 }}>
                  Peak demand festival — we recommend ordering early to avoid stock-out
                </p>
              </div>
            </div>
          )}

          {/* Tips */}
          <div>
            <h3 className="font-semibold text-sm mb-3 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <Star size={16} className="text-yellow-500" />
              Ordering Tips
            </h3>
            <ul className="space-y-2">
              {festival.tips.map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  <CheckCircle2 size={15} className="text-green-500 mt-0.5 shrink-0" />
                  {tip}
                </li>
              ))}
            </ul>
          </div>

          {/* Suggested Products */}
          <div>
            <h3 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
              Recommended for {festival.name}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {festival.suggestedProducts.map((product) => {
                const added = addedIds.includes(product.id)
                return (
                  <div
                    key={product.id}
                  className="flex items-center gap-3 rounded-xl p-3 transition-colors"
                  style={{
                    border: '1px solid var(--border)',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--brand)')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-16 h-16 rounded-lg object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1 mb-0.5">
                        <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>{product.name}</p>
                        {product.tag && (
                          <span className="text-xs bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 px-1.5 py-0.5 rounded-full shrink-0">
                            {product.tag}
                          </span>
                        )}
                      </div>
                      <p className="font-bold text-sm text-brand">₹{product.price}</p>
                    </div>
                    <button
                      onClick={() => handleAddToCart(product.id)}
                      disabled={added}
                      className={`p-2 rounded-lg transition shrink-0 ${
                        added
                          ? 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400'
                          : 'bg-red-700 hover:bg-red-800 text-white'
                      }`}
                    >
                      {added ? <CheckCircle2 size={16} /> : <ShoppingCart size={16} />}
                    </button>
                  </div>
                )
              })}
            </div>
          </div>

          {/* CTA */}
          <div className="flex gap-3 pt-2">
            <Link
              to="/products"
              className="flex-1 btn btn-outline border-red-700 text-red-700 dark:text-red-400 dark:border-red-700 hover:bg-red-50 dark:hover:bg-red-950 text-center"
              onClick={onClose}
            >
              Browse All Products
            </Link>
            <Link
              to="/cart"
              className="flex-1 btn btn-primary bg-red-700 hover:bg-red-800 text-white text-center flex items-center justify-center gap-2"
              onClick={onClose}
            >
              <ShoppingCart size={16} />
              Go to Cart
            </Link>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─────────────────────────────────────────────
// Festival Card
// ─────────────────────────────────────────────
function FestivalCard({ festival, onClick }: { festival: Festival; onClick: () => void }) {
  const days = daysUntil(festival.date)
  const isPassed = days < 0
  const isToday = days === 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
        className="rounded-2xl overflow-hidden cursor-pointer transition-all"
        style={{
          border: isPassed
            ? '1px solid var(--border)'
            : isToday
            ? '2px solid #10b981'
            : '1px solid var(--border)',
          backgroundColor: 'var(--surface)',
          boxShadow: isPassed ? 'none' : 'var(--shadow-card)',
        }}
      onClick={() => !isPassed && onClick()}
    >
      {/* Color bar */}
      <div className={`h-2 bg-gradient-to-r ${festival.color}`} />

<div
          className="p-5"
          style={{ backgroundColor: 'var(--surface)' }}
        >
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="text-3xl mb-2">{festival.emoji}</div>
              <h3 className="font-bold" style={{ color: 'var(--text-primary)' }}>{festival.name}</h3>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{festival.nameTa}</p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>
                {new Date(festival.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
              </p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                {new Date(festival.date).toLocaleDateString('en-IN', { weekday: 'short' })}
              </p>
            </div>
          </div>

          <p className="text-xs mt-2 line-clamp-2" style={{ color: 'var(--text-secondary)' }}>{festival.description}</p>

        <div className="flex items-center justify-between mt-4">
          <div className="flex flex-col gap-1">
            <CountdownChip dateStr={festival.date} orderByDays={festival.orderByDays} />
            <PreOrderBadge festival={festival} />
          </div>
          {!isPassed && (
            <button className="flex items-center gap-1 text-red-700 dark:text-red-400 text-xs font-semibold hover:gap-2 transition-all">
              View flowers <ChevronRight size={14} />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  )
}

// ─────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────
type FilterType = 'all' | 'upcoming' | 'preorder'

export default function FestivalCalendarPage() {
  const [selectedFestival, setSelectedFestival] = useState<Festival | null>(null)
  const [filter, setFilter] = useState<FilterType>('upcoming')
  const [reminderSet, setReminderSet] = useState<string[]>([])

  const displayed = useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    switch (filter) {
      case 'upcoming':
        return festivals2026.filter((f) => new Date(f.date) >= today)
      case 'preorder':
        return festivals2026.filter((f) => isPreOrderOpen(f))
      default:
        return festivals2026
    }
  }, [filter])

  const nextFestival = festivals2026
    .filter((f) => daysUntil(f.date) >= 0)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0]

  const toggleReminder = (id: string) => {
    setReminderSet((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  return (
    <div className="min-h-screen transition-colors duration-200" style={{ backgroundColor: 'var(--bg)' }}>
      {/* Hero */}
      <section className="bg-gradient-to-br from-red-700 via-red-800 to-red-900 text-white py-14 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <CalendarDays size={32} />
            <h1 className="text-3xl md:text-4xl font-bold">Festival Flower Calendar 2026</h1>
          </div>
          <p className="text-white/80 text-lg max-w-xl">
            Pre-order fresh flowers for every South Indian festival. Auto-suggestions, ordering reminders, and
            guaranteed delivery before the celebration.
          </p>
        </div>
      </section>

      {/* Next festival spotlight */}
      {nextFestival && (
        <section className="max-w-7xl mx-auto px-4 -mt-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`bg-gradient-to-r ${nextFestival.color} rounded-2xl p-6 text-white shadow-xl`}
          >
            <p className="text-white/80 text-sm font-medium mb-1 flex items-center gap-2">
              <span className="animate-pulse">●</span> Next Festival
            </p>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold">
                  {nextFestival.emoji} {nextFestival.name}
                </h2>
                <p className="text-white/80 text-sm mt-1">
                  {new Date(nextFestival.date).toLocaleDateString('en-IN', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <CountdownChip dateStr={nextFestival.date} orderByDays={nextFestival.orderByDays} />
                  <PreOrderBadge festival={nextFestival} />
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => toggleReminder(nextFestival.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition ${
                    reminderSet.includes(nextFestival.id)
                      ? 'bg-white text-green-600'
                      : 'bg-white/20 hover:bg-white/30 text-white'
                  }`}
                >
                  <Bell size={15} />
                  {reminderSet.includes(nextFestival.id) ? 'Reminder Set ✓' : 'Remind Me'}
                </button>
                <button
                  onClick={() => setSelectedFestival(nextFestival)}
                  className="flex items-center gap-2 bg-white text-red-700 px-4 py-2 rounded-xl font-semibold text-sm hover:bg-gray-100 transition"
                >
                  <ShoppingCart size={15} />
                  Order Flowers
                </button>
              </div>
            </div>
          </motion.div>
        </section>
      )}

      {/* Filter Tabs + Grid */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {([
              { key: 'upcoming', label: 'Upcoming Festivals' },
              { key: 'preorder', label: '🔥 Pre-order Open' },
              { key: 'all', label: 'All 2026 Festivals' },
            ] as { key: FilterType; label: string }[]
          ).map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className="px-4 py-2 rounded-full text-sm font-medium transition-all"
              style={{
                backgroundColor: filter === key ? 'var(--brand)' : 'var(--surface)',
                color: filter === key ? '#fff' : 'var(--text-secondary)',
                border: `1px solid ${filter === key ? 'var(--brand)' : 'var(--border)'}`,
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {displayed.length === 0 ? (
          <div className="text-center py-20 text-gray-400 dark:text-gray-600">
            <CalendarDays size={48} className="mx-auto mb-4" style={{ color: 'var(--text-muted)', opacity: 0.4 }} />
            <p>No festivals match this filter right now.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {displayed.map((festival) => (
              <div key={festival.id} className="relative">
                <FestivalCard festival={festival} onClick={() => setSelectedFestival(festival)} />
                {/* Reminder button */}
                {daysUntil(festival.date) >= 0 && (
                  <button
                    onClick={() => toggleReminder(festival.id)}
                    title={reminderSet.includes(festival.id) ? 'Reminder set' : 'Set reminder'}
                    className={`absolute top-5 right-4 p-1.5 rounded-full transition ${
                      reminderSet.includes(festival.id)
                        ? 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 hover:text-red-600'
                    }`}
                  >
                    <Bell size={14} />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Subscription CTA */}
      <section className="max-w-7xl mx-auto px-4 pb-16">
        <div
          className="rounded-2xl p-8 text-center"
          style={{
            backgroundColor: 'var(--surface)',
            border: '1px solid var(--border)',
          }}
        >
          <div className="text-4xl mb-3">🌸</div>
          <h3 className="text-2xl font-bold mb-2 text-ink">
            Never miss a festival flower
          </h3>
          <p className="text-sm max-w-md mx-auto mb-6" style={{ color: 'var(--text-secondary)' }}>
            Subscribe to our festival alerts — we'll remind you 5 days before every festival and auto-suggest the
            freshest flowers for each occasion.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/subscribe"
              className="btn btn-primary bg-red-700 hover:bg-red-800 text-white px-8 py-3 flex items-center justify-center gap-2"
            >
              <Bell size={18} />
              Subscribe to Festival Alerts
            </Link>
            <Link
              to="/products"
              className="btn btn-outline border-red-700 text-red-700 dark:text-red-400 dark:border-red-700 hover:bg-red-50 dark:hover:bg-red-950 px-8 py-3 flex items-center justify-center gap-2"
            >
              Browse All Flowers
            </Link>
          </div>
        </div>
      </section>

      {/* Festival Modal */}
      <AnimatePresence>
        {selectedFestival && (
          <FestivalModal festival={selectedFestival} onClose={() => setSelectedFestival(null)} />
        )}
      </AnimatePresence>
    </div>
  )
}
