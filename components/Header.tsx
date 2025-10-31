import React from 'react';
import { PlusIcon, SearchIcon, CloseIcon, TagIcon, TrashIcon } from './icons/Icons';
import ThemeToggle from './ThemeToggle';
import SortControl from './SortControl';
import { SortKey, SortOrder } from '../types';
import { Theme } from '../hooks/useTheme';

interface HeaderProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onAddItem: () => void;
  sortKey: SortKey;
  setSortKey: (key: SortKey) => void;
  sortOrder: SortOrder;
  setSortOrder: (order: SortOrder) => void;
  selectedItemsCount: number;
  onBulkDelete: () => void;
  onOpenBulkTagModal: () => void;
  onClearSelection: () => void;
  onSelectAll: () => void;
  isAllVisibleSelected: boolean;
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const Header: React.FC<HeaderProps> = ({ 
    searchTerm, setSearchTerm, onAddItem, sortKey, setSortKey, sortOrder, setSortOrder,
    selectedItemsCount, onBulkDelete, onOpenBulkTagModal, onClearSelection, onSelectAll, isAllVisibleSelected,
    theme, setTheme
}) => {

  const isSelectionMode = selectedItemsCount > 0;

  return (
    <header className="flex-shrink-0 bg-secondary border-b border-border-color p-4 flex items-center justify-between z-10 transition-all duration-200">
      {isSelectionMode ? (
        <>
          <div className="flex items-center space-x-4">
            <button onClick={onClearSelection} className="p-2 rounded-full text-text-secondary hover:bg-highlight hover:text-text-primary" aria-label="Clear selection">
              <CloseIcon className="h-6 w-6" />
            </button>
            <span className="text-lg font-semibold text-text-primary">{selectedItemsCount} selected</span>
            <div className="flex items-center pl-4 border-l border-border-color space-x-2">
              <input
                type="checkbox"
                className="h-5 w-5 rounded bg-primary border-border-color text-accent focus:ring-2 focus:ring-accent focus:ring-offset-secondary"
                checked={isAllVisibleSelected}
                onChange={onSelectAll}
                id="select-all-checkbox"
                aria-label="Select all visible items"
              />
              <label htmlFor="select-all-checkbox" className="text-sm font-medium text-text-secondary cursor-pointer">
                Select All
              </label>
            </div>
          </div>
          <div className="flex items-center space-x-2">
             <button
              onClick={onOpenBulkTagModal}
              className="flex items-center bg-transparent border border-border-color text-text-primary font-semibold px-4 py-2 rounded-md hover:bg-highlight transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-secondary focus:ring-accent"
            >
              <TagIcon className="h-5 w-5 mr-2" />
              Add Tags
            </button>
            <button
              onClick={onBulkDelete}
              className="flex items-center bg-red-600/10 border border-red-600/30 text-red-500 font-semibold px-4 py-2 rounded-md hover:bg-red-600/20 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-secondary focus:ring-red-500"
            >
              <TrashIcon className="h-5 w-5 mr-2" />
              Delete
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="flex-1 max-w-xl">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5 text-text-secondary" />
              </div>
              <input
                type="text"
                placeholder="Search by title, content, or tag..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-primary border border-border-color rounded-md pl-10 pr-4 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition"
              />
            </div>
          </div>
          <div className="flex items-center ml-4 space-x-2">
            <SortControl 
              sortKey={sortKey}
              setSortKey={setSortKey}
              sortOrder={sortOrder}
              setSortOrder={setSortOrder}
            />
            <ThemeToggle theme={theme} setTheme={setTheme} />
            <button
              onClick={onAddItem}
              className="flex items-center bg-accent text-white font-semibold px-4 py-2 rounded-md hover:opacity-90 transition-opacity duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-secondary focus:ring-accent"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              New Item
            </button>
          </div>
        </>
      )}
    </header>
  );
};

export default Header;