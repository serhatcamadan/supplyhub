import { ProfileButton } from './profile-button'
import { NotificationBell } from './notification-bell'
import { LanguageSwitcher } from './language-switcher'
import { GlobalSearch } from './global-search'

interface TopbarProps {
  userName: string
  userRole: string
  portal: 'seller' | 'buyer'
}

export function Topbar({ userName, userRole, portal }: TopbarProps) {
  return (
    <header className="fixed top-0 left-72 right-0 h-16 bg-surface/90 backdrop-blur-md border-b border-outline-variant/30 z-40 px-8 flex items-center justify-between shadow-[0_1px_4px_rgba(0,0,0,0.02)]">
      <div className="flex-1 max-w-xl">
        <GlobalSearch portal={portal} />
      </div>

      <div className="flex items-center gap-4 ml-6">
        <LanguageSwitcher />
        <NotificationBell />
        <ProfileButton userName={userName} userRole={userRole} />
      </div>
    </header>
  )
}
