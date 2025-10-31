import React, { useState, useMemo } from 'react';
import { Note } from '../types';
import { SearchIcon, NoteIcon } from './icons/Icons';

interface LinkNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectNote: (note: Note) => void;
  notes: Note[];
}

const LinkNoteModal: React.FC<LinkNoteModalProps> = ({ isOpen, onClose, onSelectNote, notes }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredNotes = useMemo(() => {
    if (!searchTerm.trim()) {
      return notes;
    }
    const lowercasedTerm = searchTerm.toLowerCase();
    return notes.filter(note => note.title.toLowerCase().includes(lowercasedTerm));
  }, [notes, searchTerm]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div 
        className="bg-secondary rounded-lg shadow-xl w-full max-w-lg border border-border-color flex flex-col max-h-[70vh]" 
        onClick={e => e.stopPropagation()}
      >
        <div className="p-4 border-b border-border-color flex-shrink-0">
            <h2 className="text-lg font-bold text-text-primary mb-3">Link to a Note</h2>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <SearchIcon className="h-5 w-5 text-text-secondary" />
                </div>
                <input
                    type="text"
                    placeholder="Search for a note by title..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-primary border border-border-color rounded-md pl-10 pr-4 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition"
                    autoFocus
                />
            </div>
        </div>

        <div className="overflow-y-auto p-4 flex-grow">
          {filteredNotes.length > 0 ? (
            <ul className="space-y-2">
              {filteredNotes.map(note => (
                <li key={note.id}>
                  <button
                    onClick={() => onSelectNote(note)}
                    className="w-full text-left p-3 rounded-md hover:bg-highlight transition-colors flex items-center"
                  >
                    <NoteIcon className="h-5 w-5 mr-3 text-accent-note flex-shrink-0" />
                    <span className="text-text-primary truncate">{note.title}</span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-text-secondary py-8">No matching notes found.</p>
          )}
        </div>

        <div className="bg-highlight px-6 py-3 flex justify-end space-x-3 rounded-b-lg flex-shrink-0">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-md bg-transparent border border-border-color text-text-primary hover:bg-border-color transition">Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default LinkNoteModal;