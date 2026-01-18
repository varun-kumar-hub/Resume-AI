
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export type ApplicationStatus = 'Applied' | 'Interviewing' | 'Offer' | 'Rejected'

export interface Application {
    id: string
    user_id: string
    company_name: string
    position: string
    status: ApplicationStatus
    salary_range?: string
    job_link?: string
    created_at: string
}

export async function getApplications() {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('applications')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching applications:', error)
        return []
    }

    return data as Application[]
}

export async function createApplication(formData: FormData) {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Unauthorized' }
    }

    const company_name = formData.get('company_name') as string
    const position = formData.get('position') as string
    const status = formData.get('status') as ApplicationStatus || 'Applied'
    const salary_range = formData.get('salary_range') as string
    const job_link = formData.get('job_link') as string

    const { error } = await supabase.from('applications').insert({
        user_id: user.id,
        company_name,
        position,
        status,
        salary_range,
        job_link,
    })

    if (error) {
        console.error('Error creating application:', error)
        return { error: 'Failed to create application' }
    }

    revalidatePath('/dashboard/tracker')
    return { success: true }
}

export async function updateApplicationStatus(id: string, status: ApplicationStatus) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('applications')
        .update({ status })
        .eq('id', id)

    if (error) {
        console.error('Error updating application status:', error)
        return { error: 'Failed to update status' }
    }

    revalidatePath('/dashboard/tracker')
    return { success: true }
}

export async function deleteApplication(id: string) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('applications')
        .delete()
        .eq('id', id)

    if (error) {
        console.error('Error deleting application:', error)
        return { error: 'Failed to delete application' }
    }

    revalidatePath('/dashboard/tracker')
    return { success: true }
}
