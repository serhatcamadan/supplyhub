interface TopbarProps {
  userName: string
  userRole: string
}

export function Topbar({ userName, userRole }: TopbarProps) {
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
            placeholder="Search products, orders, or suppliers..."
            type="text"
          />
        </div>
      </div>

      <div className="flex items-center gap-6 ml-6">
        <button className="relative p-2 text-on-surface-variant hover:bg-surface-container-high rounded-full transition-colors">
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full border-2 border-surface" />
        </button>

        <div className="flex items-center gap-3 pl-6 border-l border-outline-variant">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-on-surface leading-none">{userName}</p>
            <p className="text-xs text-on-surface-variant mt-1">{userRole}</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary text-sm font-bold shrink-0">
            {userName.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  )
}
