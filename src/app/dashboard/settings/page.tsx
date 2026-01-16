import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
// import { signout } from "@/components/auth-provider" // Wait, auth-provider acts on client.
// Server component cannot call client context functions directly, but can call server actions or use a client component.
// The sidebar already handles signout. Let's just show Email for now.

export default async function SettingsPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>

            <Card>
                <CardHeader>
                    <CardTitle>Account</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-2">
                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Email Address
                        </label>
                        <p className="text-sm text-muted-foreground">
                            {user?.email || "Not logged in"}
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
