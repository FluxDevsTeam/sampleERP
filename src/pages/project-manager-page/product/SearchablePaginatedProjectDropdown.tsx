import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';

interface DropdownItem {
  id: number;
  name: string;
}

interface SearchablePaginatedProjectDropdownProps {
  endpoint: string;
  onChange: (value: string) => void;
  selectedValue?: string | null;
  selectedName?: string | null;
  pageSize?: number;
}

const SearchablePaginatedProjectDropdown: React.FC<SearchablePaginatedProjectDropdownProps> = ({
  endpoint,
  onChange,
  selectedValue = '',
  selectedName = '',
  pageSize = 10,
}) => {
  const [items, setItems] = useState<DropdownItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [inputValue, setInputValue] = useState(selectedName || '');
  const [nextUrl, setNextUrl] = useState<string | null>(null);
  const [prevUrl, setPrevUrl] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedName) setInputValue(selectedName);
  }, [selectedName]);

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
      const projects = data.all_projects || data.results || [];
      setItems(Array.isArray(projects) ? projects.map((item: any) => ({ id: item.id, name: item.name })) : []);
      setNextUrl(data.next);
      setPrevUrl(data.previous);
      setCount(data.count || (projects.length ?? 0));
    } catch (error) {
      setItems([]);
      setNextUrl(null);
      setPrevUrl(null);
      setCount(0);
    }
  };

  useEffect(() => {
    let url = `${endpoint}&page=${page}&page_size=${pageSize}`;
    if (searchTerm) url += `&search=${encodeURIComponent(searchTerm)}`;
    fetchData(url);
    // eslint-disable-next-line
  }, [endpoint, page, searchTerm]);

  const handleSelect = (item: DropdownItem) => {
    onChange(String(item.id));
    setIsOpen(false);
    setInputValue(item.name);
    setSearchTerm('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    setSearchTerm(newValue);
    if (newValue === '') {
      onChange('');
    }
  };

  const handleInputFocus = () => {
    setIsOpen(true);
    setSearchTerm(inputValue);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="relative">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          placeholder="Project"
          className="w-full border rounded p-2 placeholder-black-200"
        />
        <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <FontAwesomeIcon icon={faChevronDown} className="text-black-200" />
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
              onClick={() => prevUrl && setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-xs">Page {page}</span>
            <button
              type="button"
              onClick={() => nextUrl && setPage((p) => p + 1)}
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

export default SearchablePaginatedProjectDropdown; 