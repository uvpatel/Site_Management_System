import { create } from 'zustand';

const STORAGE_KEY = 'siteos_theme';

const getPreferredTheme = () => {
  if (typeof window === 'undefined') {
    return 'dark';
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === 'light' || stored === 'dark') {
    return stored;
  }

  if (typeof window.matchMedia === 'function') {
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }

  return 'dark';
};

export const useThemeStore = create((set) => ({
  theme: 'dark',
  initialized: false,
  initializeTheme: () => {
    const theme = getPreferredTheme();
    set({ theme, initialized: true });
  },
  setTheme: (theme) => {
    window.localStorage.setItem(STORAGE_KEY, theme);
    set({ theme, initialized: true });
  },
  toggleTheme: () =>
    set((state) => {
      const nextTheme = state.theme === 'dark' ? 'light' : 'dark';
      window.localStorage.setItem(STORAGE_KEY, nextTheme);
      return { theme: nextTheme, initialized: true };
    }),
}));
