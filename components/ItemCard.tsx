import React, { useState } from 'react';
import { Item, Bookmark, Note } from '../types';
import { BookmarkIcon, NoteIcon, PencilIcon, TrashIcon, ExternalLinkIcon, CopyIcon, CheckIcon } from './icons/Icons';

// Helper function to calculate Levenshtein distance (for fuzzy matching).
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
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
    }
  }
  return dp[m][n];
};

// Helper function to convert HTML to plain text.
const stripHtml = (html: string) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
};

const HighlightedText: React.FC<{ text: string | undefined; query: string }> = ({ text, query }) => {
    if (!query || !text) {
        return <>{text}</>;
    }

    const queryWords = query.toLowerCase().split(/\s+/).filter(Boolean);
    // Split by spaces and punctuation to preserve them
    const textParts = text.split(/(\s+|[.,!?;:()"]+)/);

    const isFuzzyMatch = (textWord: string): boolean => {
        const lowerTextWord = textWord.toLowerCase();
        return queryWords.some(qw => {
            const threshold = qw.length > 5 ? 2 : (qw.length > 3 ? 1 : 0);
            if (Math.abs(qw.length - lowerTextWord.length) > threshold) {
                 // Optimization: if word lengths differ more than threshold, they can't match
                if (!lowerTextWord.includes(qw) && !qw.includes(lowerTextWord)) {
                   return false;
                }
            }
            return levenshteinDistance(qw, lowerTextWord) <= threshold;
        });
    };

    return (
        <>
            {textParts.map((part, index) => {
                // Check if the part is a word (not just whitespace or punctuation)
                if (part.trim() !== '' && isFuzzyMatch(part)) {
                    return <mark key={index}>{part}</mark>;
                }
                return part;
            })}
        </>
    );
};

interface ItemCardProps {
  item: Item;
  onEdit: (item: Item) => void;
  onDelete: (id: string) => void;
  searchTerm: string;
  isSelected: boolean;
  onToggleSelection: (id: string) => void;
  onTagClick: (tag: string) => void;
}

const ItemCard: React.FC<ItemCardProps> = ({ item, onEdit, onDelete, searchTerm, isSelected, onToggleSelection, onTagClick }) => {
  const [isCopied, setIsCopied] = useState(false);
  const isBookmark = (item: Item): item is Bookmark => item.type === 'bookmark';
  
  const accentColorClass = isBookmark(item) ? 'text-accent' : 'text-accent-note';
  const hoverBorderClass = isBookmark(item) ? 'hover:border-accent' : 'hover:border-accent-note';
  const selectionClass = isSelected ? 'border-accent shadow-lg ring-2 ring-accent' : 'border-border-color';

  const handleCardClick = () => {
    // For notes, open the editor directly. For bookmarks, toggle selection.
    // Users can still select notes using the checkbox for bulk actions.
    if (item.type === 'note') {
      onEdit(item);
    } else {
      onToggleSelection(item.id);
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(item);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(item.id);
  };
  
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    onToggleSelection(item.id);
  }

  const handleTagClick = (e: React.MouseEvent, tag: string) => {
    e.stopPropagation();
    onTagClick(tag);
  };

  const handleCopyUrl = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isBookmark(item)) return;

    navigator.clipboard.writeText(item.url).then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
    }).catch(err => {
        console.error('Failed to copy URL to clipboard:', err);
    });
  };

  const CardHeader = () => (
    <div className="flex justify-between items-start mb-2">
      <div className="flex items-center min-w-0">
        <div className="flex-shrink-0 mr-3 w-5 h-5 flex items-center justify-center">
          {isBookmark(item) ? (
            item.faviconDataUrl ? (
              <img src={item.faviconDataUrl} alt="favicon" className="w-4 h-4 rounded" />
            ) : (
              <BookmarkIcon className={`h-5 w-5 ${accentColorClass}`} />
            )
          ) : (
            <NoteIcon className={`h-5 w-5 ${accentColorClass}`} />
          )}
        </div>
        <h3 className="text-lg font-bold text-text-primary truncate pr-2">
            <HighlightedText text={item.title} query={searchTerm} />
        </h3>
      </div>
      <div className="flex-shrink-0 flex items-center space-x-2">
         <input
            type="checkbox"
            className="h-5 w-5 rounded bg-primary border-border-color text-accent focus:ring-2 focus:ring-accent focus:ring-offset-secondary"
            checked={isSelected}
            onChange={handleCheckboxChange}
            onClick={(e) => e.stopPropagation()}
            aria-label={`Select item: ${item.title}`}
        />
        <button onClick={handleEdit} className="text-text-secondary hover:text-accent transition-colors"><PencilIcon className="h-5 w-5" /></button>
        <button onClick={handleDelete} className="text-text-secondary hover:text-red-500 transition-colors"><TrashIcon className="h-5 w-5" /></button>
      </div>
    </div>
  );

  const CardFooter = () => (
     <div className="mt-4 pt-4 border-t border-border-color">
        <div className="flex flex-wrap gap-2 mb-2">
          {item.tags.map(tag => (
            <button
              key={tag} 
              title={`Filter by tag: #${tag}`}
              onClick={(e) => handleTagClick(e, tag)}
              className={`inline-block max-w-full truncate bg-highlight ${accentColorClass} text-xs font-semibold px-2.5 py-1 rounded-full hover:ring-2 hover:ring-offset-1 hover:ring-offset-secondary hover:ring-current transition-all`}
            >
                <HighlightedText text={`#${tag}`} query={searchTerm.startsWith('#') ? searchTerm : `#${searchTerm}`} />
            </button>
          ))}
        </div>
         <div className="flex justify-between items-center text-xs text-text-secondary">
            <span title={`Created on ${new Date(item.createdAt).toLocaleString()}`}>
                Created: {new Date(item.createdAt).toLocaleDateString()}
            </span>
            <span title={`Last updated on ${new Date(item.updatedAt).toLocaleString()}`}>
                Updated: {new Date(item.updatedAt).toLocaleDateString()}
            </span>
        </div>
      </div>
  );
  
  return (
    <div 
      className={`bg-secondary rounded-lg border shadow-md ${hoverBorderClass} ${selectionClass} transition-all duration-200 p-4 flex flex-col cursor-pointer`}
      onClick={handleCardClick}
    >
      <CardHeader />
      <div className="flex-grow min-h-[60px]">
        {isBookmark(item) ? (
          <div>
            <div className="flex items-center justify-between gap-2">
              <a href={item.url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="text-accent hover:underline text-sm truncate" title={item.url}>
                {item.url}
              </a>
              <div className="flex items-center flex-shrink-0">
                 <button
                    onClick={handleCopyUrl}
                    className="p-1 rounded-full text-text-secondary hover:bg-highlight hover:text-accent transition-colors disabled:opacity-50"
                    aria-label="Copy URL to clipboard"
                    title={isCopied ? "Copied!" : "Copy URL"}
                    disabled={isCopied}
                >
                    {isCopied ? <CheckIcon className="h-4 w-4 text-green-500" /> : <CopyIcon className="h-4 w-4" />}
                </button>
                <button
                    onClick={(e) => {
                    e.stopPropagation();
                    window.open(item.url, '_blank', 'noopener,noreferrer');
                    }}
                    className="p-1 rounded-full text-text-secondary hover:bg-highlight hover:text-accent transition-colors"
                    aria-label="Open link in new tab"
                    title="Open in new tab"
                >
                    <ExternalLinkIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
            {item.description && 
                <p className="text-text-secondary mt-2 text-sm">
                    <HighlightedText text={item.description} query={searchTerm} />
                </p>
            }
          </div>
        ) : (
          searchTerm ? (
             <p className="text-text-secondary text-sm line-clamp-3 overflow-hidden">
                <HighlightedText text={stripHtml((item as Note).content)} query={searchTerm} />
            </p>
          ) : (
             <div
                className="rendered-content text-text-secondary text-sm line-clamp-3 overflow-hidden"
                dangerouslySetInnerHTML={{ __html: (item as Note).content }}
            />
          )
        )}
      </div>
      <CardFooter />
    </div>
  );
};

export default ItemCard;