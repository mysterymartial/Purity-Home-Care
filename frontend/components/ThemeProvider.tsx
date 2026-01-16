'use client';

import { useEffect, useState } from 'react';

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Apply theme from localStorage or system preference
    const applyTheme = () => {
      const savedSettings = localStorage.getItem('adminSystemSettings');
      let theme = 'light';
      
      if (savedSettings) {
        try {
          const settings = JSON.parse(savedSettings);
          theme = settings.theme || 'light';
        } catch (e) {
          console.error('Failed to parse theme settings:', e);
        }
      }
      
      const html = document.documentElement;
      
      if (theme === 'dark') {
        html.classList.add('dark');
      } else if (theme === 'light') {
        html.classList.remove('dark');
      } else {
        // Auto mode - check system preference
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
          html.classList.add('dark');
        } else {
          html.classList.remove('dark');
        }
      }
    };

    applyTheme();

    // Listen for system theme changes in auto mode
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      const savedSettings = localStorage.getItem('adminSystemSettings');
      if (savedSettings) {
        try {
          const settings = JSON.parse(savedSettings);
          if (settings.theme === 'auto') {
            if (mediaQuery.matches) {
              document.documentElement.classList.add('dark');
            } else {
              document.documentElement.classList.remove('dark');
            }
          }
        } catch (e) {
          // Ignore
        }
      }
    };

    mediaQuery.addEventListener('change', handleChange);

    // Listen for storage changes (when admin changes theme)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'adminSystemSettings') {
        applyTheme();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Prevent flash of wrong theme
  if (!mounted) {
    return <>{children}</>;
  }

  return <>{children}</>;
}
