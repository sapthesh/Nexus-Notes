import React from 'react';
import { ViewType } from '../types';
import { AllItemsIcon, BookmarkIcon, NoteIcon, TagIcon, SettingsIcon } from './icons/Icons';

interface SidebarProps {
  tags: string[];
  activeView: ViewType;
  setActiveView: (view: ViewType) => void;
  filterTag: string | null;
  setFilterTag: (tag: string | null) => void;
  onOpenSettings: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ tags, activeView, setActiveView, filterTag, setFilterTag, onOpenSettings }) => {
  // FIX: Changed icon type from JSX.Element to React.ReactNode to resolve "Cannot find namespace 'JSX'" error.
  const NavItem = ({ icon, label, view, isActive }: { icon: React.ReactNode; label: string; view: ViewType; isActive: boolean; }) => (
    <button
      onClick={() => { setActiveView(view); setFilterTag(null); }}
      className={`flex items-center w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
        isActive && !filterTag ? 'bg-highlight text-text-primary' : 'text-text-secondary hover:bg-highlight hover:text-text-primary'
      }`}
    >
      {icon}
      <span className="ml-3">{label}</span>
    </button>
  );

  // FIX: Explicitly typed TagItem as a React.FC to correctly handle the 'key' prop provided during mapping and prevent a TypeScript error.
  const TagItem: React.FC<{ tag: string; isActive: boolean }> = ({ tag, isActive }) => (
    <button
      onClick={() => setFilterTag(isActive ? null : tag)}
      className={`w-full text-left px-3 py-1.5 rounded-md text-sm truncate transition-colors ${
        isActive ? 'bg-accent/20 text-accent' : 'text-text-secondary hover:bg-highlight hover:text-text-primary'
      }`}
    >
      <span className="mr-2">#</span>{tag}
    </button>
  );

  return (
    <aside className="w-64 bg-secondary border-r border-border-color p-4 flex-col hidden md:flex">
       <div className="flex-grow flex flex-col overflow-hidden">
        <div className="flex items-center mb-6 flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
            <h1 className="text-xl font-bold ml-2 text-text-primary">Nexus Notes</h1>
        </div>
        <nav className="flex-1 space-y-2 overflow-y-auto pr-2">
            <h3 className="px-3 text-xs font-semibold text-text-secondary uppercase tracking-wider">Views</h3>
            <NavItem icon={<AllItemsIcon className="h-5 w-5" />} label="All Items" view="all" isActive={activeView === 'all'} />
            <NavItem icon={<BookmarkIcon className="h-5 w-5" />} label="Bookmarks" view="bookmarks" isActive={activeView === 'bookmarks'} />
            <NavItem icon={<NoteIcon className="h-5 w-5" />} label="Notes" view="notes" isActive={activeView === 'notes'} />

            <div className="pt-4">
            <h3 className="px-3 text-xs font-semibold text-text-secondary uppercase tracking-wider flex items-center">
                <TagIcon className="h-4 w-4 mr-2" />
                Tags
            </h3>
            <div className="mt-2 space-y-1 max-h-80 overflow-y-auto">
                {tags.map(tag => (
                <TagItem key={tag} tag={tag} isActive={filterTag === tag} />
                ))}
                {tags.length === 0 && <p className="px-3 text-sm text-text-secondary">No tags yet.</p>}
            </div>
            </div>
        </nav>
      </div>

       <div className="flex-shrink-0 pt-4 border-t border-border-color">
          <div className="space-y-2">
             <button
                onClick={onOpenSettings}
                className="flex items-center w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors text-text-secondary hover:bg-highlight hover:text-text-primary"
                >
                <SettingsIcon className="h-5 w-5" />
                <span className="ml-3">Settings</span>
            </button>
          </div>
        </div>
    </aside>
  );
};

export default Sidebar;