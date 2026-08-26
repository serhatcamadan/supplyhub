'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useTranslations, useLocale } from 'next-intl'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { IconCircleCheck, IconDatabase } from '@tabler/icons-react'

const DEMO_ACCOUNTS = [
  { email: 'ali@freshfarm.com',    name: 'Ali Yılmaz',   sub: 'FreshFarm Gıda A.Ş.',  badge: 'bg-primary/10 text-primary',     labelKey: 'login.demoLabels.sellerAdmin' },
  { email: 'ayse@gunespazar.com',  name: 'Ayşe Demir',   sub: 'Güneş Market Zinciri', badge: 'bg-secondary/10 text-secondary', labelKey: 'login.demoLabels.buyerAdmin'  },
  { email: 'fatma@gunespazar.com', name: 'Fatma Çelik',  sub: 'Güneş Market Zinciri', badge: 'bg-tertiary/10 text-tertiary',   labelKey: 'login.demoLabels.buyerStaff'  },
  { email: 'kemal@lezzet.com',     name: 'Kemal Arslan', sub: 'Lezzet Restoranları',  badge: 'bg-secondary/10 text-secondary', labelKey: 'login.demoLabels.buyerAdmin'  },
] as const

const DEMO_PASSWORD = 'Demo1234!'

type SeedState = 'idle' | 'loading' | 'ok' | 'error'

export default function LoginPage() {
  const router = useRouter()
  const t = useTranslations('auth')
  const locale = useLocale()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [seedState, setSeedState] = useState<SeedState>('idle')
  const [seedMsg, setSeedMsg] = useState<string | null>(null)

  async function handleSeed() {
    setSeedState('loading')
    setSeedMsg(null)
    try {
      const res = await fetch('/api/seed', { method: 'POST' })
      const data = await res.json()
      if (!res.ok) {
        setSeedState('error')
        setSeedMsg(data.error ?? t('login.seedFailed'))
      } else {
        setSeedState('ok')
        setSeedMsg(data.message ?? t('login.seedCompleted'))
      }
    } catch {
      setSeedState('error')
      setSeedMsg(t('login.seedNetworkError'))
    }
  }

  async function handleDemoLogin(email: string) {
    setLoading(true)
    setError(null)
    const supabase = createClient()
    const { data, error } = await supabase.auth.signInWithPassword({ email, password: DEMO_PASSWORD })

    if (error || !data.user) {
      setError(error?.message ?? t('login.errorFailed'))
      setLoading(false)
      return
    }

    const companyType = data.user.user_metadata?.company_type as string | undefined
    router.push(companyType === 'seller' ? `/${locale}/seller/dashboard` : `/${locale}/buyer/discover`)
    router.refresh()
  }

  async function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const form = new FormData(e.currentTarget)
    const email = form.get('email') as string
    const password = form.get('password') as string

    const supabase = createClient()
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })

    if (error || !data.user) {
      setError(error?.message ?? t('login.errorGeneric'))
      setLoading(false)
      return
    }

    const companyType = data.user.user_metadata?.company_type as string | undefined
    router.push(companyType === 'seller' ? `/${locale}/seller/dashboard` : `/${locale}/buyer/discover`)
    router.refresh()
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <p className="text-2xl font-bold text-primary tracking-tight">SupplyHub</p>
          <p className="text-sm text-on-surface-variant mt-1">{t('login.tagline')}</p>
        </div>

        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm p-8 flex flex-col gap-6">
          <div>
            <h2 className="text-xl font-semibold text-on-surface mb-1">{t('login.heading')}</h2>
            <p className="text-sm text-on-surface-variant">{t('login.subHeading')}</p>
          </div>

          <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                {t('login.email')}
              </label>
              <input id="email" name="email" type="email" required autoComplete="email" data-testid="email"
                className="w-full px-4 py-2.5 bg-surface border border-outline-variant/50 rounded-lg text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                {t('login.password')}
              </label>
              <input id="password" name="password" type="password" required autoComplete="current-password" data-testid="password"
                className="w-full px-4 py-2.5 bg-surface border border-outline-variant/50 rounded-lg text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
            </div>
            {error && <p className="text-xs text-error" data-testid="error-msg">{error}</p>}
            <Button type="submit" variant="primary" disabled={loading} className="w-full" data-testid="submit">
              {loading ? t('login.submitting') : t('login.submit')}
            </Button>
          </form>

          <div className="border-t border-outline-variant/40 pt-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant/50 mb-3">
              {t('login.demoSection')}
            </p>
            <div className="space-y-2">
              {DEMO_ACCOUNTS.map((acc) => (
                <button
                  key={acc.email}
                  onClick={() => handleDemoLogin(acc.email)}
                  disabled={loading}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-lg border border-outline-variant hover:border-primary/30 hover:bg-surface-container-low transition-colors group disabled:opacity-60"
                >
                  <div className="text-left">
                    <p className="text-sm font-medium text-on-surface">{acc.name}</p>
                    <p className="text-xs text-on-surface-variant">{acc.sub}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${acc.badge}`}>
                    {t(acc.labelKey)}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <p className="text-center text-xs text-on-surface-variant/60">
            {t('login.noAccount')}{' '}
            <Link href={`/${locale}/signup`} className="text-primary font-semibold hover:underline">
              {t('login.register')}
            </Link>
          </p>

          {/* Developer seed tool */}
          <div className="border-t border-outline-variant/30 pt-4 flex flex-col gap-2">
            <p className="text-xs text-on-surface-variant/40 uppercase tracking-wider font-semibold text-center">
              {t('login.devTools')}
            </p>
            <button
              onClick={handleSeed}
              disabled={seedState === 'loading' || seedState === 'ok'}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-dashed border-outline-variant rounded-lg text-xs text-on-surface-variant hover:border-primary/40 hover:text-primary transition-colors disabled:opacity-50"
            >
              {seedState === 'ok' ? <IconCircleCheck size={16} /> : <IconDatabase size={16} />}
              {seedState === 'loading'
                ? t('login.seedLoading')
                : seedState === 'ok'
                  ? t('login.seedDone')
                  : t('login.seedIdle')}
            </button>
            {seedMsg && (
              <p className={`text-xs text-center ${seedState === 'error' ? 'text-error' : 'text-secondary'}`}>
                {seedMsg}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
