import { fireEvent, render, screen } from '@testing-library/react';
import { ThemeProvider } from '../context/ThemeContext';
import { useTheme } from '../hooks/useTheme';
import { useThemeStore } from '../store/themeStore';

function ThemeHarness() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div>
      <span>{theme}</span>
      <button type="button" onClick={toggleTheme}>
        toggle
      </button>
    </div>
  );
}

describe('ThemeProvider', () => {
  it('toggles the root theme class and persists selection', () => {
    window.localStorage.clear();
    useThemeStore.setState({ theme: 'dark', initialized: false });

    render(
      <ThemeProvider>
        <ThemeHarness />
      </ThemeProvider>
    );

    expect(document.documentElement.classList.contains('theme-dark')).toBe(true);

    fireEvent.click(screen.getByRole('button', { name: /toggle/i }));

    expect(document.documentElement.classList.contains('theme-light')).toBe(true);
    expect(window.localStorage.getItem('siteos_theme')).toBe('light');
  });
});
