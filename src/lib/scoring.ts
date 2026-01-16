import { ParsedResume } from "./resume-parser";

export type ScoringResult = {
    score: number
    breakdown: {
        sectionScore: number
        contactScore: number
        keywordScore: number
        formattingScore: number
    }
    details: string[]
    improvements: string[]
}

const ACTION_VERBS = [
    'managed', 'led', 'developed', 'designed', 'implemented', 'created', 'built', 'engineered',
    'architected', 'optimized', 'reduced', 'increased', 'improved', 'analyzed', 'collaborated',
    'communicated', 'coordinated', 'launched', 'mentored', 'innovated', 'resolved', 'spearheaded'
]

const PROHIBITED_WORDS = [
    'ninja', 'rockstar', 'guru', 'expert', 'passionate', 'hardworking' // Subjective filler
]

export function calculateResmueScore(data: ParsedResume): ScoringResult {
    let score = 0
    const breakdown = {
        sectionScore: 0,
        contactScore: 0,
        keywordScore: 0,
        formattingScore: 0
    }
    const details: string[] = []
    const improvements: string[] = []

    // 1. Section Completeness (Max 40)
    const requiredSections = ['EXPERIENCE', 'EDUCATION', 'SKILLS', 'SUMMARY'] // or PROJECTS
    let sectionsFoundCount = 0
    const sectionsFound = data.sections.map(s => s.title)

    requiredSections.forEach(req => {
        // loose match
        if (sectionsFound.some(s => s.includes(req))) {
            sectionsFoundCount++
            details.push(`Found section: ${req}`)
        } else {
            improvements.push(`Missing important section: ${req}. consider adding it.`)
        }
    })

    // Scale 0-4 sections to 0-40 points
    breakdown.sectionScore = (sectionsFoundCount / requiredSections.length) * 40
    score += breakdown.sectionScore

    // 2. Contact Info (Max 15)
    if (data.email) {
        breakdown.contactScore += 5
        details.push("Email detected")
    } else {
        improvements.push("Email address not found or unreadable.")
    }

    if (data.phone) {
        breakdown.contactScore += 5
        details.push("Phone number detected")
    } else {
        improvements.push("Phone number not found.")
    }

    if (data.links && data.links.length > 0) {
        breakdown.contactScore += 5
        details.push(`${data.links.length} Link(s) detected (LinkedIn/Portfolio)`)
    } else {
        improvements.push("No links found (e.g. LinkedIn).")
    }
    score += breakdown.contactScore

    // 3. Keyword/Content Analysis (Max 25)
    const allText = data.text.toLowerCase()

    // Action Verbs
    let verbCount = 0
    ACTION_VERBS.forEach(verb => {
        if (allText.includes(verb)) verbCount++
    })

    if (verbCount > 5) {
        breakdown.keywordScore += 15
        details.push(`Good use of action verbs (${verbCount} found)`)
    } else {
        breakdown.keywordScore += Math.max(0, verbCount * 2)
        improvements.push(`Weak use of action verbs. Try using words like 'Managed', 'Developed', 'Optimized'.`)
    }

    // Prohibited words check
    /* const fillerWords = PROHIBITED_WORDS.filter(w => allText.includes(w))
    if (fillerWords.length > 0) {
        improvements.push(`Avoid subjective cliches: ${fillerWords.join(', ')}`)
    } */

    // Length Check (part of content/keyword score approx)
    if (data.text.length > 500 && data.text.length < 5000) {
        breakdown.keywordScore += 10
        details.push("Resume length is optimal")
    } else if (data.text.length < 500) {
        improvements.push("Resume is too short. Elaborate on your experience.")
    }
    score += breakdown.keywordScore

    // 4. Formatting (Max 20)
    // Bullet points heuristic: count '•' or '-' inside sections
    const bulletCount = (data.text.match(/•| - /g) || []).length
    if (bulletCount > 5) {
        breakdown.formattingScore += 20
        details.push("Good use of bullet points")
    } else {
        breakdown.formattingScore += 5
        improvements.push("Use more bullet points for readability.")
    }
    score += breakdown.formattingScore

    return {
        score: Math.min(100, Math.round(score)),
        breakdown,
        details,
        improvements
    }
}
