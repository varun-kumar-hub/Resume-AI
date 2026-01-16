'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { CloudUpload, FileText, Loader2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { analyzeResume } from '@/app/actions/analyze-resume'
import { ParsedResume } from '@/lib/resume-parser'
import { ScoringResult } from '@/lib/scoring'

interface ResumeUploadProps {
    onAnalysisComplete?: (data: ParsedResume, scoring?: ScoringResult) => void
}

export function ResumeUpload({ onAnalysisComplete }: ResumeUploadProps) {
    const [isUploading, setIsUploading] = useState(false)

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        const file = acceptedFiles[0]
        if (!file) return

        if (file.size > 5 * 1024 * 1024) {
            toast.error('File size too large', {
                description: 'Please upload a file smaller than 5MB.',
            })
            return
        }

        setIsUploading(true)
        const formData = new FormData()
        formData.append('file', file)

        try {
            const result = await analyzeResume(formData)

            if (result.success && result.data) {
                toast.success('Resume analyzed successfully!')
                if (onAnalysisComplete) {
                    onAnalysisComplete(result.data, result.scoring)
                }
            } else {

                toast.error('Analysis failed', {
                    description: result.error || 'Something went wrong.',
                })
            }

        } catch (error) {
            toast.error('Upload failed', {
                description: 'An unexpected error occurred.',
            })
        } finally {
            setIsUploading(false)
        }
    }, [onAnalysisComplete])


    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/pdf': ['.pdf'],
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
        },
        maxFiles: 1,
        multiple: false,
    })

    return (
        <Card className="mx-auto max-w-xl border-2 border-dashed border-gray-200 dark:border-gray-800">
            <CardContent className="p-0">
                <div
                    {...getRootProps()}
                    className={cn(
                        'flex flex-col items-center justify-center p-12 text-center transition-colors hover:cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900/50',
                        isDragActive && 'bg-blue-50 dark:bg-blue-900/20'
                    )}
                >
                    <input {...getInputProps()} />
                    {isUploading ? (
                        <div className="flex flex-col items-center gap-4">
                            <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
                            <div className="space-y-1">
                                <p className="font-medium text-gray-900 dark:text-gray-100">Analyzing your resume...</p>
                                <p className="text-sm text-gray-500">This usually takes a few seconds.</p>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="mb-4 rounded-full bg-blue-100 p-4 text-blue-600 dark:bg-blue-900/30">
                                <CloudUpload className="h-8 w-8" />
                            </div>
                            <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
                                Upload your resume
                            </h3>
                            <p className="mb-6 max-w-xs text-sm text-gray-500 dark:text-gray-400">
                                Drag and drop your resume here, or click to browse. Supports PDF and DOCX up to 5MB.
                            </p>
                            <Button size="sm" variant="outline" className="pointer-events-none">
                                Select File
                            </Button>
                        </>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
