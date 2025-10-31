import React, { useState } from 'react';

interface BulkTagModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (tags: string) => void;
}

const BulkTagModal: React.FC<BulkTagModalProps> = ({ isOpen, onClose, onSave }) => {
  const [tags, setTags] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tags.trim()) {
        alert('Please enter at least one tag.');
        return;
    };
    onSave(tags);
    setTags(''); // Reset after save
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-secondary rounded-lg shadow-xl w-full max-w-md border border-border-color" onClick={e => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <h2 className="text-xl font-bold text-text-primary mb-4">Add Tags to Selected Items</h2>
            <p className="text-text-secondary mb-4 text-sm">Enter one or more tags, separated by commas. These tags will be added to all selected items.</p>
            <div>
              <label htmlFor="bulk-tags" className="block text-sm font-medium text-text-secondary mb-1">Tags</label>
              <input 
                id="bulk-tags" 
                type="text" 
                value={tags} 
                onChange={e => setTags(e.target.value)} 
                required 
                className="w-full bg-primary border border-border-color rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="e.g., react, javascript, productivity"
                autoFocus
              />
            </div>
          </div>
          
          <div className="bg-highlight px-6 py-3 flex justify-end space-x-3 rounded-b-lg">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-md bg-transparent border border-border-color text-text-primary hover:bg-border-color transition">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded-md bg-accent text-white font-semibold hover:opacity-90 transition-opacity">Add Tags</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BulkTagModal;
