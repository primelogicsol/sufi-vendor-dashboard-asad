// "use client"

// import { useState, useEffect } from 'react'
// import { useRouter } from 'next/navigation'
// import Link from 'next/link'
// import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
// import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'
// import { Label } from '@/components/ui/label'
// import { Alert, AlertDescription } from '@/components/ui/alert'
// import { Eye, EyeOff, Mail, Lock, Loader2, Store, AlertCircle } from 'lucide-react'
// import { useAuth } from './auth-provider'
// import type { LoginCredentials } from '@/types/auth'

// export function LoginForm() {
//   const [credentials, setCredentials] = useState<LoginCredentials>({
//     email: '',
//     password: '',
//   })
//   const [showPassword, setShowPassword] = useState(false)
//   const [isSubmitting, setIsSubmitting] = useState(false)
//   const [validationErrors, setValidationErrors] = useState<Partial<LoginCredentials>>({})

//   const { login, error, isAuthenticated, clearError } = useAuth()
//   const router = useRouter()

//   // Redirect if already authenticated
//   useEffect(() => {
//     if (isAuthenticated) {
//       router.push('/') // Redirect to dashboard
//     }
//   }, [isAuthenticated, router])

//   // Clear error when component mounts or credentials change
//   useEffect(() => {
//     if (error) {
//       clearError()
//     }
//   }, [credentials])

//   // Validation function
//   const validateForm = (): boolean => {
//     const errors: Partial<LoginCredentials> = {}

//     // Email validation
//     if (!credentials.email.trim()) {
//       errors.email = 'Email is required'
//     } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(credentials.email)) {
//       errors.email = 'Please enter a valid email address'
//     }

//     // Password validation
//     if (!credentials.password) {
//       errors.password = 'Password is required'
//     } else if (credentials.password.length < 6) {
//       errors.password = 'Password must be at least 6 characters long'
//     }

//     setValidationErrors(errors)
//     return Object.keys(errors).length === 0
//   }

//   // Handle input changes
//   const handleInputChange = (field: keyof LoginCredentials, value: string) => {
//     setCredentials(prev => ({
//       ...prev,
//       [field]: value,
//     }))
    
//     // Clear validation error for this field
//     if (validationErrors[field]) {
//       setValidationErrors(prev => ({
//         ...prev,
//         [field]: undefined,
//       }))
//     }
//   }

//   // Handle form submission
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
    
//     if (!validateForm()) {
//       return
//     }

//     setIsSubmitting(true)

//     try {
//       const success = await login(credentials)
      
//       if (success) {
//         // Login successful, redirect will happen via useEffect
//         router.push('/')
//       }
//     } catch (err) {
//       console.error('Login error:', err)
//     } finally {
//       setIsSubmitting(false)
//     }
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/20 to-background p-4">
//       <div className="w-full max-w-md space-y-6">
//         {/* Logo/Branding */}
//         <div className="text-center space-y-2">
//           <div className="flex justify-center">
//             <div className="h-16 w-16 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center shadow-lg">
//               <Store className="h-8 w-8 text-primary-foreground" />
//             </div>
//           </div>
//           <h1 className="text-2xl font-bold text-foreground">Welcome Back</h1>
//           <p className="text-muted-foreground">Sign in to your VendorHub account</p>
//         </div>

//         {/* Login Form */}
//         <Card className="shadow-xl border-0 bg-card/50 backdrop-blur-sm">
//           <CardHeader className="space-y-1 pb-4">
//             <CardTitle className="text-xl text-center">Login</CardTitle>
//           </CardHeader>
          
//           <form onSubmit={handleSubmit}>
//             <CardContent className="space-y-4">
//               {/* Global Error Alert */}
//               {error && (
//                 <Alert variant="destructive">
//                   <AlertCircle className="h-4 w-4" />
//                   <AlertDescription>{error}</AlertDescription>
//                 </Alert>
//               )}

//               {/* Email Field */}
//               <div className="space-y-2">
//                 <Label htmlFor="email" className="text-sm font-medium">
//                   Email Address
//                 </Label>
//                 <div className="relative">
//                   <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//                   <Input
//                     id="email"
//                     type="email"
//                     placeholder="Enter your email"
//                     value={credentials.email}
//                     onChange={(e) => handleInputChange('email', e.target.value)}
//                     className={`pl-10 ${validationErrors.email ? 'border-destructive' : ''}`}
//                     disabled={isSubmitting}
//                     autoComplete="email"
//                     required
//                   />
//                 </div>
//                 {validationErrors.email && (
//                   <p className="text-sm text-destructive">{validationErrors.email}</p>
//                 )}
//               </div>

//               {/* Password Field */}
//               <div className="space-y-2">
//                 <Label htmlFor="password" className="text-sm font-medium">
//                   Password
//                 </Label>
//                 <div className="relative">
//                   <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//                   <Input
//                     id="password"
//                     type={showPassword ? 'text' : 'password'}
//                     placeholder="Enter your password"
//                     value={credentials.password}
//                     onChange={(e) => handleInputChange('password', e.target.value)}
//                     className={`pl-10 pr-10 ${validationErrors.password ? 'border-destructive' : ''}`}
//                     disabled={isSubmitting}
//                     autoComplete="current-password"
//                     required
//                   />
//                   <Button
//                     type="button"
//                     variant="ghost"
//                     size="sm"
//                     className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
//                     onClick={() => setShowPassword(!showPassword)}
//                     disabled={isSubmitting}
//                   >
//                     {showPassword ? (
//                       <EyeOff className="h-4 w-4 text-muted-foreground" />
//                     ) : (
//                       <Eye className="h-4 w-4 text-muted-foreground" />
//                     )}
//                   </Button>
//                 </div>
//                 {validationErrors.password && (
//                   <p className="text-sm text-destructive">{validationErrors.password}</p>
//                 )}
//               </div>

//               {/* Remember Me & Forgot Password */}
//               <div className="flex items-center justify-between text-sm">
//                 <div className="flex items-center space-x-2">
//                   <input
//                     type="checkbox"
//                     id="remember"
//                     className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
//                   />
//                   <Label htmlFor="remember" className="text-muted-foreground cursor-pointer">
//                     Remember me
//                   </Label>
//                 </div>
//                 <Link
//                   href="/forgot-password"
//                   className="text-primary hover:text-primary/80 font-medium transition-colors"
//                 >
//                   Forgot password?
//                 </Link>
//               </div>
//             </CardContent>

//             <CardFooter className="flex flex-col space-y-4 pt-2">
//               {/* Submit Button */}
//               <Button
//                 type="submit"
//                 className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground font-medium py-2.5"
//                 disabled={isSubmitting}
//               >
//                 {isSubmitting ? (
//                   <>
//                     <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                     Signing In...
//                   </>
//                 ) : (
//                   'Sign In'
//                 )}
//               </Button>

//               {/* Divider */}
//               <div className="relative">
//                 <div className="absolute inset-0 flex items-center">
//                   <span className="w-full border-t border-muted" />
//                 </div>
//                 <div className="relative flex justify-center text-xs uppercase">
//                   <span className="bg-card px-2 text-muted-foreground">Or</span>
//                 </div>
//               </div>

//               {/* Social Login Options */}
//               <div className="grid grid-cols-2 gap-3">
//                 <Button
//                   type="button"
//                   variant="outline"
//                   className="w-full"
//                   disabled={isSubmitting}
//                   onClick={() => {
//                     // TODO: Implement Google OAuth
//                     console.log('Google login clicked')
//                   }}
//                 >
//                   <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
//                     <path
//                       fill="currentColor"
//                       d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
//                     />
//                     <path
//                       fill="currentColor"
//                       d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
//                     />
//                     <path
//                       fill="currentColor"
//                       d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
//                     />
//                     <path
//                       fill="currentColor"
//                       d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
//                     />
//                   </svg>
//                   Google
//                 </Button>
                
//                 <Button
//                   type="button"
//                   variant="outline"
//                   className="w-full"
//                   disabled={isSubmitting}
//                   onClick={() => {
//                     // TODO: Implement Microsoft OAuth
//                     console.log('Microsoft login clicked')
//                   }}
//                 >
//                   <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
//                     <path d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zM24 11.4H12.6V0H24v11.4z" />
//                   </svg>
//                   Microsoft
//                 </Button>
//               </div>
//             </CardFooter>
//           </form>
//         </Card>

//         {/* Sign Up Link */}
//         <div className="text-center">
//           <p className="text-sm text-muted-foreground">
//             Don't have an account?{' '}
//             <Link
//               href="/register"
//               className="text-primary hover:text-primary/80 font-medium transition-colors"
//             >
//               Sign up here
//             </Link>
//           </p>
//         </div>

//         {/* Help/Support */}
//         <div className="text-center">
//           <p className="text-xs text-muted-foreground">
//             Having trouble signing in?{' '}
//             <Link
//               href="/support"
//               className="text-primary hover:text-primary/80 transition-colors"
//             >
//               Contact support
//             </Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   )
// }


"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Eye, EyeOff, Mail, Lock, Loader2, Store, AlertCircle } from 'lucide-react'
import { useAuth } from './auth-provider'
import type { LoginCredentials } from '@/types/auth'

export function LoginForm() {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: '',
    password: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [validationErrors, setValidationErrors] = useState<Partial<LoginCredentials>>({})

  const { login, error, isAuthenticated, clearError } = useAuth()
  const router = useRouter()

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/') // Redirect to dashboard
    }
  }, [isAuthenticated, router])

  // Clear error when component mounts or credentials change
  useEffect(() => {
    if (error) {
      clearError()
    }
  }, [credentials, error, clearError]) // Added error and clearError to dependencies

  // Validation function
  const validateForm = (): boolean => {
    const errors: Partial<LoginCredentials> = {}

    // Email validation
    if (!credentials.email.trim()) {
      errors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(credentials.email)) {
      errors.email = 'Please enter a valid email address'
    }

    // Password validation
    if (!credentials.password) {
      errors.password = 'Password is required'
    } else if (credentials.password.length < 6) {
      errors.password = 'Password must be at least 6 characters long'
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Handle input changes
  const handleInputChange = (field: keyof LoginCredentials, value: string) => {
    setCredentials(prev => ({
      ...prev,
      [field]: value,
    }))
    
    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors(prev => ({
        ...prev,
        [field]: undefined,
      }))
    }
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      const success = await login(credentials)
      
      if (success) {
        // Login successful, redirect will happen via useEffect
        router.push('/')
      }
    } catch (err) {
      console.error('Login error:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/20 to-background p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo/Branding */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="h-16 w-16 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center shadow-lg">
              <Store className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-foreground">Welcome Back</h1>
          <p className="text-muted-foreground">Sign in to your VendorHub account</p>
        </div>

        {/* Login Form */}
        <Card className="shadow-xl border-0 bg-card/50 backdrop-blur-sm">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl text-center">Login</CardTitle>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {/* Global Error Alert */}
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={credentials.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`pl-10 ${validationErrors.email ? 'border-destructive' : ''}`}
                    disabled={isSubmitting}
                    autoComplete="email"
                    required
                  />
                </div>
                {validationErrors.email && (
                  <p className="text-sm text-destructive">{validationErrors.email}</p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={credentials.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className={`pl-10 pr-10 ${validationErrors.password ? 'border-destructive' : ''}`}
                    disabled={isSubmitting}
                    autoComplete="current-password"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isSubmitting}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
                {validationErrors.password && (
                  <p className="text-sm text-destructive">{validationErrors.password}</p>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="remember"
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <Label htmlFor="remember" className="text-muted-foreground cursor-pointer">
                    Remember me
                  </Label>
                </div>
                <Link
                  href="/forgot-password"
                  className="text-primary hover:text-primary/80 font-medium transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4 pt-2">
              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground font-medium py-2.5"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-muted" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">Or</span>
                </div>
              </div>

              {/* Social Login Options */}
              <div className="grid grid-cols-2 gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  disabled={isSubmitting}
                  onClick={() => {
                    // TODO: Implement Google OAuth
                    console.log('Google login clicked')
                  }}
                >
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Google
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  disabled={isSubmitting}
                  onClick={() => {
                    // TODO: Implement Microsoft OAuth
                    console.log('Microsoft login clicked')
                  }}
                >
                  <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zM24 11.4H12.6V0H24v11.4z" />
                  </svg>
                  Microsoft
                </Button>
              </div>
            </CardFooter>
          </form>
        </Card>

        {/* Sign Up Link */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link
              href="/register"
              className="text-primary hover:text-primary/80 font-medium transition-colors"
            >
              Sign up here
            </Link>
          </p>
        </div>

        {/* Help/Support */}
        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            Having trouble signing in?{' '}
            <Link
              href="/support"
              className="text-primary hover:text-primary/80 transition-colors"
            >
              Contact support
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}