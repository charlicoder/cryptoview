import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';


const CryptoMobileCard = ({ 
  cryptocurrencies = [], 
  onCoinClick, 
  isLoading = false,
  searchQuery = ''
}) => {
  const filteredData = cryptocurrencies?.filter(coin =>
    coin?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
    coin?.symbol?.toLowerCase()?.includes(searchQuery?.toLowerCase())
  );

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

  const formatPercentage = (percentage) => {
    if (!percentage) return '0.00%';
    const formatted = Math.abs(percentage)?.toFixed(2);
    return `${percentage >= 0 ? '+' : '-'}${formatted}%`;
  };

  const getPercentageColor = (percentage) => {
    if (!percentage) return 'text-muted-foreground';
    return percentage >= 0 ? 'text-success' : 'text-error';
  };

  const SkeletonCard = () => (
    <div className="glass rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-muted animate-pulse rounded-full" />
          <div className="space-y-2">
            <div className="w-24 h-4 bg-muted animate-pulse rounded" />
            <div className="w-16 h-3 bg-muted animate-pulse rounded" />
          </div>
        </div>
        <div className="w-8 h-4 bg-muted animate-pulse rounded" />
      </div>
      <div className="flex items-center justify-between">
        <div className="w-20 h-5 bg-muted animate-pulse rounded" />
        <div className="w-16 h-4 bg-muted animate-pulse rounded" />
      </div>
      <div className="w-32 h-3 bg-muted animate-pulse rounded" />
    </div>
  );

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 8 })?.map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {filteredData?.map((coin, index) => (
        <div
          key={coin?.id}
          className="glass rounded-xl p-4 cursor-pointer transition-all duration-150 hover:shadow-elevation-2 hover:scale-[1.02] active:scale-[0.98]"
          onClick={() => onCoinClick && onCoinClick(coin)}
        >
          {/* Header Row */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-muted flex-shrink-0">
                <Image
                  src={coin?.image}
                  alt={coin?.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0">
                <div className="font-medium text-foreground truncate flex items-center">
                  {coin?.name}
                  {coin?.symbol === 'vanry' && (
                    <span className="ml-2 px-2 py-0.5 bg-accent text-accent-foreground text-xs rounded-full">
                      Featured
                    </span>
                  )}
                </div>
                <div className="text-sm text-muted-foreground uppercase">
                  {coin?.symbol}
                </div>
              </div>
            </div>
            <div className="text-sm font-medium text-muted-foreground">
              #{coin?.market_cap_rank || index + 1}
            </div>
          </div>

          {/* Price Row */}
          <div className="flex items-center justify-between mb-3">
            <div className="font-mono text-lg font-semibold text-foreground">
              {formatPrice(coin?.current_price)}
            </div>
            <div className={`font-mono text-sm font-medium ${getPercentageColor(coin?.price_change_percentage_24h)}`}>
              {formatPercentage(coin?.price_change_percentage_24h)}
            </div>
          </div>

          {/* Market Cap Row */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Market Cap</span>
            <span className="font-mono text-muted-foreground">
              {formatMarketCap(coin?.market_cap)}
            </span>
          </div>

          {/* Expand Icon */}
          <div className="flex justify-center mt-3 pt-3 border-t border-border/30">
            <Icon name="ChevronRight" size={16} className="text-muted-foreground" />
          </div>
        </div>
      ))}
      {filteredData?.length === 0 && !isLoading && (
        <div className="glass rounded-xl p-8 text-center">
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

export default CryptoMobileCard;