import { usePageTitle } from '@/hooks/usePageTitle'
import { useTranslation } from 'react-i18next'

export default function LoginPage() {
  const { t } = useTranslation()
  usePageTitle('Login')

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8 px-4">
      <div className="card p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold mb-8">{t('common.login')}</h1>

        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input type="email" placeholder="your@email.com" className="w-full" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <input type="password" placeholder="••••••••" className="w-full" />
          </div>

          <button type="submit" className="btn btn-primary w-full">
            {t('common.login')}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-4">
          Don't have an account?{' '}
          <a href="/register" className="text-red-700 font-semibold hover:underline">
            {t('common.register')}
          </a>
        </p>
      </div>
    </div>
  )
}
