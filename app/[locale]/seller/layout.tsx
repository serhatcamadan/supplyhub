import { Sidebar } from '@/components/shared/sidebar'
import { Topbar } from '@/components/shared/topbar'
import { getServerUser } from '@/lib/auth/server'
import { getLocale } from 'next-intl/server'
import { redirect } from 'next/navigation'

export default async function SellerLayout({ children }: { children: React.ReactNode }) {
  const user = await getServerUser()

  if (!user) {
    const locale = await getLocale()
    redirect(`/${locale}/login`)
  }

  const name = user.name ?? user.email ?? 'Seller'
  const role = 'Wholesale Seller'

  return (
    <div className="min-h-screen bg-surface">
      <Sidebar portal="seller" />
      <Topbar userName={name} userRole={role} />
      <div className="pl-72">
        <main className="pt-16 min-h-screen">{children}</main>
      </div>
    </div>
  )
}
