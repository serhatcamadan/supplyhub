export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-[#1e3a5f] tracking-tight">SupplyHub</h1>
          <p className="text-sm text-slate-500 mt-1">B2B Toptan Tedarik Platformu</p>
        </div>
        {children}
      </div>
    </div>
  )
}
