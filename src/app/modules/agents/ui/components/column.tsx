"use client"

import { ColumnDef } from "@tanstack/react-table"
import { AgentGetMany, AgentGetOne } from "../../types"
import { GeneratedAvatar } from "@/components/avatar-generator"
import { CornerDownRight, VideoIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef<AgentGetMany[number]>[] = [
  {
    accessorKey: "name",
    header: "Agent Name",
    cell: (row) => (
  <div className="flex flex-col gap-1">
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-full overflow-hidden">
        <GeneratedAvatar
          variant="botttsNeutral"
          seed={row.row.original.name}
          className="w-full h-full"
        />
      </div>
      <span className="text-sm font-semibold text-foreground">
        {row.row.original.name}
      </span>
    </div>

    <div className="flex items-start gap-1 pl-11">
      <CornerDownRight className="size-4 text-muted-foreground mt-1" />
      <span className="text-xs text-muted-foreground max-w-[250px] truncate capitalize">
        {row.row.original.instruction}
      </span>
    </div>
  </div>
)

  },
  {
    accessorKey: "meetingCount",
    header: "Meetings",
    cell: (row) => (
      <Badge
        variant="outline"
        className="flex items-center gap-x-2 [&>svg]:size-4"
      >
        <VideoIcon className="text-blue-700" />
        {row.row.original.meetingCount} {row.row.original.meetingCount === 1 ? "Meeting" : "Meetings"}
      </Badge>
    ),
  }
]