'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { cn } from '@/lib/utils'
import { FormInput } from '@/components/ui/form-input'
import { FormSelect } from '@/components/ui/form-select'
import { FormError } from '@/components/ui/form-error'
import { StepIndicator } from '@/components/ui/step-indicator'
import { RoleCard } from '@/components/auth/role-card'

type Step = 1 | 2 | 3
type Role = 'seller' | 'buyer' | null

const step1Schema = z.object({
  name: z.string().min(2, 'Ad en az 2 karakter olmalı'),
  email: z.string().email('Geçerli bir e-posta adresi girin'),
  password: z.string().min(8, 'Şifre en az 8 karakter olmalı'),
})

const step3Schema = z.object({
  company: z.string().min(2, 'Şirket adı en az 2 karakter olmalı'),
  industry: z.string().min(1, 'Lütfen sektör seçin'),
  tax: z.string().optional(),
})

type Step1Values = z.infer<typeof step1Schema>
type Step3Values = z.infer<typeof step3Schema>

const INDUSTRY_OPTIONS = [
  { value: 'manufacturing', label: 'Manufacturing' },
  { value: 'retail', label: 'Retail' },
  { value: 'electronics', label: 'Electronics' },
  { value: 'apparel', label: 'Apparel & Textiles' },
  { value: 'food', label: 'Food & Beverage' },
  { value: 'other', label: 'Other' },
]

// Local helper — slides step panels horizontally based on position relative to current
function StepPanel({
  stepNum,
  currentStep,
  children,
}: {
  stepNum: number
  currentStep: number
  children: React.ReactNode
}) {
  return (
    <div
      className={cn(
        'absolute inset-0 flex items-center justify-center transition-all duration-500 ease-in-out',
        stepNum === currentStep
          ? 'opacity-100 translate-x-0 pointer-events-auto'
          : stepNum < currentStep
            ? 'opacity-0 -translate-x-full pointer-events-none'
            : 'opacity-0 translate-x-full pointer-events-none'
      )}
    >
      {children}
    </div>
  )
}

export default function SignupPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>(1)
  const [role, setRole] = useState<Role>(null)
  const [roleError, setRoleError] = useState<string | null>(null)

  const form1 = useForm<Step1Values>({
    resolver: zodResolver(step1Schema),
    defaultValues: { name: '', email: '', password: '' },
  })

  const form3 = useForm<Step3Values>({
    resolver: zodResolver(step3Schema),
    defaultValues: { company: '', industry: '', tax: '' },
  })

  function handleStep1Submit(data: Step1Values) {
    void data
    setStep(2)
  }

  function handleStep2Continue() {
    if (!role) {
      setRoleError('Lütfen bir rol seçin')
      return
    }
    setRoleError(null)
    setStep(3)
  }

  function handleStep3Submit(data: Step3Values) {
    void data
    document.cookie = `mock-session=${JSON.stringify({
      userId: 'new-user',
      role: 'admin',
      companyType: role,
      companyId: 'new-company',
    })}; path=/`
    router.push(role === 'seller' ? '/seller/dashboard' : '/buyer/discover')
  }

  return (
    <main className="min-h-screen flex flex-col">
      <div className="flex-1 flex flex-col w-full max-w-250 mx-auto px-4 py-12 md:px-8">

        {/* Header */}
        <div className="flex items-start justify-between mb-12 shrink-0">
          <div>
            <h1 className="text-[36px] leading-11 font-bold tracking-[-0.02em] text-on-surface">
              Create an Account
            </h1>
            <p className="text-base text-on-surface-variant mt-1 max-w-md">
              Join our platform to streamline your wholesale operations.
            </p>
          </div>
          <div className="hidden md:block mt-2">
            <StepIndicator totalSteps={3} currentStep={step} />
          </div>
        </div>

        {/* Steps container */}
        <div className="flex-1 relative overflow-hidden" style={{ minHeight: '480px' }}>

          {/* ── Step 1: Account Details ── */}
          <StepPanel stepNum={1} currentStep={step}>
            <div className="bg-surface-container-lowest p-8 rounded-xl shadow-lg w-full max-w-120">
              <form onSubmit={form1.handleSubmit(handleStep1Submit)} className="flex flex-col gap-6">
                <h2 className="text-[20px] leading-7 font-semibold text-on-surface">
                  Account Details
                </h2>
                <div className="flex flex-col gap-4">
                  <FormInput
                    label="Full Name"
                    id="name"
                    icon="person"
                    placeholder="Jane Doe"
                    error={form1.formState.errors.name?.message}
                    {...form1.register('name')}
                  />
                  <FormInput
                    label="Work Email"
                    id="email"
                    type="email"
                    icon="mail"
                    placeholder="jane@company.com"
                    error={form1.formState.errors.email?.message}
                    {...form1.register('email')}
                  />
                  <FormInput
                    label="Password"
                    id="password"
                    type="password"
                    icon="lock"
                    placeholder="••••••••"
                    helperText="Must be at least 8 characters long."
                    error={form1.formState.errors.password?.message}
                    {...form1.register('password')}
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-primary text-on-primary py-3 rounded-lg text-base font-semibold hover:bg-primary-container transition-colors flex items-center justify-center gap-2 mt-2"
                >
                  Continue
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                    arrow_forward
                  </span>
                </button>
                <p className="text-center text-xs text-on-surface-variant/60">
                  Already have an account?{' '}
                  <Link href="/login" className="text-primary font-semibold hover:underline">
                    Sign in
                  </Link>
                </p>
              </form>
            </div>
          </StepPanel>

          {/* ── Step 2: Role Selection ── */}
          <StepPanel stepNum={2} currentStep={step}>
            <div className="w-full flex flex-col gap-8">
              <div className="text-center">
                <h2 className="text-[24px] leading-8 font-semibold tracking-[-0.01em] text-on-surface mb-2">
                  How will you use the platform?
                </h2>
                <p className="text-sm text-on-surface-variant">
                  Select your primary role to customize your experience.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <RoleCard
                  selected={role === 'seller'}
                  onSelect={() => { setRole('seller'); setRoleError(null) }}
                  icon="inventory_2"
                  iconBg="bg-primary text-on-primary"
                  title="I'm a Seller"
                  description="Manage inventory, process orders, and connect with wholesale buyers."
                />
                <RoleCard
                  selected={role === 'buyer'}
                  onSelect={() => { setRole('buyer'); setRoleError(null) }}
                  icon="local_mall"
                  iconBg="bg-secondary text-on-secondary"
                  title="I'm a Buyer"
                  description="Discover suppliers, place bulk orders, and track shipments."
                />
              </div>

              {roleError && (
                <div className="flex justify-center">
                  <FormError message={roleError} />
                </div>
              )}

              <div className="flex justify-between">
                <button
                  onClick={() => setStep(1)}
                  className="px-6 py-2 rounded-lg text-base font-semibold text-on-surface-variant hover:bg-surface-container transition-colors flex items-center gap-2"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                    arrow_back
                  </span>
                  Back
                </button>
                <button
                  onClick={handleStep2Continue}
                  className={cn(
                    'px-8 py-3 rounded-lg text-base font-semibold transition-colors flex items-center gap-2',
                    role
                      ? 'bg-primary text-on-primary hover:bg-primary-container cursor-pointer'
                      : 'bg-surface-variant text-on-surface-variant opacity-50 cursor-not-allowed'
                  )}
                >
                  Continue
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                    arrow_forward
                  </span>
                </button>
              </div>
            </div>
          </StepPanel>

          {/* ── Step 3: Company Information ── */}
          <StepPanel stepNum={3} currentStep={step}>
            <div className="bg-surface-container-lowest p-8 rounded-xl shadow-lg w-full max-w-120">
              <form onSubmit={form3.handleSubmit(handleStep3Submit)} className="flex flex-col gap-6">
                <h2 className="text-[20px] leading-7 font-semibold text-on-surface">
                  Company Information
                </h2>
                <div className="flex flex-col gap-4">
                  <FormInput
                    label="Company Name"
                    id="company"
                    icon="business"
                    placeholder="Acme Corp"
                    error={form3.formState.errors.company?.message}
                    {...form3.register('company')}
                  />
                  <FormSelect
                    label="Industry"
                    id="industry"
                    icon="category"
                    placeholder="Select Industry"
                    options={INDUSTRY_OPTIONS}
                    error={form3.formState.errors.industry?.message}
                    {...form3.register('industry')}
                  />
                  <FormInput
                    label="Tax ID / VAT (Optional)"
                    id="tax"
                    icon="receipt_long"
                    placeholder="XX-XXXXXXX"
                    error={form3.formState.errors.tax?.message}
                    {...form3.register('tax')}
                  />
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-surface-container-high">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="p-2 rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                      arrow_back
                    </span>
                  </button>
                  <button
                    type="submit"
                    className="flex-1 ml-4 bg-primary text-on-primary py-3 rounded-lg text-base font-semibold hover:bg-primary-container transition-colors flex items-center justify-center gap-2"
                  >
                    Complete Setup
                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                      check_circle
                    </span>
                  </button>
                </div>
              </form>
            </div>
          </StepPanel>

        </div>
      </div>
    </main>
  )
}
