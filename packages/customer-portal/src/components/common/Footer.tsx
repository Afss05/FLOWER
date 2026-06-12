import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Mail, Phone, MapPin, CalendarDays } from 'lucide-react'

export default function Footer() {
  const { t } = useTranslation()
  const currentYear = new Date().getFullYear()

  return (
    <footer
      className="mt-12 transition-colors duration-200"
      style={{
        backgroundColor: 'var(--surface)',
        borderTop: '1px solid var(--border)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">

          {/* About */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 bg-brand rounded-md flex items-center justify-center text-white font-bold text-xs">
                FS
              </div>
              <span className="font-bold text-ink">FlowerShop</span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Fresh flowers and pooja items delivered to your doorstep. Same-day delivery in Chennai.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-sm font-semibold text-ink mb-4 uppercase tracking-wider">Shop</h3>
            <ul className="space-y-2.5">
              {[
                { to: '/products', label: t('common.products') },
                { to: '/subscribe', label: t('nav.subscriptions') },
                { to: '/festivals', label: 'Festival Calendar', icon: <CalendarDays size={12} /> },
                { to: '/blog', label: t('nav.blogs') },
              ].map(({ to, label, icon }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="flex items-center gap-1.5 text-sm transition-colors hover:text-brand"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {icon}
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold text-ink mb-4 uppercase tracking-wider">Support</h3>
            <ul className="space-y-2.5">
              {[
                { href: '/help', label: 'Help Center' },
                { href: '/faq', label: 'FAQ' },
                { href: '/contact', label: t('nav.contact') },
              ].map(({ href, label }) => (
                <li key={href}>
                  <a
                    href={href}
                    className="text-sm transition-colors hover:text-brand"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-ink mb-4 uppercase tracking-wider">Contact</h3>
            <div className="space-y-2.5">
              {[
                { icon: <Phone size={14} />, text: '+91 9876543210' },
                { icon: <Mail size={14} />, text: 'support@flowershop.com' },
                { icon: <MapPin size={14} />, text: 'Chennai, Tamil Nadu' },
              ].map(({ icon, text }) => (
                <div key={text} className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  <span style={{ color: 'var(--text-muted)' }}>{icon}</span>
                  {text}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '24px' }} />

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-0">
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            © {currentYear} FlowerShop. All rights reserved.
          </p>
          <div className="flex gap-4">
            {[
              { href: '/privacy', label: 'Privacy Policy' },
              { href: '/terms', label: 'Terms of Service' },
            ].map(({ href, label }) => (
              <a
                key={href}
                href={href}
                className="text-xs transition-colors hover:text-brand"
                style={{ color: 'var(--text-muted)' }}
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
