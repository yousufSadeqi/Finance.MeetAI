import {
  CircleCheckIcon,
  CircleXIcon,
  ClockArrowUpIcon,
  LoaderIcon,
  VideoIcon,
} from "lucide-react";
import { UseMeetingsFilters } from "../../hooks/use-meetings-fliters";
import { CommandSelect } from "@/components/command-select";
import { MeetingsStatus } from "../../types";

const options = [
  {
    id: MeetingsStatus.Upcoming,
    value: MeetingsStatus.Upcoming,
    children: (
      <div className="flex items-center gap-x-2 capitalize">
        <ClockArrowUpIcon className="h-4 w-4 text-blue-500" />
        <span>Upcoming</span>
      </div>
    ),
  },
  {
    id: MeetingsStatus.Completed,
    value: MeetingsStatus.Completed,
    children: (
      <div className="flex items-center gap-x-2 capitalize">
        <CircleCheckIcon className="h-4 w-4 text-green-600" />
        <span>Completed</span>
      </div>
    ),
  },
  {
    id: MeetingsStatus.Active,
    value: MeetingsStatus.Active,
    children: (
      <div className="flex items-center gap-x-2 capitalize">
        <VideoIcon className="h-4 w-4 text-purple-600" />
        <span>Active</span>
      </div>
    ),
  },
  {
    id: MeetingsStatus.Processing,
    value: MeetingsStatus.Processing,
    children: (
      <div className="flex items-center gap-x-2 capitalize">
        <LoaderIcon className="h-4 w-4 animate-spin text-yellow-600" />
        <span>Processing</span>
      </div>
    ),
  },
  {
    id: MeetingsStatus.Cancelled,
    value: MeetingsStatus.Cancelled,
    children: (
      <div className="flex items-center gap-x-2 capitalize">
        <CircleXIcon className="h-4 w-4 text-red-600" />
        <span>Cancelled</span>
      </div>
    ),
  },
];

export const MeetingsStatusFilter = () => {
  const [filters, setFilters] = UseMeetingsFilters();

  return (
    <CommandSelect
      placeholder="Filter by status"
      className="h-9 min-w-[180px] text-sm"
      options={options}
      value={filters.status ?? ""}
      onSelect={(value) => setFilters({ status: value as MeetingsStatus })}
      onSearch={() => {}}
    />
  );
};
