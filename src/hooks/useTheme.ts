import { useEffect, useState } from 'react';

export type ThemeMode = 'auto' | 'light' | 'dark';

export function useTheme() {
  const [themeMode, setThemeMode] = useState<ThemeMode>('auto');

  useEffect(() => {
    const root = document.documentElement;

    if (themeMode === 'auto') {
      root.removeAttribute('data-theme');
      return;
    }

    root.dataset.theme = themeMode;
  }, [themeMode]);

  return { themeMode, setThemeMode };
}