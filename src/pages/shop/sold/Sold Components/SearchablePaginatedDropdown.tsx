import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import soldDataJson from "@/data/shop/sold/sold.json";

interface DropdownItem {
  id: number;
  name: string;
}

interface SearchablePaginatedDropdownProps {
  endpoint: string;
  label: string;
  onChange: (name: string, value: string) => void;
  name: string;
  resultsKey: string;
  dataMapper?: (data: any) => DropdownItem[];
  selectedValue?: string | null;
  selectedName?: string | null;
  disabled?: boolean;
}

const SearchablePaginatedDropdown: React.FC<SearchablePaginatedDropdownProps> = ({
  endpoint,
  label,
  onChange,
  name,
  resultsKey,
  dataMapper,
  selectedValue,
  selectedName,
  disabled,
}) => {
  const [items, setItems] = useState<DropdownItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [inputValue, setInputValue] = useState(selectedName || "");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedName) {
      setInputValue(selectedName);
    } else if (selectedValue === "" || selectedValue == null) {
      setInputValue("");
    }
  }, [selectedValue, selectedName]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    try {
      let resultItems = soldDataJson[resultsKey as keyof typeof soldDataJson] || [];
      if (dataMapper) {
        resultItems = dataMapper(resultItems);
      }
      const filteredItems = resultItems.filter((item: DropdownItem) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setItems(filteredItems);
    } catch (error) {
      console.error(`Error processing data for ${resultsKey}:`, error);
      setItems([]);
    }
  }, [resultsKey, searchTerm, dataMapper]);

  const handleSelect = (item: DropdownItem) => {
    onChange(name, String(item.id));
    setIsOpen(false);
    setInputValue(item.name);
    setSearchTerm("");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    setSearchTerm(newValue);
    if (newValue === "") {
      onChange(name, "");
    }
  };

  const handleInputFocus = () => {
    setIsOpen(true);
    setSearchTerm(inputValue);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block mb-1 text-xs sm:text-sm">{label}:</label>
      <div className="relative">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          className="w-full border rounded p-1.5 sm:p-2 text-xs sm:text-sm"
          disabled={disabled}
        />
        <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <FontAwesomeIcon icon={isOpen ? faChevronUp : faChevronDown} className="text-xs sm:text-sm" />
        </span>
      </div>
      {isOpen && (
        <div className="absolute z-10 w-full bg-white border rounded mt-1 max-h-48 sm:max-h-60 overflow-y-auto">
          <ul>
            {items.map((item) => (
              <li
                key={item.id}
                onClick={() => handleSelect(item)}
                className="p-1.5 sm:p-2 hover:bg-gray-200 cursor-pointer text-xs sm:text-sm"
              >
                {item.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchablePaginatedDropdown;