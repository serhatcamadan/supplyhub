'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useTranslations, useLocale } from 'next-intl'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import {
  IconLogout, IconLayoutGrid, IconPackage, IconFileInvoice, IconShoppingBag,
  IconChartBar, IconSearch, IconShoppingCart, IconHistory, IconMailForward,
  IconClipboardList,
} from '@tabler/icons-react'
import type { ElementType } from 'react'

const SELLER_NAV: { href: string; key: string; icon: ElementType }[] = [
  { href: '/seller/dashboard', key: 'seller.dashboard', icon: IconLayoutGrid },
  { href: '/seller/products',  key: 'seller.products',  icon: IconPackage },
  { href: '/seller/quotes',    key: 'seller.quotes',    icon: IconFileInvoice },
  { href: '/seller/orders',    key: 'seller.orders',    icon: IconShoppingBag },
  { href: '/seller/discover',  key: 'seller.discover',  icon: IconChartBar },
] as const

const BUYER_NAV: { href: string; key: string; icon: ElementType }[] = [
  { href: '/buyer/discover',   key: 'buyer.discover',   icon: IconSearch },
  { href: '/buyer/cart',       key: 'buyer.cart',       icon: IconShoppingCart },
  { href: '/buyer/orders',     key: 'buyer.orders',     icon: IconHistory },
  { href: '/buyer/quotes',     key: 'buyer.quotes',     icon: IconMailForward },
  { href: '/buyer/approvals',  key: 'buyer.approvals',  icon: IconClipboardList },
] as const

interface SidebarProps {
  portal: 'seller' | 'buyer'
}

export function Sidebar({ portal }: SidebarProps) {
  const pathname = usePathname()
  const router   = useRouter()
  const t        = useTranslations('sidebar')
  const locale   = useLocale()

  const navItems = portal === 'seller' ? SELLER_NAV : BUYER_NAV

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push(`/${locale}/login`)
  }

  function navLink(item: { href: string; key: string; icon: ElementType }) {
    const isActive = pathname.includes(item.href)
    const NavIcon = item.icon
    return (
      <Link
        key={item.href}
        href={`/${locale}${item.href}`}
        className={cn(
          'flex items-center px-4 py-3 text-sm rounded-lg transition-colors',
          isActive
            ? 'bg-primary-container/20 text-on-primary font-semibold'
            : 'text-on-primary/70 hover:bg-primary-container/10 hover:text-on-primary'
        )}
      >
        <NavIcon size={20} className="mr-3" />
        {t(item.key)}
      </Link>
    )
  }

  return (
    <aside className="fixed left-0 top-0 h-screen w-72 bg-primary text-on-primary flex flex-col z-40">
      <div className="p-6 border-b border-primary-container/30">
        <h1 className="text-xl font-bold tracking-tight">SupplyHub</h1>
        <p className="text-xs text-on-primary/50 mt-0.5 capitalize">{portal} Portal</p>
      </div>

      <nav className="flex-1 overflow-y-auto p-4">
        <div className="space-y-1">{navItems.map(navLink)}</div>
      </nav>

      <div className="p-4 border-t border-primary-container/30">
        <button
          onClick={handleLogout}
          className="w-full flex items-center px-4 py-3 text-sm hover:bg-error/10 hover:text-error transition-colors rounded-lg"
        >
          <IconLogout size={20} className="mr-3" />
          {t('signOut')}
        </button>
      </div>
    </aside>
  )
}
