import { useTranslation } from 'react-i18next'
import { Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
  const { t } = useTranslation()
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-white mt-12">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-bold mb-4">FlowerShop</h3>
            <p className="text-gray-300 text-sm">
              Fresh flowers and pooja items delivered to your doorstep, same day delivery in Chennai.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">{t('nav.home')}</h3>
            <ul className="text-gray-300 text-sm space-y-2">
              <li>
                <a href="/" className="hover:text-white transition">
                  {t('common.home')}
                </a>
              </li>
              <li>
                <a href="/products" className="hover:text-white transition">
                  {t('common.products')}
                </a>
              </li>
              <li>
                <a href="/blogs" className="hover:text-white transition">
                  {t('nav.blogs')}
                </a>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-bold mb-4">Support</h3>
            <ul className="text-gray-300 text-sm space-y-2">
              <li>
                <a href="/help" className="hover:text-white transition">
                  Help Center
                </a>
              </li>
              <li>
                <a href="/faq" className="hover:text-white transition">
                  FAQ
                </a>
              </li>
              <li>
                <a href="/contact" className="hover:text-white transition">
                  {t('nav.contact')}
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-bold mb-4">Contact</h3>
            <div className="text-gray-300 text-sm space-y-2">
              <div className="flex items-center gap-2">
                <Phone size={16} />
                <span>+91 9876543210</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={16} />
                <span>support@flowershop.com</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={16} />
                <span>Chennai, Tamil Nadu</span>
              </div>
            </div>
          </div>
        </div>

        <hr className="border-gray-700 mb-8" />

        {/* Copyright */}
        <div className="flex justify-between items-center">
          <p className="text-gray-400 text-sm">
            &copy; {currentYear} FlowerShop. All rights reserved.
          </p>
          <div className="flex gap-4 text-sm text-gray-400">
            <a href="/privacy" className="hover:text-white transition">
              Privacy Policy
            </a>
            <a href="/terms" className="hover:text-white transition">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
