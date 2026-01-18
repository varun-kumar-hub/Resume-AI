
import { TailorView } from '@/components/tailor-view'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function TailorPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const { data: resumes } = await supabase
        .from('resumes')
        .select('id, name, file_name, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

    return (
        <div className="flex flex-col p-4 md:p-8 pt-6 space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">AI Resume Tailor</h2>
                <p className="text-muted-foreground">
                    Customize your resume and generate cover letters for specific job descriptions.
                </p>
            </div>

            <div>
                {resumes && resumes.length > 0 ? (
                    <TailorView resumes={resumes} />
                ) : (
                    <div className="flex flex-col items-center justify-center h-[400px] border-2 border-dashed rounded-lg">
                        <p className="text-muted-foreground mb-4">You need to upload a resume first.</p>
                        {/* Link to dashboard or upload would be good here, but for now simple text */}
                    </div>
                )}
            </div>
        </div>
    )
}
