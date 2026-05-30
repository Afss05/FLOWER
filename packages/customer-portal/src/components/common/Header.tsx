import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ShoppingCart, User, Search, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { useUIStore } from '@/store/uiStore'
import { useAuthStore } from '@/store/authStore'

export default function Header() {
  const { t } = useTranslation()
  const { isSidebarOpen, toggleSidebar, language, setLanguage } = useUIStore()
  const { isAuthenticated, user } = useAuthStore()
  const [searchOpen, setSearchOpen] = useState(false)

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-red-700 rounded-lg flex items-center justify-center text-white font-bold">
              FS
            </div>
            <span className="text-xl font-bold text-gray-800 hidden sm:inline">FlowerShop</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex gap-6 items-center">
            <Link to="/products" className="text-gray-700 hover:text-red-700 transition">
              {t('common.products')}
            </Link>
            <Link to="/subscribe" className="text-gray-700 hover:text-red-700 transition">
              {t('nav.subscriptions')}
            </Link>
            <Link to="/blog" className="text-gray-700 hover:text-red-700 transition">
              {t('nav.blogs')}
            </Link>
            <Link to="/contact" className="text-gray-700 hover:text-red-700 transition">
              {t('nav.contact')}
            </Link>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            {/* Language Selector */}
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as 'en' | 'ta')}
              className="text-sm border border-gray-300 rounded px-2 py-1"
            >
              <option value="en">English</option>
              <option value="ta">Tamil</option>
            </select>

            {/* Search */}
            <button onClick={() => setSearchOpen(!searchOpen)} className="text-gray-700 hover:text-red-700">
              <Search size={20} />
            </button>

            {/* Cart */}
            <Link to="/cart" className="relative text-gray-700 hover:text-red-700">
              <ShoppingCart size={20} />
              <span className="absolute -top-2 -right-2 bg-red-700 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                0
              </span>
            </Link>

            {/* User */}
            {isAuthenticated ? (
              <Link to="/profile" className="text-gray-700 hover:text-red-700">
                <User size={20} />
              </Link>
            ) : (
              <Link to="/login" className="btn btn-primary text-sm">
                {t('common.login')}
              </Link>
            )}

            {/* Mobile Menu */}
            <button onClick={toggleSidebar} className="md:hidden text-gray-700">
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        {searchOpen && (
          <div className="mt-4 flex gap-2">
            <input
              type="text"
              placeholder={t('common.search')}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-700"
            />
            <button className="btn btn-primary">{t('common.search')}</button>
          </div>
        )}
      </div>
    </header>
  )
}
