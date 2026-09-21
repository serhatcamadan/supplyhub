import Link from 'next/link'
import { getTranslations, getLocale } from 'next-intl/server'
import { getServerUser } from '@/lib/auth/server'
import { buttonVariants } from '@/components/ui/button'
import { GlobalSearch } from '@/components/shared/global-search'
import { NotFoundBackButton } from '@/components/shared/not-found-back-button'
import { NotFoundPathBar } from '@/components/shared/not-found-path-bar'
import {
  IconError404, IconFileInvoice, IconHistory, IconLayoutGrid,
  IconMailForward, IconPackage, IconSearch, IconShoppingBag, IconShoppingCart,
} from '@tabler/icons-react'
import type { ElementType } from 'react'

interface QuickNavItem {
  href: string
  key: string
  icon: ElementType
}

const SELLER_QUICK_NAV: QuickNavItem[] = [
  { href: '/seller/dashboard', key: 'seller.dashboard', icon: IconLayoutGrid },
  { href: '/seller/products',  key: 'seller.products',  icon: IconPackage },
  { href: '/seller/quotes',    key: 'seller.quotes',    icon: IconFileInvoice },
  { href: '/seller/orders',    key: 'seller.orders',    icon: IconShoppingBag },
]

const BUYER_QUICK_NAV: QuickNavItem[] = [
  { href: '/buyer/discover',  key: 'buyer.discover',  icon: IconSearch },
  { href: '/buyer/cart',      key: 'buyer.cart',       icon: IconShoppingCart },
  { href: '/buyer/orders',    key: 'buyer.orders',     icon: IconHistory },
  { href: '/buyer/quotes',    key: 'buyer.quotes',     icon: IconMailForward },
]

export async function NotFoundContent() {
  const [t, tSidebar, locale, user] = await Promise.all([
    getTranslations('common'),
    getTranslations('sidebar'),
    getLocale(),
    getServerUser(),
  ])

  const portal: 'seller' | 'buyer' | null =
    user?.companyType === 'seller' ? 'seller' : user?.companyType === 'buyer' ? 'buyer' : null

  const quickNav = portal === 'seller' ? SELLER_QUICK_NAV : portal === 'buyer' ? BUYER_QUICK_NAV : []
  const homeHref =
    portal === 'seller'
      ? `/${locale}/seller/dashboard`
      : portal === 'buyer'
        ? `/${locale}/buyer/discover`
        : `/${locale}/login`

  return (
    <div className="relative min-h-screen bg-surface overflow-hidden flex items-center justify-center px-4 py-16">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-linear-to-br from-surface-container-high/50 to-surface-container-low/20" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-180 h-125 bg-linear-to-tr from-primary-container/10 via-surface-variant/10 to-transparent blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-3xl flex flex-col items-center text-center gap-8">
        <Link href={homeHref} className="text-2xl font-bold tracking-tight text-primary">
          SupplyHub
        </Link>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-high text-primary shadow-sm">
          <IconError404 size={16} />
          <span className="text-xs font-semibold uppercase tracking-wider">{t('notFound.eyebrow')}</span>
        </div>

        <div>
          <h1 className="text-4xl font-bold tracking-tight text-on-surface mb-3 text-balance">
            {t('notFound.heading')}
          </h1>
          <p className="text-base text-on-surface-variant max-w-xl mx-auto text-balance">
            {t('notFound.description')}
          </p>
        </div>

        {portal && (
          <div className="w-full max-w-md">
            <GlobalSearch portal={portal} />
          </div>
        )}

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link href={homeHref} className={buttonVariants({ variant: 'primary', size: 'lg' })}>
            <IconLayoutGrid size={18} />
            {portal ? t('notFound.backToPanel') : t('notFound.goToLogin')}
          </Link>
          <NotFoundBackButton label={t('notFound.goBack')} />
        </div>

        {quickNav.length > 0 && (
          <div className="w-full mt-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-4">
              {t('notFound.quickNav')}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {quickNav.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={`/${locale}${item.href}`}
                    className="group flex flex-col items-center gap-2 p-4 rounded-xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors">
                      <Icon size={20} />
                    </div>
                    <span className="text-sm font-semibold text-on-surface">{tSidebar(item.key)}</span>
                  </Link>
                )
              })}
            </div>
          </div>
        )}

        <NotFoundPathBar
          label={t('notFound.attemptedPath')}
          copyLabel={t('notFound.copyPath')}
          copiedLabel={t('notFound.copied')}
        />
      </div>
    </div>
  )
}
