import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/server"
import { formatDistanceToNow } from "date-fns"
import { FileText, Calendar, TrendingUp } from "lucide-react"

export const dynamic = 'force-dynamic'

export default async function ResumesPage() {
    const supabase = await createClient()
    const { data: resumes } = await supabase
        .from('resumes')
        .select('*')
        .order('created_at', { ascending: false })

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">My Resumes</h1>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {resumes?.map((resume) => (
                    <Card key={resume.id} className="hover:bg-muted/50 transition-colors">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {resume.file_name}
                            </CardTitle>
                            <FileText className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col gap-4">
                                <div className="flex items-center gap-2">
                                    <div className="text-2xl font-bold">{resume.ats_score}</div>
                                    <span className="text-xs text-muted-foreground">ATS Score</span>
                                </div>
                                <div className="flex items-center text-xs text-muted-foreground">
                                    <Calendar className="mr-1 h-3 w-3" />
                                    {formatDistanceToNow(new Date(resume.created_at), { addSuffix: true })}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {(!resumes || resumes.length === 0) && (
                    <div className="col-span-full py-12 text-center text-muted-foreground">
                        <p>No resumes analyzed yet. Upload one on the dashboard!</p>
                    </div>
                )}
            </div>
        </div>
    )
}
