import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const ThemeToggle = ({ 
  className = '',
  size = 'default',
  variant = 'ghost',
  showLabel = false 
}) => {
  const [isDark, setIsDark] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeTheme = () => {
      const savedTheme = localStorage.getItem('theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)')?.matches;
      const shouldBeDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
      
      setIsDark(shouldBeDark);
      document.documentElement?.classList?.toggle('dark', shouldBeDark);
      setIsLoading(false);
    };

    initializeTheme();

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      const savedTheme = localStorage.getItem('theme');
      if (!savedTheme) {
        setIsDark(e?.matches);
        document.documentElement?.classList?.toggle('dark', e?.matches);
      }
    };

    mediaQuery?.addEventListener('change', handleChange);
    return () => mediaQuery?.removeEventListener('change', handleChange);
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
    document.documentElement?.classList?.toggle('dark', newTheme);

    // Dispatch custom event for other components to listen to
    window.dispatchEvent(new CustomEvent('themeChange', { 
      detail: { theme: newTheme ? 'dark' : 'light' } 
    }));
  };

  if (isLoading) {
    return (
      <Button
        variant={variant}
        size={size === 'icon' ? 'icon' : size}
        disabled
        className={className}
      >
        <div className="w-4 h-4 animate-pulse bg-muted-foreground/30 rounded" />
        {showLabel && <span className="ml-2">Theme</span>}
      </Button>
    );
  }

  const iconSize = size === 'sm' ? 16 : size === 'lg' ? 20 : 18;

  return (
    <Button
      variant={variant}
      size={size === 'icon' ? 'icon' : size}
      onClick={toggleTheme}
      className={`transition-all duration-150 hover:scale-102 ${className}`}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <div className="relative">
        <Icon 
          name={isDark ? 'Sun' : 'Moon'} 
          size={iconSize} 
          className="transition-all duration-300 ease-spring" 
        />
        {/* Subtle glow effect for dark mode */}
        {isDark && (
          <div className="absolute inset-0 -z-10">
            <Icon 
              name="Sun" 
              size={iconSize} 
              className="text-warning/20 blur-sm" 
            />
          </div>
        )}
      </div>
      {showLabel && (
        <span className="ml-2 text-sm font-medium">
          {isDark ? 'Light' : 'Dark'}
        </span>
      )}
    </Button>
  );
};

export default ThemeToggle;