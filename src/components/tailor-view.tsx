
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Loader2, Wand2, Copy, Check } from 'lucide-react'
import { generateCoverLetter, tailorResume } from '@/lib/actions/generate'
import { toast } from 'sonner'

interface Resume {
    id: string
    name?: string
    file_name: string
}

interface TailorViewProps {
    resumes: Resume[]
}

export function TailorView({ resumes }: TailorViewProps) {
    const [selectedResumeId, setSelectedResumeId] = useState<string>(resumes[0]?.id || '')
    const [jobDescription, setJobDescription] = useState('')
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState<{
        type: 'cover-letter' | 'tailor' | null
        content?: string
        suggestions?: any[]
    }>({ type: null })
    const [copied, setCopied] = useState(false)

    const handleGenerateCoverLetter = async () => {
        if (!selectedResumeId || !jobDescription) {
            toast.error('Please select a resume and paste a job description')
            return
        }

        setLoading(true)
        setResult({ type: null }) // Reset

        try {
            const data = await generateCoverLetter(selectedResumeId, jobDescription)
            if (data.success && data.content) {
                setResult({ type: 'cover-letter', content: data.content })
                toast.success('Cover letter generated!')
            } else {
                toast.error(data.error || 'Failed to generate')
            }
        } catch (e) {
            toast.error('An error occurred')
        } finally {
            setLoading(false)
        }
    }

    const handleTailorResume = async () => {
        if (!selectedResumeId || !jobDescription) {
            toast.error('Please select a resume and paste a job description')
            return
        }

        setLoading(true)
        setResult({ type: null })

        try {
            const data = await tailorResume(selectedResumeId, jobDescription)
            if (data.success && data.data) {
                setResult({ type: 'tailor', suggestions: data.data.suggestions })
                toast.success('Suggestions generated!')
            } else {
                toast.error(data.error || 'Failed to generate')
            }
        } catch (e) {
            toast.error('An error occurred')
        } finally {
            setLoading(false)
        }
    }

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
        toast.success('Copied to clipboard')
    }

    return (
        <div className="grid gap-6 lg:grid-cols-2">
            {/* Input Section */}
            <div className="flex flex-col gap-6">
                <Card className="flex flex-col">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Wand2 className="h-5 w-5 text-purple-500" />
                            Generative AI Tools
                        </CardTitle>
                        <CardDescription>
                            Select a resume and job description to get started.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4 p-4">
                        <div className="space-y-2">
                            <Label>Select Resume</Label>
                            <Select value={selectedResumeId} onValueChange={setSelectedResumeId}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a resume" />
                                </SelectTrigger>
                                <SelectContent>
                                    {resumes.map((resume) => (
                                        <SelectItem key={resume.id} value={resume.id}>
                                            {resume.name || resume.file_name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2 flex-col">
                            <Label>Job Description</Label>
                            <Textarea
                                placeholder="Paste the job description here..."
                                className="min-h-[400px]"
                                value={jobDescription}
                                onChange={(e) => setJobDescription(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-4 pt-2">
                            <Button
                                onClick={handleTailorResume}
                                disabled={loading}
                                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                            >
                                {loading && result.type === 'tailor' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                Tailor Resume
                            </Button>
                            <Button
                                onClick={handleGenerateCoverLetter}
                                disabled={loading}
                                variant="secondary"
                                className="flex-1"
                            >
                                {loading && result.type === 'cover-letter' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                Generate Cover Letter
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Output Section */}
            <div>
                <Card className="flex flex-col overflow-hidden bg-gray-50/50 dark:bg-gray-900/50 border-dashed min-h-[500px]">
                    {!result.type && !loading && (
                        <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-8 text-center">
                            <Wand2 className="h-12 w-12 mb-4 opacity-20" />
                            <p>AI generated content will appear here.</p>
                        </div>
                    )}

                    {loading && (
                        <div className="flex-1 flex items-center justify-center">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    )}

                    {result.type === 'cover-letter' && result.content && (
                        <div className="flex-1 flex flex-col h-full">
                            <div className="p-4 border-b bg-background flex items-center justify-between">
                                <h3 className="font-semibold">Cover Letter</h3>
                                <Button variant="ghost" size="sm" onClick={() => copyToClipboard(result.content!)}>
                                    {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                                </Button>
                            </div>
                            <div className="flex-1 overflow-auto p-6 prose dark:prose-invert max-w-none text-sm whitespace-pre-wrap">
                                {result.content}
                            </div>
                        </div>
                    )}

                    {result.type === 'tailor' && result.suggestions && (
                        <div className="flex-1 flex flex-col h-full">
                            <div className="p-4 border-b bg-background">
                                <h3 className="font-semibold">Tailoring Suggestions</h3>
                            </div>
                            <div className="flex-1 overflow-auto p-4 space-y-4">
                                {result.suggestions.map((item: any, i: number) => (
                                    <Card key={i} className="bg-background">
                                        <CardHeader className="pb-2">
                                            <CardTitle className="text-sm font-medium text-red-500 line-through opacity-70">
                                                {item.original}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-2">
                                            <div className="text-sm font-medium text-green-600 dark:text-green-400">
                                                {item.improved}
                                            </div>
                                            <p className="text-xs text-muted-foreground italic">
                                                Why: {item.explanation}
                                            </p>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    )
}
