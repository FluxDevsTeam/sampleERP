import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { FiFilter } from "react-icons/fi";

interface FilterDropdownProps {
  onFilterChange: (filter: string) => void;
}

export default function FilterDropdown({ onFilterChange }: FilterDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex bg-white p-2 px-3 space-x-2 text-lg cursor-pointer">
          <span className="mt-1"><FiFilter /></span>
          <p>Filter</p>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40 flex flex-col justify-center items-center">
        <DropdownMenuItem className="cursor-pointer text-md" onClick={() => onFilterChange("delivered")}>
          Is Delivered
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer text-md" onClick={() => onFilterChange("past_deadline")}>
          Past Deadline
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer text-md" onClick={() => onFilterChange("all")}>
          All
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
