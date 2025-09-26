import React, { useState, useMemo } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const CryptoTable = ({
  cryptocurrencies = [],
  onCoinClick,
  isLoading = false,
  searchQuery = '',
  sortConfig = { key: 'market_cap_rank', direction: 'asc' },
  onSort
}) => {
  const [hoveredRow, setHoveredRow] = useState(null);

  const filteredAndSortedData = useMemo(() => {
    let filtered = cryptocurrencies;

    // Apply search filter
    if (searchQuery) {
      filtered = cryptocurrencies?.filter(coin =>
        coin?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
        coin?.symbol?.toLowerCase()?.includes(searchQuery?.toLowerCase())
      );
    }

    // Sort data
    if (sortConfig?.key) {
      filtered = [...filtered]?.sort((a, b) => {
        let aValue = a?.[sortConfig?.key];
        let bValue = b?.[sortConfig?.key];

        // Handle null/undefined values
        if (aValue === null || aValue === undefined) aValue = 0;
        if (bValue === null || bValue === undefined) bValue = 0;

        // Convert to numbers for numeric sorting
        if (typeof aValue === 'string' && !isNaN(aValue)) aValue = parseFloat(aValue);
        if (typeof bValue === 'string' && !isNaN(bValue)) bValue = parseFloat(bValue);

        if (sortConfig?.direction === 'asc') {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });
    }

    return filtered;
  }, [cryptocurrencies, searchQuery, sortConfig]);

  const formatPrice = (price) => {
    if (!price) return '$0.00';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: price < 1 ? 6 : 2
    })?.format(price);
  };

  const formatMarketCap = (marketCap) => {
    if (!marketCap) return '$0';
    if (marketCap >= 1e12) return `$${(marketCap / 1e12)?.toFixed(2)}T`;
    if (marketCap >= 1e9) return `$${(marketCap / 1e9)?.toFixed(2)}B`;
    if (marketCap >= 1e6) return `$${(marketCap / 1e6)?.toFixed(2)}M`;
    return `$${marketCap?.toLocaleString()}`;
  };

  const formatVolume = (volume) => {
    if (!volume) return '$0';
    if (volume >= 1e9) return `$${(volume / 1e9)?.toFixed(2)}B`;
    if (volume >= 1e6) return `$${(volume / 1e6)?.toFixed(2)}M`;
    if (volume >= 1e3) return `$${(volume / 1e3)?.toFixed(2)}K`;
    return `$${volume?.toLocaleString()}`;
  };

  const formatPercentage = (percentage) => {
    if (!percentage) return '0.00%';
    const formatted = Math.abs(percentage)?.toFixed(2);
    return `${percentage >= 0 ? '+' : '-'}${formatted}%`;
  };

  const getPercentageColor = (percentage) => {
    if (!percentage) return 'text-muted-foreground';
    return percentage >= 0 ? 'text-success' : 'text-error';
  };

  const handleSort = (key) => {
    if (onSort) {
      const direction = sortConfig?.key === key && sortConfig?.direction === 'asc' ? 'desc' : 'asc';
      onSort({ key, direction });
    }
  };

  const getSortIcon = (key) => {
    if (sortConfig?.key !== key) return 'ArrowUpDown';
    return sortConfig?.direction === 'asc' ? 'ArrowUp' : 'ArrowDown';
  };

  const TableHeader = ({ label, sortKey, className = '' }) => (
    <th className={`px-4 py-3 text-left ${className}`}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleSort(sortKey)}
        className="h-auto p-0 font-medium text-muted-foreground hover:text-foreground -ml-1"
      >
        {label}
        <Icon
          name={getSortIcon(sortKey)}
          size={14}
          className="ml-1 opacity-60"
        />
      </Button>
    </th>
  );

  const SkeletonRow = () => (
    <tr className="border-b border-border/50">
      <td className="px-4 py-4">
        <div className="w-8 h-4 bg-muted animate-pulse rounded" />
      </td>
      <td className="px-4 py-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-muted animate-pulse rounded-full" />
          <div className="space-y-2">
            <div className="w-20 h-4 bg-muted animate-pulse rounded" />
            <div className="w-12 h-3 bg-muted animate-pulse rounded" />
          </div>
        </div>
      </td>
      <td className="px-4 py-4">
        <div className="w-20 h-4 bg-muted animate-pulse rounded" />
      </td>
      <td className="px-4 py-4">
        <div className="w-16 h-4 bg-muted animate-pulse rounded" />
      </td>
      <td className="px-4 py-4 hidden md:table-cell">
        <div className="w-24 h-4 bg-muted animate-pulse rounded" />
      </td>
      <td className="px-4 py-4 hidden lg:table-cell">
        <div className="w-20 h-4 bg-muted animate-pulse rounded" />
      </td>
    </tr>
  );

  if (isLoading) {
    return (
      <div className="glass-table rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/40 border-b border-border/60">
              <tr>
                <TableHeader label="#" sortKey="market_cap_rank" className="w-16" />
                <TableHeader label="Name" sortKey="name" className="min-w-[200px]" />
                <TableHeader label="Price" sortKey="current_price" />
                <TableHeader label="24h %" sortKey="price_change_percentage_24h" />
                <TableHeader label="Market Cap" sortKey="market_cap" className="hidden md:table-cell" />
                <TableHeader label="Volume" sortKey="total_volume" className="hidden lg:table-cell" />
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 10 })?.map((_, index) => (
                <SkeletonRow key={index} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-table rounded-xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/40 border-b border-border/60">
            <tr>
              <TableHeader label="#" sortKey="market_cap_rank" className="w-16" />
              <TableHeader label="Name" sortKey="name" className="min-w-[200px]" />
              <TableHeader label="Price" sortKey="current_price" />
              <TableHeader label="24h %" sortKey="price_change_percentage_24h" />
              <TableHeader label="Market Cap" sortKey="market_cap" className="hidden md:table-cell" />
              <TableHeader label="Volume" sortKey="total_volume" className="hidden lg:table-cell" />
            </tr>
          </thead>
          <tbody className="bg-card/50">
            {filteredAndSortedData?.map((coin, index) => (
              <tr
                key={coin?.id}
                className={`border-b border-border/40 cursor-pointer transition-all duration-150 hover:bg-muted/20 hover:scale-[1.005] hover:shadow-sm ${hoveredRow === coin?.id ? 'shadow-md bg-card/80' : ''
                  }`}
                onClick={() => onCoinClick && onCoinClick(coin)}
                onMouseEnter={() => setHoveredRow(coin?.id)}
                onMouseLeave={() => setHoveredRow(null)}
              >
                <td className="px-4 py-4 text-sm font-medium text-muted-foreground">
                  {coin?.market_cap_rank || index + 1}
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-muted/60 flex-shrink-0 border border-border/30">
                      <Image
                        src={coin?.image}
                        alt={coin?.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="font-medium text-foreground truncate">
                        {coin?.name}
                        {coin?.symbol === 'vanry' && (
                          <span className="ml-2 px-2 py-0.5 bg-accent text-accent-foreground text-xs rounded-full shadow-sm">
                            Featured
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground uppercase font-medium">
                        {coin?.symbol}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 font-mono text-sm font-semibold text-foreground">
                  {formatPrice(coin?.current_price)}
                </td>
                <td className="px-4 py-4">
                  <span className={`font-mono text-sm font-semibold ${getPercentageColor(coin?.price_change_percentage_24h)}`}>
                    {formatPercentage(coin?.price_change_percentage_24h)}
                  </span>
                </td>
                <td className="px-4 py-4 hidden md:table-cell font-mono text-sm text-muted-foreground font-medium">
                  {formatMarketCap(coin?.market_cap)}
                </td>
                <td className="px-4 py-4 hidden lg:table-cell font-mono text-sm text-muted-foreground font-medium">
                  {formatVolume(coin?.total_volume)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {filteredAndSortedData?.length === 0 && !isLoading && (
        <div className="p-8 text-center bg-card/30">
          <Icon name="Search" size={48} className="mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No cryptocurrencies found</h3>
          <p className="text-muted-foreground">
            {searchQuery ? `No results for "${searchQuery}"` : 'No data available'}
          </p>
        </div>
      )}
    </div>
  );
};

export default CryptoTable;