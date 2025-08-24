import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import rawMaterialsCategoryData from '@/data/store-keeper-page/raw-materials/raw-materials-category.json';

interface DropdownItem {
  id: number;
  name: string;
}

interface SearchablePaginatedDropdownProps {
  endpoint: string;
  label: string;
  name: string;
  value: string;
  resultsKey: string;
  onChange: (name: string, value: string) => void;
  onSearchChange: (value: string) => void;
}

const SearchablePaginatedDropdown: React.FC<SearchablePaginatedDropdownProps> = ({ label, name, value, resultsKey, onChange, onSearchChange }) => {
  const [items, setItems] = useState<DropdownItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<DropdownItem | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const filteredItems = rawMaterialsCategoryData.results.filter((item: DropdownItem) =>
      value ? item.name.toLowerCase().includes(value.toLowerCase()) : true
    );
    setItems(filteredItems);
    if (value && filteredItems.length > 0) {
      const item = filteredItems.find(item => item.name.toLowerCase() === value.toLowerCase());
      if (item) {
        setSelectedItem(item);
      }
    } else if (!value) {
      setSelectedItem(null);
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (item: DropdownItem) => {
    setSelectedItem(item);
    onChange(name, String(item.id));
    onSearchChange(item.name);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block mb-1">{label}</label>
      <div className="relative">
        <input
          type="text"
          value={selectedItem ? selectedItem.name : value}
          onChange={(e) => {
            const newSearch = e.target.value;
            onSearchChange(newSearch);
            if (newSearch === '') {
              setSelectedItem(null);
              onChange(name, '');
            }
          }}
          onFocus={() => setIsOpen(true)}
          className="w-full border rounded p-2"
          readOnly={!onSearchChange}
        />
        <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <FontAwesomeIcon icon={isOpen ? faChevronUp : faChevronDown} />
        </span>
      </div>
      {isOpen && (
        <div className="absolute z-10 w-full bg-white border rounded mt-1 max-h-60 overflow-y-auto">
          <ul>
            {items.map((item) => (
              <li
                key={item.id}
                onClick={() => handleSelect(item)}
                className="p-2 hover:bg-gray-200 cursor-pointer"
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