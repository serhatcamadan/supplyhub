import { Sidebar } from '@/components/shared/sidebar'

export default function BuyerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar
        portalType="buyer"
        companyName="Güneş Market Zinciri"
        userName="Ayşe Demir"
      />
      <main className="flex-1 bg-slate-50 overflow-auto">
        {children}
      </main>
    </div>
  )
}
