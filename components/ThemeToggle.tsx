import React from 'react';
import { SunIcon, MoonIcon } from './icons/Icons';
import { Theme } from '../hooks/useTheme';

interface ThemeToggleProps {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ theme, setTheme }) => {
  
  const handleToggle = () => {
    // This toggle will switch between light and dark. If the current theme is
    // high-contrast, it will switch to dark mode as a default next step.
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  // The icon should show what the button *will do*. 
  // If the current theme is not dark, the button will switch to dark mode, so show the moon.
  const nextThemeIsDark = theme !== 'dark';

  return (
    <button
      onClick={handleToggle}
      className="p-2 rounded-md text-text-secondary hover:bg-highlight hover:text-text-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-secondary focus:ring-accent"
      aria-label={`Switch to ${nextThemeIsDark ? 'dark' : 'light'} mode`}
    >
      {nextThemeIsDark ? (
        <MoonIcon className="h-5 w-5" />
      ) : (
        <SunIcon className="h-5 w-5" />
      )}
    </button>
  );
};

export default ThemeToggle;