'use server'

import { extractTextFromFile, parseResumeSections, ParsedResume } from '@/lib/resume-parser'
import { createClient } from '@/lib/supabase/server'
import { calculateResmueScore, ScoringResult } from '@/lib/scoring'

export type AnalysisResult = {
    success: boolean
    data?: ParsedResume
    scoring?: ScoringResult
    error?: string
}

export async function analyzeResume(formData: FormData): Promise<AnalysisResult> {
    try {
        const file = formData.get('file') as File
        if (!file) {
            console.error('SERVER: No file received')
            return { success: false, error: 'No file provided' }
        }

        console.log('SERVER: v2.0 - File received:', file.name, file.type, file.size)

        // 1. Extract Text
        console.log('SERVER: Starting text extraction...')
        const text = await extractTextFromFile(file)
        console.log('SERVER: Text extraction complete. Length:', text.length)

        // 2. Parse Sections
        console.log('SERVER: Starting section parsing...')
        const parsedData = parseResumeSections(text)
        console.log('SERVER: Section parsing complete. Sections:', parsedData.sections.length)

        // 3. Scoring
        console.log('SERVER: Starting scoring...')
        const scoringResult = calculateResmueScore(parsedData)
        console.log('SERVER: Scoring complete. Score:', scoringResult.score)

        // 4. Save to Database
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (user) {
            console.log('SERVER: Saving to database for user:', user.id)
            const { error: dbError } = await supabase.from('resumes').insert({
                user_id: user.id,
                file_name: file.name,
                parsed_data: { ...parsedData, scoring: scoringResult }, // Store full scoring details
                ats_score: scoringResult.score
            })

            if (dbError) {
                console.error('SERVER: DB Insert Error:', dbError)
                // We don't fail the whole request if saving fails, but good to know
            } else {
                console.log('SERVER: Saved to database successfully')
            }
        } else {
            console.warn('SERVER: No user found, skipping DB save')
        }

        return { success: true, data: parsedData, scoring: scoringResult }

    } catch (error) {
        console.error('SERVER: Analysis Error Full:', error)
        // @ts-ignore
        const errorMessage = error.message || 'Unknown error occurred';
        console.error('SERVER: Analysis Error Msg:', errorMessage)
        return { success: false, error: `Analysis failed: ${errorMessage}` }
    }

}
