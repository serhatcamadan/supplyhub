import { Sidebar } from '@/components/shared/sidebar'

export default function SellerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar
        portalType="seller"
        companyName="FreshFarm Gıda A.Ş."
        userName="Ali Yılmaz"
      />
      <main className="flex-1 bg-slate-50 overflow-auto">
        {children}
      </main>
    </div>
  )
}
