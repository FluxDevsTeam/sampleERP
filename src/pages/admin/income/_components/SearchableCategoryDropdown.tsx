import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';

interface DropdownItem { id: string; name: string; }

interface SearchableCategoryDropdownProps {
  endpoint: string;
  label: string;
  onChange: (name: string, value: string) => void;
  name: string;
  resultsKey?: string; // optional path
  dataMapper?: (data: any) => DropdownItem[];
  selectedValue?: string | null;
  selectedName?: string | null;
  disabled?: boolean;
}

const SearchableCategoryDropdown: React.FC<SearchableCategoryDropdownProps> = ({ endpoint, label, onChange, name, resultsKey, dataMapper, selectedValue, selectedName, disabled }) => {
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
    // Always update inputValue when selectedValue or selectedName changes
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
      console.log('[Income] Category API response:', data);

      // For income categories, the API response is: { results: [{ name: "category_name" }] }
      // But we need IDs. The backend probably expects category names as IDs or has a separate endpoint.
      // Let's check if there's an 'id' field hidden or if we need to fetch from a different endpoint.
      
      // Drill into resultsKey path if provided
      let resultItems: any = data;
      if (resultsKey) {
        const keys = resultsKey.split('.').filter(Boolean);
        for (const key of keys) {
          if (resultItems && typeof resultItems === 'object' && key in resultItems) {
            resultItems = resultItems[key];
          } else {
            resultItems = [];
            break;
          }
        }
      }

      // If still not an array, try common fallbacks
      if (!Array.isArray(resultItems)) {
        if (Array.isArray(data)) resultItems = data;
        else if (Array.isArray((data as any)?.results)) resultItems = (data as any).results;
        else resultItems = [];
      }
      console.log('[Income] Category extracted items:', resultItems);

      // Map to DropdownItem
      let finalItems: DropdownItem[];
      if (dataMapper) {
        finalItems = dataMapper(resultItems) as DropdownItem[];
      } else {
        finalItems = (resultItems as any[]).map((it: any) => {
          // Try to find an ID field first
          let id = String(it?.id ?? it?.uuid ?? it?.pk ?? it?.value ?? '');
          const name = String(it?.name ?? it?.label ?? it?.title ?? '');
          
          // CRITICAL FIX: Since your API only returns { name: "category_name" },
          // and the backend likely expects the name as the identifier, use name as ID
          if (!id && name) {
            id = name; // Use the name as the ID for the backend
            console.log('[Income] Category using name as ID:', { name, id });
          }
          
          return id && name ? { id, name } : null;
        }).filter(Boolean) as DropdownItem[];
      }
      console.log('[Income] Category final mapped items:', finalItems);

      setItems(finalItems || []);
      setNextUrl((data as any)?.next ?? null);
      setPrevUrl((data as any)?.previous ?? null);
    } catch (error) {
      console.error(`Error fetching data from ${url}:`, error);
      setItems([]);
    }
  };

  useEffect(() => {
    const fullEndpoint = searchTerm ? `${endpoint}?search=${encodeURIComponent(searchTerm)}` : endpoint;
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
              onClick={() => prevUrl && fetchData(prevUrl)}
              disabled={!prevUrl}
              className="px-2 sm:px-3 py-1 bg-gray-200 text-gray-700 rounded disabled:opacity-50 text-xs sm:text-sm"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={() => nextUrl && fetchData(nextUrl)}
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
