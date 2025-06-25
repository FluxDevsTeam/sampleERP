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
  name: string;
  value: string;
  resultsKey: string;
  onChange: (name: string, value: string) => void;
  onSearchChange: (value: string) => void;
}

const SearchablePaginatedDropdown: React.FC<SearchablePaginatedDropdownProps> = ({ endpoint, label, name, value, resultsKey, onChange, onSearchChange }) => {
  const [items, setItems] = useState<DropdownItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [nextUrl, setNextUrl] = useState<string | null>(null);
  const [prevUrl, setPrevUrl] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<DropdownItem | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Update selected item when value changes
  useEffect(() => {
    if (value && items.length > 0) {
      const item = items.find(item => String(item.id) === value);
      if (item) {
        setSelectedItem(item);
      }
    } else if (!value) {
      setSelectedItem(null);
    }
  }, [value, items]);

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
    console.log(`Dropdown: Fetching from URL: ${url}`);
    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `JWT ${localStorage.getItem('accessToken')}`,
        },
      });
      const data = await response.json();
      console.log('Dropdown: API Response Data:', data);

      let itemsToShow = [];
      let next = null;
      let prev = null;

      // The API might return a paginated object or a direct array.
      if (data && typeof data === 'object' && !Array.isArray(data)) {
        // This handles paginated responses, e.g., { count, next, previous, results: [...] }
        const keys = resultsKey.split('.');
        let extractedItems = data;
        for (const key of keys) {
          if (extractedItems && typeof extractedItems === 'object' && key in extractedItems) {
            extractedItems = extractedItems[key];
          } else {
            extractedItems = null; 
            break;
          }
        }
        
        if (Array.isArray(extractedItems)) {
          itemsToShow = extractedItems;
          next = data.next;
          prev = data.previous;
        } else {
           console.error('Dropdown: Could not extract a valid array from the response object.', data);
        }

      } else if (Array.isArray(data)) {
        // This handles when the API returns a direct array of items, e.g., [{...}, {...}]
        itemsToShow = data;
      } else {
        console.error('Dropdown: API response is not in a recognized format.', data);
      }

      console.log('Dropdown: Extracted items:', itemsToShow);
      setItems(itemsToShow);
      setNextUrl(next);
      setPrevUrl(prev);

    } catch (error) {
      console.error(`Dropdown: Error fetching data from ${url}:`, error);
      setItems([]); // Clear items on error
    }
  };

  useEffect(() => {
    const fullEndpoint = `${endpoint}?search=${value}`;
    fetchData(fullEndpoint);
  }, [endpoint, value]);

  const handleSelect = (item: DropdownItem) => {
    setSelectedItem(item);
    onChange(name, String(item.id));
    onSearchChange(item.name);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block mb-1">{label}:</label>
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
