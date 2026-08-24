import { Sidebar } from '@/components/shared/sidebar'
import { Topbar } from '@/components/shared/topbar'
import { createClient } from '@/lib/supabase/server'
import { getLocale } from 'next-intl/server'
import { redirect } from 'next/navigation'

export default async function BuyerLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    const locale = await getLocale()
    redirect(`/${locale}/login`)
  }

  const name = user.user_metadata?.name ?? user.email ?? 'Buyer'
  const role = 'Wholesale Buyer'

  return (
    <div className="min-h-screen bg-surface">
      <Sidebar portal="buyer" />
      <Topbar userName={name} userRole={role} />
      <div className="pl-72">
        <main className="pt-16 min-h-screen">{children}</main>
      </div>
    </div>
  )
}
