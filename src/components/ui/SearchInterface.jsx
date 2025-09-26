import React, { useState, useEffect, useRef } from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const SearchInterface = ({ 
  onSearch, 
  placeholder = "Search cryptocurrencies...", 
  value = '', 
  className = '',
  showFilters = false,
  filters = {},
  onFilterChange,
  debounceMs = 300
}) => {
  const [searchValue, setSearchValue] = useState(value);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const debounceRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    setSearchValue(value);
  }, [value]);

  useEffect(() => {
    if (debounceRef?.current) {
      clearTimeout(debounceRef?.current);
    }

    debounceRef.current = setTimeout(() => {
      if (onSearch) {
        onSearch(searchValue);
      }
    }, debounceMs);

    return () => {
      if (debounceRef?.current) {
        clearTimeout(debounceRef?.current);
      }
    };
  }, [searchValue, onSearch, debounceMs]);

  const handleInputChange = (e) => {
    setSearchValue(e?.target?.value);
  };

  const handleClear = () => {
    setSearchValue('');
    if (onSearch) {
      onSearch('');
    }
    inputRef?.current?.focus();
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (onSearch) {
      onSearch(searchValue);
    }
  };

  const toggleFilters = () => {
    setIsFiltersOpen(!isFiltersOpen);
  };

  const handleFilterChange = (filterKey, value) => {
    if (onFilterChange) {
      onFilterChange({
        ...filters,
        [filterKey]: value
      });
    }
  };

  const filterOptions = {
    sortBy: [
      { value: 'market_cap', label: 'Market Cap' },
      { value: 'price', label: 'Price' },
      { value: 'volume', label: 'Volume' },
      { value: 'change_24h', label: '24h Change' }
    ],
    order: [
      { value: 'desc', label: 'Descending' },
      { value: 'asc', label: 'Ascending' }
    ],
    category: [
      { value: 'all', label: 'All Categories' },
      { value: 'defi', label: 'DeFi' },
      { value: 'nft', label: 'NFT' },
      { value: 'gaming', label: 'Gaming' },
      { value: 'layer1', label: 'Layer 1' }
    ]
  };

  return (
    <div className={`relative ${className}`}>
      {/* Search Input */}
      <form onSubmit={handleSubmit} className="relative">
        <div className={`relative transition-all duration-150 ${
          isFocused ? 'ring-2 ring-accent ring-offset-2 ring-offset-background' : ''
        }`}>
          <Icon 
            name="Search" 
            size={18} 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground pointer-events-none z-10" 
          />
          <input
            ref={inputRef}
            type="text"
            placeholder={placeholder}
            value={searchValue}
            onChange={handleInputChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="w-full pl-10 pr-20 py-3 bg-card border border-border rounded-lg text-sm focus:outline-none focus:border-accent transition-all duration-150 placeholder:text-muted-foreground font-mono"
          />
          
          {/* Clear Button */}
          {searchValue && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleClear}
              className="absolute right-12 top-1/2 transform -translate-y-1/2 w-6 h-6 hover:bg-muted/50"
              aria-label="Clear search"
            >
              <Icon name="X" size={14} />
            </Button>
          )}

          {/* Filters Toggle */}
          {showFilters && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={toggleFilters}
              className={`absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 ${
                isFiltersOpen ? 'bg-accent text-accent-foreground' : 'hover:bg-muted/50'
              }`}
              aria-label="Toggle filters"
            >
              <Icon name="SlidersHorizontal" size={16} />
            </Button>
          )}
        </div>
      </form>
      {/* Filters Panel */}
      {showFilters && isFiltersOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 p-4 bg-card border border-border rounded-lg shadow-elevation-3 z-20 glass">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Sort By */}
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
                Sort By
              </label>
              <select
                value={filters?.sortBy || 'market_cap'}
                onChange={(e) => handleFilterChange('sortBy', e?.target?.value)}
                className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              >
                {filterOptions?.sortBy?.map(option => (
                  <option key={option?.value} value={option?.value}>
                    {option?.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Order */}
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
                Order
              </label>
              <select
                value={filters?.order || 'desc'}
                onChange={(e) => handleFilterChange('order', e?.target?.value)}
                className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              >
                {filterOptions?.order?.map(option => (
                  <option key={option?.value} value={option?.value}>
                    {option?.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
                Category
              </label>
              <select
                value={filters?.category || 'all'}
                onChange={(e) => handleFilterChange('category', e?.target?.value)}
                className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              >
                {filterOptions?.category?.map(option => (
                  <option key={option?.value} value={option?.value}>
                    {option?.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Filter Actions */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                if (onFilterChange) {
                  onFilterChange({
                    sortBy: 'market_cap',
                    order: 'desc',
                    category: 'all'
                  });
                }
              }}
              className="text-muted-foreground hover:text-foreground"
            >
              Reset Filters
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={toggleFilters}
            >
              Apply Filters
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchInterface;