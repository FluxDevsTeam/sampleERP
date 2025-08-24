import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import incomeCategories from '@/data/admin/income/incomeCategories.json';

interface DropdownItem { id: string; name: string; }

interface SearchableCategoryDropdownProps {
  endpoint: string;
  label: string;
  onChange: (name: string, value: string) => void;
  name: string;
  resultsKey?: string;
  dataMapper?: (data: any) => DropdownItem[];
  selectedValue?: string | null;
  selectedName?: string | null;
  disabled?: boolean;
  refreshTrigger?: number;
}

const SearchableCategoryDropdown: React.FC<SearchableCategoryDropdownProps> = ({ endpoint, label, onChange, name, resultsKey, dataMapper, selectedValue, selectedName, disabled, refreshTrigger }) => {
  const [items, setItems] = useState<DropdownItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [inputValue, setInputValue] = useState(selectedName || '');
  const [nextUrl, setNextUrl] = useState<string | null>(null);
  const [prevUrl, setPrevUrl] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedName) {
      setInputValue(selectedName);
    }
  }, [selectedName]);

  useEffect(() => {
    if (selectedName) {
      setInputValue(selectedName);
    } else if (selectedValue === '' || selectedValue == null) {
      setInputValue('');
    }
  }, [selectedValue, selectedName]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [inputValue]);

  const fetchData = async () => {
    try {
      const filteredItems = searchTerm
        ? incomeCategories.filter((cat) => cat.name.toLowerCase().includes(searchTerm.toLowerCase()))
        : incomeCategories;
      const pageSize = 10;
      const page = parseInt(nextUrl?.split('page=')[1] || prevUrl?.split('page=')[1] || '1');
      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      const paginatedItems = filteredItems.slice(start, end);
      const finalItems = paginatedItems.map((it) => ({ id: it.id, name: it.name }));
      setItems(finalItems);
      setNextUrl(end < filteredItems.length ? `page=${page + 1}` : null);
      setPrevUrl(page > 1 ? `page=${page - 1}` : null);
    } catch (error) {
      console.error(`Error processing data:`, error);
      setItems([]);
    }
  };

  useEffect(() => {
    fetchData();
  }, [searchTerm, refreshTrigger]);

  const handleSelect = (item: DropdownItem) => {
    onChange(name, String(item.id));
    setIsOpen(false);
    setInputValue(item.name);
    setSearchTerm('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    setSearchTerm(newValue);
    if (newValue === '') {
      onChange(name, '');
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
          {items.length === 0 ? (
            <div className="p-2 text-xs sm:text-sm text-gray-500">No categories found</div>
          ) : (
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
          )}
          <div className="flex justify-between p-1.5 sm:p-2">
            <button
              type="button"
              onClick={() => prevUrl && fetchData()}
              disabled={!prevUrl}
              className="px-2 sm:px-3 py-1 bg-gray-200 text-gray-700 rounded disabled:opacity-50 text-xs sm:text-sm"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={() => nextUrl && fetchData()}
              disabled={!nextUrl}
              className="px-2 sm:px-3 py-1 bg-gray-200 text-gray-700 rounded disabled:opacity-50 text-xs sm:text-sm"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchableCategoryDropdown;