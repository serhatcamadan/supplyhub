'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  Package,
  MessageSquare,
  ShoppingCart,
  Search,
  ClipboardList,
  CheckSquare,
  LogOut,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface NavItem {
  href: string
  label: string
  icon: React.ReactNode
}

const sellerNav: NavItem[] = [
  { href: '/seller/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
  { href: '/seller/products', label: 'Ürünlerim', icon: <Package size={18} /> },
  { href: '/seller/quotes', label: 'Teklif Talepleri', icon: <MessageSquare size={18} /> },
  { href: '/seller/orders', label: 'Siparişler', icon: <ClipboardList size={18} /> },
]

const buyerNav: NavItem[] = [
  { href: '/buyer/discover', label: 'Ürün Keşfi', icon: <Search size={18} /> },
  { href: '/buyer/cart', label: 'Sepet', icon: <ShoppingCart size={18} /> },
  { href: '/buyer/orders', label: 'Siparişlerim', icon: <ClipboardList size={18} /> },
  { href: '/buyer/approvals', label: 'Onay Bekleyenler', icon: <CheckSquare size={18} /> },
]

interface SidebarProps {
  portalType: 'seller' | 'buyer'
  companyName: string
  userName: string
}

export function Sidebar({ portalType, companyName, userName }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const navItems = portalType === 'seller' ? sellerNav : buyerNav

  function handleLogout() {
    document.cookie = 'mock-session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    router.push('/login')
  }

  return (
    <aside className="w-60 shrink-0 flex flex-col bg-[#1e3a5f] min-h-screen">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-white/10">
        <p className="text-white font-bold text-lg tracking-tight">SupplyHub</p>
        <p className="text-white/50 text-xs mt-0.5">
          {portalType === 'seller' ? 'Satıcı Paneli' : 'Alıcı Paneli'}
        </p>
      </div>

      {/* Company info */}
      <div className="px-6 py-4 border-b border-white/10">
        <p className="text-white/90 text-sm font-medium truncate">{companyName}</p>
        <p className="text-white/50 text-xs mt-0.5 truncate">{userName}</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors',
                active
                  ? 'bg-white/15 text-white font-medium'
                  : 'text-white/60 hover:bg-white/10 hover:text-white'
              )}
            >
              {item.icon}
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 pb-4">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/60 hover:bg-white/10 hover:text-white transition-colors"
        >
          <LogOut size={18} />
          Çıkış Yap
        </button>
      </div>
    </aside>
  )
}
