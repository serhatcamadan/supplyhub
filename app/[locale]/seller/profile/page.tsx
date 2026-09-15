'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { getCurrentUserFromCookie } from '@/lib/auth/client'
import { getMyProfile } from '@/lib/api/users'
import type { UserProfile } from '@/lib/api/users'
import { ProfileEditForm } from '@/components/shared/profile-edit-form'

export default function SellerProfilePage() {
  const t = useTranslations('common')
  const [profile, setProfile] = useState<UserProfile | null>(null)

  useEffect(() => {
    const jwt = getCurrentUserFromCookie()
    if (!jwt) return

    // Show form immediately with JWT data; enrich with API data (phone, company name) in background
    const base: UserProfile = {
      id:         jwt.sub,
      email:      jwt.email,
      name:       jwt.name,
      phone:      null,
      role:       jwt.role,
      company_id: jwt.companyId,
      companies:  { name: '', type: jwt.companyType, industry: null },
    }
    // JWT cookie is only readable client-side, so this can't run during SSR/first render
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setProfile(base)

    getMyProfile()
      .then((data) => setProfile(data))
      .catch(() => {/* keep JWT-based profile */})
  }, [])

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-64 text-sm text-on-surface-variant">
        {t('loading')}
      </div>
    )
  }

  return <ProfileEditForm profile={profile} portal="seller" />
}
