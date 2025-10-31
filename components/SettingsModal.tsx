import React from 'react';
import { ExportIcon, ImportIcon, DatabaseIcon, WarningIcon, CheckIcon } from './icons/Icons';
import { Theme } from '../hooks/useTheme';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: () => void;
  onImport: () => void;
  onLoadDemoData: () => void;
  onDeleteAllData: () => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  accentColor: string;
  setAccentColor: (color: string) => void;
}

const accentColors = [
  '#0969DA', '#1A7F37', '#800080', '#D2691E', '#DB2777', '#DC2626',
  '#EA580C', '#D97706', '#65A30D', '#059669', '#0891B2', '#0284C7',
  '#4F46E5', '#7C3AED', '#A855F7', '#C026D3', '#334155', '#475569',
  '#4B5563', '#6B7280'
];

const SettingsModal: React.FC<SettingsModalProps> = ({ 
    isOpen, onClose, onExport, onImport, onLoadDemoData, onDeleteAllData, 
    theme, setTheme, accentColor, setAccentColor 
}) => {
  if (!isOpen) return null;

  const ThemeButton: React.FC<{ themeName: Theme; label: string }> = ({ themeName, label }) => (
    <button
      onClick={() => setTheme(themeName)}
      className={`w-full py-2 rounded text-sm font-semibold transition-colors ${
        theme === themeName
          ? 'bg-accent text-white'
          : 'text-text-primary bg-primary hover:bg-highlight'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-secondary rounded-lg shadow-xl w-full max-w-md border border-border-color" onClick={e => e.stopPropagation()}>
          <div className="p-6">
            <h2 className="text-xl font-bold text-text-primary mb-6">Settings</h2>
            
            <div className="space-y-6">
                <div>
                    <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-2">Appearance</h3>
                     <div className="grid grid-cols-3 gap-2 rounded-md border border-border-color bg-secondary p-2">
                        <ThemeButton themeName="light" label="Light" />
                        <ThemeButton themeName="dark" label="Dark" />
                        <ThemeButton themeName="high-contrast" label="High Contrast" />
                    </div>
                </div>

                <div>
                    <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-2">Accent Color</h3>
                    <div className="grid grid-cols-10 gap-2 rounded-md border border-border-color bg-primary p-2">
                        {accentColors.map(color => (
                            <button
                                key={color}
                                title={color}
                                onClick={() => setAccentColor(color)}
                                className="w-full h-7 rounded-md flex items-center justify-center transition-all ring-offset-primary ring-offset-2 focus:outline-none focus:ring-2"
                                style={{ 
                                    backgroundColor: color,
                                    boxShadow: accentColor.toLowerCase() === color.toLowerCase() ? `0 0 0 2px ${color}`: 'none'
                                }}
                                >
                                {accentColor.toLowerCase() === color.toLowerCase() && (
                                    <CheckIcon className="h-4 w-4 text-white" style={{ filter: 'drop-shadow(0 1px 1px rgb(0 0 0 / 0.5))'}}/>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                 <div>
                    <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-2">Data Management</h3>
                    <div className="space-y-2 rounded-md border border-border-color bg-primary p-2">
                        <button
                            onClick={onImport}
                            className="flex items-center w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors text-text-primary hover:bg-highlight"
                            >
                            <ImportIcon className="h-5 w-5 mr-3 text-text-secondary" />
                            <span>Import Data from File</span>
                        </button>
                        <button
                            onClick={onExport}
                            className="flex items-center w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors text-text-primary hover:bg-highlight"
                            >
                            <ExportIcon className="h-5 w-5 mr-3 text-text-secondary" />
                            <span>Export Data to File</span>
                        </button>
                    </div>
                    <p className="text-xs text-text-secondary mt-2 px-1">
                        Save your notes and bookmarks to a JSON file, or load them from a backup.
                    </p>
                </div>
                 <div>
                    <h3 className="text-sm font-semibold text-red-500 uppercase tracking-wider mb-2">Danger Zone</h3>
                    <div className="space-y-2 rounded-md border border-red-500/30 bg-primary p-2">
                        <button
                            onClick={onLoadDemoData}
                            className="flex items-center w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors text-text-primary hover:bg-highlight"
                            >
                            <DatabaseIcon className="h-5 w-5 mr-3 text-text-secondary" />
                            <span>Load Demo Data</span>
                        </button>
                        <button
                            onClick={onDeleteAllData}
                            className="flex items-center w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors text-red-500 hover:bg-red-500/10"
                            >
                            <WarningIcon className="h-5 w-5 mr-3" />
                            <span>Delete All Data</span>
                        </button>
                    </div>
                     <p className="text-xs text-text-secondary mt-2 px-1">
                        Populate the app with sample items, or clear everything permanently. These actions cannot be undone.
                    </p>
                </div>
            </div>

          </div>
          
          <div className="bg-highlight px-6 py-3 flex justify-end space-x-3 rounded-b-lg">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-md bg-accent text-white font-semibold hover:opacity-90 transition-opacity">Done</button>
          </div>
      </div>
    </div>
  );
};

export default SettingsModal;