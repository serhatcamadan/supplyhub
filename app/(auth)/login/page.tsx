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

    if (company.type === 'seller') {
      router.push('/seller/dashboard')
    } else {
      router.push('/buyer/discover')
    }
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
      <h2 className="text-xl font-semibold text-slate-900 mb-1">Giriş Yap</h2>
      <p className="text-sm text-slate-500 mb-6">Hesabınıza erişin</p>

      {/* Mock login shortcuts for UI development */}
      <div className="space-y-2 mb-6">
        <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-3">
          Demo Girişleri
        </p>
        <button
          onClick={() => handleMockLogin(MOCK_SELLER_USER.id)}
          disabled={loading}
          className="w-full flex items-center justify-between px-4 py-3 rounded-lg border border-slate-200 hover:border-[#1e3a5f] hover:bg-slate-50 transition-colors group"
        >
          <div className="text-left">
            <p className="text-sm font-medium text-slate-900 group-hover:text-[#1e3a5f]">
              {MOCK_SELLER_USER.name}
            </p>
            <p className="text-xs text-slate-500">Satıcı · FreshFarm Gıda A.Ş.</p>
          </div>
          <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-medium">
            Satıcı
          </span>
        </button>

        <button
          onClick={() => handleMockLogin(MOCK_BUYER_ADMIN.id)}
          disabled={loading}
          className="w-full flex items-center justify-between px-4 py-3 rounded-lg border border-slate-200 hover:border-[#1e3a5f] hover:bg-slate-50 transition-colors group"
        >
          <div className="text-left">
            <p className="text-sm font-medium text-slate-900 group-hover:text-[#1e3a5f]">
              {MOCK_BUYER_ADMIN.name}
            </p>
            <p className="text-xs text-slate-500">Alıcı Admin · Güneş Market Zinciri</p>
          </div>
          <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full font-medium">
            Alıcı Admin
          </span>
        </button>

        <button
          onClick={() => handleMockLogin(MOCK_BUYER_STAFF.id)}
          disabled={loading}
          className="w-full flex items-center justify-between px-4 py-3 rounded-lg border border-slate-200 hover:border-[#1e3a5f] hover:bg-slate-50 transition-colors group"
        >
          <div className="text-left">
            <p className="text-sm font-medium text-slate-900 group-hover:text-[#1e3a5f]">
              {MOCK_BUYER_STAFF.name}
            </p>
            <p className="text-xs text-slate-500">Alıcı Çalışan · Güneş Market Zinciri</p>
          </div>
          <span className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full font-medium">
            Alıcı Staff
          </span>
        </button>
      </div>

      <div className="border-t border-slate-100 pt-4 text-center">
        <p className="text-xs text-slate-400">
          Hesabınız yok mu?{' '}
          <Link href="/signup" className="text-[#1e3a5f] font-medium hover:underline">
            Kayıt Ol
          </Link>
        </p>
      </div>
    </div>
  )
}
