'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, AlertTriangle, XCircle, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'
import { ParsedResume } from '@/lib/resume-parser'
import { ScoringResult } from '@/lib/scoring'

interface AnalysisViewProps {
    data: ParsedResume
    scoring?: ScoringResult
}

// Helper to get a brief summary line
function getSectionSummary(title: string, content: string): string {
    const lines = content.split('\n').filter(l => l.trim().length > 0)
    if (lines.length === 0) return "No content detected."

    const upperTitle = title.toUpperCase()

    if (upperTitle.includes('SKILL')) {
        // e.g. "Python, Java, React..."
        // Join top 3 lines or comma sep
        const topSkills = lines.slice(0, 3).join(', ').substring(0, 100)
        return `Found ${lines.length} skill entries. Top: ${topSkills}...`
    }

    if (upperTitle.includes('EDUCATION')) {
        // usually "Degree Name"
        return lines[0].substring(0, 100)
    }

    if (upperTitle.includes('EXPERIENCE') || upperTitle.includes('WORK') || upperTitle.includes('EMPLOYMENT')) {
        // Try to count dates? or just "X lines of text"
        return `Contains ${lines.length} lines of text. Latest: ${lines[0].substring(0, 50)}...`
    }

    if (upperTitle.includes('PROJECT')) {
        return `Found ${lines.length} project entries. First: ${lines[0].substring(0, 50)}...`
    }

    // Default: First line truncated
    return lines[0].substring(0, 120) + (content.length > 120 ? '...' : '')
}

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { JDMatchView } from './jd-match-view'

export function AnalysisView({ data, scoring }: AnalysisViewProps) {
    const score = scoring?.score || 0
    const color = score >= 80 ? 'text-green-600' :
        score >= 60 ? 'text-amber-600' :
            'text-red-600';

    return (
        <div className="space-y-6">
            <Tabs defaultValue="general" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-8">
                    <TabsTrigger value="general">General ATS Analysis</TabsTrigger>
                    <TabsTrigger value="jd-match">Job Match Analysis</TabsTrigger>
                </TabsList>

                <TabsContent value="general" className="space-y-6">
                    {/* Overview Cards */}
                    <div className="grid gap-6 md:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>ATS Compatibility Score</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-end gap-2 mb-2">
                                    <span className={`text-5xl font-bold ${color}`}>{score}</span>
                                    <span className="text-gray-500 mb-2">/ 100</span>
                                </div>
                                <Progress value={score} className="h-2 mb-2" />
                                <p className="text-sm text-gray-500">
                                    {score >= 80 ? 'Excellent! Your resume is well-optimized.' :
                                        score >= 60 ? 'Good start, but there are areas for improvement.' :
                                            'Needs significant improvements to pass ATS filters.'}
                                </p>

                                {scoring && (
                                    <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                                        <div>Completeness: {Math.round(scoring.breakdown.sectionScore)}/40</div>
                                        <div>Keywords: {Math.round(scoring.breakdown.keywordScore)}/25</div>
                                        <div>Formatting: {Math.round(scoring.breakdown.formattingScore)}/20</div>
                                        <div>Contact Info: {Math.round(scoring.breakdown.contactScore)}/15</div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Improvements & Issues */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Improvement Areas</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                {scoring?.improvements && scoring.improvements.length > 0 ? (
                                    scoring.improvements.map((imp: string, i: number) => (
                                        <div key={i} className="flex items-start gap-2 text-sm text-amber-600 dark:text-amber-500">
                                            <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
                                            <span>{imp}</span>
                                        </div>
                                    ))
                                ) : (
                                    <div className="flex items-center gap-2 text-sm text-green-600">
                                        <CheckCircle className="h-4 w-4" />
                                        <span>No major issues detected!</span>
                                    </div>
                                )}

                                {scoring?.details && (
                                    <div className="mt-4 pt-4 border-t space-y-2">
                                        <p className="font-semibold text-sm">Highlights</p>
                                        {scoring.details.map((det: string, i: number) => (
                                            <div key={i} className="flex items-center gap-2 text-sm text-green-600 dark:text-green-500">
                                                <CheckCircle className="h-4 w-4" />
                                                <span>{det}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid gap-6 md:grid-cols-3">
                        {/* Contact Information Card */}
                        <Card className="md:col-span-1 h-fit">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <span className="text-primary">Contact Details</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 text-sm">
                                <div>
                                    <p className="text-xs text-muted-foreground font-semibold uppercase mb-1">Email</p>
                                    {data.email ? (
                                        <a href={`mailto:${data.email}`} className="text-blue-600 hover:underline break-all block">
                                            {data.email}
                                        </a>
                                    ) : (
                                        <div className="flex items-center gap-2 text-amber-600">
                                            <AlertTriangle className="h-3 w-3" /> <span className="text-xs">Not found</span>
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <p className="text-xs text-muted-foreground font-semibold uppercase mb-1">Phone</p>
                                    {data.phone ? (
                                        <p className="font-mono text-gray-700 dark:text-gray-300">{data.phone}</p>
                                    ) : (
                                        <div className="flex items-center gap-2 text-amber-600">
                                            <AlertTriangle className="h-3 w-3" /> <span className="text-xs">Not found</span>
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <p className="text-xs text-muted-foreground font-semibold uppercase mb-1">Links</p>
                                    {data.links && data.links.length > 0 ? (
                                        <ul className="space-y-1">
                                            {data.links.map((link, i) => (
                                                <li key={i}>
                                                    <a href={link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline truncate block w-full">
                                                        {link.replace(/^https?:\/\//, '')}
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-xs text-gray-400 italic">No links detected</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Extracted Sections - Spans 2 cols */}
                        <Card className="md:col-span-2">
                            <CardHeader>
                                <CardTitle>Extracted Sections</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {data.sections.length === 0 ? (
                                    <div className="text-center text-gray-500 py-8">
                                        No distinct sections found. Ensure standard headers are used (e.g., Experience, Education).
                                    </div>
                                ) : (
                                    data.sections.map((section, index) => {
                                        const title = section.title.toUpperCase()
                                        return (
                                            <div key={index} className="flex flex-col gap-2 border-b last:border-0 pb-4 last:pb-0">
                                                <div className="flex items-center justify-between">
                                                    <h3 className="text-sm font-semibold uppercase">{section.title}</h3>
                                                    <Badge variant="outline" className="text-[10px] h-5">
                                                        {section.content.length} chars
                                                    </Badge>
                                                </div>

                                                <div className="text-xs text-muted-foreground">
                                                    {title.includes('SKILL') ? (
                                                        <div className="flex flex-wrap gap-1.5">
                                                            {section.content.split(/[\n,]+/).map(s => s.trim()).filter(s => s.length > 0).map((skill, i) => (
                                                                <span key={i} className="inline-flex items-center rounded-sm bg-secondary px-1.5 py-0.5 text-[10px] font-medium text-secondary-foreground ring-1 ring-inset ring-black/5 dark:ring-white/10">
                                                                    {skill}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <div className="whitespace-pre-wrap line-clamp-4 leading-relaxed opacity-90">
                                                            {section.content}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )
                                    })
                                )}

                                <div className="pt-8 border-t">
                                    <details className="cursor-pointer group">
                                        <summary className="text-sm font-medium text-gray-500 hover:text-gray-700 flex items-center gap-2 select-none">
                                            <ChevronDown className="h-4 w-4 group-open:hidden" />
                                            <ChevronUp className="h-4 w-4 hidden group-open:block" />
                                            Full Resume Content (Debug)
                                        </summary>
                                        <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-md text-xs font-mono overflow-auto max-h-[500px] whitespace-pre-wrap border shadow-inner">
                                            {data.text || "No text content available."}
                                        </div>
                                    </details>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="jd-match">
                    <JDMatchView resumeData={data} />
                </TabsContent>
            </Tabs>
        </div>
    )
}
