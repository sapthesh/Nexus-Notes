import { useState, useEffect } from 'react';

export type Theme = 'light' | 'dark' | 'high-contrast';

// Default accent color if none is set in localStorage
const DEFAULT_ACCENT_COLOR = '#0969DA';

export interface UseThemeOutput {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  accentColor: string;
  setAccentColor: (color: string) => void;
}

export const useTheme = (): UseThemeOutput => {
  const [theme, setTheme] = useState<Theme>(() => {
    const storedTheme = localStorage.getItem('theme') as Theme | null;
    if (storedTheme) return storedTheme;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  const [accentColor, setAccentColor] = useState<string>(() => {
    return localStorage.getItem('accent-color') || DEFAULT_ACCENT_COLOR;
  });

  useEffect(() => {
    const root = document.documentElement;
    
    // 1. Handle base theme class
    root.classList.remove('dark', 'high-contrast');
    if (theme !== 'light') {
      root.classList.add(theme);
    }
    localStorage.setItem('theme', theme);

    // 2. Handle accent color CSS variable
    root.style.setProperty('--color-accent', accentColor);
    localStorage.setItem('accent-color', accentColor);

  }, [theme, accentColor]);
  
  return { theme, setTheme, accentColor, setAccentColor };
};