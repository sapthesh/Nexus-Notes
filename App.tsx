import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { Item, ViewType, Bookmark, Note, ItemFormData, SortKey, SortOrder } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useTheme } from './hooks/useTheme';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ItemList from './components/ItemList';
import ItemModal from './components/ItemModal';
import Notification from './components/Notification';
import BulkTagModal from './components/BulkTagModal';
import ConfirmationModal from './components/ConfirmationModal';
import SettingsModal from './components/SettingsModal';
import { demoData } from './demoData';

// Helper function to calculate Levenshtein distance between two strings.
// This measures the number of edits (insertions, deletions, substitutions) needed to change one string into the other.
const levenshteinDistance = (a: string, b: string): number => {
  const m = a.length;
  const n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;

  const dp = Array.from(Array(m + 1), () => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,      // Deletion
        dp[i][j - 1] + 1,      // Insertion
        dp[i - 1][j - 1] + cost // Substitution
      );
    }
  }

  return dp[m][n];
};

// Advanced search function that uses Levenshtein distance for fuzzy matching.
// This allows for typo tolerance in user searches.
const fuzzySearch = (query: string, text: string): boolean => {
    if (!query) return true;
    if (!text) return false;

    const lowerQuery = query.toLowerCase();
    const lowerText = text.toLowerCase();

    // 1. Prioritize exact substring match for performance
    if (lowerText.includes(lowerQuery)) {
        return true;
    }

    const queryWords = lowerQuery.split(/\s+/).filter(Boolean);
    const textWords = lowerText.split(/\s+/).filter(Boolean);

    // 2. Handle concatenated words (e.g., search "reacthooks" in "React Hooks")
    const concatenatedText = textWords.join('');
    const concatenatedQuery = queryWords.join('');
    if (concatenatedText.includes(concatenatedQuery)) {
        return true;
    }

    // 3. Perform word-by-word fuzzy matching for typo tolerance
    return queryWords.every(qw => {
        const threshold = qw.length > 5 ? 2 : (qw.length > 3 ? 1 : 0);
        return textWords.some(tw => {
            // Optimization: if word lengths differ more than the threshold, they can't match
            if (Math.abs(qw.length - tw.length) > threshold) {
                return false;
            }
            return levenshteinDistance(qw, tw) <= threshold;
        });
    });
};


const App: React.FC = () => {
  const [items, setItems] = useLocalStorage<Item[]>('nexus-notes-items', []);
  const [activeView, setActiveView] = useState<ViewType>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTag, setFilterTag] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>('updatedAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [selectedItems, setSelectedItems] = useState(new Set<string>());
  const [isBulkTagModalOpen, setIsBulkTagModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [confirmation, setConfirmation] = useState<{
    isOpen: boolean;
    title: string;
    message: React.ReactNode;
    onConfirm: () => void;
    confirmButtonText?: string;
    confirmButtonVariant?: 'primary' | 'destructive';
  } | null>(null);
  const { theme, setTheme, accentColor, setAccentColor } = useTheme();

  const importFileRef = useRef<HTMLInputElement>(null);


  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  const fetchAndSetFavicon = useCallback(async (itemId: string, itemUrl: string) => {
    try {
      // Use a reliable, CORS-friendly favicon service
      const faviconUrl = `https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${encodeURIComponent(itemUrl)}&size=32`;
      const response = await fetch(faviconUrl);
      
      if (!response.ok) return;

      const blob = await response.blob();
      
      // Ensure the fetched blob is an image
      if (!blob.type.startsWith('image/')) return;
      
      const reader = new FileReader();
      reader.onloadend = () => {
          const base64data = reader.result as string;
          setItems(prevItems =>
              prevItems.map(i => {
                  if (i.id === itemId && i.type === 'bookmark') {
                      return { ...i, faviconDataUrl: base64data };
                  }
                  return i;
              })
          );
      };
      reader.readAsDataURL(blob);
    } catch (error) {
        console.error("Failed to fetch favicon:", error);
    }
  }, [setItems]);


  const handleOpenModal = (item: Item | null = null) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleOpenItemById = (id: string) => {
    const itemToOpen = items.find(i => i.id === id);
    if (itemToOpen) {
        handleOpenModal(itemToOpen);
    } else {
        showNotification(`Error: Could not find the linked item.`);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleSaveItem = (itemData: ItemFormData) => {
    if (itemData.id) { // Editing existing item
      const originalItem = items.find(i => i.id === itemData.id);
      
      setItems(prevItems => prevItems.map(item => {
        if (item.id !== itemData.id) {
          return item;
        }

        if (item.type === 'bookmark' && itemData.type === 'bookmark') {
          return { ...item, ...itemData, updatedAt: new Date().toISOString() };
        }
        if (item.type === 'note' && itemData.type === 'note') {
          return { ...item, ...itemData, updatedAt: new Date().toISOString() };
        }
        
        return item;
      }));

      // If bookmark URL changed, fetch new favicon
      if (
        itemData.type === 'bookmark' &&
        originalItem?.type === 'bookmark' &&
        originalItem.url !== itemData.url
      ) {
        fetchAndSetFavicon(itemData.id, itemData.url);
      }
      showNotification('Item updated successfully!');
    } else { // Creating new item
      const newItemId = `item-${Date.now()}`;
      const newItem: Item = {
        ...itemData,
        id: newItemId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setItems(prevItems => [newItem, ...prevItems]);

      // Fetch favicon for new bookmark
      if (newItem.type === 'bookmark') {
        fetchAndSetFavicon(newItemId, newItem.url);
      }
      showNotification('Item created successfully!');
    }
    handleCloseModal();
  };

  const handleDeleteItem = (id: string) => {
    const itemToDelete = items.find(i => i.id === id);
    if (!itemToDelete) return;

    setConfirmation({
      isOpen: true,
      title: 'Delete Item',
      message: <>Are you sure you want to delete "<strong>{itemToDelete.title}</strong>"? This action cannot be undone.</>,
      onConfirm: () => {
        setItems(prevItems => prevItems.filter(item => item.id !== id));
        showNotification('Item deleted.');
        setConfirmation(null);
      },
      confirmButtonText: 'Delete',
      confirmButtonVariant: 'destructive'
    });
  };

  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    items.forEach(item => {
      item.tags.forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [items]);

  const stripHtml = (html: string) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
  };
  
  const filteredItems = useMemo(() => {
    const filtered = items
      .filter(item => {
        if (activeView === 'bookmarks') return item.type === 'bookmark';
        if (activeView === 'notes') return item.type === 'note';
        return true;
      })
      .filter(item => {
        if (!filterTag) return true;
        return item.tags.includes(filterTag);
      })
      .filter(item => {
        if (!searchTerm.trim()) return true;
        
        const lowerSearchTerm = searchTerm.toLowerCase();

        // Check for a direct tag match (case-insensitive includes)
        const hasTagMatch = item.tags.some(tag => tag.toLowerCase().includes(lowerSearchTerm));
        
        // Check for a fuzzy match in the title
        const hasTitleMatch = fuzzySearch(searchTerm, item.title);

        // Check for a fuzzy match in content or description based on item type
        let hasContentMatch = false;
        if (item.type === 'note') {
          const strippedContent = stripHtml((item as Note).content);
          hasContentMatch = fuzzySearch(searchTerm, strippedContent);
        } else if (item.type === 'bookmark') {
          hasContentMatch = fuzzySearch(searchTerm, (item as Bookmark).description || '');
        }

        return hasTitleMatch || hasContentMatch || hasTagMatch;
      });

      return [...filtered].sort((a, b) => {
        let compareA: string | number;
        let compareB: string | number;

        switch (sortKey) {
          case 'title':
            compareA = a.title.toLowerCase();
            compareB = b.title.toLowerCase();
            break;
          case 'createdAt':
            compareA = new Date(a.createdAt).getTime();
            compareB = new Date(b.createdAt).getTime();
            break;
          case 'updatedAt':
            compareA = new Date(a.updatedAt).getTime();
            compareB = new Date(b.updatedAt).getTime();
            break;
          default:
            return 0;
        }

        if (compareA < compareB) {
          return sortOrder === 'asc' ? -1 : 1;
        }
        if (compareA > compareB) {
          return sortOrder === 'asc' ? 1 : -1;
        }
        return 0;
      });

  }, [items, activeView, filterTag, searchTerm, sortKey, sortOrder]);

  // Bulk Action Handlers
  const handleToggleItemSelection = (itemId: string) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    const allVisibleIds = filteredItems.map(item => item.id);
    const allVisibleSelected = allVisibleIds.length > 0 && allVisibleIds.every(id => selectedItems.has(id));

    if (allVisibleSelected) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(allVisibleIds));
    }
  };

  const handleClearSelection = () => {
    setSelectedItems(new Set());
  };

  const handleBulkDelete = () => {
    if (selectedItems.size === 0) return;
    setConfirmation({
      isOpen: true,
      title: `Delete ${selectedItems.size} Items`,
      message: `Are you sure you want to permanently delete these ${selectedItems.size} items? This action cannot be undone.`,
      onConfirm: () => {
        setItems(prev => prev.filter(item => !selectedItems.has(item.id)));
        showNotification(`${selectedItems.size} items deleted.`);
        handleClearSelection();
        setConfirmation(null);
      },
      confirmButtonText: 'Delete',
      confirmButtonVariant: 'destructive'
    });
  };
  
  const handleBulkAddTags = (tagsStr: string) => {
    const newTags = tagsStr.split(',').map(t => t.trim()).filter(Boolean);
    if (newTags.length === 0) return;

    setItems(prevItems =>
      prevItems.map(item => {
        if (selectedItems.has(item.id)) {
          const updatedTags = new Set([...item.tags, ...newTags]);
          return { ...item, tags: Array.from(updatedTags), updatedAt: new Date().toISOString() };
        }
        return item;
      })
    );
    showNotification(`Tags added to ${selectedItems.size} items.`);
    setIsBulkTagModalOpen(false);
    handleClearSelection();
  };

  // Data Management Handlers
  const handleExportData = () => {
    if (items.length === 0) {
        showNotification('No data to export.');
        return;
    }
    const dataStr = JSON.stringify(items, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    const date = new Date().toISOString().split('T')[0];
    link.download = `nexus-notes-backup-${date}.json`;
    link.href = url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showNotification('Data exported successfully!');
    setIsSettingsModalOpen(false);
  };

  const handleTriggerImport = () => {
    importFileRef.current?.click();
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result;
        if (typeof text !== 'string') {
          throw new Error('Invalid file content.');
        }
        const importedItems: Item[] = JSON.parse(text);

        if (!Array.isArray(importedItems) || importedItems.some(item => !item.id || !item.title || !item.type)) {
          throw new Error('Invalid file format or missing required fields.');
        }

        setIsSettingsModalOpen(false);
        setConfirmation({
            isOpen: true,
            title: 'Import Data',
            message: `You are about to import ${importedItems.length} items. This will merge with your existing data. Items with the same ID will be overwritten. Do you want to continue?`,
            onConfirm: () => {
                const itemsMap = new Map(items.map(item => [item.id, item]));
                importedItems.forEach(importedItem => {
                    itemsMap.set(importedItem.id, importedItem);
                });
                const mergedItems = Array.from(itemsMap.values());
                setItems(mergedItems);
                showNotification(`${importedItems.length} items imported successfully!`);
                setConfirmation(null);
            },
            confirmButtonText: 'Import',
            confirmButtonVariant: 'primary'
        });

      } catch (error) {
        showNotification(`Import failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        console.error('Import error:', error);
      } finally {
        // Reset file input value to allow re-importing the same file
        if (event.target) {
            event.target.value = '';
        }
      }
    };
    reader.readAsText(file);
  };

  const handleLoadDemoData = () => {
    setIsSettingsModalOpen(false);
    setConfirmation({
        isOpen: true,
        title: 'Load Demo Data',
        message: 'This will add sample notes and bookmarks to your existing data. Are you sure you want to proceed?',
        onConfirm: () => {
            const itemsMap = new Map(items.map(item => [item.id, item]));
            demoData.forEach(demoItem => {
                itemsMap.set(demoItem.id, demoItem);
            });
            const mergedItems = Array.from(itemsMap.values());
            setItems(mergedItems);
            showNotification('Demo data loaded successfully!');
            setConfirmation(null);
        },
        confirmButtonText: 'Load Data',
        confirmButtonVariant: 'primary'
    });
  };

  const handleDeleteAllData = () => {
    setIsSettingsModalOpen(false);
    setConfirmation({
        isOpen: true,
        title: 'Delete All Data',
        message: (
            <>
                Are you sure you want to permanently delete <strong>all {items.length} items</strong>? 
                <br />
                This action is irreversible.
            </>
        ),
        onConfirm: () => {
            setItems([]);
            setSelectedItems(new Set());
            setFilterTag(null);
            showNotification('All data has been deleted.');
            setConfirmation(null);
        },
        confirmButtonText: 'Delete Everything',
        confirmButtonVariant: 'destructive'
    });
  };


  const isAllVisibleSelected = filteredItems.length > 0 && filteredItems.every(item => selectedItems.has(item.id));

  return (
    <div className="flex h-screen bg-primary font-sans">
      <Sidebar
        tags={allTags}
        activeView={activeView}
        setActiveView={setActiveView}
        filterTag={filterTag}
        setFilterTag={setFilterTag}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
      />
       <input
        type="file"
        ref={importFileRef}
        onChange={handleImportData}
        className="hidden"
        accept="application/json"
      />
      <main className="flex-1 flex flex-col overflow-hidden">
        <Header
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onAddItem={() => handleOpenModal()}
          sortKey={sortKey}
          setSortKey={setSortKey}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          selectedItemsCount={selectedItems.size}
          onBulkDelete={handleBulkDelete}
          onOpenBulkTagModal={() => setIsBulkTagModalOpen(true)}
          onClearSelection={handleClearSelection}
          onSelectAll={handleSelectAll}
          isAllVisibleSelected={isAllVisibleSelected}
          theme={theme}
          setTheme={setTheme}
        />
        <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <ItemList
            items={filteredItems}
            onEdit={handleOpenModal}
            onDelete={handleDeleteItem}
            searchTerm={searchTerm}
            selectedItems={selectedItems}
            onToggleSelection={handleToggleItemSelection}
            setFilterTag={setFilterTag}
          />
        </div>
      </main>
      {isModalOpen && (
        <ItemModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSaveItem}
          item={editingItem}
          allItems={items}
          allTags={allTags}
          onOpenItemById={handleOpenItemById}
        />
      )}
       {isSettingsModalOpen && (
        <SettingsModal
            isOpen={isSettingsModalOpen}
            onClose={() => setIsSettingsModalOpen(false)}
            onExport={handleExportData}
            onImport={handleTriggerImport}
            onLoadDemoData={handleLoadDemoData}
            onDeleteAllData={handleDeleteAllData}
            theme={theme}
            setTheme={setTheme}
            accentColor={accentColor}
            setAccentColor={setAccentColor}
        />
      )}
      {isBulkTagModalOpen && (
        <BulkTagModal
          isOpen={isBulkTagModalOpen}
          onClose={() => setIsBulkTagModalOpen(false)}
          onSave={handleBulkAddTags}
        />
      )}
      {confirmation?.isOpen && (
        <ConfirmationModal
          isOpen={confirmation.isOpen}
          onClose={() => setConfirmation(null)}
          onConfirm={confirmation.onConfirm}
          title={confirmation.title}
          message={confirmation.message}
          confirmButtonText={confirmation.confirmButtonText}
          confirmButtonVariant={confirmation.confirmButtonVariant}
        />
      )}
      {notification && <Notification message={notification} />}
    </div>
  );
};

export default App;