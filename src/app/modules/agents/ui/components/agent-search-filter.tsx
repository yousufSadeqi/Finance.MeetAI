import { cp } from "fs"
import { UseAgentFilters } from "../../hooks/use-agents-fliters";
import { SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";


export const SearchFilter = () => {
    const [filters, setFilters] = UseAgentFilters();

    return (
        <div className="relative">
            <Input 
                placeholder="Search agents..."
                className="pl-8"
                value={filters.search}
                onChange={(e) => setFilters({ search: e.target.value })}
                
            />
            <SearchIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground size-4" />
            
        </div>
    )

}