import { Sidebar } from '@/components/shared/sidebar'
import { Topbar } from '@/components/shared/topbar'

export default function BuyerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-surface">
      <Sidebar />
      <Topbar userName="Ayşe Demir" userRole="Wholesale Buyer" />
      <div className="pl-72">
        <main className="pt-16 min-h-screen">{children}</main>
      </div>
    </div>
  )
}
