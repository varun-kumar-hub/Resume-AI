import PDFParser from 'pdf2json'
import mammoth from 'mammoth'

// ... existing code ...

export type ResumeSection = {
    title: string
    content: string
}

export type ParsedResume = {
    text: string
    email?: string
    phone?: string
    links: string[]
    sections: ResumeSection[]
}

export async function extractTextFromFile(file: File): Promise<string> {
    console.log('PARSER: extractTextFromFile called for', file.name, file.type)
    const buffer = Buffer.from(await file.arrayBuffer())
    console.log('PARSER: Buffer created, size:', buffer.length)
    const type = file.type

    try {
        if (type === 'application/pdf') {
            console.log('PARSER: Processing PDF with pdf2json...')

            return new Promise((resolve, reject) => {
                const pdfParser = new PDFParser(null, true); // true = Text content only

                pdfParser.on("pdfParser_dataError", (errData: any) => {
                    console.error('PARSER: pdf2json Error:', errData.parserError)
                    reject(new Error(errData.parserError))
                });

                pdfParser.on("pdfParser_dataReady", (pdfData: any) => {
                    const rawText = pdfParser.getRawTextContent()
                    console.log('PARSER: PDF parsed. Raw text length:', rawText.length)

                    // Deep Inspection
                    if (pdfData && pdfData.Pages && pdfData.Pages.length > 0) {
                        const firstPage = pdfData.Pages[0];
                        console.log('PARSER: Page 1 Text Elements Count:', firstPage.Texts.length)
                        if (firstPage.Texts.length > 0) {
                            // Decode first few text elements
                            // pdf2json text is usually URL encoded
                            const sample = firstPage.Texts.slice(0, 5).map((t: any) => decodeURIComponent(t.R[0].T)).join(' ');
                            console.log('PARSER: Sample Text Content:', sample)
                        } else {
                            console.log('PARSER: Page 1 has NO Text Elements.')
                        }
                    }

                    resolve(rawText)
                });

                // pdf2json expects a buffer directly? No, it often works with file paths or manual parsing.
                // parseBuffer is available in newer versions.
                pdfParser.parseBuffer(buffer);
            })

        } else if (
            type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ) {
            console.log('PARSER: Processing DOCX...')
            const result = await mammoth.extractRawText({ buffer })
            console.log('PARSER: DOCX parsed. Text length:', result.value.length)
            return result.value
        }
    } catch (e) {
        console.error('PARSER: Extraction Error:', e)
        throw e
    }

    throw new Error('Unsupported file type')
}


// Helper to clean extracted text
function cleanText(text: string): string {
    return text
        // Remove multiple spaces
        .replace(/\s+/g, ' ')
        // Fix spaced-out characters (e.g., "E X P E R I E N C E" -> "EXPERIENCE")
        // This is a naive heuristic: if we see many single chars separated by spaces, join them.
        .replace(/([A-Z])\s(?=[A-Z]\s)/g, '$1')
        .trim()
}

// Deterministic Section Parsing Logic
export function parseResumeSections(text: string): ParsedResume {
    // 1. Initial cleanup
    // We split by newline, but some PDFs might have weird spacing.
    const lines = text.split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)

    // Basic Regex for Contact Info
    const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/
    // Phone: Matches various formats: (123) 456-7890, 123-456-7890, +1 123 456 7890
    const phoneRegex = /(\+?\d{1,3}[-. ]?)?\(?\d{3}\)?[-. ]?\d{3}[-. ]?\d{4}/
    const urlRegex = /(https?:\/\/[^\s]+)|(www\.[^\s]+)/g

    // Search contact info in the raw text (often more reliable before splitting)
    // Clean text for contact search to handle spacing issues e.g. "e m a i l @ c o m"
    const emailMatch = text.match(emailRegex)
    const phoneMatch = text.match(phoneRegex)
    const links = text.match(urlRegex) || []

    // Section Headers Keywords (Expanded and Robust)
    const sectionKeywords: Record<string, string[]> = {
        EXPERIENCE: ['EXPERIENCE', 'WORK EXPERIENCE', 'EMPLOYMENT HISTORY', 'PROFESSIONAL EXPERIENCE', 'WORK HISTORY'],
        EDUCATION: ['EDUCATION', 'ACADEMIC BACKGROUND', 'QUALIFICATIONS', 'ACADEMIC HISTORY'],
        SKILLS: ['SKILLS', 'TECHNICAL SKILLS', 'CORE COMPETENCIES', 'TECHNOLOGIES', 'SKILLS & EXPERTISE'],
        PROJECTS: ['PROJECTS', 'PERSONAL PROJECTS', 'ACADEMIC PROJECTS', 'KEY PROJECTS'],
        SUMMARY: ['SUMMARY', 'PROFESSIONAL SUMMARY', 'PROFILE', 'OBJECTIVE', 'ABOUT ME', 'BIO'],
    }

    const sections: ResumeSection[] = []
    let currentSection: ResumeSection | null = null

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i]
        const cleanLine = cleanText(line) // Remove excess internal spacing
        const upperLine = cleanLine.toUpperCase()

        // Detect Section Header
        let isHeader = false
        for (const [key, keywords] of Object.entries(sectionKeywords)) {
            // Check for exact match or typical header formats
            // Allow for bullet points or leading/trailing symbols
            const isMatch = keywords.some(k =>
                upperLine === k ||
                upperLine === k + ':' ||
                upperLine.startsWith(k + ' ') || // Header followed by text on same line? (riskier)
                upperLine.endsWith(' ' + k) // Rare
            )

            // Heuristic: Headers are usually short.
            // If "EXPERIENCE" is found but the line is 100 chars long, it's likely a sentence containing the word.
            if (isMatch && cleanLine.length < 50) {
                if (currentSection) {
                    sections.push(currentSection)
                }
                currentSection = {
                    title: key,
                    content: ''
                }
                isHeader = true
                break
            }
        }

        if (!isHeader && currentSection) {
            currentSection.content += line + '\n'
        } else if (!isHeader && !currentSection) {
            // Attempt to capture Name/Header info into a "Contact" or "Header" pseudo-section?
            // For now, ignore or store in a default 'Summary' if it looks like summary?
        }
    }

    if (currentSection) {
        sections.push(currentSection)
    }

    return {
        text,
        email: emailMatch ? emailMatch[0] : undefined,
        phone: phoneMatch ? phoneMatch[0] : undefined,
        links: links,
        sections: sections
    }
}

