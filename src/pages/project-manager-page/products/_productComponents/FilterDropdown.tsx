import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { FiFilter } from "react-icons/fi";

interface FilterDropdownProps {
  setFilter: (filter: string | null) => void;
}

export default function FilterDropdown({ setFilter }: FilterDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex bg-white p-2 px-3 space-x-2 text-lg cursor-pointer">
          <span className="mt-1"><FiFilter /></span>
          <p>Filter</p>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40 flex flex-col justify-center items-center">
        <DropdownMenuItem className="cursor-pointer" onClick={() => setFilter("Profit")}>
          Profit
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer" onClick={() => setFilter("Loss")}>
          Loss
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer" onClick={() => setFilter(null)}>
          Reset
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
