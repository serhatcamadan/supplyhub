'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import { Button } from '@/components/ui/button'
import { IconArrowLeft, IconMailCheck } from '@tabler/icons-react'

export default function ForgotPasswordPage() {
  const t = useTranslations('auth')
  const locale = useLocale()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sent, setSent] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const email = (new FormData(e.currentTarget).get('email') as string).trim()
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data.message ?? t('forgotPassword.errorGeneric'))
      } else {
        setSent(true)
      }
    } catch {
      setError(t('forgotPassword.errorGeneric'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <p className="text-2xl font-bold text-primary tracking-tight">SupplyHub</p>
          <p className="text-sm text-on-surface-variant mt-1">{t('login.tagline')}</p>
        </div>

        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm p-8 flex flex-col gap-6">
          {sent ? (
            <div className="flex flex-col items-center gap-4 py-4 text-center">
              <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center">
                <IconMailCheck size={32} className="text-secondary" />
              </div>
              <div>
                <p className="text-lg font-semibold text-on-surface">{t('forgotPassword.successHeading')}</p>
                <p className="text-sm text-on-surface-variant mt-2">{t('forgotPassword.successText')}</p>
              </div>
              <Link
                href={`/${locale}/login`}
                className="text-sm text-primary font-semibold hover:underline flex items-center gap-1 mt-2"
              >
                <IconArrowLeft size={16} />
                {t('forgotPassword.backToLogin')}
              </Link>
            </div>
          ) : (
            <>
              <div>
                <h2 className="text-xl font-semibold text-on-surface mb-1">{t('forgotPassword.heading')}</h2>
                <p className="text-sm text-on-surface-variant">{t('forgotPassword.subHeading')}</p>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                    {t('forgotPassword.email')}
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    className="w-full px-4 py-2.5 bg-surface border border-outline-variant/50 rounded-lg text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  />
                </div>
                {error && <p className="text-xs text-error">{error}</p>}
                <Button type="submit" variant="primary" disabled={loading} className="w-full">
                  {loading ? t('forgotPassword.submitting') : t('forgotPassword.submit')}
                </Button>
              </form>

              <p className="text-center text-xs text-on-surface-variant/60">
                {t('forgotPassword.rememberPassword')}{' '}
                <Link href={`/${locale}/login`} className="text-primary font-semibold hover:underline">
                  {t('forgotPassword.signIn')}
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
