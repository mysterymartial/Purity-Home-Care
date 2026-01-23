'use client';

import { useEffect, useState, useCallback } from 'react';
import { getGlobalTheme } from '@/lib/api';

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark' | 'auto'>('light');

  const applyTheme = useCallback((themeValue: 'light' | 'dark' | 'auto') => {
    const html = document.documentElement;
    
    if (themeValue === 'dark') {
      html.classList.add('dark');
    } else if (themeValue === 'light') {
      html.classList.remove('dark');
    } else {
      // Auto mode - check system preference
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        html.classList.add('dark');
      } else {
        html.classList.remove('dark');
      }
    }
  }, []);

  useEffect(() => {
    setMounted(true);
    
    // Load theme from backend (global setting)
    const loadTheme = async () => {
      try {
        const { theme: globalTheme } = await getGlobalTheme();
        setTheme(globalTheme);
        applyTheme(globalTheme);
      } catch (error) {
        console.error('Failed to load global theme:', error);
        // Fallback to light mode if API fails
        applyTheme('light');
      }
    };

    loadTheme();

    // Poll for theme changes every 5 seconds (to detect admin changes)
    const pollInterval = setInterval(() => {
      loadTheme();
    }, 5000);

    // Listen for system theme changes in auto mode
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'auto') {
        applyTheme('auto');
      }
    };

    mediaQuery.addEventListener('change', handleChange);

    return () => {
      clearInterval(pollInterval);
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [applyTheme, theme]);

  // Apply theme when it changes
  useEffect(() => {
    applyTheme(theme);
  }, [theme, applyTheme]);

  // Prevent flash of wrong theme
  if (!mounted) {
    return <>{children}</>;
  }

  return <>{children}</>;
}
