'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useTranslations, useLocale } from 'next-intl'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'

const SELLER_NAV = [
  { href: '/seller/dashboard', key: 'seller.dashboard', icon: 'grid_view' },
  { href: '/seller/products',  key: 'seller.products',  icon: 'inventory_2' },
  { href: '/seller/quotes',    key: 'seller.quotes',    icon: 'request_quote' },
  { href: '/seller/orders',    key: 'seller.orders',    icon: 'shopping_bag' },
  { href: '/seller/discover',  key: 'seller.discover',  icon: 'query_stats' },
] as const

const BUYER_NAV = [
  { href: '/buyer/discover',   key: 'buyer.discover',   icon: 'search' },
  { href: '/buyer/cart',       key: 'buyer.cart',       icon: 'shopping_cart' },
  { href: '/buyer/orders',     key: 'buyer.orders',     icon: 'history' },
  { href: '/buyer/quotes',     key: 'buyer.quotes',     icon: 'outgoing_mail' },
  { href: '/buyer/approvals',  key: 'buyer.approvals',  icon: 'pending_actions' },
] as const

interface SidebarProps {
  portal: 'seller' | 'buyer'
}

export function Sidebar({ portal }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const t = useTranslations('sidebar')
  const locale = useLocale()

  const navItems = portal === 'seller' ? SELLER_NAV : BUYER_NAV

  // Strip locale prefix before matching against bare /seller/... paths
  const pathWithoutLocale = pathname.replace(`/${locale}`, '') || '/'

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push(`/${locale}/login`)
  }

  function navLink(item: { href: string; key: string; icon: string }) {
    const active =
      pathWithoutLocale === item.href ||
      pathWithoutLocale.startsWith(item.href + '/')

    return (
      <Link
        key={item.href}
        href={`/${locale}${item.href}`}
        className={cn(
          'flex items-center px-4 py-2.5 text-sm transition-colors rounded-lg',
          active
            ? 'bg-primary-container text-on-primary-container border-l-2 border-secondary-fixed'
            : 'text-on-primary hover:bg-primary-container/40'
        )}
      >
        <span className="material-symbols-outlined mr-3" style={{ fontSize: '20px' }}>
          {item.icon}
        </span>
        {t(item.key)}
      </Link>
    )
  }

  return (
    <aside className="fixed left-0 top-0 h-screen w-72 bg-primary text-on-primary border-r border-outline-variant/10 z-50 flex flex-col overflow-y-auto">
      <div className="p-6 flex items-center gap-3 border-b border-primary-container/30">
        <span className="text-xl font-bold tracking-tight">SupplyHub</span>
      </div>

      <nav className="flex-1 py-6 px-4">
        <div className="space-y-1">{navItems.map(navLink)}</div>
      </nav>

      <div className="p-4 border-t border-primary-container/30">
        <button
          onClick={handleLogout}
          className="w-full flex items-center px-4 py-3 text-sm hover:bg-error/10 hover:text-error transition-colors rounded-lg"
        >
          <span className="material-symbols-outlined mr-3" style={{ fontSize: '20px' }}>
            logout
          </span>
          {t('signOut')}
        </button>
      </div>
    </aside>
  )
}
