import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ShoppingCart, User, Search, Menu, X, Moon, Sun, CalendarDays } from 'lucide-react'
import { useState, useRef } from 'react'
import { useUIStore } from '@/store/uiStore'
import { useAuthStore } from '@/store/authStore'
import { VoiceSearchButton } from '@/components/common'
import { NotificationBell } from '@/components/common'

export default function Header() {
  const { t } = useTranslation()
  const { isSidebarOpen, toggleSidebar, language, setLanguage, theme, toggleTheme } = useUIStore()
  const { isAuthenticated } = useAuthStore()
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const searchInputRef = useRef<HTMLInputElement>(null)

  const handleVoiceResult = (transcript: string) => {
    setSearchQuery(transcript)
    if (!searchOpen) setSearchOpen(true)
    setTimeout(() => searchInputRef.current?.focus(), 50)
  }

  return (
    <header
      className="sticky top-0 z-50 transition-colors duration-200"
      style={{
        backgroundColor: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">

        {/* ── Logo ─────────────────────────────────────────────── */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center text-white font-bold text-sm">
            FS
          </div>
          <span className="text-base font-bold text-ink hidden sm:inline tracking-tight">
            FlowerShop
          </span>
        </Link>

        {/* ── Nav ──────────────────────────────────────────────── */}
        <nav className="hidden md:flex items-center gap-1">
          {[
            { to: '/products', label: t('common.products') },
            { to: '/subscribe', label: t('nav.subscriptions') },
            { to: '/festivals', label: 'Festivals', icon: <CalendarDays size={14} /> },
            { to: '/blog', label: t('nav.blogs') },
            { to: '/contact', label: t('nav.contact') },
          ].map(({ to, label, icon }) => (
            <Link
              key={to}
              to={to}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium text-ink-secondary transition-all duration-150 hover:text-ink hover:bg-surface-raised"
            >
              {icon}
              {label}
            </Link>
          ))}
        </nav>

        {/* ── Right Actions ─────────────────────────────────────── */}
        <div className="flex items-center gap-1">

          {/* Language */}
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as 'en' | 'ta')}
            className="text-xs rounded-md px-2 py-1 font-medium transition-colors hidden sm:block"
            style={{
              backgroundColor: 'var(--surface-raised)',
              color: 'var(--text-secondary)',
              border: '1px solid var(--border)',
              outline: 'none',
            }}
          >
            <option value="en">EN</option>
            <option value="ta">தமிழ்</option>
          </select>

          {/* Dark mode toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
            className="w-8 h-8 rounded-md flex items-center justify-center text-ink-secondary hover:text-ink hover:bg-surface-raised transition-all"
          >
            {theme === 'dark'
              ? <Sun size={16} strokeWidth={1.8} />
              : <Moon size={16} strokeWidth={1.8} />}
          </button>

          {/* Search */}
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="w-8 h-8 rounded-md flex items-center justify-center text-ink-secondary hover:text-ink hover:bg-surface-raised transition-all"
          >
            <Search size={16} strokeWidth={1.8} />
          </button>

          {/* Notifications */}
          <NotificationBell />

          {/* Cart */}
          <Link
            to="/cart"
            className="relative w-8 h-8 rounded-md flex items-center justify-center text-ink-secondary hover:text-ink hover:bg-surface-raised transition-all"
          >
            <ShoppingCart size={16} strokeWidth={1.8} />
            <span className="absolute -top-0.5 -right-0.5 bg-brand text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center leading-none">
              0
            </span>
          </Link>

          {/* User / Login */}
          {isAuthenticated ? (
            <Link
              to="/profile"
              className="w-8 h-8 rounded-md flex items-center justify-center text-ink-secondary hover:text-ink hover:bg-surface-raised transition-all"
            >
              <User size={16} strokeWidth={1.8} />
            </Link>
          ) : (
            <Link
              to="/login"
              className="ml-1 px-3 py-1.5 rounded-md text-sm font-semibold text-white transition-colors"
              style={{ backgroundColor: 'var(--brand)' }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--brand-hover)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--brand)')}
            >
              {t('common.login')}
            </Link>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={toggleSidebar}
            className="md:hidden w-8 h-8 rounded-md flex items-center justify-center text-ink-secondary hover:text-ink hover:bg-surface-raised transition-all"
          >
            {isSidebarOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </div>

      {/* ── Search Bar (expanded) ─────────────────────────────── */}
      {searchOpen && (
        <div
          className="border-t px-4 py-3 flex gap-2 items-center"
          style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-subtle)' }}
        >
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('common.search')}
            autoFocus
            className="input-token flex-1 text-sm"
          />
          <VoiceSearchButton
            lang={language === 'ta' ? 'ta-IN' : 'en-US'}
            onResult={handleVoiceResult}
            size="md"
          />
          <button className="btn btn-primary text-sm px-4 py-1.5">{t('common.search')}</button>
        </div>
      )}
    </header>
  )
}
