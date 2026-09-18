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

    getMyProfile()
      .then((data) => setProfile(data))
      .catch(() => {
        // API unreachable — fall back to a JWT-derived profile so the page doesn't hang forever.
        // ProfileEditForm seeds its editable state from this once on mount, so this must be the
        // only place we ever set a placeholder profile (never alongside a later real fetch).
        setProfile({
          id:         jwt.sub,
          email:      jwt.email,
          name:       jwt.name,
          phone:      null,
          role:       jwt.role,
          company_id: jwt.companyId,
          companies:  { name: '', type: jwt.companyType, industry: null, free_shipping_threshold: 10_000, shipping_fee: 450 },
        })
      })
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
