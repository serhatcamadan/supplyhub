export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Material Symbols — auth pages only */}
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
      />
      <div className="relative min-h-screen bg-surface overflow-hidden">
        {/* Background decoration */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 bg-linear-to-br from-surface-container-high/50 to-surface-container-low/20" />
          <svg
            className="absolute top-0 right-0 w-200 h-200 text-primary opacity-[0.04]"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <path d="M0,0 L100,0 L100,100 Z" fill="currentColor" />
          </svg>
        </div>
        {/* Page content */}
        <div className="relative z-10 min-h-screen">{children}</div>
      </div>
    </>
  )
}
