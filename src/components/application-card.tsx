
'use client'

import { Application } from '@/lib/actions/applications'
import { formatDistanceToNow } from 'date-fns'
import { Building2, Calendar, Link as LinkIcon, MoreVertical, Trash } from 'lucide-react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { deleteApplication } from '@/lib/actions/applications'
import { toast } from 'sonner'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface ApplicationCardProps {
    application: Application
}

export function ApplicationCard({ application }: ApplicationCardProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: application.id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    }

    const handleDelete = async () => {
        const result = await deleteApplication(application.id)
        if (result.error) {
            toast.error(result.error)
        } else {
            toast.success('Application deleted')
        }
    }

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="touch-none">
            <Card className="cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow">
                <CardHeader className="p-4 pb-2 flex flex-row items-start justify-between space-y-0">
                    <div className="space-y-1">
                        <CardTitle className="text-sm font-medium leading-none">
                            {application.position}
                        </CardTitle>
                        <div className="flex items-center text-xs text-muted-foreground">
                            <Building2 className="mr-1 h-3 w-3" />
                            {application.company_name}
                        </div>
                    </div>
                    <div onPointerDown={(e) => e.stopPropagation()}>
                        {/* Stop propagation so dragging doesn't start when clicking menu */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-6 w-6 -mr-2">
                                    <MoreVertical className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={handleDelete} className="text-red-600">
                                    <Trash className="mr-2 h-4 w-4" />
                                    Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </CardHeader>
                <CardContent className="p-4 pt-2 space-y-2">
                    {application.salary_range && (
                        <div className="text-xs text-muted-foreground">
                            {application.salary_range}
                        </div>
                    )}

                    <div className="flex items-center justify-between pt-2 border-t">
                        <div className="flex items-center text-xs text-muted-foreground" title={new Date(application.created_at).toLocaleString()}>
                            <Calendar className="mr-1 h-3 w-3" />
                            {formatDistanceToNow(new Date(application.created_at), { addSuffix: true })}
                        </div>
                        {application.job_link && (
                            <a
                                href={application.job_link}
                                target="_blank"
                                rel="noreferrer"
                                className="text-xs text-blue-500 hover:underline flex items-center"
                                onPointerDown={(e) => e.stopPropagation()}
                            >
                                <LinkIcon className="mr-1 h-3 w-3" />
                                Link
                            </a>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
