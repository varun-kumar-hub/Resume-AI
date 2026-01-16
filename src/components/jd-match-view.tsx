'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { ParsedResume } from '@/lib/resume-parser'
import { calculateJDMatch, JDMatchResult } from '@/lib/jd-analysis'
import { CheckCircle, XCircle, Briefcase, Search } from 'lucide-react'

interface JDMatchViewProps {
    resumeData: ParsedResume
}

export function JDMatchView({ resumeData }: JDMatchViewProps) {
    const [jdText, setJdText] = useState('')
    const [result, setResult] = useState<JDMatchResult | null>(null)
    const [isAnalyzing, setIsAnalyzing] = useState(false)

    const handleAnalyze = () => {
        if (!jdText.trim()) return

        setIsAnalyzing(true)
        // Simulate small delay for UX
        setTimeout(() => {
            const res = calculateJDMatch(resumeData, jdText)
            setResult(res)
            setIsAnalyzing(false)
        }, 600)
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Briefcase className="h-5 w-5" />
                        Target Job Description
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-sm text-gray-500">
                        Paste the full job description here to see how well your resume matches the specific requirements.
                    </p>
                    <textarea
                        placeholder="Paste Job Description text here..."
                        className="flex min-h-[150px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 font-mono"
                        value={jdText}
                        onChange={(e) => setJdText(e.target.value)}
                    />
                    <div className="flex justify-end">
                        <Button onClick={handleAnalyze} disabled={!jdText.trim() || isAnalyzing}>
                            {isAnalyzing ? (
                                <>
                                    <Search className="mr-2 h-4 w-4 animate-spin" />
                                    Analyzing...
                                </>
                            ) : (
                                "Analyze Match"
                            )}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {result && (
                <div className="grid gap-6 md:grid-cols-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {/* Score Card */}
                    <Card className="border-l-4 border-l-blue-500">
                        <CardHeader className="pb-2">
                            <CardTitle>JD Match Score</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-end gap-2 mb-2">
                                <span className={`text-5xl font-bold ${result.score >= 80 ? 'text-green-600' :
                                    result.score >= 50 ? 'text-amber-600' : 'text-red-500'
                                    }`}>
                                    {result.score}%
                                </span>
                                <Badge variant={
                                    result.verdict === 'Strong Match' ? 'default' :
                                        result.verdict === 'Weak Match' ? 'destructive' : 'secondary'
                                } className="mb-2">
                                    {result.verdict}
                                </Badge>
                            </div>
                            <Progress value={result.score} className="h-3" />
                            <p className="text-xs text-gray-500 mt-2">
                                Based on {result.details.totalKeywordsFound} keywords extracted from the JD.
                            </p>
                        </CardContent>
                    </Card>

                    {/* Quick Stats */}
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle>Gap Analysis</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 gap-4 text-center">
                            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                <div className="text-2xl font-bold text-green-700 dark:text-green-500">
                                    {result.matchedKeywords.length}
                                </div>
                                <div className="text-xs text-green-800 dark:text-green-400 font-medium">Matched Skills</div>
                            </div>
                            <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                                <div className="text-2xl font-bold text-red-700 dark:text-red-500">
                                    {result.missingKeywords.length}
                                </div>
                                <div className="text-xs text-red-800 dark:text-red-400 font-medium">Missing Skills</div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Missing Skills (High Priority) */}
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle className="text-red-600 dark:text-red-400 flex items-center gap-2">
                                <XCircle className="h-5 w-5" />
                                Missing Keywords (Add these!)
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {result.missingKeywords.length === 0 ? (
                                <p className="text-green-600">Perfect match! No missing keywords found.</p>
                            ) : (
                                <div className="flex flex-wrap gap-2">
                                    {result.missingKeywords.map(kw => (
                                        <Badge key={kw} variant="outline" className="text-red-600 border-red-200 bg-red-50 hover:bg-red-100">
                                            {kw}
                                        </Badge>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Matched Skills */}
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle className="text-green-600 dark:text-green-400 flex items-center gap-2">
                                <CheckCircle className="h-5 w-5" />
                                Matched Keywords
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {result.matchedKeywords.length === 0 ? (
                                <p className="text-gray-500">No overlap found. Try adding more tech skills.</p>
                            ) : (
                                <div className="flex flex-wrap gap-2">
                                    {result.matchedKeywords.map(kw => (
                                        <Badge key={kw} variant="secondary" className="text-green-700 bg-green-100 hover:bg-green-200">
                                            {kw}
                                        </Badge>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    )
}
