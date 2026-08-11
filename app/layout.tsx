import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'SupplyHub — B2B Tedarik Platformu',
  description: 'Satıcı ve alıcı işletmeleri buluşturan toptan tedarik platformu',
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="tr" className={`${inter.className} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  )
}
