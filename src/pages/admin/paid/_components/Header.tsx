import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchPaidEntries } from "../_api/apiService";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

const Header = ({
  year,
  setYear,
  month,
  setMonth,
  day,
  setDay,
}: {
  year: number | "";
  setYear: (year: number | "") => void;
  month: number | "";
  setMonth: (month: number | "") => void;
  day: number | "";
  setDay: (day: number | "") => void;
}) => {
  const [date, setDate] = useState<Date | undefined>(undefined);

  const { data, isLoading, error } = useQuery({
    queryKey: ["paidEntries", year, month, day],
    queryFn: () => fetchPaidEntries(year, month, day),
  });

  const handleYearChange = (value: string) => {
    setYear(value ? Number(value) : "");
  };

  const handleMonthChange = (value: string) => {
    setMonth(value ? Number(value) : "");
  };

  const handleDayChange = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    setDay(selectedDate ? selectedDate.getDate() : "");
  };

  const years = Array.from({ length: 10 }, (_, i) => 2025 - i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <div className="flex flex-col sm:flex-row gap-2 mb-4 items-center">
      <Select onValueChange={handleYearChange} value={year.toString()}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select Year" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">All Years</SelectItem>
          {years.map((y) => (
            <SelectItem key={y} value={y.toString()}>
              {y}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select onValueChange={handleMonthChange} value={month.toString()}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select Month" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">All Months</SelectItem>
          {months.map((m) => (
            <SelectItem key={m} value={m.toString()}>
              {format(new Date(2025, m - 1), "MMMM")}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-[180px] justify-start text-left font-normal"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : <span>Pick a day</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDayChange}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      {isLoading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
    </div>
  );
};

export default Header;