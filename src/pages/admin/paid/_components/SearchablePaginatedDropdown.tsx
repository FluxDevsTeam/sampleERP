import React, { useState, useEffect, useMemo } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Item {
  id: string | number;
  name: string;
}

interface SearchablePaginatedDropdownProps {
  endpoint: string;
  label: string;
  name: string;
  onChange: (name: string, value: string) => void;
  resultsKey: string;
  dataMapper: (data: any[]) => Item[];
  selectedValue: string | null;
  selectedName: string | null;
  staticData: any[];
}

const SearchablePaginatedDropdown: React.FC<SearchablePaginatedDropdownProps> = ({
  label,
  name,
  onChange,
  dataMapper,
  selectedValue,
  selectedName,
  staticData,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    // Use static data directly
    const mappedItems = dataMapper(staticData);
    setItems(mappedItems);
  }, [staticData, dataMapper]);

  const filteredItems = useMemo(() => {
    return items.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [items, searchTerm]);

  const handleSelectChange = (value: string) => {
    const selectedItem = items.find((item) => item.id.toString() === value);
    if (selectedItem) {
      onChange(selectedItem.name, value);
    }
  };

  return (
    <div className="space-y-2">
      <label htmlFor={name} className="text-sm font-medium">
        {label}
      </label>
      <Input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-2"
      />
      <Select
        value={selectedValue || ""}
        onValueChange={handleSelectChange}
      >
        <SelectTrigger id={name}>
          <SelectValue placeholder={selectedName || "Select an option"} />
        </SelectTrigger>
        <SelectContent>
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <SelectItem key={item.id} value={item.id.toString()}>
                {item.name}
              </SelectItem>
            ))
          ) : (
            <SelectItem value="no-results" disabled>
              No results found
            </SelectItem>
          )}
        </SelectContent>
      </Select>
    </div>
  );
};

export default SearchablePaginatedDropdown;