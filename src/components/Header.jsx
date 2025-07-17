import React from 'react';
import { Moon, Sun, Coffee } from 'lucide-react';
import { Button } from './ui/button';

const Header = ({ darkMode, toggleDarkMode }) => {
  return (
    <header className="bg-card border-b border-border shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Coffee className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-2xl md:text-3xl font-pacifico text-primary">
                Cozy Café Finder
              </h1>
              <p className="text-sm text-muted-foreground font-merriweather">
                Find your perfect cozy café
              </p>
            </div>
          </div>
          
          <Button
            variant="outline"
            size="icon"
            onClick={toggleDarkMode}
            className="btn-hover transition-all"
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;

