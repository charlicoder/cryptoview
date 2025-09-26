import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CoinStatistics = ({ coin, isLoading = false }) => {
  const formatPrice = (price) => {
    if (!price) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 6
    })?.format(price);
  };

  const formatNumber = (num) => {
    if (!num) return 'N/A';
    if (num >= 1e12) return `$${(num / 1e12)?.toFixed(2)}T`;
    if (num >= 1e9) return `$${(num / 1e9)?.toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6)?.toFixed(2)}M`;
    if (num >= 1e3) return `$${(num / 1e3)?.toFixed(2)}K`;
    return `$${num?.toLocaleString()}`;
  };

  const formatSupply = (supply) => {
    if (!supply) return 'N/A';
    if (supply >= 1e12) return `${(supply / 1e12)?.toFixed(2)}T`;
    if (supply >= 1e9) return `${(supply / 1e9)?.toFixed(2)}B`;
    if (supply >= 1e6) return `${(supply / 1e6)?.toFixed(2)}M`;
    if (supply >= 1e3) return `${(supply / 1e3)?.toFixed(2)}K`;
    return supply?.toLocaleString();
  };

  const handleViewOnCoinGecko = () => {
    if (coin?.id) {
      const coinGeckoUrl = `https://www.coingecko.com/en/coins/${coin?.id}`;
      window.open(coinGeckoUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleAddToWatchlist = () => {
    // Future implementation for watchlist functionality
    console.log('Adding to watchlist:', coin?.name);
  };

  const statistics = [
    {
      label: 'Market Cap',
      value: formatNumber(coin?.market_cap),
      icon: 'TrendingUp',
      description: 'Total market value of all coins in circulation'
    },
    {
      label: '24h Volume',
      value: formatNumber(coin?.total_volume),
      icon: 'BarChart3',
      description: 'Total trading volume in the last 24 hours'
    },
    {
      label: 'Circulating Supply',
      value: formatSupply(coin?.circulating_supply),
      icon: 'Coins',
      description: 'Number of coins currently in circulation'
    },
    {
      label: 'Total Supply',
      value: formatSupply(coin?.total_supply),
      icon: 'Database',
      description: 'Total number of coins that exist'
    },
    {
      label: 'All-Time High',
      value: formatPrice(coin?.ath),
      icon: 'ArrowUp',
      description: 'Highest price ever recorded',
      extra: coin?.ath_date ? `on ${new Date(coin.ath_date)?.toLocaleDateString()}` : null
    },
    {
      label: 'All-Time Low',
      value: formatPrice(coin?.atl),
      icon: 'ArrowDown',
      description: 'Lowest price ever recorded',
      extra: coin?.atl_date ? `on ${new Date(coin.atl_date)?.toLocaleDateString()}` : null
    },
    {
      label: 'Price Change (7d)',
      value: coin?.price_change_percentage_7d_in_currency ? 
        `${coin?.price_change_percentage_7d_in_currency >= 0 ? '+' : ''}${coin?.price_change_percentage_7d_in_currency?.toFixed(2)}%` : 
        'N/A',
      icon: coin?.price_change_percentage_7d_in_currency >= 0 ? 'TrendingUp' : 'TrendingDown',
      description: 'Price change over the last 7 days',
      isChange: true,
      changeValue: coin?.price_change_percentage_7d_in_currency
    },
    {
      label: 'Price Change (30d)',
      value: coin?.price_change_percentage_30d_in_currency ? 
        `${coin?.price_change_percentage_30d_in_currency >= 0 ? '+' : ''}${coin?.price_change_percentage_30d_in_currency?.toFixed(2)}%` : 
        'N/A',
      icon: coin?.price_change_percentage_30d_in_currency >= 0 ? 'TrendingUp' : 'TrendingDown',
      description: 'Price change over the last 30 days',
      isChange: true,
      changeValue: coin?.price_change_percentage_30d_in_currency
    }
  ];

  if (isLoading) {
    return (
      <div className="p-6 border-t border-border/50">
        <div className="h-6 bg-muted animate-pulse rounded w-32 mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 })?.map((_, index) => (
            <div key={index} className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 bg-muted animate-pulse rounded-lg"></div>
                <div className="h-4 bg-muted animate-pulse rounded w-20"></div>
              </div>
              <div className="h-6 bg-muted animate-pulse rounded w-16 mb-2"></div>
              <div className="h-3 bg-muted animate-pulse rounded w-full"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const getChangeColor = (value) => {
    if (!value) return 'text-muted-foreground';
    return value >= 0 ? 'text-success' : 'text-error';
  };

  return (
    <div className="p-6 border-t border-border/50">
      <h3 className="text-lg font-semibold text-foreground mb-6">Key Statistics</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statistics?.map((stat, index) => (
          <div
            key={index}
            className="bg-card border border-border rounded-lg p-4 hover:shadow-elevation-2 transition-all duration-150 hover:scale-[1.02]"
          >
            <div className="flex items-center space-x-3 mb-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                stat?.isChange 
                  ? stat?.changeValue >= 0 
                    ? 'bg-success/10 text-success' :'bg-error/10 text-error' :'bg-accent/10 text-accent'
              }`}>
                <Icon name={stat?.icon} size={16} />
              </div>
              <span className="text-sm font-medium text-muted-foreground">
                {stat?.label}
              </span>
            </div>
            
            <div className="mb-2">
              <span className={`text-lg font-bold ${
                stat?.isChange ? getChangeColor(stat?.changeValue) : 'text-foreground'
              }`}>
                {stat?.value}
              </span>
              {stat?.extra && (
                <div className="text-xs text-muted-foreground mt-1">
                  {stat?.extra}
                </div>
              )}
            </div>
            
            <p className="text-xs text-muted-foreground leading-relaxed">
              {stat?.description}
            </p>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex flex-col sm:flex-row gap-3 pt-4 border-t border-border/30">
        <Button
          variant="default"
          className="flex-1"
          iconName="Star"
          iconPosition="left"
          onClick={handleAddToWatchlist}
        >
          Add to Watchlist
        </Button>
        <Button
          variant="outline"
          className="flex-1"
          iconName="ExternalLink"
          iconPosition="right"
          onClick={handleViewOnCoinGecko}
        >
          View on CoinGecko
        </Button>
      </div>

      {/* Additional Info */}
      <div className="mt-6 p-4 bg-muted/30 rounded-lg">
        <div className="flex items-center space-x-2 mb-2">
          <Icon name="Info" size={16} className="text-accent" />
          <span className="text-sm font-medium text-foreground">Market Information</span>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Data is updated in real-time from CoinGecko API. Market cap is calculated by multiplying the current price by the circulating supply. 
          All-time high and low values are recorded since the coin's inception on major exchanges.
        </p>
      </div>
    </div>
  );
};

export default CoinStatistics;