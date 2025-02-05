

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { FiFilter } from "react-icons/fi";

export default function FilterDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex bg-white p-2 px-3 space-x-2 text-lg  cursor-pointer ">
          <span className="mt-1"><FiFilter /></span>
          <p>Filter</p>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent  className="w-40 flex flex-col justify-center items-center ">
        <DropdownMenuItem className="cursor-pointer">
          Option 1
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer" >
          Option 2
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer">
          Option 3
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
