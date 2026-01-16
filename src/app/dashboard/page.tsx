'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AnalysisView } from '@/components/analysis-view'
import { ResumeUpload } from '@/components/resume-upload'
import { createClient } from '@/lib/supabase/client'
import { ParsedResume } from '@/lib/resume-parser'
import { ScoringResult } from '@/lib/scoring'

export default function DashboardPage() {
    const [analyzedData, setAnalyzedData] = useState<ParsedResume | null>(null)
    const [scoringData, setScoringData] = useState<ScoringResult | undefined>(undefined)
    const [isLoading, setIsLoading] = useState(true)
    const [stats, setStats] = useState({ total: 0, avgScore: 0 })

    const handleAnalysisComplete = (data: ParsedResume, scoring?: ScoringResult) => {
        setAnalyzedData(data)
        setScoringData(scoring)
    }

    useEffect(() => {
        const loadDashboardData = async () => {
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            // 1. Fetch Stats
            const { data: resumes, error } = await supabase
                .from('resumes')
                .select('ats_score, parsed_data')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })

            if (resumes && resumes.length > 0) {
                const total = resumes.length
                const totalScore = resumes.reduce((acc, curr) => acc + (curr.ats_score || 0), 0)
                const avgScore = total > 0 ? Math.round(totalScore / total) : 0
                setStats({ total, avgScore })

                // 2. Load Latest Resume (if not already set via upload)
                if (!analyzedData) {
                    const latest = resumes[0]
                    // Cast potential unknown DB JSON to typed objects
                    const pData = latest.parsed_data as any
                    if (pData) {
                        // Ensure we separate the scoring part if it's mixed in, or pass it cleanly
                        // My database writes: parsed_data = { ...parsedData, scoring: scoringResult }
                        const { scoring, ...cleanResumeData } = pData

                        setAnalyzedData(cleanResumeData as ParsedResume)
                        if (scoring) {
                            setScoringData(scoring as ScoringResult)
                        } else if (pData.scoring) {
                            setScoringData(pData.scoring as ScoringResult)
                        }
                    }
                }
            }
            setIsLoading(false)
        }

        loadDashboardData()
    }, []) // Run once on mount

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>

            {/* Stats Overview */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Resumes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {isLoading ? '...' : stats.total}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg. ATS Score</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {isLoading ? '...' : stats.avgScore}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {isLoading ? (
                <div className="flex justify-center p-12">
                    <div className="animate-pulse text-gray-500">Loading your data...</div>
                </div>
            ) : !analyzedData ? (
                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center animate-in fade-in zoom-in duration-500">
                    <div className="mx-auto flex w-full max-w-[420px] flex-col items-center justify-center text-center">
                        <h3 className="mt-4 text-lg font-semibold">Start your first analysis</h3>
                        <div className="mt-4 w-full">
                            <ResumeUpload onAnalysisComplete={handleAnalysisComplete} />
                        </div>
                    </div>
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg border">
                        <span className="text-sm text-gray-600">Showing latest analysis</span>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => {
                                    setAnalyzedData(null)
                                    setScoringData(undefined)
                                }}
                                className="text-sm text-blue-600 hover:underline"
                            >
                                Upload New
                            </button>
                        </div>
                    </div>
                    <AnalysisView data={analyzedData} scoring={scoringData} />
                </div>
            )}
        </div>
    )
}
