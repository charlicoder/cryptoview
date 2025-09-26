import React from 'react';
import Icon from '../../../components/AppIcon';

const SearchResultsHeader = ({ searchQuery, resultsCount, onClearSearch }) => {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Search Results
          </h1>
          {searchQuery && (
            <p className="text-muted-foreground">
              Showing results for "{searchQuery}"
            </p>
          )}
        </div>
        {searchQuery && (
          <button
            onClick={onClearSearch}
            className="flex items-center space-x-2 px-4 py-2 text-sm text-muted-foreground hover:text-foreground bg-card hover:bg-muted/50 border border-border rounded-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
          >
            <Icon name="X" size={16} />
            <span>Clear Search</span>
          </button>
        )}
      </div>
      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
        <div className="flex items-center space-x-2">
          <Icon name="Search" size={16} />
          <span>
            {resultsCount} {resultsCount === 1 ? 'cryptocurrency' : 'cryptocurrencies'} found
          </span>
        </div>
        <div className="w-1 h-1 bg-muted-foreground/50 rounded-full"></div>
        <div className="flex items-center space-x-2">
          <Icon name="Clock" size={16} />
          <span>Updated {new Date()?.toLocaleTimeString()}</span>
        </div>
      </div>
    </div>
  );
};

export default SearchResultsHeader;