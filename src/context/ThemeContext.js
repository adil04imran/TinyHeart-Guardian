import React, { createContext, useContext, useMemo, useState, useEffect, useCallback } from 'react';
import { ThemeProvider as MUIThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

export const ThemeContext = createContext({});

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState(() => {
    // Check for saved user preference first, then system preference
    if (typeof window !== 'undefined') {
      const savedMode = localStorage.getItem('themeMode');
      if (savedMode) return savedMode;
      
      // Check system preference
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      return prefersDark ? 'dark' : 'light';
    }
    return 'light'; // Default to light mode for SSR
  });

  // Toggle between light and dark mode
  const toggleDarkMode = useCallback(() => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  }, []);

  // Create theme with mode
  const theme = useMemo(() => {
    const isDark = mode === 'dark';
    
    return createTheme({
      palette: {
        mode,
        primary: {
          main: isDark ? '#90caf9' : '#1976d2',
          light: isDark ? '#e3f2fd' : '#bbdefb',
          dark: isDark ? '#42a5f5' : '#1565c0',
          contrastText: isDark ? 'rgba(0, 0, 0, 0.87)' : '#fff',
        },
        secondary: {
          main: isDark ? '#ce93d8' : '#9c27b0',
          light: isDark ? '#f3e5f5' : '#e1bee7',
          dark: isDark ? '#ab47bc' : '#7b1fa2',
          contrastText: isDark ? 'rgba(0, 0, 0, 0.87)' : '#fff',
        },
        background: {
          default: isDark ? '#121212' : '#f5f5f5',
          paper: isDark ? '#1e1e1e' : '#ffffff',
        },
        text: {
          primary: isDark ? 'rgba(255, 255, 255, 0.87)' : 'rgba(0, 0, 0, 0.87)',
          secondary: isDark ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)',
          disabled: isDark ? 'rgba(255, 255, 255, 0.38)' : 'rgba(0, 0, 0, 0.38)',
        },
        divider: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)',
      },
      typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        h1: { fontWeight: 500 },
        h2: { fontWeight: 500 },
        h3: { fontWeight: 500 },
        h4: { fontWeight: 500 },
        h5: { fontWeight: 500 },
        h6: { fontWeight: 500 },
      },
      components: {
        MuiButton: {
          styleOverrides: {
            root: {
              textTransform: 'none',
              borderRadius: 8,
            },
          },
        },
        MuiCard: {
          styleOverrides: {
            root: {
              borderRadius: 12,
              boxShadow: isDark 
                ? '0 4px 20px 0 rgba(0,0,0,0.2)' 
                : '0 4px 20px 0 rgba(0,0,0,0.05)',
            },
          },
        },
        MuiAppBar: {
          styleOverrides: {
            root: {
              backgroundColor: isDark ? '#1e1e1e' : '#1976d2',
              color: isDark ? '#fff' : '#fff',
              boxShadow: 'none',
              borderBottom: isDark 
                ? '1px solid rgba(255, 255, 255, 0.12)' 
                : '1px solid rgba(0, 0, 0, 0.12)',
            },
          },
        },
      },
    });
  }, [mode]);

  // Save user preference and update document
  useEffect(() => {
    try {
      localStorage.setItem('themeMode', mode);
      document.documentElement.setAttribute('data-theme', mode);
      
      // Update meta theme-color for mobile browsers
      const metaThemeColor = document.querySelector('meta[name="theme-color"]');
      if (metaThemeColor) {
        metaThemeColor.setAttribute('content', mode === 'dark' ? '#121212' : '#1976d2');
      }
      
      // Update body class for easier CSS theming
      document.body.className = mode === 'dark' ? 'dark-theme' : 'light-theme';
    } catch (error) {
      console.error('Error setting theme:', error);
    }
  }, [mode]);

  // Listen for system theme changes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      // Only update if there's no saved preference
      if (!localStorage.getItem('themeMode')) {
        setMode(e.matches ? 'dark' : 'light');
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const value = useMemo(() => ({
    darkMode: mode === 'dark',
    toggleDarkMode,
    mode,
  }), [mode, toggleDarkMode]);

  return (
    <ThemeContext.Provider value={value}>
      <MUIThemeProvider theme={theme}>
        <CssBaseline enableColorScheme />
        {children}
      </MUIThemeProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
