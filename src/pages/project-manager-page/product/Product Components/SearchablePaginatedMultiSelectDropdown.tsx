import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { Checkbox } from '@/components/ui/checkbox';

interface DropdownItem {
  id: number;
  name: string;
}

interface SearchablePaginatedMultiSelectDropdownProps {
  endpoint: string;
  label: string;
  selectedValues: number[];
  onChange: (selected: number[]) => void;
  resultsKey: string; // e.g., 'results.contractor' or 'results.workers'
  dataMapper?: (data: any) => DropdownItem[];
}

const SearchablePaginatedMultiSelectDropdown: React.FC<SearchablePaginatedMultiSelectDropdownProps> = ({
  endpoint,
  label,
  selectedValues,
  onChange,
  resultsKey,
  dataMapper,
}) => {
  const [items, setItems] = useState<DropdownItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [nextUrl, setNextUrl] = useState<string | null>(null);
  const [prevUrl, setPrevUrl] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
  }, []);

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
      setItems([]);
      setNextUrl(null);
      setPrevUrl(null);
    }
  };

  useEffect(() => {
    const fullEndpoint = `${endpoint}?search=${searchTerm}`;
    fetchData(fullEndpoint);
  }, [endpoint, searchTerm]);

  const handleCheckboxChange = (id: number) => {
    if (selectedValues.includes(id)) {
      onChange(selectedValues.filter((v) => v !== id));
    } else {
      onChange([...selectedValues, id]);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="relative">
        <div
          className="w-full border rounded p-2 cursor-pointer bg-white"
          onClick={() => setIsOpen((open) => !open)}
        >
          {items
            .filter((item) => selectedValues.includes(item.id))
            .map((item) => item.name)
            .join(', ') || `Select ${label}`}
          <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            <FontAwesomeIcon icon={isOpen ? faChevronUp : faChevronDown} />
          </span>
        </div>
      </div>
      {isOpen && (
        <div className="absolute z-10 w-full bg-white border rounded mt-1 max-h-60 overflow-y-auto shadow-lg">
          <div className="p-2">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={`Search ${label}`}
              className="w-full border rounded p-2 mb-2"
            />
          </div>
          <ul>
            {items.map((item) => (
              <li key={item.id} className="flex items-center px-2 py-1 hover:bg-gray-100 cursor-pointer">
                <Checkbox
                  checked={selectedValues.includes(item.id)}
                  onCheckedChange={() => handleCheckboxChange(item.id)}
                  className="mr-2"
                  id={`checkbox-${label}-${item.id}`}
                />
                <label htmlFor={`checkbox-${label}-${item.id}`} className="cursor-pointer select-none">
                  {item.name}
                </label>
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

export default SearchablePaginatedMultiSelectDropdown; 