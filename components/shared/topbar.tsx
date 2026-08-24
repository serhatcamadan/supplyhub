import { getTranslations } from 'next-intl/server'
import { ProfileButton } from './profile-button'
import { NotificationBell } from './notification-bell'
import { LanguageSwitcher } from './language-switcher'

interface TopbarProps {
  userName: string
  userRole: string
}

export async function Topbar({ userName, userRole }: TopbarProps) {
  const t = await getTranslations('common')

  return (
    <header className="fixed top-0 left-72 right-0 h-16 bg-surface/90 backdrop-blur-md border-b border-outline-variant/30 z-40 px-8 flex items-center justify-between shadow-[0_1px_4px_rgba(0,0,0,0.02)]">
      <div className="flex-1 max-w-xl">
        <div className="relative flex items-center group">
          <span
            className="material-symbols-outlined absolute left-3 text-on-surface-variant group-focus-within:text-primary transition-colors"
            style={{ fontSize: '20px' }}
          >
            search
          </span>
          <input
            className="w-full pl-10 pr-4 py-2 bg-surface-container-low border border-outline-variant rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
            placeholder={t('searchPlaceholder')}
            type="text"
          />
        </div>
      </div>

      <div className="flex items-center gap-4 ml-6">
        <LanguageSwitcher />
        <NotificationBell />
        <ProfileButton userName={userName} userRole={userRole} />
      </div>
    </header>
  )
}
