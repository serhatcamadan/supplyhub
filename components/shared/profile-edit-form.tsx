'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { FormInput } from '@/components/ui/form-input'
import { FormError } from '@/components/ui/form-error'
import { updateMyProfile } from '@/lib/api/users'
import type { UserProfile } from '@/lib/api/users'
import { refreshToken } from '@/lib/api/auth'
import {
  IconChevronRight,
  IconDeviceFloppy,
  IconX,
  IconMail,
  IconPhone,
  IconBuildingSkyscraper,
  IconShieldLock,
  IconEye,
  IconEyeOff,
  IconCircleCheck,
  IconUser,
} from '@tabler/icons-react'

interface Props {
  profile: UserProfile
  portal: 'seller' | 'buyer'
}

export function ProfileEditForm({ profile, portal }: Props) {
  const t = useTranslations('common.profileEdit')
  const locale = useLocale()
  const router = useRouter()

  const backHref = `/${locale}/${portal}/dashboard`

  // Personal fields
  const [name, setName]   = useState(profile.name)
  const [phone, setPhone] = useState(profile.phone ?? '')

  // Password section
  const [showPasswordSection, setShowPasswordSection] = useState(false)
  const [currentPassword, setCurrentPassword]         = useState('')
  const [newPassword, setNewPassword]                 = useState('')
  const [confirmPassword, setConfirmPassword]         = useState('')
  const [showNewPw, setShowNewPw]                     = useState(false)
  const [showConfirmPw, setShowConfirmPw]             = useState(false)

  // Status
  const [saving, setSaving]     = useState(false)
  const [success, setSuccess]   = useState(false)
  const [errors, setErrors]     = useState<Record<string, string>>({})

  function validate() {
    const e: Record<string, string> = {}
    if (!name.trim()) e.name = t('errors.nameRequired')
    if (showPasswordSection) {
      if (newPassword.length > 0 && newPassword.length < 8) e.newPassword = t('password.tooShort')
      if (newPassword !== confirmPassword) e.confirmPassword = t('password.mismatch')
    }
    return e
  }

  async function handleSave() {
    setSuccess(false)
    const e = validate()
    if (Object.keys(e).length > 0) { setErrors(e); return }
    setErrors({})
    setSaving(true)
    try {
      const payload: Parameters<typeof updateMyProfile>[0] = { name: name.trim() }
      // phone only sent when non-empty; backend validates unknown fields strictly
      if (phone.trim()) payload.phone = phone.trim()
      if (showPasswordSection && newPassword) payload.password = newPassword
      await updateMyProfile(payload)
      // Refresh JWT cookie so server components (Topbar, ProfileButton) pick up new name
      await refreshToken().catch(() => {})
      // Hard navigate — guarantees layout re-renders with fresh cookie
      window.location.href = backHref
    } catch {
      setSaving(false)
      setErrors({ submit: t('errors.saveFailed') })
    }
  }

  const companyLabel = profile.companies?.name || '—'
  const roleLabel = profile.role === 'admin' ? 'Admin' : 'Staff'

  return (
    <div className="flex flex-col w-full min-h-full">

      {/* Page header */}
      <div className="flex items-center justify-between px-8 py-8 border-b border-outline-variant/20 bg-surface sticky top-16 z-10">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-2">
            <Link href={backHref} className="hover:text-primary transition-colors">
              {t('breadcrumbSettings')}
            </Link>
            <IconChevronRight size={14} />
            <span className="text-on-surface">{t('heading')}</span>
          </div>
          <h1 className="text-2xl font-semibold text-on-surface tracking-tight">{t('heading')}</h1>
        </div>
        <div className="flex items-center gap-3">
          {success && (
            <span className="flex items-center gap-1.5 text-sm text-secondary font-medium">
              <IconCircleCheck size={16} />
              {t('saveSuccess')}
            </span>
          )}
          {errors.submit && <FormError message={errors.submit} />}
          <Link
            href={backHref}
            className="px-4 py-2 rounded-xl text-sm font-semibold text-on-surface hover:bg-surface-container-high transition-colors flex items-center gap-2"
          >
            <IconX size={16} />
            {t('cancel')}
          </Link>
          <Button variant="secondary" onClick={handleSave} disabled={saving} className="active:scale-[0.98]">
            <IconDeviceFloppy size={18} />
            {saving ? t('saving') : t('saveChanges')}
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-8 py-8">
        <div className="max-w-3xl mx-auto flex flex-col gap-8">

          {/* Avatar + name card */}
          <section className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 p-8 flex items-center gap-6">
            <Avatar name={profile.name} size="xl" colorScheme="primary" />
            <div>
              <p className="text-lg font-semibold text-on-surface">{profile.name}</p>
              <p className="text-sm text-on-surface-variant mt-0.5">{profile.email}</p>
              <span className="inline-block mt-2 px-2 py-0.5 rounded-full text-xs font-semibold bg-primary-container/20 text-primary">
                {companyLabel} · {roleLabel}
              </span>
            </div>
          </section>

          {/* Personal Information */}
          <section className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 p-8 flex flex-col gap-6">
            <div className="flex items-center gap-3 pb-4 border-b border-outline-variant/20">
              <span className="w-8 h-8 rounded-lg bg-primary-container/20 flex items-center justify-center text-primary">
                <IconUser size={18} />
              </span>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-on-surface-variant">
                {t('sections.personal')}
              </h2>
            </div>
            <FormInput
              id="name"
              label={t('fields.name')}
              value={name}
              onChange={(e) => { setName(e.target.value); setErrors((p) => ({ ...p, name: '' })) }}
              error={errors.name}
            />
          </section>

          {/* Contact Details */}
          <section className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 p-8 flex flex-col gap-6">
            <div className="flex items-center gap-3 pb-4 border-b border-outline-variant/20">
              <span className="w-8 h-8 rounded-lg bg-primary-container/20 flex items-center justify-center text-primary">
                <IconMail size={18} />
              </span>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-on-surface-variant">
                {t('sections.contact')}
              </h2>
            </div>

            {/* Email — read-only */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold tracking-wider text-on-surface-variant">
                {t('fields.email')}
              </label>
              <div className="relative flex items-center">
                <IconMail size={18} className="absolute left-3 text-on-surface-variant/50 pointer-events-none" />
                <input
                  readOnly
                  value={profile.email}
                  className="w-full pl-10 pr-28 py-3 rounded-lg bg-surface-container text-on-surface/60 text-sm cursor-not-allowed outline-none"
                />
                <span className="absolute right-3 flex items-center gap-1 px-2 py-0.5 bg-secondary-container text-on-secondary-container rounded-full text-xs font-semibold">
                  <IconCircleCheck size={12} />
                  {t('fields.emailVerified')}
                </span>
              </div>
              <p className="text-xs text-on-surface-variant/60">{t('fields.emailReadOnly')}</p>
            </div>

            {/* Phone */}
            <FormInput
              id="phone"
              label={t('fields.phone')}
              icon={IconPhone}
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={t('fields.phonePlaceholder')}
            />
          </section>

          {/* Company Information — read-only */}
          <section className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 p-8 flex flex-col gap-6">
            <div className="flex items-center gap-3 pb-4 border-b border-outline-variant/20">
              <span className="w-8 h-8 rounded-lg bg-primary-container/20 flex items-center justify-center text-primary">
                <IconBuildingSkyscraper size={18} />
              </span>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-on-surface-variant">
                {t('sections.company')}
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold tracking-wider text-on-surface-variant">
                  {t('fields.company')}
                </label>
                <input
                  readOnly
                  value={companyLabel}
                  className="w-full px-4 py-3 rounded-lg bg-surface-container text-on-surface/60 text-sm cursor-not-allowed outline-none"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold tracking-wider text-on-surface-variant">
                  {t('fields.role')}
                </label>
                <input
                  readOnly
                  value={roleLabel}
                  className="w-full px-4 py-3 rounded-lg bg-surface-container text-on-surface/60 text-sm cursor-not-allowed outline-none"
                />
              </div>
            </div>
          </section>

          {/* Account Security — password change */}
          <section className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 p-8 flex flex-col gap-6">
            <div className="flex items-center justify-between pb-4 border-b border-outline-variant/20">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-primary-container/20 flex items-center justify-center text-primary">
                  <IconShieldLock size={18} />
                </span>
                <h2 className="text-sm font-semibold uppercase tracking-wider text-on-surface-variant">
                  {t('sections.account')}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => { setShowPasswordSection((p) => !p); setErrors({}) }}
                className="text-xs font-semibold text-primary hover:underline"
              >
                {t('password.toggle')}
              </button>
            </div>

            {showPasswordSection && (
              <div className="flex flex-col gap-5">
                <FormInput
                  id="currentPassword"
                  label={t('fields.currentPassword')}
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
                <div className="flex flex-col gap-2">
                  <label htmlFor="newPassword" className="text-xs font-semibold tracking-wider text-on-surface-variant">
                    {t('fields.newPassword')}
                  </label>
                  <div className="relative">
                    <input
                      id="newPassword"
                      type={showNewPw ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => { setNewPassword(e.target.value); setErrors((p) => ({ ...p, newPassword: '' })) }}
                      className={`w-full pl-4 pr-10 py-3 rounded-lg text-sm text-on-surface outline-none transition-all bg-surface focus:bg-surface-container ${errors.newPassword ? 'ring-2 ring-error/60 border border-error/40' : ''}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPw((p) => !p)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary"
                    >
                      {showNewPw ? <IconEyeOff size={18} /> : <IconEye size={18} />}
                    </button>
                  </div>
                  {errors.newPassword && <FormError message={errors.newPassword} />}
                  <p className="text-xs text-on-surface-variant/60">{t('fields.newPasswordHint')}</p>
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="confirmPassword" className="text-xs font-semibold tracking-wider text-on-surface-variant">
                    {t('fields.confirmPassword')}
                  </label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      type={showConfirmPw ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => { setConfirmPassword(e.target.value); setErrors((p) => ({ ...p, confirmPassword: '' })) }}
                      className={`w-full pl-4 pr-10 py-3 rounded-lg text-sm text-on-surface outline-none transition-all bg-surface focus:bg-surface-container ${errors.confirmPassword ? 'ring-2 ring-error/60 border border-error/40' : ''}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPw((p) => !p)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary"
                    >
                      {showConfirmPw ? <IconEyeOff size={18} /> : <IconEye size={18} />}
                    </button>
                  </div>
                  {errors.confirmPassword && <FormError message={errors.confirmPassword} />}
                </div>
              </div>
            )}

            {!showPasswordSection && (
              <p className="text-sm text-on-surface-variant">••••••••••••</p>
            )}
          </section>

        </div>
      </div>
    </div>
  )
}
