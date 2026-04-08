import { createContext, useEffect, useMemo } from 'react';
import { useThemeStore } from '../store/themeStore';

export const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const theme = useThemeStore((state) => state.theme);
  const initialized = useThemeStore((state) => state.initialized);
  const initializeTheme = useThemeStore((state) => state.initializeTheme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);
  const setTheme = useThemeStore((state) => state.setTheme);

  useEffect(() => {
    if (!initialized) {
      initializeTheme();
    }
  }, [initializeTheme, initialized]);

  useEffect(() => {
    if (!initialized) return;

    document.documentElement.dataset.theme = theme;
    document.documentElement.classList.toggle('theme-light', theme === 'light');
    document.documentElement.classList.toggle('theme-dark', theme === 'dark');
  }, [initialized, theme]);

  const value = useMemo(
    () => ({ theme, initialized, toggleTheme, setTheme }),
    [theme, initialized, toggleTheme, setTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
