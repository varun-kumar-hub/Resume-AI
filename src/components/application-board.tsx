
'use client'

import { useState } from 'react'
import {
    DndContext,
    DragOverlay,
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragStartEvent,
    DragOverEvent,
    DragEndEvent,
} from '@dnd-kit/core'
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { Application, ApplicationStatus, updateApplicationStatus } from '@/lib/actions/applications'
import { ApplicationCard } from './application-card'
import { toast } from 'sonner'

interface ApplicationBoardProps {
    initialApplications: Application[]
}

const COLUMNS: ApplicationStatus[] = ['Applied', 'Interviewing', 'Offer', 'Rejected']

export function ApplicationBoard({ initialApplications }: ApplicationBoardProps) {
    const [applications, setApplications] = useState<Application[]>(initialApplications)
    const [activeId, setActiveId] = useState<string | null>(null)

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event
        setActiveId(active.id as string)
    }

    const handleDragOver = (event: DragOverEvent) => {
        const { active, over } = event
        if (!over) return

        const activeId = active.id
        const overId = over.id

        if (activeId === overId) return

        const activeApp = applications.find((app) => app.id === activeId)
        // If over a container (column)
        if (COLUMNS.includes(overId as ApplicationStatus)) {
            // Logic handled in DragEnd for status change usually, 
            // but for visual "snap" we might need more complex logic. 
            // For simple kanban, we often just update status on drop.
            return;
        }
    }

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event

        if (!over) {
            setActiveId(null)
            return
        }

        const activeId = active.id as string
        const overId = over.id as string

        const activeApp = applications.find(app => app.id === activeId)
        if (!activeApp) return

        let newStatus = activeApp.status

        // Check if dropped on a column header or empty column area
        if (COLUMNS.includes(overId as ApplicationStatus)) {
            newStatus = overId as ApplicationStatus
        } else {
            // Dropped on another card
            const overApp = applications.find(app => app.id === overId)
            if (overApp) {
                newStatus = overApp.status
            }
        }

        if (newStatus !== activeApp.status) {
            // Optimistic update
            setApplications(apps => apps.map(app =>
                app.id === activeId ? { ...app, status: newStatus } : app
            ))

            // Server update
            const result = await updateApplicationStatus(activeId, newStatus)
            if (result.error) {
                toast.error('Failed to update status')
                // Revert
                setApplications(apps => apps.map(app =>
                    app.id === activeId ? { ...app, status: activeApp.status } : app
                ))
            }
        }

        setActiveId(null)
    }

    return (
        <DndContext
            id="application-board"
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
        >
            <div className="flex h-full gap-4 overflow-x-auto p-4">
                {COLUMNS.map((column) => (
                    <div key={column} className="flex h-full min-w-[300px] flex-col rounded-lg bg-muted/50 p-4">
                        <h3 className="mb-4 font-semibold flex items-center justify-between">
                            {column}
                            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                                {applications.filter((app) => app.status === column).length}
                            </span>
                        </h3>

                        <SortableContext
                            id={column}
                            items={applications.filter((app) => app.status === column).map((app) => app.id)}
                            strategy={verticalListSortingStrategy}
                        >
                            <div className="flex flex-1 flex-col gap-3 min-h-[100px]">
                                {applications
                                    .filter((app) => app.status === column)
                                    .map((app) => (
                                        <ApplicationCard key={app.id} application={app} />
                                    ))}
                            </div>
                        </SortableContext>
                    </div>
                ))}
            </div>

            <DragOverlay>
                {activeId ? (
                    <ApplicationCard
                        application={applications.find((app) => app.id === activeId)!}
                    />
                ) : null}
            </DragOverlay>
        </DndContext>
    )
}
