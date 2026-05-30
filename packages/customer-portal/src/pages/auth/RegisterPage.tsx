import { usePageTitle } from '@/hooks/usePageTitle'
import { useTranslation } from 'react-i18next'

export default function RegisterPage() {
  const { t } = useTranslation()
  usePageTitle('Register')

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8 px-4">
      <div className="card p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold mb-8">{t('common.register')}</h1>

        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Name</label>
            <input type="text" placeholder="Your Name" className="w-full" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input type="email" placeholder="your@email.com" className="w-full" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Phone</label>
            <input type="tel" placeholder="9876543210" className="w-full" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <input type="password" placeholder="••••••••" className="w-full" />
          </div>

          <button type="submit" className="btn btn-primary w-full">
            {t('common.register')}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-4">
          Already have an account?{' '}
          <a href="/login" className="text-red-700 font-semibold hover:underline">
            {t('common.login')}
          </a>
        </p>
      </div>
    </div>
  )
}
