
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateResumeName(id: string, name: string) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('resumes')
        .update({ name })
        .eq('id', id)

    if (error) {
        console.error('Error updating resume name:', error)
        return { error: 'Failed to update resume name' }
    }

    revalidatePath('/dashboard/resumes')
    return { success: true }
}

export async function deleteResume(id: string) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('resumes')
        .delete()
        .eq('id', id)

    if (error) {
        console.error('Error deleting resume:', error)
        return { error: 'Failed to delete resume' }
    }

    revalidatePath('/dashboard/resumes')
    return { success: true }
}