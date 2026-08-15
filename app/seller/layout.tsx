import { Sidebar } from '@/components/shared/sidebar'
import { Topbar } from '@/components/shared/topbar'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function SellerLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const name = user.user_metadata?.name ?? user.email ?? 'Seller'
  const role = user.user_metadata?.role ?? 'Wholesale Seller'

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
