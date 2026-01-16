'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { createClient } from '@/lib/supabase/client'
import { Github } from 'lucide-react'
import { useState } from 'react'
import { login, signup } from '../auth/actions'
import { toast } from 'sonner'

export default function LoginPage() {
    const [loading, setLoading] = useState(false)
    const supabase = createClient()


    const handleOAuthLogin = async (provider: 'google' | 'github') => {
        setLoading(true)
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider,
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                },
            })
            if (error) throw error
        } catch (error) {
            if (error instanceof Error) {
                toast.error('Login failed', { description: error.message })
            } else {
                toast.error('Login failed', { description: 'An unknown error occurred' })
            }
        } finally {
            setLoading(false)
        }
    }

    const handleEmailLogin = async (formData: FormData) => {
        setLoading(true)
        const result = await login(formData)
        setLoading(false)

        if (result?.error) {
            toast.error('Login Failed', { description: result.error })
        }
        // If success, the server action redirects, so no need to do anything here strictly
        // But we can verify via client side state if needed. 
        // Redirect happens on server.
    }

    const handleEmailSignup = async (formData: FormData) => {
        setLoading(true)
        const result = await signup(formData)
        setLoading(false)

        if (result?.error) {
            toast.error('Signup Failed', { description: result.error })
        } else if (result?.success) {
            toast.success('Signup Successful', { description: result.message })
        }
    }

    return (
        <div className="relative flex min-h-screen flex-col items-center justify-center p-4 lg:p-8">
            {/* Background Gradients */}
            <div className="fixed inset-0 z-0 bg-background bg-[regional-gradient(var(--color-border)_1px,transparent_1px)]" />
            <div className="fixed inset-0 z-0 bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-pink-600/10 dark:from-blue-950/40 dark:via-purple-950/40 dark:to-pink-950/40" />

            {/* Floating Orbs (Decorative) */}
            <div className="fixed top-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-blue-500/20 blur-[100px]" />
            <div className="fixed bottom-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full bg-purple-500/20 blur-[100px]" />

            <div className="relative z-10 w-full max-w-[400px]">
                {/* Logo & Header */}
                <div className="mb-8 flex flex-col items-center text-center">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg shadow-blue-600/20">
                        <span className="text-xl font-bold text-white">RA</span>
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                        Welcome Back
                    </h1>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Sign in to access your Resume Intelligence
                    </p>
                </div>

                {/* Glass Card */}
                <div className="backdrop-blur-xl bg-white/70 dark:bg-black/40 border border-white/20 dark:border-white/10 shadow-2xl rounded-2xl p-6 md:p-8 ring-1 ring-black/5">
                    <Tabs defaultValue="login" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 mb-6">
                            <TabsTrigger value="login">Login</TabsTrigger>
                            <TabsTrigger value="signup">Sign Up</TabsTrigger>
                        </TabsList>

                        <TabsContent value="login">
                            <div className="grid gap-6">
                                <form action={handleEmailLogin}>
                                    <div className="grid gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="email">Email</Label>
                                            <Input
                                                id="email"
                                                name="email"
                                                placeholder="name@example.com"
                                                type="email"
                                                autoCapitalize="none"
                                                autoComplete="email"
                                                autoCorrect="off"
                                                className="bg-white/50 dark:bg-black/20"
                                                required
                                                disabled={loading}
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="password">Password</Label>
                                            <Input
                                                id="password"
                                                name="password"
                                                placeholder="••••••••"
                                                type="password"
                                                autoComplete="current-password"
                                                className="bg-white/50 dark:bg-black/20"
                                                required
                                                disabled={loading}
                                            />
                                        </div>
                                        <Button disabled={loading} className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-600/20">
                                            {loading && (
                                                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                            )}
                                            Sign In
                                        </Button>
                                    </div>
                                </form>
                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <span className="w-full border-t border-muted" />
                                    </div>
                                    <div className="relative flex justify-center text-xs uppercase">
                                        <span className="bg-transparent px-2 text-muted-foreground backdrop-blur-sm bg-white/50 dark:bg-black/50 rounded-sm">
                                            Or continue with
                                        </span>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <Button variant="outline" onClick={() => handleOAuthLogin('google')} disabled={loading} className="bg-white/50 dark:bg-black/20 hover:bg-white/80 dark:hover:bg-black/40">
                                        {loading ? '...' : 'Google'}
                                    </Button>
                                    <Button variant="outline" onClick={() => handleOAuthLogin('github')} disabled={loading} className="bg-white/50 dark:bg-black/20 hover:bg-white/80 dark:hover:bg-black/40">
                                        {loading ? '...' : (
                                            <>
                                                <Github className="mr-2 h-4 w-4" />
                                                GitHub
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="signup">
                            <div className="grid gap-6">
                                <form action={handleEmailSignup}>
                                    <div className="grid gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="signup-email">Email</Label>
                                            <Input
                                                id="signup-email"
                                                name="email"
                                                placeholder="name@example.com"
                                                type="email"
                                                autoCapitalize="none"
                                                autoComplete="email"
                                                autoCorrect="off"
                                                className="bg-white/50 dark:bg-black/20"
                                                required
                                                disabled={loading}
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="signup-password">Password</Label>
                                            <Input
                                                id="signup-password"
                                                name="password"
                                                placeholder="Create a password"
                                                type="password"
                                                autoComplete="new-password"
                                                className="bg-white/50 dark:bg-black/20"
                                                required
                                                disabled={loading}
                                            />
                                        </div>
                                        <Button disabled={loading} className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-600/20">
                                            {loading && (
                                                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                            )}
                                            Create Account
                                        </Button>
                                    </div>
                                </form>
                                <div className="text-center text-xs text-muted-foreground mt-2">
                                    Password must be at least 6 characters
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>

                <p className="px-8 text-center text-xs text-muted-foreground mt-8">
                    By clicking continue, you agree to our{" "}
                    <a href="/terms" className="underline underline-offset-4 hover:text-primary">
                        Terms
                    </a>{" "}
                    and{" "}
                    <a href="/privacy" className="underline underline-offset-4 hover:text-primary">
                        Privacy Policy
                    </a>
                </p>
            </div>
        </div>
    )
}
