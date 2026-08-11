'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { MOCK_SELLER_USER, MOCK_BUYER_ADMIN, MOCK_BUYER_STAFF } from '@/lib/mock-data'
import { companies } from '@/lib/mock-data'

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  function handleMockLogin(userId: string) {
    setLoading(true)
    const user = [MOCK_SELLER_USER, MOCK_BUYER_ADMIN, MOCK_BUYER_STAFF].find(
      (u) => u.id === userId
    )!
    const company = companies.find((c) => c.id === user.company_id)!

    document.cookie = `mock-session=${JSON.stringify({
      userId: user.id,
      role: user.role,
      companyType: company.type,
      companyId: company.id,
    })}; path=/`

    router.push(company.type === 'seller' ? '/seller/dashboard' : '/buyer/discover')
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <p className="text-2xl font-bold text-primary tracking-tight">SupplyHub</p>
          <p className="text-sm text-on-surface-variant mt-1">B2B Toptan Tedarik Platformu</p>
        </div>

        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm p-8">
          <h2 className="text-xl font-semibold text-on-surface mb-1">Giriş Yap</h2>
          <p className="text-sm text-on-surface-variant mb-6">Hesabınıza erişin</p>

          <div className="space-y-2 mb-6">
            <p className="text-xs font-semibold tracking-wider text-on-surface-variant/50 uppercase mb-3">
              Demo Girişleri
            </p>

            {[
              { user: MOCK_SELLER_USER, label: 'Satıcı', sub: 'FreshFarm Gıda A.Ş.', badge: 'bg-blue-50 text-blue-700' },
              { user: MOCK_BUYER_ADMIN, label: 'Alıcı Admin', sub: 'Güneş Market Zinciri', badge: 'bg-green-50 text-green-700' },
              { user: MOCK_BUYER_STAFF, label: 'Alıcı Staff', sub: 'Güneş Market Zinciri', badge: 'bg-amber-50 text-amber-700' },
            ].map(({ user, label, sub, badge }) => (
              <button
                key={user.id}
                onClick={() => handleMockLogin(user.id)}
                disabled={loading}
                className="w-full flex items-center justify-between px-4 py-3 rounded-lg border border-outline-variant hover:border-primary-container hover:bg-surface-container-low transition-colors group"
              >
                <div className="text-left">
                  <p className="text-sm font-medium text-on-surface group-hover:text-primary-container transition-colors">
                    {user.name}
                  </p>
                  <p className="text-xs text-on-surface-variant">{sub}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${badge}`}>
                  {label}
                </span>
              </button>
            ))}
          </div>

          <div className="border-t border-outline-variant/50 pt-4 text-center">
            <p className="text-xs text-on-surface-variant/60">
              Hesabınız yok mu?{' '}
              <Link href="/signup" className="text-primary-container font-semibold hover:underline">
                Kayıt Ol
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
