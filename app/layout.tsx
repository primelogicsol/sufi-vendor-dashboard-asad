// 

// app/layout.tsx

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'sonner'
import { AuthProvider } from '@/components/auth/auth-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    template: '%s | VendorHub',
    default: 'VendorHub - Vendor Dashboard'
  },
  description: 'Comprehensive vendor dashboard for managing products, orders, and analytics.',
  keywords: 'vendor, dashboard, ecommerce, products, orders, analytics',
  authors: [{ name: 'VendorHub Team' }],
  
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
}
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <AuthProvider>
          {children}
            <Toaster richColors position="top-right" />
        </AuthProvider>
      </body>
    </html>
  )
}