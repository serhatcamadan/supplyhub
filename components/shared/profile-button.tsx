'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'

interface ProfileButtonProps {
  userName: string
  userRole: string
}

const SECTIONS = [
  {
    title: 'Hesap Ayarları',
    items: [
      { icon: 'person_edit', label: 'Profil Düzenle' },
      { icon: 'password',    label: 'Şifre Değiştir' },
    ],
  },
  {
    title: 'Kişisel Bilgiler',
    items: [
      { icon: 'contact_mail', label: 'İletişim Bilgileri' },
    ],
  },
  {
    title: 'Tercihler',
    items: [
      { icon: 'notifications', label: 'Bildirim Ayarları' },
      { icon: 'language',      label: 'Dil & Bölge' },
    ],
  },
]

export function ProfileButton({ userName, userRole }: ProfileButtonProps) {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  const initials = userName.charAt(0).toUpperCase()

  return (
    <>
      {/* Topbar trigger */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-3 pl-6 border-l border-outline-variant hover:opacity-80 transition-opacity"
      >
        <div className="text-right hidden sm:block">
          <p className="text-sm font-semibold text-on-surface leading-none">{userName}</p>
          <p className="text-xs text-on-surface-variant mt-1">{userRole}</p>
        </div>
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary text-sm font-bold shrink-0">
          {initials}
        </div>
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-50 bg-on-surface/20 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Drawer panel */}
      <div className={`fixed right-0 top-0 h-screen w-80 bg-surface-container-lowest shadow-2xl border-l border-outline-variant/30 z-50 flex flex-col transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'}`}>
        {/* Header */}
        <div className="p-6 border-b border-outline-variant/30 flex flex-col items-center text-center">
          <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center text-on-primary text-3xl font-bold mb-4 border-2 border-primary-container">
            {initials}
          </div>
          <h2 className="text-xl font-semibold text-on-surface leading-none">{userName}</h2>
          <p className="text-sm text-on-surface-variant mt-1">{userRole}</p>
        </div>

        {/* Menu */}
        <div className="flex-1 overflow-y-auto py-2">
          {SECTIONS.map((section, si) => (
            <div key={section.title} className={`px-6 py-4 ${si > 0 ? 'border-t border-outline-variant/30' : ''}`}>
              <p className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-2">
                {section.title}
              </p>
              {section.items.map((item) => (
                <button
                  key={item.label}
                  onClick={() => setOpen(false)}
                  className="w-full flex items-center py-2.5 text-sm text-on-surface hover:text-primary transition-colors group"
                >
                  <span
                    className="material-symbols-outlined mr-3 text-on-surface-variant group-hover:text-primary transition-colors"
                    style={{ fontSize: '20px' }}
                  >
                    {item.icon}
                  </span>
                  {item.label}
                </button>
              ))}
            </div>
          ))}
        </div>

        {/* Sign Out */}
        <div className="p-6 border-t border-outline-variant/30">
          <Button variant="destructive" size="lg" onClick={handleSignOut} className="w-full">
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>logout</span>
            Çıkış Yap
          </Button>
        </div>
      </div>
    </>
  )
}
