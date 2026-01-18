
import { Suspense } from 'react'
import { getApplications } from '@/lib/actions/applications'
import { ApplicationBoard } from '@/components/application-board'
import { NewApplicationDialog } from '@/components/new-application-dialog'

export default async function ApplicationTrackerPage() {
    const applications = await getApplications()

    return (
        <div className="flex flex-col h-[calc(100vh-4rem)] p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Application Tracker</h2>
                    <p className="text-muted-foreground">
                        Manage and track your job applications properly.
                    </p>
                </div>
                <NewApplicationDialog />
            </div>

            <div className="flex-1 overflow-hidden">
                <Suspense fallback={<div>Loading board...</div>}>
                    <ApplicationBoard initialApplications={applications} />
                </Suspense>
            </div>
        </div>
    )
}
