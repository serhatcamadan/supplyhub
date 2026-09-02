'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTranslations, useLocale } from 'next-intl'
import { cn } from '@/lib/utils'
import { FormInput } from '@/components/ui/form-input'
import { FormSelect } from '@/components/ui/form-select'
import { FormError } from '@/components/ui/form-error'
import { StepIndicator } from '@/components/ui/step-indicator'
import { RoleCard } from '@/components/auth/role-card'
import { Button } from '@/components/ui/button'
import {
  IconArrowLeft, IconArrowRight, IconBuilding, IconCategory,
  IconCircleCheck, IconLock, IconMail, IconPackage, IconRefresh,
  IconShoppingBag, IconUser,
} from '@tabler/icons-react'

type Step = 1 | 2 | 3 | 4
type Role = 'seller' | 'buyer' | null

const RESEND_COOLDOWN = 60 // saniye

const _step1Schema = z.object({
  name: z.string().min(2),
  email: z.email(),
  password: z.string().min(8),
})
const _step3Schema = z.object({
  company: z.string().min(2),
  industry: z.string().min(1),
})
type Step1Values = z.infer<typeof _step1Schema>
type Step3Values = z.infer<typeof _step3Schema>

function StepPanel({ stepNum, currentStep, children }: { stepNum: number; currentStep: number; children: React.ReactNode }) {
  return (
    <div className={cn(
      'absolute inset-0 flex items-center justify-center transition-all duration-500 ease-in-out',
      stepNum === currentStep ? 'opacity-100 translate-x-0 pointer-events-auto'
        : stepNum < currentStep ? 'opacity-0 -translate-x-full pointer-events-none'
        : 'opacity-0 translate-x-full pointer-events-none'
    )}>
      {children}
    </div>
  )
}

// 6 ayrı kutucuklu OTP girişi
function OtpInput({ value, onChange, disabled, autoFocus }: { value: string; onChange: (v: string) => void; disabled?: boolean; autoFocus?: boolean }) {
  const refs = useRef<(HTMLInputElement | null)[]>(Array(6).fill(null))

  useEffect(() => {
    if (autoFocus) refs.current[0]?.focus()
  }, [autoFocus])

  function focus(idx: number) { refs.current[idx]?.focus() }

  function handleChange(idx: number, char: string) {
    if (!/^\d*$/.test(char)) return
    const digits = value.split('')
    digits[idx] = char.slice(-1)
    const next = digits.join('').slice(0, 6)
    onChange(next)
    if (char && idx < 5) focus(idx + 1)
  }

  function handleKeyDown(idx: number, e: React.KeyboardEvent) {
    if (e.key === 'Backspace' && !value[idx] && idx > 0) focus(idx - 1)
  }

  function handlePaste(e: React.ClipboardEvent) {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    onChange(pasted)
    focus(Math.min(pasted.length, 5))
  }

  return (
    <div className="flex gap-3 justify-center">
      {Array.from({ length: 6 }).map((_, i) => (
        <input
          key={i}
          ref={(el) => { refs.current[i] = el }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[i] ?? ''}
          disabled={disabled}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          className={cn(
            'w-12 h-14 text-center text-xl font-bold rounded-xl border-2 transition-all outline-none',
            'bg-surface text-on-surface',
            value[i]
              ? 'border-primary bg-primary/5'
              : 'border-outline-variant focus:border-primary',
            disabled && 'opacity-50 cursor-not-allowed',
          )}
        />
      ))}
    </div>
  )
}

export default function SignupPage() {
  const router = useRouter()
  const t = useTranslations('auth')
  const locale = useLocale()

  const [step, setStep] = useState<Step>(1)
  const [role, setRole] = useState<Role>(null)
  const [roleError, setRoleError] = useState<string | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [step1Data, setStep1Data] = useState<Step1Values | null>(null)

  // OTP state
  const [otp, setOtp] = useState('')
  const [otpError, setOtpError] = useState<string | null>(null)
  const [otpLoading, setOtpLoading] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)
  const cooldownRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const startCooldown = useCallback(() => {
    setResendCooldown(RESEND_COOLDOWN)
    cooldownRef.current = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) { clearInterval(cooldownRef.current!); return 0 }
        return prev - 1
      })
    }, 1000)
  }, [])

  useEffect(() => () => { if (cooldownRef.current) clearInterval(cooldownRef.current) }, [])

  const form1 = useForm<Step1Values>({
    resolver: zodResolver(z.object({
      name: z.string().min(2, t('validation.nameMin')),
      email: z.email(t('validation.emailInvalid')),
      password: z.string().min(8, t('validation.passwordMin')),
    })),
    defaultValues: { name: '', email: '', password: '' },
  })

  const form3 = useForm<Step3Values>({
    resolver: zodResolver(z.object({
      company: z.string().min(2, t('validation.companyMin')),
      industry: z.string().min(1, t('validation.industryRequired')),
    })),
    defaultValues: { company: '', industry: '' },
  })

  const industryOptions = [
    { value: 'manufacturing', label: t('signup.industries.manufacturing') },
    { value: 'retail',        label: t('signup.industries.retail') },
    { value: 'food',          label: t('signup.industries.food') },
    { value: 'electronics',   label: t('signup.industries.electronics') },
    { value: 'apparel',       label: t('signup.industries.apparel') },
    { value: 'other',         label: t('signup.industries.other') },
  ]

  function handleStep1Submit(data: Step1Values) {
    setStep1Data(data)
    setStep(2)
  }

  function handleStep2Continue() {
    if (!role) { setRoleError(t('signup.step2.roleRequired')); return }
    setRoleError(null)
    setStep(3)
  }

  async function sendVerificationCode(): Promise<{ ok: boolean; error?: string }> {
    if (!step1Data) return { ok: false }
    setLoading(true)

    try {
      const res = await fetch('/api/auth/send-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: step1Data.email }),
      })

      const json = await res.json() as { message?: string | string[] }

      if (!res.ok) {
        const msg = typeof json.message === 'string'
          ? json.message
          : Array.isArray(json.message) ? json.message[0] : t('signup.step3.errorGeneric')
        return { ok: false, error: msg }
      }

      return { ok: true }
    } catch {
      return { ok: false, error: t('signup.step3.errorGeneric') }
    } finally {
      setLoading(false)
    }
  }

  async function handleStep3Submit(data: Step3Values) {
    if (!step1Data || !role) return
    setSubmitError(null)

    const { ok, error } = await sendVerificationCode()
    if (!ok) { setSubmitError(error ?? t('signup.step3.errorGeneric')); return }

    setOtp('')
    setOtpError(null)
    startCooldown()
    setStep(4)
  }

  async function handleResend() {
    if (resendCooldown > 0 || !step1Data) return
    setOtpError(null)
    const { ok, error } = await sendVerificationCode()
    if (ok) {
      startCooldown()
    } else {
      setOtpError(error ?? t('signup.step4.errorGeneric'))
    }
  }

  async function handleOtpSubmit() {
    if (otp.length !== 6 || !step1Data || !role) return
    setOtpLoading(true)
    setOtpError(null)

    const form3Values = form3.getValues()

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: step1Data.name,
          email: step1Data.email,
          password: step1Data.password,
          companyName: form3Values.company,
          companyType: role,
          verificationCode: otp,
        }),
      })

      const json = await res.json() as { message?: string | string[]; user?: { companyType: string } }

      if (!res.ok) {
        const msg = typeof json.message === 'string'
          ? json.message
          : Array.isArray(json.message) ? json.message[0] : t('signup.step4.errorGeneric')
        setOtpError(msg)
        return
      }

      const companyType = json.user?.companyType ?? role
      router.push(companyType === 'seller' ? `/${locale}/seller/dashboard` : `/${locale}/buyer/discover`)
      router.refresh()
    } catch {
      setOtpError(t('signup.step4.errorGeneric'))
    } finally {
      setOtpLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex flex-col">
      <div className="flex-1 flex flex-col w-full max-w-250 mx-auto px-4 py-12 md:px-8">

        <div className="flex items-start justify-between mb-12 shrink-0">
          <div>
            <h1 className="text-[36px] leading-11 font-bold tracking-[-0.02em] text-on-surface">{t('signup.heading')}</h1>
            <p className="text-base text-on-surface-variant mt-1 max-w-md">{t('signup.subHeading')}</p>
          </div>
          <div className="hidden md:block mt-2">
            <StepIndicator totalSteps={4} currentStep={step} />
          </div>
        </div>

        <div className="flex-1 relative overflow-hidden" style={{ minHeight: '520px' }}>

          {/* Step 1 — Hesap Bilgileri */}
          <StepPanel stepNum={1} currentStep={step}>
            <div className="bg-surface-container-lowest p-8 rounded-xl shadow-lg w-full max-w-120">
              <form onSubmit={form1.handleSubmit(handleStep1Submit)} className="flex flex-col gap-6">
                <h2 className="text-[20px] leading-7 font-semibold text-on-surface">{t('signup.step1.heading')}</h2>
                <div className="flex flex-col gap-4">
                  <FormInput label={t('signup.step1.fullName')} id="name" icon={IconUser} placeholder="Jane Doe"
                    error={form1.formState.errors.name?.message} {...form1.register('name')} />
                  <FormInput label={t('signup.step1.workEmail')} id="email" type="email" icon={IconMail} placeholder="jane@company.com"
                    error={form1.formState.errors.email?.message} {...form1.register('email')} />
                  <FormInput label={t('signup.step1.password')} id="password" type="password" icon={IconLock} placeholder="••••••••"
                    helperText={t('signup.step1.passwordHelper')}
                    error={form1.formState.errors.password?.message} {...form1.register('password')} />
                </div>
                <button type="submit" className="w-full bg-primary text-on-primary py-3 rounded-lg text-base font-semibold hover:bg-primary-container transition-colors flex items-center justify-center gap-2 mt-2">
                  {t('signup.step1.submit')}
                  <IconArrowRight size={18} />
                </button>
                <p className="text-center text-xs text-on-surface-variant/60">
                  {t('signup.step1.alreadyHave')}{' '}
                  <Link href={`/${locale}/login`} className="text-primary font-semibold hover:underline">
                    {t('signup.step1.signIn')}
                  </Link>
                </p>
              </form>
            </div>
          </StepPanel>

          {/* Step 2 — Rol Seçimi */}
          <StepPanel stepNum={2} currentStep={step}>
            <div className="w-full flex flex-col gap-8">
              <div className="text-center">
                <h2 className="text-[24px] leading-8 font-semibold tracking-[-0.01em] text-on-surface mb-2">
                  {t('signup.step2.heading')}
                </h2>
                <p className="text-sm text-on-surface-variant">{t('signup.step2.subHeading')}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <RoleCard selected={role === 'seller'} onSelect={() => { setRole('seller'); setRoleError(null) }}
                  icon={IconPackage} iconBg="bg-primary text-on-primary"
                  title={t('signup.step2.sellerTitle')}
                  description={t('signup.step2.sellerDescription')} />
                <RoleCard selected={role === 'buyer'} onSelect={() => { setRole('buyer'); setRoleError(null) }}
                  icon={IconShoppingBag} iconBg="bg-secondary text-on-secondary"
                  title={t('signup.step2.buyerTitle')}
                  description={t('signup.step2.buyerDescription')} />
              </div>
              {roleError && <div className="flex justify-center"><FormError message={roleError} /></div>}
              <div className="flex justify-between">
                <Button variant="ghost" onClick={() => setStep(1)}>
                  <IconArrowLeft size={18} />
                  {t('signup.step2.back')}
                </Button>
                <Button onClick={handleStep2Continue} disabled={!role} className="px-8 py-3 text-base">
                  {t('signup.step2.continue')}
                  <IconArrowRight size={18} />
                </Button>
              </div>
            </div>
          </StepPanel>

          {/* Step 3 — Şirket Bilgileri */}
          <StepPanel stepNum={3} currentStep={step}>
            <div className="bg-surface-container-lowest p-8 rounded-xl shadow-lg w-full max-w-120">
              <form onSubmit={form3.handleSubmit(handleStep3Submit)} className="flex flex-col gap-6">
                <h2 className="text-[20px] leading-7 font-semibold text-on-surface">{t('signup.step3.heading')}</h2>
                <div className="flex flex-col gap-4">
                  <FormInput label={t('signup.step3.companyName')} id="company" icon={IconBuilding} placeholder="Acme Corp"
                    error={form3.formState.errors.company?.message} {...form3.register('company')} />
                  <FormSelect label={t('signup.step3.industry')} id="industry" icon={IconCategory}
                    placeholder={t('signup.step3.industryPlaceholder')}
                    options={industryOptions} error={form3.formState.errors.industry?.message} {...form3.register('industry')} />
                </div>
                {submitError && <FormError message={submitError} />}
                <div className="flex items-center justify-between pt-4 border-t border-surface-container-high">
                  <Button type="button" variant="ghost" size="sm" onClick={() => setStep(2)} disabled={loading} className="p-2">
                    <IconArrowLeft size={20} />
                  </Button>
                  <Button type="submit" disabled={loading} className="flex-1 ml-4 py-3 text-base">
                    {loading ? t('signup.step3.submitting') : t('signup.step3.submit')}
                    <IconArrowRight size={18} />
                  </Button>
                </div>
              </form>
            </div>
          </StepPanel>

          {/* Step 4 — E-posta Doğrulama */}
          <StepPanel stepNum={4} currentStep={step}>
            <div className="bg-surface-container-lowest p-8 rounded-xl shadow-lg w-full max-w-120 flex flex-col gap-6">

              {/* Başlık */}
              <div className="text-center space-y-2">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-1">
                  <IconMail className="text-primary" size={28} />
                </div>
                <h2 className="text-[20px] leading-7 font-semibold text-on-surface">
                  {t('signup.step4.heading')}
                </h2>
                <p className="text-sm text-on-surface-variant">
                  {t.rich('signup.step4.description', {
                    email: step1Data?.email ?? '',
                    strong: (chunks) => <span className="font-medium text-on-surface">{chunks}</span>,
                  })}
                </p>
              </div>

              {/* OTP Kutucukları */}
              <OtpInput value={otp} onChange={setOtp} disabled={otpLoading} autoFocus={step === 4} />

              {/* Hata */}
              {otpError && <FormError message={otpError} />}

              {/* Gönder butonu */}
              <Button
                onClick={handleOtpSubmit}
                disabled={otp.length !== 6 || otpLoading}
                className="w-full py-3 text-base"
              >
                {otpLoading ? t('signup.step4.verifying') : t('signup.step4.submit')}
                <IconCircleCheck size={18} />
              </Button>

              {/* Tekrar gönder */}
              <div className="text-center">
                {resendCooldown > 0 ? (
                  <p className="text-sm text-on-surface-variant">
                    {t('signup.step4.resendWait', { seconds: resendCooldown })}
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={loading}
                    className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline disabled:opacity-50"
                  >
                    <IconRefresh size={15} />
                    {t('signup.step4.resend')}
                  </button>
                )}
              </div>

              {/* Geri */}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => { setStep(3); setOtp(''); setOtpError(null) }}
                disabled={otpLoading}
                className="self-start -mt-2"
              >
                <IconArrowLeft size={16} />
                {t('signup.step4.back')}
              </Button>

            </div>
          </StepPanel>

        </div>
      </div>
    </main>
  )
}
