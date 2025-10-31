import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Item, Bookmark, Note, ItemFormData } from '../types';
import { PencilIcon, InfoCircleIcon, CheckIcon, DocumentLinkIcon } from './icons/Icons';
import LinkNoteModal from './LinkNoteModal';

declare var Quill: any;

interface ItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (itemData: ItemFormData) => void;
  item: Item | null;
  allTags: string[];
  allItems: Item[];
  onOpenItemById: (id: string) => void;
}

const ItemModal: React.FC<ItemModalProps> = ({ isOpen, onClose, onSave, item, allTags, allItems, onOpenItemById }) => {
  const [itemType, setItemType] = useState<'bookmark' | 'note'>(item?.type || 'bookmark');
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [currentTags, setCurrentTags] = useState<string[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [draftLoaded, setDraftLoaded] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [isLinkNoteModalOpen, setIsLinkNoteModalOpen] = useState(false);


  // State for the new tag input component
  const [tagInput, setTagInput] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const tagInputRef = useRef<HTMLInputElement>(null);

  const quillEditorRef = useRef<HTMLDivElement>(null);
  const quillInstanceRef = useRef<any>(null);
  const debounceTimerRef = useRef<number | null>(null);
  const savedStatusTimerRef = useRef<number | null>(null);
  const viewContentRef = useRef<HTMLDivElement>(null);

  const getDraftKey = (itemId: string) => `nexus-notes-draft-${itemId}`;

  // Memoize the list of notes to avoid re-filtering on every render
  const notes = useMemo(() => allItems.filter((i): i is Note => i.type === 'note'), [allItems]);

  useEffect(() => {
    if (isOpen) {
      const isNewItem = !item;
      const isBookmarkItem = item?.type === 'bookmark';
      setIsEditing(isNewItem || isBookmarkItem);
      setDraftLoaded(false); // Reset draft state on open
      setAutoSaveStatus('idle'); // Reset auto-save status

      if (item) {
        setItemType(item.type);
        setTitle(item.title);
        setCurrentTags(item.tags);
        if (item.type === 'bookmark') {
          setUrl((item as Bookmark).url);
          setDescription((item as Bookmark).description || '');
          setContent('');
        } else {
          // Check for and load a draft for existing notes
          const draftKey = getDraftKey(item.id);
          const savedDraft = localStorage.getItem(draftKey);
          if (savedDraft) {
            setContent(savedDraft);
            setDraftLoaded(true);
          } else {
            setContent((item as Note).content);
          }
          setUrl('');
          setDescription('');
        }
      } else { // New item
        setItemType('bookmark');
        setTitle('');
        setUrl('');
        setDescription('');
        setContent('');
        setCurrentTags([]);
      }
    } else {
      setTagInput('');
      setSuggestions([]);
      setAutoSaveStatus('idle');
    }
  }, [item, isOpen]);

  useEffect(() => {
    if (isOpen && isEditing && itemType === 'note' && quillEditorRef.current) {
        if (!quillInstanceRef.current) {
             // Add custom icon for the link-note button
            const icons = Quill.import('ui/icons');
            icons['link-note'] = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>`;

            const quill = new Quill(quillEditorRef.current, {
                modules: {
                    toolbar: {
                        container: [
                            [{ 'font': [] }, { 'size': ['small', false, 'large', 'huge'] }],
                            [{ 'header': [1, 2, 3, false] }],
                            ['bold', 'italic', 'underline', 'strike'],
                            [{ 'align': [] }, { 'list': 'ordered' }, { 'list': 'bullet' }],
                            ['blockquote', 'code-block'],
                            ['link', 'image', 'link-note'], // Add custom button
                            ['clean']
                        ],
                    },
                },
                placeholder: 'Write your note here...',
                theme: 'snow',
            });
            
            quill.clipboard.dangerouslyPasteHTML(content || '');
            
            quill.getModule('toolbar').addHandler('link-note', () => {
                setIsLinkNoteModalOpen(true);
            });

            quill.on('text-change', () => {
                let currentContent = quill.root.innerHTML;
                if (currentContent === '<p><br></p>') {
                    currentContent = '';
                }
                setContent(currentContent);

                // Debounced auto-save for existing notes
                if (item && item.type === 'note') {
                    if (savedStatusTimerRef.current) clearTimeout(savedStatusTimerRef.current);
                    
                    setAutoSaveStatus('saving');

                    if (debounceTimerRef.current) {
                        clearTimeout(debounceTimerRef.current);
                    }
                    debounceTimerRef.current = window.setTimeout(() => {
                        localStorage.setItem(getDraftKey(item.id), currentContent);
                        setAutoSaveStatus('saved');
                        savedStatusTimerRef.current = window.setTimeout(() => setAutoSaveStatus('idle'), 2000);
                    }, 1000); // Save 1 second after user stops typing
                }
            });

            quillInstanceRef.current = quill;
        }
    } else if (quillInstanceRef.current) {
        quillInstanceRef.current = null;
    }
    
    // Cleanup debounce timer on component unmount/close
    return () => {
        if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
        if (savedStatusTimerRef.current) clearTimeout(savedStatusTimerRef.current);
    };
  }, [isOpen, isEditing, itemType, content, item]);


  // Effect for handling internal note links in view mode
  useEffect(() => {
    if (isOpen && !isEditing && item?.type === 'note' && viewContentRef.current) {
        const links = viewContentRef.current.querySelectorAll<HTMLAnchorElement>('a[href^="nexus-note://"]');
        
        const handleClick = (e: MouseEvent) => {
            e.preventDefault();
            const href = (e.currentTarget as HTMLAnchorElement).getAttribute('href');
            if (href) {
                const noteId = href.replace('nexus-note://', '');
                onOpenItemById(noteId);
            }
        };

        links.forEach(link => link.addEventListener('click', handleClick));

        return () => {
            links.forEach(link => link.removeEventListener('click', handleClick));
        };
    }
  }, [isOpen, isEditing, item, onOpenItemById]);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    const commonData = {
      id: item?.id,
      title,
      tags: currentTags,
    };

    if (itemType === 'bookmark') {
      if (!url) return;
      onSave({ ...commonData, type: 'bookmark', url, description });
    } else {
      if (!content.trim() || content === '<p><br></p>') {
        alert('Note content cannot be empty.');
        return;
      }
      onSave({ ...commonData, type: 'note', content });

      // Clean up draft on successful save
      if (item) {
        localStorage.removeItem(getDraftKey(item.id));
      }
    }
  };
  
  const handleCancelEdit = () => {
    if (item && item.type === 'note') {
      setTitle(item.title);
      setCurrentTags(item.tags);
      setContent((item as Note).content);
      setIsEditing(false);
    } else {
      onClose();
    }
  };
  
  const handleDiscardDraft = () => {
    if (!item || item.type !== 'note') return;
    
    // Remove draft from storage
    localStorage.removeItem(getDraftKey(item.id));

    // Revert content in the editor
    const originalContent = (item as Note).content;
    setContent(originalContent);
    if (quillInstanceRef.current) {
        quillInstanceRef.current.clipboard.dangerouslyPasteHTML(originalContent);
    }
    
    // Hide the draft notification
    setDraftLoaded(false);
  };

  // --- Tag Input Logic ---
  const handleAddTag = (tagToAdd: string) => {
    const trimmedTag = tagToAdd.trim();
    if (trimmedTag && !currentTags.includes(trimmedTag)) {
      setCurrentTags([...currentTags, trimmedTag]);
    }
    setTagInput('');
    setSuggestions([]);
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setCurrentTags(currentTags.filter(tag => tag !== tagToRemove));
  };
  
  const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setTagInput(inputValue);
    if (inputValue) {
      const filtered = allTags.filter(tag => 
        tag.toLowerCase().includes(inputValue.toLowerCase()) && !currentTags.includes(tag)
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === ',' || e.key === 'Enter') {
      e.preventDefault();
      handleAddTag(tagInput);
    } else if (e.key === 'Backspace' && !tagInput) {
      if (currentTags.length > 0) {
        handleRemoveTag(currentTags[currentTags.length - 1]);
      }
    }
  };


  if (!isOpen) return null;
  
  const accentColorClass = itemType === 'bookmark' ? 'text-accent' : 'text-accent-note';

  const TagInputComponent = (
    <div className="relative">
      <label htmlFor="tags" className="block text-sm font-medium text-text-secondary mb-1">Tags</label>
      <div 
        className="w-full bg-primary border border-border-color rounded-md px-3 py-2 flex items-center flex-wrap gap-2 focus-within:ring-2 focus-within:ring-accent"
        onClick={() => tagInputRef.current?.focus()}
      >
        {currentTags.map(tag => (
          <span key={tag} className={`flex items-center bg-highlight ${accentColorClass} text-xs font-semibold pl-2.5 pr-1 py-1 rounded-full`}>
            {tag}
            <button
              type="button"
              onClick={() => handleRemoveTag(tag)}
              className={`ml-1.5 h-4 w-4 rounded-full ${accentColorClass} bg-black/10 dark:bg-white/20 flex items-center justify-center hover:opacity-80`}
              aria-label={`Remove tag ${tag}`}
            >
              &times;
            </button>
          </span>
        ))}
        <input
          ref={tagInputRef}
          id="tags"
          type="text"
          value={tagInput}
          onChange={handleTagInputChange}
          onKeyDown={handleTagInputKeyDown}
          className="flex-grow bg-transparent outline-none p-0.5 text-sm"
          placeholder={currentTags.length === 0 ? "Add tags (e.g., react, productivity)" : ""}
        />
      </div>
       {suggestions.length > 0 && (
        <ul className="absolute z-10 w-full mt-1 bg-secondary border border-border-color rounded-md shadow-lg max-h-40 overflow-y-auto">
          {suggestions.map(suggestion => (
            <li
              key={suggestion}
              onClick={() => handleAddTag(suggestion)}
              className="px-3 py-2 text-sm text-text-primary hover:bg-highlight cursor-pointer"
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );


  return (
    <>
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-secondary rounded-lg shadow-xl w-full max-w-2xl border border-border-color flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
        {isEditing ? (
          <form onSubmit={handleSubmit} className="flex flex-col flex-grow min-h-0">
            <div className="p-6 overflow-y-auto">
              <h2 className="text-xl font-bold text-text-primary mb-4">{item ? 'Edit Item' : 'Create New Item'}</h2>
              {!item && (
                <div className="mb-4">
                  <div className="flex rounded-md border border-border-color p-1">
                    <button type="button" onClick={() => setItemType('bookmark')} className={`w-1/2 py-2 rounded ${itemType === 'bookmark' ? 'bg-accent text-white' : 'hover:bg-highlight'}`}>Bookmark</button>
                    <button type="button" onClick={() => setItemType('note')} className={`w-1/2 py-2 rounded ${itemType === 'note' ? 'bg-accent text-white' : 'hover:bg-highlight'}`}>Note</button>
                  </div>
                </div>
              )}
              <div className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-text-secondary mb-1">Title</label>
                  <input id="title" type="text" value={title} onChange={e => setTitle(e.target.value)} required className="w-full bg-primary border border-border-color rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent" />
                </div>
                {itemType === 'bookmark' ? (
                  <>
                    <div>
                      <label htmlFor="url" className="block text-sm font-medium text-text-secondary mb-1">URL</label>
                      <input id="url" type="url" value={url} onChange={e => setUrl(e.target.value)} required className="w-full bg-primary border border-border-color rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent" />
                    </div>
                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-text-secondary mb-1">Description (Optional)</label>
                      <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} rows={3} className="w-full bg-primary border border-border-color rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent" />
                    </div>
                  </>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">Content</label>
                    {draftLoaded && (
                      <div className="flex items-center justify-between bg-blue-500/10 text-blue-500 dark:text-blue-400 text-sm p-3 rounded-md mb-2 border border-blue-500/20">
                          <div className="flex items-center">
                              <InfoCircleIcon className="h-5 w-5 mr-2" />
                              <span>Unsaved draft restored.</span>
                          </div>
                          <button 
                              type="button" 
                              onClick={handleDiscardDraft}
                              className="font-semibold underline hover:opacity-80"
                          >
                              Discard
                          </button>
                      </div>
                    )}
                    <div className="mt-1 focus-within:ring-2 focus-within:ring-accent rounded-lg">
                      <div ref={quillEditorRef}></div>
                    </div>
                  </div>
                )}
                {TagInputComponent}
              </div>
            </div>
            <div className="bg-highlight px-6 py-3 flex justify-between items-center rounded-b-lg flex-shrink-0">
              <div>
                {isEditing && itemType === 'note' && item?.id && (
                  <div 
                    className={`text-sm text-text-secondary italic transition-opacity duration-300 flex items-center ${
                      autoSaveStatus !== 'idle' ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    {autoSaveStatus === 'saving' && (
                      <span>Saving...</span>
                    )}
                    {autoSaveStatus === 'saved' && (
                      <>
                        <CheckIcon className="h-4 w-4 mr-1 text-green-500" />
                        <span>Draft saved</span>
                      </>
                    )}
                  </div>
                )}
              </div>
              <div className="flex space-x-3">
                <button type="button" onClick={handleCancelEdit} className="px-4 py-2 rounded-md bg-transparent border border-border-color text-text-primary hover:bg-border-color transition">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-md bg-accent text-white font-semibold hover:opacity-90 transition-opacity">Save</button>
              </div>
            </div>
          </form>
        ) : (
           <div className="flex flex-col flex-grow min-h-0">
            <div className="p-6 space-y-4 overflow-y-auto" ref={viewContentRef}>
              <h2 className="text-2xl font-bold text-text-primary break-words">{item?.title}</h2>
              {item?.tags && item.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {item.tags.map(tag => (
                    <span key={tag} className={`bg-highlight text-accent-note text-xs font-semibold px-2.5 py-1 rounded-full`}>
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
              <div className="rendered-content text-text-primary text-base pt-4 border-t border-border-color mt-4"
                dangerouslySetInnerHTML={{ __html: (item as Note).content }}
              />
            </div>
            <div className="bg-highlight px-6 py-3 flex justify-end space-x-3 rounded-b-lg flex-shrink-0">
              <button type="button" onClick={onClose} className="px-4 py-2 rounded-md bg-transparent border border-border-color text-text-primary hover:bg-border-color transition">Close</button>
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 rounded-md bg-accent text-white font-semibold hover:opacity-90 transition-opacity flex items-center"
              >
                <PencilIcon className="h-5 w-5 mr-2" />
                Edit
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
    {isLinkNoteModalOpen && (
        <LinkNoteModal
            isOpen={isLinkNoteModalOpen}
            onClose={() => setIsLinkNoteModalOpen(false)}
            notes={notes.filter(n => n.id !== item?.id)} // Exclude current note from list
            onSelectNote={(selectedNote) => {
                const quill = quillInstanceRef.current;
                if (quill) {
                    const range = quill.getSelection(true); // Get cursor position
                    // Insert a link with custom protocol
                    quill.insertText(range.index, selectedNote.title, 'link', `nexus-note://${selectedNote.id}`);
                    quill.setSelection(range.index + selectedNote.title.length);
                }
                setIsLinkNoteModalOpen(false);
            }}
        />
    )}
    </>
  );
};

export default ItemModal;