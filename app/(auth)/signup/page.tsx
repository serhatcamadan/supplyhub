'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { FormInput } from '@/components/ui/form-input'
import { FormSelect } from '@/components/ui/form-select'
import { FormError } from '@/components/ui/form-error'
import { StepIndicator } from '@/components/ui/step-indicator'
import { RoleCard } from '@/components/auth/role-card'
import { Button } from '@/components/ui/button'

type Step = 1 | 2 | 3
type Role = 'seller' | 'buyer' | null

const step1Schema = z.object({
  name: z.string().min(2, 'Ad en az 2 karakter olmalı'),
  email: z.email('Geçerli bir e-posta adresi girin'),
  password: z.string().min(8, 'Şifre en az 8 karakter olmalı'),
})

const step3Schema = z.object({
  company: z.string().min(2, 'Şirket adı en az 2 karakter olmalı'),
  industry: z.string().min(1, 'Lütfen sektör seçin'),
})

type Step1Values = z.infer<typeof step1Schema>
type Step3Values = z.infer<typeof step3Schema>

const INDUSTRY_OPTIONS = [
  { value: 'manufacturing', label: 'Manufacturing' },
  { value: 'retail', label: 'Retail' },
  { value: 'food', label: 'Food & Beverage' },
  { value: 'electronics', label: 'Electronics' },
  { value: 'apparel', label: 'Apparel & Textiles' },
  { value: 'other', label: 'Other' },
]

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

export default function SignupPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>(1)
  const [role, setRole] = useState<Role>(null)
  const [roleError, setRoleError] = useState<string | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [step1Data, setStep1Data] = useState<Step1Values | null>(null)

  const form1 = useForm<Step1Values>({ resolver: zodResolver(step1Schema), defaultValues: { name: '', email: '', password: '' } })
  const form3 = useForm<Step3Values>({ resolver: zodResolver(step3Schema), defaultValues: { company: '', industry: '' } })

  function handleStep1Submit(data: Step1Values) {
    setStep1Data(data)
    setStep(2)
  }

  function handleStep2Continue() {
    if (!role) { setRoleError('Lütfen bir rol seçin'); return }
    setRoleError(null)
    setStep(3)
  }

  async function handleStep3Submit(data: Step3Values) {
    if (!step1Data || !role) return
    setLoading(true)
    setSubmitError(null)

    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: step1Data.name,
        email: step1Data.email,
        password: step1Data.password,
        companyName: data.company,
        companyType: role,
        role: 'admin',
      }),
    })

    const json = await res.json() as { error?: string; session?: { access_token: string; refresh_token: string }; companyType?: string }

    if (!res.ok || json.error) {
      setSubmitError(json.error ?? 'Kayıt sırasında hata oluştu.')
      setLoading(false)
      return
    }

    // Oturumu istemci tarafında yükle
    const supabase = createClient()
    await supabase.auth.setSession({
      access_token: json.session!.access_token,
      refresh_token: json.session!.refresh_token,
    })

    router.push(json.companyType === 'seller' ? '/seller/dashboard' : '/buyer/discover')
    router.refresh()
  }

  return (
    <main className="min-h-screen flex flex-col">
      <div className="flex-1 flex flex-col w-full max-w-250 mx-auto px-4 py-12 md:px-8">

        <div className="flex items-start justify-between mb-12 shrink-0">
          <div>
            <h1 className="text-[36px] leading-11 font-bold tracking-[-0.02em] text-on-surface">Create an Account</h1>
            <p className="text-base text-on-surface-variant mt-1 max-w-md">Join our platform to streamline your wholesale operations.</p>
          </div>
          <div className="hidden md:block mt-2">
            <StepIndicator totalSteps={3} currentStep={step} />
          </div>
        </div>

        <div className="flex-1 relative overflow-hidden" style={{ minHeight: '480px' }}>

          {/* Step 1: Hesap bilgileri */}
          <StepPanel stepNum={1} currentStep={step}>
            <div className="bg-surface-container-lowest p-8 rounded-xl shadow-lg w-full max-w-120">
              <form onSubmit={form1.handleSubmit(handleStep1Submit)} className="flex flex-col gap-6">
                <h2 className="text-[20px] leading-7 font-semibold text-on-surface">Account Details</h2>
                <div className="flex flex-col gap-4">
                  <FormInput label="Full Name" id="name" icon="person" placeholder="Jane Doe"
                    error={form1.formState.errors.name?.message} {...form1.register('name')} />
                  <FormInput label="Work Email" id="email" type="email" icon="mail" placeholder="jane@company.com"
                    error={form1.formState.errors.email?.message} {...form1.register('email')} />
                  <FormInput label="Password" id="password" type="password" icon="lock" placeholder="••••••••"
                    helperText="Must be at least 8 characters long."
                    error={form1.formState.errors.password?.message} {...form1.register('password')} />
                </div>
                <button type="submit" className="w-full bg-primary text-on-primary py-3 rounded-lg text-base font-semibold hover:bg-primary-container transition-colors flex items-center justify-center gap-2 mt-2">
                  Continue
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_forward</span>
                </button>
                <p className="text-center text-xs text-on-surface-variant/60">
                  Already have an account?{' '}
                  <Link href="/login" className="text-primary font-semibold hover:underline">Sign in</Link>
                </p>
              </form>
            </div>
          </StepPanel>

          {/* Step 2: Rol seçimi */}
          <StepPanel stepNum={2} currentStep={step}>
            <div className="w-full flex flex-col gap-8">
              <div className="text-center">
                <h2 className="text-[24px] leading-8 font-semibold tracking-[-0.01em] text-on-surface mb-2">How will you use the platform?</h2>
                <p className="text-sm text-on-surface-variant">Select your primary role to customize your experience.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <RoleCard selected={role === 'seller'} onSelect={() => { setRole('seller'); setRoleError(null) }}
                  icon="inventory_2" iconBg="bg-primary text-on-primary" title="I'm a Seller"
                  description="Manage inventory, process orders, and connect with wholesale buyers." />
                <RoleCard selected={role === 'buyer'} onSelect={() => { setRole('buyer'); setRoleError(null) }}
                  icon="local_mall" iconBg="bg-secondary text-on-secondary" title="I'm a Buyer"
                  description="Discover suppliers, place bulk orders, and track shipments." />
              </div>
              {roleError && <div className="flex justify-center"><FormError message={roleError} /></div>}
              <div className="flex justify-between">
                <Button variant="ghost" onClick={() => setStep(1)}>
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_back</span>
                  Back
                </Button>
                <Button
                  onClick={handleStep2Continue}
                  disabled={!role}
                  className="px-8 py-3 text-base"
                >
                  Continue
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_forward</span>
                </Button>
              </div>
            </div>
          </StepPanel>

          {/* Step 3: Şirket bilgileri */}
          <StepPanel stepNum={3} currentStep={step}>
            <div className="bg-surface-container-lowest p-8 rounded-xl shadow-lg w-full max-w-120">
              <form onSubmit={form3.handleSubmit(handleStep3Submit)} className="flex flex-col gap-6">
                <h2 className="text-[20px] leading-7 font-semibold text-on-surface">Company Information</h2>
                <div className="flex flex-col gap-4">
                  <FormInput label="Company Name" id="company" icon="business" placeholder="Acme Corp"
                    error={form3.formState.errors.company?.message} {...form3.register('company')} />
                  <FormSelect label="Industry" id="industry" icon="category" placeholder="Select Industry"
                    options={INDUSTRY_OPTIONS} error={form3.formState.errors.industry?.message} {...form3.register('industry')} />
                </div>
                {submitError && <FormError message={submitError} />}
                <div className="flex items-center justify-between pt-4 border-t border-surface-container-high">
                  <Button type="button" variant="ghost" size="sm" onClick={() => setStep(2)} disabled={loading} className="p-2">
                    <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>arrow_back</span>
                  </Button>
                  <Button type="submit" disabled={loading} className="flex-1 ml-4 py-3 text-base">
                    {loading ? 'Hesap oluşturuluyor…' : 'Complete Setup'}
                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>check_circle</span>
                  </Button>
                </div>
              </form>
            </div>
          </StepPanel>

        </div>
      </div>
    </main>
  )
}
