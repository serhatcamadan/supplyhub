'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

const SELLER_NAV = [
  { href: '/seller/dashboard',  label: 'Dashboard',        icon: 'grid_view' },
  { href: '/seller/products',   label: 'Products',         icon: 'inventory_2' },
  { href: '/seller/quotes',     label: 'Quote Requests',   icon: 'request_quote' },
  { href: '/seller/orders',     label: 'Orders',           icon: 'shopping_bag' },
  { href: '/seller/discover',   label: 'Market Discovery', icon: 'query_stats' },
]

const BUYER_NAV = [
  { href: '/buyer/discover', label: 'Discovery', icon: 'search' },
  { href: '/buyer/cart', label: 'Shopping Cart', icon: 'shopping_cart' },
  { href: '/buyer/orders', label: 'Order History', icon: 'history' },
  { href: '/buyer/approvals', label: 'Quote Requests', icon: 'outgoing_mail' },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  function handleLogout() {
    document.cookie = 'mock-session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    router.push('/login')
  }

  function navLink(item: { href: string; label: string; icon: string }) {
    const active = pathname === item.href || pathname.startsWith(item.href + '/')
    return (
      <Link
        key={item.href}
        href={item.href}
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
        {item.label}
      </Link>
    )
  }

  return (
    <aside className="fixed left-0 top-0 h-screen w-72 bg-primary text-on-primary border-r border-outline-variant/10 z-50 flex flex-col overflow-y-auto">
      <div className="p-6 flex items-center gap-3 border-b border-primary-container/30">
        <span className="text-xl font-bold tracking-tight">SupplyHub</span>
      </div>

      <nav className="flex-1 py-6 px-4 space-y-8">
        <section>
          <p className="px-4 mb-3 text-xs font-semibold uppercase tracking-wider text-on-primary-container/60">
            Seller Portal
          </p>
          <div className="space-y-1">{SELLER_NAV.map(navLink)}</div>
        </section>
        <section>
          <p className="px-4 mb-3 text-xs font-semibold uppercase tracking-wider text-on-primary-container/60">
            Buyer Portal
          </p>
          <div className="space-y-1">{BUYER_NAV.map(navLink)}</div>
        </section>
      </nav>

      <div className="p-4 border-t border-primary-container/30">
        <button
          onClick={handleLogout}
          className="w-full flex items-center px-4 py-3 text-sm hover:bg-error/10 hover:text-error transition-colors rounded-lg"
        >
          <span className="material-symbols-outlined mr-3" style={{ fontSize: '20px' }}>
            logout
          </span>
          Sign Out
        </button>
      </div>
    </aside>
  )
}
