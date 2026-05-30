import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

export function usePageTitle(title: string) {
  const { t } = useTranslation()

  useEffect(() => {
    document.title = `${title} - FlowerShop`
  }, [title])
}
