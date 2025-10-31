import React from 'react';
import { Item } from '../types';
import ItemCard from './ItemCard';

interface ItemListProps {
  items: Item[];
  onEdit: (item: Item) => void;
  onDelete: (id: string) => void;
  searchTerm: string;
  selectedItems: Set<string>;
  onToggleSelection: (id: string) => void;
  setFilterTag: (tag: string) => void;
}

const ItemList: React.FC<ItemListProps> = ({ items, onEdit, onDelete, searchTerm, selectedItems, onToggleSelection, setFilterTag }) => {
  if (items.length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-semibold text-text-primary">No items found</h2>
        <p className="text-text-secondary mt-2">Try adjusting your search or filters, or add a new item!</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:gap-6 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {items.map(item => (
        <ItemCard 
            key={item.id} 
            item={item} 
            onEdit={onEdit} 
            onDelete={onDelete} 
            searchTerm={searchTerm}
            isSelected={selectedItems.has(item.id)}
            onToggleSelection={onToggleSelection}
            onTagClick={setFilterTag}
        />
      ))}
    </div>
  );
};

export default ItemList;