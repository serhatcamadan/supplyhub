'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

type CompanyType = 'seller' | 'buyer'

export default function SignupPage() {
  const router = useRouter()
  const [companyType, setCompanyType] = useState<CompanyType>('buyer')
  const [loading, setLoading] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    // Mock signup — sets a demo session and redirects
    document.cookie = `mock-session=${JSON.stringify({
      userId: 'new-user',
      role: 'admin',
      companyType,
      companyId: 'new-company',
    })}; path=/`

    setTimeout(() => {
      router.push(companyType === 'seller' ? '/seller/dashboard' : '/buyer/discover')
    }, 500)
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
      <h2 className="text-xl font-semibold text-slate-900 mb-1">Hesap Oluştur</h2>
      <p className="text-sm text-slate-500 mb-6">SupplyHub'a katılın</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Company type selector */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Hesap Türü
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setCompanyType('buyer')}
              className={`px-4 py-3 rounded-lg border text-sm font-medium transition-all ${
                companyType === 'buyer'
                  ? 'border-[#1e3a5f] bg-[#1e3a5f] text-white'
                  : 'border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              Alıcı
              <span className="block text-xs font-normal opacity-75 mt-0.5">
                Toptan satın al
              </span>
            </button>
            <button
              type="button"
              onClick={() => setCompanyType('seller')}
              className={`px-4 py-3 rounded-lg border text-sm font-medium transition-all ${
                companyType === 'seller'
                  ? 'border-[#1e3a5f] bg-[#1e3a5f] text-white'
                  : 'border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              Satıcı
              <span className="block text-xs font-normal opacity-75 mt-0.5">
                Ürün sat
              </span>
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Şirket Adı
          </label>
          <input
            type="text"
            required
            placeholder="Şirket adınız"
            className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Ad Soyad
          </label>
          <input
            type="text"
            required
            placeholder="Adınız ve soyadınız"
            className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            E-posta
          </label>
          <input
            type="email"
            required
            placeholder="ornek@sirket.com"
            className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Şifre
          </label>
          <input
            type="password"
            required
            placeholder="En az 8 karakter"
            className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f]"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 rounded-lg bg-[#1e3a5f] text-white text-sm font-medium hover:bg-[#16304f] transition-colors disabled:opacity-60"
        >
          {loading ? 'Yönlendiriliyor...' : 'Hesap Oluştur'}
        </button>
      </form>

      <div className="border-t border-slate-100 pt-4 mt-4 text-center">
        <p className="text-xs text-slate-400">
          Zaten hesabınız var mı?{' '}
          <Link href="/login" className="text-[#1e3a5f] font-medium hover:underline">
            Giriş Yap
          </Link>
        </p>
      </div>
    </div>
  )
}
