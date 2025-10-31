
export interface BaseItem {
  id: string;
  title: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Bookmark extends BaseItem {
  type: 'bookmark';
  url: string;
  description?: string;
  faviconDataUrl?: string;
}

export interface Note extends BaseItem {
  type: 'note';
  content: string;
}

export type Item = Bookmark | Note;

// FIX: Defined a new `ItemFormData` union type to correctly represent the data for new or updated items. This is necessary because Omit<Item,...> was creating an intersection instead of a union, causing type errors.
export type ItemFormData =
  | (Omit<Bookmark, 'id' | 'createdAt' | 'updatedAt' | 'faviconDataUrl'> & { id?: string })
  | (Omit<Note, 'id' | 'createdAt' | 'updatedAt'> & { id?: string });

export type ViewType = 'all' | 'bookmarks' | 'notes';

export type SortKey = 'title' | 'createdAt' | 'updatedAt';
export type SortOrder = 'asc' | 'desc';
