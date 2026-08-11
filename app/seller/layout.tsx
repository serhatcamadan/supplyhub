import { Sidebar } from '@/components/shared/sidebar'
import { Topbar } from '@/components/shared/topbar'

export default function SellerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-surface">
      <Sidebar />
      <Topbar userName="Ali Yılmaz" userRole="Wholesale Seller" />
      <div className="pl-72">
        <main className="pt-16 min-h-screen">{children}</main>
      </div>
    </div>
  )
}
