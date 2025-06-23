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
}

const SearchablePaginatedDropdown: React.FC<SearchablePaginatedDropdownProps> = ({ endpoint, label, onChange, name, resultsKey }) => {
  const [items, setItems] = useState<DropdownItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [nextUrl, setNextUrl] = useState<string | null>(null);
  const [prevUrl, setPrevUrl] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  const fetchData = async (url: string) => {
    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `JWT ${localStorage.getItem('accessToken')}`,
        },
      });
      const data = await response.json();

      // Access nested results key
      const keys = resultsKey.split('.');
      let resultItems = data;
      for (const key of keys) {
        resultItems = resultItems[key];
      }

      setItems(resultItems || []);
      setNextUrl(data.next);
      setPrevUrl(data.previous);
    } catch (error) {
      console.error(`Error fetching data from ${url}:`, error);
    }
  };

  useEffect(() => {
    const fullEndpoint = `${endpoint}?search=${search}`;
    fetchData(fullEndpoint);
  }, [endpoint, search]);

  const handleSelect = (item: DropdownItem) => {
    onChange(name, String(item.id));
    setIsOpen(false);
    setSearch(item.name);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block mb-1">{label}:</label>
      <div className="relative">
        <input
          type="text"
          value={search}
          onChange={(e) => {
            const newSearch = e.target.value;
            setSearch(newSearch);
            if (newSearch === '') {
              onChange(name, '');
            }
          }}
          onFocus={() => setIsOpen(true)}
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
              onClick={() => prevUrl && fetchData(prevUrl)}
              disabled={!prevUrl}
              className="px-3 py-1 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <button
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
