'use client'

import { useLocale } from 'next-intl'
import { usePathname, useRouter } from 'next/navigation'

export function LanguageSwitcher() {
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()

  function switchLocale() {
    const nextLocale = locale === 'tr' ? 'en' : 'tr'
    // Swap the locale segment at the start of the path
    const newPath = pathname.replace(`/${locale}`, `/${nextLocale}`)
    router.push(newPath)
  }

  return (
    <button
      onClick={switchLocale}
      className="flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-lg hover:bg-surface-container-low transition-colors"
      aria-label="Switch language"
    >
      <span className={locale === 'tr' ? 'text-on-surface' : 'text-on-surface-variant/50'}>
        TR
      </span>
      <span className="text-on-surface-variant/30 select-none">|</span>
      <span className={locale === 'en' ? 'text-on-surface' : 'text-on-surface-variant/50'}>
        EN
      </span>
    </button>
  )
}
