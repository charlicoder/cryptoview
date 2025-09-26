import React, { useState, useMemo } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const SearchResultsTable = ({ cryptocurrencies, onCoinClick, searchQuery }) => {
  const [sortConfig, setSortConfig] = useState({ key: 'market_cap_rank', direction: 'asc' });

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig?.key === key && sortConfig?.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedCryptocurrencies = React.useMemo(() => {
    let sortableItems = [...cryptocurrencies];
    if (sortConfig?.key) {
      sortableItems?.sort((a, b) => {
        let aValue = a?.[sortConfig?.key];
        let bValue = b?.[sortConfig?.key];

        // Handle percentage values
        if (sortConfig?.key === 'price_change_percentage_24h') {
          aValue = parseFloat(aValue) || 0;
          bValue = parseFloat(bValue) || 0;
        }

        // Handle numeric values
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sortConfig?.direction === 'asc' ? aValue - bValue : bValue - aValue;
        }

        // Handle string values
        if (aValue < bValue) {
          return sortConfig?.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig?.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [cryptocurrencies, sortConfig]);

  const formatPrice = (price) => {
    if (price >= 1) {
      return `$${price?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    return `$${price?.toFixed(6)}`;
  };

  const formatMarketCap = (marketCap) => {
    if (marketCap >= 1e12) {
      return `$${(marketCap / 1e12)?.toFixed(2)}T`;
    }
    if (marketCap >= 1e9) {
      return `$${(marketCap / 1e9)?.toFixed(2)}B`;
    }
    if (marketCap >= 1e6) {
      return `$${(marketCap / 1e6)?.toFixed(2)}M`;
    }
    return `$${marketCap?.toLocaleString()}`;
  };

  const formatVolume = (volume) => {
    if (volume >= 1e9) {
      return `$${(volume / 1e9)?.toFixed(2)}B`;
    }
    if (volume >= 1e6) {
      return `$${(volume / 1e6)?.toFixed(2)}M`;
    }
    return `$${volume?.toLocaleString()}`;
  };

  const getSortIcon = (columnKey) => {
    if (sortConfig?.key !== columnKey) {
      return <Icon name="ArrowUpDown" size={14} className="text-muted-foreground/50" />;
    }
    return sortConfig?.direction === 'asc' 
      ? <Icon name="ArrowUp" size={14} className="text-accent" />
      : <Icon name="ArrowDown" size={14} className="text-accent" />;
  };

  const highlightText = (text, query) => {
    if (!query) return text;
    
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text?.split(regex);
    
    return parts?.map((part, index) => 
      regex?.test(part) ? (
        <mark key={index} className="bg-accent/20 text-accent font-medium px-1 rounded">
          {part}
        </mark>
      ) : part
    );
  };

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden shadow-elevation-1">
      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/30 border-b border-border">
            <tr>
              <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                <button
                  onClick={() => handleSort('market_cap_rank')}
                  className="flex items-center space-x-1 hover:text-foreground transition-colors duration-150"
                >
                  <span>#</span>
                  {getSortIcon('market_cap_rank')}
                </button>
              </th>
              <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                <button
                  onClick={() => handleSort('name')}
                  className="flex items-center space-x-1 hover:text-foreground transition-colors duration-150"
                >
                  <span>Name</span>
                  {getSortIcon('name')}
                </button>
              </th>
              <th className="text-right p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                <button
                  onClick={() => handleSort('current_price')}
                  className="flex items-center justify-end space-x-1 hover:text-foreground transition-colors duration-150"
                >
                  <span>Price</span>
                  {getSortIcon('current_price')}
                </button>
              </th>
              <th className="text-right p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                <button
                  onClick={() => handleSort('price_change_percentage_24h')}
                  className="flex items-center justify-end space-x-1 hover:text-foreground transition-colors duration-150"
                >
                  <span>24h %</span>
                  {getSortIcon('price_change_percentage_24h')}
                </button>
              </th>
              <th className="text-right p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                <button
                  onClick={() => handleSort('market_cap')}
                  className="flex items-center justify-end space-x-1 hover:text-foreground transition-colors duration-150"
                >
                  <span>Market Cap</span>
                  {getSortIcon('market_cap')}
                </button>
              </th>
              <th className="text-right p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                <button
                  onClick={() => handleSort('total_volume')}
                  className="flex items-center justify-end space-x-1 hover:text-foreground transition-colors duration-150"
                >
                  <span>Volume (24h)</span>
                  {getSortIcon('total_volume')}
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedCryptocurrencies?.map((crypto, index) => (
              <tr
                key={crypto?.id}
                onClick={() => onCoinClick(crypto)}
                className="border-b border-border hover:bg-muted/30 cursor-pointer transition-all duration-150 group"
              >
                <td className="p-4">
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground">
                      {crypto?.market_cap_rank}
                    </span>
                    {crypto?.symbol?.toLowerCase() === 'vanry' && (
                      <div className="ml-2 px-2 py-1 bg-accent/10 text-accent text-xs font-medium rounded-full">
                        Featured
                      </div>
                    )}
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-muted flex-shrink-0">
                      <Image
                        src={crypto?.image}
                        alt={crypto?.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-foreground group-hover:text-accent transition-colors duration-150">
                        {highlightText(crypto?.name, searchQuery)}
                      </div>
                      <div className="text-xs text-muted-foreground uppercase font-mono">
                        {highlightText(crypto?.symbol, searchQuery)}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-right">
                  <span className="text-sm font-semibold text-foreground font-mono">
                    {formatPrice(crypto?.current_price)}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <span className={`text-sm font-semibold font-mono ${
                    crypto?.price_change_percentage_24h >= 0 
                      ? 'text-success' :'text-error'
                  }`}>
                    {crypto?.price_change_percentage_24h >= 0 ? '+' : ''}
                    {crypto?.price_change_percentage_24h?.toFixed(2)}%
                  </span>
                </td>
                <td className="p-4 text-right">
                  <span className="text-sm font-medium text-foreground font-mono">
                    {formatMarketCap(crypto?.market_cap)}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <span className="text-sm font-medium text-muted-foreground font-mono">
                    {formatVolume(crypto?.total_volume)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Mobile Cards */}
      <div className="lg:hidden space-y-4 p-4">
        {sortedCryptocurrencies?.map((crypto) => (
          <div
            key={crypto?.id}
            onClick={() => onCoinClick(crypto)}
            className="bg-background border border-border rounded-lg p-4 hover:bg-muted/30 cursor-pointer transition-all duration-150 group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-muted flex-shrink-0">
                  <Image
                    src={crypto?.image}
                    alt={crypto?.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="text-base font-semibold text-foreground group-hover:text-accent transition-colors duration-150">
                    {highlightText(crypto?.name, searchQuery)}
                  </div>
                  <div className="text-sm text-muted-foreground uppercase font-mono">
                    {highlightText(crypto?.symbol, searchQuery)}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-foreground font-mono">
                  {formatPrice(crypto?.current_price)}
                </div>
                <div className={`text-sm font-semibold font-mono ${
                  crypto?.price_change_percentage_24h >= 0 
                    ? 'text-success' :'text-error'
                }`}>
                  {crypto?.price_change_percentage_24h >= 0 ? '+' : ''}
                  {crypto?.price_change_percentage_24h?.toFixed(2)}%
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-muted-foreground mb-1">Market Cap</div>
                <div className="font-semibold text-foreground font-mono">
                  {formatMarketCap(crypto?.market_cap)}
                </div>
              </div>
              <div>
                <div className="text-muted-foreground mb-1">Volume (24h)</div>
                <div className="font-semibold text-foreground font-mono">
                  {formatVolume(crypto?.total_volume)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchResultsTable;