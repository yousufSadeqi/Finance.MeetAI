'use client'

import { ColumnDef } from "@tanstack/react-table"
import { MeetingGetMany } from "../../types"
import { GeneratedAvatar } from "@/components/avatar-generator"
import {
  CircleCheckIcon,
  CircleXIcon,
  ClockArrowUpIcon,
  ClockFadingIcon,
  CornerDownRight,
  LoaderIcon,
  VideoIcon,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import humanizeDuration from 'humanize-duration'
import { format } from "date-fns"
import { cn } from "@/lib/utils"

// Format seconds into human-readable duration
function formatDuration(seconds: number) {
  return humanizeDuration(seconds * 1000, {
    largest: 1,
    round: true,
    units: ['h', 'm', 's'],
  })
}

// Maps status to icon
const statusIconMap = {
  upcoming: ClockArrowUpIcon,
  active: LoaderIcon,
  completed: CircleCheckIcon,
  processing: LoaderIcon,
  cancelled: CircleXIcon,
}

// Maps status to color class
const statusColorMap = {
  upcoming: "text-yellow-400",
  active: "text-green-500",
  completed: "text-indigo-500",
  processing: "text-amber-500",
  cancelled: "text-red-500",
}

export const columns: ColumnDef<MeetingGetMany[number]>[] = [
  {
    accessorKey: "name",
    header: "Meeting Name",
    cell: (row) => (
      <div className="flex flex-col gap-1">
        <span className="font-semibold">{row.row.original.name}</span>

        <div className="flex items-start gap-1 pl-11">
          <CornerDownRight className="size-4 text-muted-foreground mt-1" />
          <span className="text-xs text-muted-foreground max-w-[250px] truncate capitalize">
            {row.row.original.agent.name}
          </span>
        </div>

        <GeneratedAvatar
          variant="botttsNeutral"
          seed={row.row.original.agent.name}
          className="size-4"
        />

        <span className="text-sm text-muted-foreground">
          {row.row.original.startedAt ? format(row.row.original.startedAt, 'MMM d') : ''}
        </span>
      </div>
    )
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: (row) => {
      const status = row.row.original.status as keyof typeof statusIconMap
      const IconComponent = statusIconMap[status]

      return (
        <Badge
          variant="outline"
          className={cn(
            'capitalize flex items-center gap-x-1 [&>svg]:size-4 text-muted-foreground',
            statusColorMap[status]
          )}
        >
          {IconComponent && (
            <IconComponent
              className={cn(
                status === 'processing' && 'animate-spin'
              )}
            />
          )}
          {status}
        </Badge>
      )
    }
  },
  {
    accessorKey: 'duration',
    header: 'Duration',
    cell: ({ row }) => (
      <Badge
        variant='outline'
        className="capitalize [&>svg]:size-4 flex items-center gap-x-2"
      >
        <ClockFadingIcon className="text-blue-700" />
        {row.original.duration
          ? formatDuration(row.original.duration)
          : 'No duration'}
      </Badge>
    )
  }
]
