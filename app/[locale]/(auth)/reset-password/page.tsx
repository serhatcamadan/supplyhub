'use client'

import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import { useTranslations, useLocale } from 'next-intl'
import { Button } from '@/components/ui/button'
import { IconCircleCheck, IconAlertCircle } from '@tabler/icons-react'

function ResetPasswordForm() {
  const t = useTranslations('auth')
  const locale = useLocale()
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const newPassword = form.get('newPassword') as string
    const confirmPassword = form.get('confirmPassword') as string

    if (newPassword !== confirmPassword) {
      setError(t('resetPassword.passwordMismatch'))
      return
    }

    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data.message ?? t('resetPassword.errorGeneric'))
      } else {
        setSuccess(true)
        setTimeout(() => router.push(`/${locale}/login`), 2500)
      }
    } catch {
      setError(t('resetPassword.errorGeneric'))
    } finally {
      setLoading(false)
    }
  }

  if (!token) {
    return (
      <div className="flex flex-col items-center gap-4 py-4 text-center">
        <div className="w-16 h-16 rounded-full bg-error-container/30 flex items-center justify-center">
          <IconAlertCircle size={32} className="text-error" />
        </div>
        <div>
          <p className="text-lg font-semibold text-on-surface">{t('resetPassword.invalidTokenHeading')}</p>
          <p className="text-sm text-on-surface-variant mt-2">{t('resetPassword.invalidToken')}</p>
        </div>
        <Link href={`/${locale}/forgot-password`} className="text-sm text-primary font-semibold hover:underline mt-2">
          {t('resetPassword.requestNew')}
        </Link>
      </div>
    )
  }

  if (success) {
    return (
      <div className="flex flex-col items-center gap-4 py-4 text-center">
        <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center">
          <IconCircleCheck size={32} className="text-secondary" />
        </div>
        <div>
          <p className="text-lg font-semibold text-on-surface">{t('resetPassword.successHeading')}</p>
          <p className="text-sm text-on-surface-variant mt-2">{t('resetPassword.successText')}</p>
        </div>
        <Link href={`/${locale}/login`} className="text-sm text-primary font-semibold hover:underline mt-2">
          {t('resetPassword.backToLogin')}
        </Link>
      </div>
    )
  }

  return (
    <>
      <div>
        <h2 className="text-xl font-semibold text-on-surface mb-1">{t('resetPassword.heading')}</h2>
        <p className="text-sm text-on-surface-variant">{t('resetPassword.subHeading')}</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="newPassword" className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
            {t('resetPassword.newPassword')}
          </label>
          <input
            id="newPassword"
            name="newPassword"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            className="w-full px-4 py-2.5 bg-surface border border-outline-variant/50 rounded-lg text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="confirmPassword" className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
            {t('resetPassword.confirmPassword')}
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            className="w-full px-4 py-2.5 bg-surface border border-outline-variant/50 rounded-lg text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
          />
        </div>
        {error && <p className="text-xs text-error">{error}</p>}
        <Button type="submit" variant="primary" disabled={loading} className="w-full">
          {loading ? t('resetPassword.submitting') : t('resetPassword.submit')}
        </Button>
      </form>
    </>
  )
}

export default function ResetPasswordPage() {
  const t = useTranslations('auth')

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <p className="text-2xl font-bold text-primary tracking-tight">SupplyHub</p>
          <p className="text-sm text-on-surface-variant mt-1">{t('login.tagline')}</p>
        </div>
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm p-8 flex flex-col gap-6">
          <Suspense>
            <ResetPasswordForm />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
