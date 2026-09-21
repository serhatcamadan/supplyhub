'use client'

// Catches a crash in app/[locale]/layout.tsx itself (e.g. a font/provider failure).
// This is the last line of defense, so it deliberately avoids next-intl, Tailwind
// theme classes, and every other app component — anything that could itself be
// the thing that's broken. Plain inline styles only.
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="tr">
      <body style={{ margin: 0, fontFamily: 'system-ui, -apple-system, sans-serif', background: '#f8f9ff', color: '#0b1c30' }}>
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
          <div style={{ textAlign: 'center', maxWidth: '28rem' }}>
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- plain <a>, not next/link: this boundary must survive even if the router itself is what crashed */}
            <a href="/" style={{ fontSize: '1.375rem', fontWeight: 700, color: '#022448', marginBottom: '1.25rem', textDecoration: 'none', display: 'block' }}>
              SupplyHub
            </a>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              Beklenmeyen bir hata oluştu
            </h1>
            <p style={{ fontSize: '0.875rem', color: '#43474e', marginBottom: '1.5rem' }}>
              Sayfa yüklenemedi. Lütfen tekrar deneyin. / The page failed to load. Please try again.
            </p>
            <button
              onClick={reset}
              style={{
                padding: '0.625rem 1.5rem',
                borderRadius: '0.75rem',
                background: '#022448',
                color: '#fff',
                fontWeight: 600,
                fontSize: '0.875rem',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Tekrar Dene
            </button>
            {error.digest && (
              <p style={{ fontSize: '0.75rem', color: '#74777f', marginTop: '1.5rem', fontFamily: 'monospace' }}>
                {error.digest}
              </p>
            )}
          </div>
        </div>
      </body>
    </html>
  )
}
