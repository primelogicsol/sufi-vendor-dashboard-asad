// app/login/page.tsx

import { Metadata } from 'next'
import { LoginForm } from '@/components/auth/login-form'

export const metadata: Metadata = {
  title: 'Login | VendorHub',
  description: 'Sign in to your VendorHub account to manage your products and store.',
  keywords: 'login, signin, vendor, dashboard, ecommerce',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function LoginPage() {
  return <LoginForm />
}