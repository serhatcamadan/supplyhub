'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { FormInput } from '@/components/ui/form-input'
import { FormSelect } from '@/components/ui/form-select'
import { FormError } from '@/components/ui/form-error'
import { updateMyProfile, updateMyCompany } from '@/lib/api/users'
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

  // Company fields
  const [companyName, setCompanyName] = useState(profile.companies?.name || '')
  const [industry, setIndustry]       = useState(profile.companies?.industry || '')

  // Password section
  const [showPasswordSection, setShowPasswordSection] = useState(false)
  const [currentPassword, setCurrentPassword]         = useState('')
  const [newPassword, setNewPassword]                 = useState('')
  const [confirmPassword, setConfirmPassword]         = useState('')
  const [showNewPw, setShowNewPw]                     = useState(false)
  const [showConfirmPw, setShowConfirmPw]             = useState(false)

  // Status
  const [saving, setSaving]   = useState(false)
  const [errors, setErrors]   = useState<Record<string, string>>({})

  const industryOptions = [
    { value: 'manufacturing', label: t('industries.manufacturing') },
    { value: 'retail',        label: t('industries.retail') },
    { value: 'food',          label: t('industries.food') },
    { value: 'electronics',   label: t('industries.electronics') },
    { value: 'apparel',       label: t('industries.apparel') },
    { value: 'other',         label: t('industries.other') },
  ]

  function validate() {
    const e: Record<string, string> = {}
    if (!name.trim())        e.name        = t('errors.nameRequired')
    if (!companyName.trim()) e.companyName = t('errors.companyNameRequired')
    if (showPasswordSection) {
      if (newPassword.length > 0 && newPassword.length < 8) e.newPassword     = t('password.tooShort')
      if (newPassword !== confirmPassword)                   e.confirmPassword = t('password.mismatch')
    }
    return e
  }

  async function handleSave() {
    const e = validate()
    if (Object.keys(e).length > 0) { setErrors(e); return }
    setErrors({})
    setSaving(true)
    try {
      const userPayload: Parameters<typeof updateMyProfile>[0] = { name: name.trim() }
      if (phone.trim()) userPayload.phone = phone.trim()
      if (showPasswordSection && newPassword) userPayload.password = newPassword

      const companyPayload: Parameters<typeof updateMyCompany>[0] = {
        name: companyName.trim(),
        industry: industry || undefined,
      }

      await Promise.all([
        updateMyProfile(userPayload),
        updateMyCompany(companyPayload),
      ])

      await refreshToken().catch(() => {})
      window.location.href = backHref
    } catch {
      setSaving(false)
      setErrors({ submit: t('errors.saveFailed') })
    }
  }

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

          {/* Avatar + summary card */}
          <section className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 p-8 flex items-center gap-6">
            <Avatar name={profile.name} size="xl" colorScheme="primary" />
            <div>
              <p className="text-lg font-semibold text-on-surface">{profile.name}</p>
              <p className="text-sm text-on-surface-variant mt-0.5">{profile.email}</p>
              <span className="inline-block mt-2 px-2 py-0.5 rounded-full text-xs font-semibold bg-primary-container/20 text-primary">
                {companyName || '—'} · {roleLabel}
              </span>
            </div>
          </section>

          {/* Personal Information */}
          <section className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 p-8 flex flex-col gap-6">
            <SectionHeader icon={<IconUser size={18} />} label={t('sections.personal')} />
            <FormInput
              id="name"
              label={t('fields.name')}
              value={name}
              onChange={(e) => { setName(e.target.value); clearError('name') }}
              error={errors.name}
            />
          </section>

          {/* Contact Details */}
          <section className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 p-8 flex flex-col gap-6">
            <SectionHeader icon={<IconMail size={18} />} label={t('sections.contact')} />

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

          {/* Company Information — editable */}
          <section className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 p-8 flex flex-col gap-6">
            <SectionHeader icon={<IconBuildingSkyscraper size={18} />} label={t('sections.company')} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput
                id="companyName"
                label={t('fields.companyName')}
                value={companyName}
                onChange={(e) => { setCompanyName(e.target.value); clearError('companyName') }}
                placeholder={t('fields.companyNamePlaceholder')}
                error={errors.companyName}
              />
              <FormSelect
                id="industry"
                label={t('fields.industry')}
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                options={industryOptions}
                placeholder={t('fields.industryPlaceholder')}
              />
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
              <SectionHeader icon={<IconShieldLock size={18} />} label={t('sections.account')} noBorder />
              <button
                type="button"
                onClick={() => { setShowPasswordSection((p) => !p); setErrors({}) }}
                className="text-xs font-semibold text-primary hover:underline"
              >
                {t('password.toggle')}
              </button>
            </div>

            {showPasswordSection ? (
              <div className="flex flex-col gap-5">
                <FormInput
                  id="currentPassword"
                  label={t('fields.currentPassword')}
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
                <PasswordField
                  id="newPassword"
                  label={t('fields.newPassword')}
                  hint={t('fields.newPasswordHint')}
                  value={newPassword}
                  show={showNewPw}
                  onToggle={() => setShowNewPw((p) => !p)}
                  onChange={(v) => { setNewPassword(v); clearError('newPassword') }}
                  error={errors.newPassword}
                />
                <PasswordField
                  id="confirmPassword"
                  label={t('fields.confirmPassword')}
                  value={confirmPassword}
                  show={showConfirmPw}
                  onToggle={() => setShowConfirmPw((p) => !p)}
                  onChange={(v) => { setConfirmPassword(v); clearError('confirmPassword') }}
                  error={errors.confirmPassword}
                />
              </div>
            ) : (
              <p className="text-sm text-on-surface-variant">••••••••••••</p>
            )}
          </section>

        </div>
      </div>
    </div>
  )

  function clearError(key: string) {
    setErrors((p) => ({ ...p, [key]: '' }))
  }
}

/* ── Small sub-components ── */

function SectionHeader({ icon, label, noBorder }: { icon: React.ReactNode; label: string; noBorder?: boolean }) {
  return (
    <div className={`flex items-center gap-3 ${noBorder ? '' : 'pb-4 border-b border-outline-variant/20'}`}>
      <span className="w-8 h-8 rounded-lg bg-primary-container/20 flex items-center justify-center text-primary">
        {icon}
      </span>
      <h2 className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">{label}</h2>
    </div>
  )
}

function PasswordField({
  id, label, hint, value, show, onToggle, onChange, error,
}: {
  id: string; label: string; hint?: string; value: string
  show: boolean; onToggle: () => void; onChange: (v: string) => void; error?: string
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-xs font-semibold tracking-wider text-on-surface-variant">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={show ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full pl-4 pr-10 py-3 rounded-lg text-sm text-on-surface outline-none transition-all bg-surface focus:bg-surface-container ${error ? 'ring-2 ring-error/60 border border-error/40' : ''}`}
        />
        <button type="button" onClick={onToggle} className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary">
          {show ? <IconEyeOff size={18} /> : <IconEye size={18} />}
        </button>
      </div>
      {error && <FormError message={error} />}
      {hint && !error && <p className="text-xs text-on-surface-variant/60">{hint}</p>}
    </div>
  )
}
