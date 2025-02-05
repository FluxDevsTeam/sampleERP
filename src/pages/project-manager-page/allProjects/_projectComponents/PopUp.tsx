import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export function PopoverDemo() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Open popover</Button>
      </PopoverTrigger>
      <PopoverContent className="w-50">
        <div className="flex flex-col space-y-3">
          <p>Edit</p>
          <p>Delete</p>
        </div>
        
        
      </PopoverContent>
    </Popover>
  )
}
