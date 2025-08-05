import { ReactNode, useState } from "react";
import { Button } from "./ui/button";
import { ChevronsUpDownIcon } from "lucide-react";
import {
  CommandInput,
  CommandResponsiveDialog,
} from "./ui/command";
import {
  CommandEmpty,
  CommandItem,
  CommandList,
} from "cmdk";
import { cn } from "@/lib/utils";

interface Props {
  options: Array<{
    id: string;
    value: string;
    children: ReactNode;
  }>;
  onSelect: (value: string) => void;
  onSearch: (value: string) => void;
  value?: string;
  placeholder?: string;
  isSearchable?: boolean;
  className?: string;
}

export const CommandSelect = ({
  options,
  onSelect,
  onSearch,
  value,
  placeholder = "Select an option",
  isSearchable = true,
  className,
}: Props) => {
  const [open, setOpen] = useState(false);
  const selectedOption = options.find((option) => option.value === value);

  const handleOpenChange = (val: boolean) => {
    onSearch?.("");
    setOpen(val);
  };

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        type="button"
        variant="outline"
        className={cn(
          "h-9 min-w-[180px] justify-between font-medium text-sm px-3 rounded-xl shadow-sm border-muted bg-background hover:bg-muted transition-colors",
          !selectedOption && "text-muted-foreground",
          className,
        )}
      >
        <div className="truncate text-left flex-1">
          {selectedOption?.children ?? placeholder}
        </div>
        <ChevronsUpDownIcon className="ml-2 h-4 w-4 opacity-60" />
      </Button>

      <CommandResponsiveDialog
        open={open}
        onOpenChange={handleOpenChange}
      >
        <div className="p-3 space-y-2">
          {isSearchable && (
            <CommandInput
              placeholder="Search..."
              onValueChange={onSearch}
              className="rounded-md border px-3 py-2 text-sm"
            />
          )}

          <CommandList className="max-h-60 overflow-y-auto">
            <CommandEmpty>
              <div className="text-muted-foreground text-sm px-3 py-2">
                No options found.
              </div>
            </CommandEmpty>

            {options.map((option) => (
              <CommandItem
                key={option.id}
                onSelect={() => {
                  onSelect(option.value);
                  setOpen(false);
                }}
                className="px-3 py-2 text-sm cursor-pointer hover:bg-accent rounded-md transition-colors"
              >
                {option.children}
              </CommandItem>
            ))}
          </CommandList>
        </div>
      </CommandResponsiveDialog>
    </>
  );
};
 