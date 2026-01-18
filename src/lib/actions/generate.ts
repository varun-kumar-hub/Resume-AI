
'use server'

import { GoogleGenerativeAI } from '@google/generative-ai'
import { createClient } from '@/lib/supabase/server'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function generateCoverLetter(resumeId: string, jobDescription: string) {
    try {
        const supabase = await createClient()

        // 1. Fetch Resume Data
        const { data: resume, error } = await supabase
            .from('resumes')
            .select('*')
            .eq('id', resumeId)
            .single()

        if (error || !resume) {
            throw new Error('Resume not found')
        }

        // 2. Prepare Prompt
        const resumeText = JSON.stringify(resume.parsed_data) // Simplified for prompt
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

        const prompt = `
        You are an expert career coach and professional writer.
        
        Using the following RESUME and JOB DESCRIPTION, write a professional, engaging, and tailored Cover Letter.
        
        Guidelines:
        - Highlight relevant skills from the resume that match the job description.
        - Tone should be professional, enthusiastic, and confident.
        - Keep it concise (3-4 paragraphs).
        - Use standard business letter formatting.
        - Do not include placeholders like "[Your Name]" if possible, use the name from the resume if available.
        
        RESUME DATA:
        ${resumeText}
        
        JOB DESCRIPTION:
        ${jobDescription}
        `

        // 3. Generate
        const result = await model.generateContent(prompt)
        const response = await result.response
        const text = response.text()

        return { success: true, content: text }

    } catch (error: any) {
        console.error('Error generating cover letter:', error)
        return { success: false, error: error.message || 'Failed to generate cover letter' }
    }
}

export async function tailorResume(resumeId: string, jobDescription: string) {
    try {
        const supabase = await createClient()

        // 1. Fetch Resume Data
        const { data: resume, error } = await supabase
            .from('resumes')
            .select('*')
            .eq('id', resumeId)
            .single()

        if (error || !resume) {
            throw new Error('Resume not found')
        }

        // 2. Prepare Prompt
        const resumeText = JSON.stringify(resume.parsed_data)
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

        const prompt = `
        You are an expert resume writer.
        
        Analyze the provided RESUME against the JOB DESCRIPTION.
        Identify 3-5 bullet points from the resume that could be improved to better match the keywords and requirements of the job description.
        
        For each, provide:
        1. Original Text
        2. Improved/Tailored Version (incorporating JD keywords, stronger action verbs, and quantifiable metrics if implied).
        3. Explanation of why this change helps.
        
        Format the output as a JSON object with this structure:
        {
            "suggestions": [
                {
                    "original": "...",
                    "improved": "...",
                    "explanation": "..."
                }
            ]
        }
        
        RESUME DATA:
        ${resumeText}
        
        JOB DESCRIPTION:
        ${jobDescription}
        `

        // 3. Generate
        const result = await model.generateContent(prompt)
        const response = await result.response
        const text = response.text()

        // Clean markdown code blocks if present
        const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim()

        return { success: true, data: JSON.parse(cleanText) }

    } catch (error: any) {
        console.error('Error tailoring resume:', error)
        return { success: false, error: error.message || 'Failed to tailor resume' }
    }
}
