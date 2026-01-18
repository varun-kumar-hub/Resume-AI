
'use client'

import { useState } from 'react'
import { MoreVertical, Pencil, Trash, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { updateResumeName, deleteResume } from '@/lib/actions/resumes'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface ResumeCardActionsProps {
    resumeId: string
    currentName: string
    fileName: string
}

export function ResumeCardActions({ resumeId, currentName, fileName }: ResumeCardActionsProps) {
    const [isRenameOpen, setIsRenameOpen] = useState(false)
    const [newName, setNewName] = useState(currentName || fileName)
    const [loading, setLoading] = useState(false)
    const router = useRouter() // Re-added router for refresh if needed, though server action revalidates

    const handleRename = async () => {
        setLoading(true)
        const result = await updateResumeName(resumeId, newName)
        setLoading(false)

        if (result.error) {
            toast.error(result.error)
        } else {
            toast.success('Resume renamed')
            setIsRenameOpen(false)
        }
    }

    const handleDelete = async () => {
        const result = await deleteResume(resumeId)
        if (result.error) {
            toast.error(result.error)
        } else {
            toast.success('Resume deleted')
        }
    }

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setIsRenameOpen(true)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Rename
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleDelete} className="text-red-600">
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <Dialog open={isRenameOpen} onOpenChange={setIsRenameOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Rename Resume</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <Input
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            placeholder="e.g. Frontend V1"
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsRenameOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleRename} disabled={loading}>
                            {loading ? 'Saving...' : 'Save'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
