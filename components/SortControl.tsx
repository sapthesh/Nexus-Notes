import React, { useState, useRef, useEffect } from 'react';
import { SortKey, SortOrder } from '../types';
import { ArrowUpIcon, ArrowDownIcon, ChevronDownIcon } from './icons/Icons';

interface SortControlProps {
  sortKey: SortKey;
  setSortKey: (key: SortKey) => void;
  sortOrder: SortOrder;
  setSortOrder: (order: SortOrder) => void;
}

const sortOptions: { key: SortKey; label: string }[] = [
  { key: 'updatedAt', label: 'Date Updated' },
  { key: 'createdAt', label: 'Date Created' },
  { key: 'title', label: 'Title' },
];

const SortControl: React.FC<SortControlProps> = ({ sortKey, setSortKey, sortOrder, setSortOrder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const toggleOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const handleSelectKey = (key: SortKey) => {
    setSortKey(key);
    setIsOpen(false);
  };
  
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  const currentLabel = sortOptions.find(opt => opt.key === sortKey)?.label || 'Sort by';

  return (
    <div className="flex items-center space-x-1" ref={wrapperRef}>
      <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center bg-primary border border-border-color text-text-secondary font-medium px-3 py-2 rounded-md hover:bg-highlight focus:outline-none focus:ring-2 focus:ring-accent transition-colors"
          >
            <span className="text-sm">{currentLabel}</span>
            <ChevronDownIcon className="h-4 w-4 ml-2" />
          </button>
          {isOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-secondary border border-border-color rounded-md shadow-lg z-20">
            {sortOptions.map(option => (
              <button
                key={option.key}
                onClick={() => handleSelectKey(option.key)}
                className={`block w-full text-left px-4 py-2 text-sm ${sortKey === option.key ? 'bg-highlight text-text-primary' : 'text-text-primary hover:bg-highlight'}`}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={toggleOrder}
        className="p-2 rounded-md text-text-secondary bg-primary border border-border-color hover:bg-highlight hover:text-text-primary focus:outline-none focus:ring-2 focus:ring-accent transition-colors"
        aria-label={`Sort ${sortOrder === 'asc' ? 'descending' : 'ascending'}`}
      >
        {sortOrder === 'asc' ? <ArrowUpIcon className="h-5 w-5" /> : <ArrowDownIcon className="h-5 w-5" />}
      </button>
    </div>
  );
};

export default SortControl;
