import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';

interface DropdownItem {
  id: number;
  name: string;
}

interface SearchablePaginatedDropdownProps {
  endpoint: string;
  label: string;
  onChange: (name: string, value: string) => void;
  name: string;
  resultsKey: string; // e.g., 'results.all_customers' or 'all_projects'
  dataMapper?: (data: any) => DropdownItem[];
  selectedValue?: string | null;
  selectedName?: string | null;
}

const SearchablePaginatedDropdown: React.FC<SearchablePaginatedDropdownProps> = ({ endpoint, label, onChange, name, resultsKey, dataMapper, selectedValue, selectedName }) => {
  const [items, setItems] = useState<DropdownItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(''); 
  const [inputValue, setInputValue] = useState(selectedName || ''); 
  const [nextUrl, setNextUrl] = useState<string | null>(null);
  const [prevUrl, setPrevUrl] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log("Dropdown: useEffect - selectedName changed:", selectedName);
    if (selectedName) {
      setInputValue(selectedName);
    }
  }, [selectedName]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
        console.log("Dropdown: handleClickOutside - closing. inputValue:", inputValue, "searchTerm:", '');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [inputValue]);

  const fetchData = async (url: string) => {
    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `JWT ${localStorage.getItem('accessToken')}`,
        },
      });
      const data = await response.json();

      const keys = resultsKey.split('.');
      let resultItems = data;
      for (const key of keys) {
        if (resultItems && typeof resultItems === 'object' && key in resultItems) {
          resultItems = resultItems[key];
        } else {
          resultItems = [];
          break;
        }
      }

      const finalItems = dataMapper ? dataMapper(resultItems) : resultItems;
      setItems(finalItems || []);
      setNextUrl(data.next);
      setPrevUrl(data.previous);
    } catch (error) {
      console.error(`Error fetching data from ${url}:`, error);
    }
  };

  useEffect(() => {
    const fullEndpoint = `${endpoint}?search=${searchTerm}`;
    fetchData(fullEndpoint);
  }, [endpoint, searchTerm]);

  const handleSelect = (item: DropdownItem) => {
    onChange(name, String(item.id));
    setIsOpen(false);
    setInputValue(item.name);
    setSearchTerm('');
    console.log("Dropdown: handleSelect - after set. inputValue:", item.name, "searchTerm:", '');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    setSearchTerm(newValue);
    console.log("Dropdown: handleInputChange - newValue:", newValue, "searchTerm:", newValue);
    if (newValue === '') {
      onChange(name, '');
    }
  };

  const handleInputFocus = () => {
    setIsOpen(true);
    setSearchTerm(inputValue);
    console.log("Dropdown: handleInputFocus - inputValue:", inputValue, "searchTerm:", inputValue);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block mb-1">{label}:</label>
      <div className="relative">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          className="w-full border rounded p-2"
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
          <div className="flex justify-between p-2">
            <button
              type="button"
              onClick={() => prevUrl && fetchData(prevUrl)}
              disabled={!prevUrl}
              className="px-3 py-1 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={() => nextUrl && fetchData(nextUrl)}
              disabled={!nextUrl}
              className="px-3 py-1 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchablePaginatedDropdown;
