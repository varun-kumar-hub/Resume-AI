
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Briefcase, FileText, Home, LayoutDashboard, LogOut, Settings, User, Wand2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    return (
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
            {/* Sidebar */}
            <aside className="hidden w-64 flex-col border-r border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950 md:flex">
                <div className="flex h-16 items-center border-b border-gray-200 px-6 dark:border-gray-800">
                    <div className="flex items-center gap-2 font-bold text-gray-900 dark:text-white">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
                            RA
                        </div>
                        Resume AI
                    </div>
                </div>
                <nav className="flex-1 space-y-1 p-4">
                    <Link href="/dashboard">
                        <Button variant="ghost" className="w-full justify-start gap-2">
                            <LayoutDashboard className="h-4 w-4" />
                            Dashboard
                        </Button>
                    </Link>
                    <Link href="/dashboard/resumes">
                        <Button variant="ghost" className="w-full justify-start gap-2">
                            <FileText className="h-4 w-4" />
                            My Resumes
                        </Button>
                    </Link>
                    <Link href="/dashboard/tracker">
                        <Button variant="ghost" className="w-full justify-start gap-2">
                            <Briefcase className="h-4 w-4" />
                            Tracker
                        </Button>
                    </Link>
                    <Link href="/dashboard/tailor">
                        <Button variant="ghost" className="w-full justify-start gap-2">
                            <Wand2 className="h-4 w-4" />
                            AI Tailor
                        </Button>
                    </Link>
                    <Link href="/dashboard/settings">
                        <Button variant="ghost" className="w-full justify-start gap-2">
                            <Settings className="h-4 w-4" />
                            Settings
                        </Button>
                    </Link>
                </nav>
                <div className="border-t border-gray-200 p-4 dark:border-gray-800">
                    <div className="mb-4 flex items-center gap-3 px-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-800">
                            <User className="h-4 w-4 text-gray-500" />
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                                {user.email}
                            </p>
                        </div>
                    </div>
                    <form action="/auth/signout" method="post">
                        <Button variant="outline" className="w-full gap-2">
                            <LogOut className="h-4 w-4" />
                            Sign Out
                        </Button>
                    </form>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <div className="container mx-auto p-4 md:p-8">
                    {children}
                </div>
            </main>
        </div>
    )
}
