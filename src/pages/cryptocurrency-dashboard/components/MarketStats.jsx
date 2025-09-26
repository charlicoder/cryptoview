import React from 'react';
import Icon from '../../../components/AppIcon';

const MarketStats = ({ marketData = {}, isLoading = false }) => {
  const formatCurrency = (value) => {
    if (!value) return '$0';
    if (value >= 1e12) return `$${(value / 1e12)?.toFixed(2)}T`;
    if (value >= 1e9) return `$${(value / 1e9)?.toFixed(2)}B`;
    if (value >= 1e6) return `$${(value / 1e6)?.toFixed(2)}M`;
    return `$${value?.toLocaleString()}`;
  };

  const formatPercentage = (percentage) => {
    if (percentage === null || percentage === undefined) return '0.00%';
    const formatted = Math.abs(percentage)?.toFixed(2);
    return `${percentage >= 0 ? '+' : '-'}${formatted}%`;
  };

  const getPercentageColor = (percentage) => {
    if (percentage === null || percentage === undefined) return 'text-muted-foreground';
    return percentage >= 0 ? 'text-success' : 'text-error';
  };

  const formatNumber = (value) => {
    if (!value) return '0';
    return value?.toLocaleString();
  };

  // Extract actual data from the API response structure
  const apiData = marketData?.data || marketData;

  const stats = [
    {
      id: 'total_market_cap',
      label: 'Total Market Cap',
      value: apiData?.total_market_cap?.usd,
      change: apiData?.market_cap_change_percentage_24h_usd,
      icon: 'TrendingUp',
      format: 'currency'
    },
    {
      id: 'total_volume',
      label: '24h Volume',
      value: apiData?.total_volume?.usd,
      icon: 'BarChart3',
      format: 'currency'
    },
    {
      id: 'btc_dominance',
      label: 'BTC Dominance',
      value: apiData?.market_cap_percentage?.btc,
      icon: 'Bitcoin',
      format: 'percentage'
    },
    {
      id: 'active_cryptocurrencies',
      label: 'Active Cryptocurrencies',
      value: apiData?.active_cryptocurrencies,
      icon: 'Coins',
      format: 'number'
    },
    {
      id: 'markets',
      label: 'Markets',
      value: apiData?.markets,
      icon: 'Building2',
      format: 'number'
    },
    {
      id: 'eth_dominance',
      label: 'ETH Dominance',
      value: apiData?.market_cap_percentage?.eth,
      icon: 'Zap',
      format: 'percentage'
    }
  ];

  const SkeletonStat = () => (
    <div className="glass rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="w-8 h-8 bg-muted animate-pulse rounded-lg" />
        <div className="w-16 h-4 bg-muted animate-pulse rounded" />
      </div>
      <div className="space-y-2">
        <div className="w-24 h-6 bg-muted animate-pulse rounded" />
        <div className="w-20 h-4 bg-muted animate-pulse rounded" />
      </div>
    </div>
  );

  const formatValue = (value, format) => {
    if (value === null || value === undefined) return '0';

    switch (format) {
      case 'currency':
        return formatCurrency(value);
      case 'percentage':
        return `${value?.toFixed(2)}%`;
      case 'number':
        return formatNumber(value);
      default:
        return value?.toString();
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        {Array.from({ length: 6 })?.map((_, index) => (
          <SkeletonStat key={index} />
        ))}
      </div>
    );
  }

  // Show top 4 stats on mobile/tablet, all 6 on desktop
  const displayStats = stats.filter(stat => stat.value !== null && stat.value !== undefined);

  return (
    <div className="mb-8">
      {/* Main stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
        {displayStats?.map((stat) => (
          <div key={stat?.id} className="glass rounded-xl p-4 lg:p-6 hover:shadow-elevation-2 transition-all duration-150">
            <div className="flex items-center justify-between mb-3">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                <Icon name={stat?.icon} size={16} className="text-accent lg:w-5 lg:h-5" />
              </div>
              {stat?.change !== null && stat?.change !== undefined && (
                <div className={`text-xs lg:text-sm font-medium ${getPercentageColor(stat?.change)}`}>
                  {formatPercentage(stat?.change)}
                </div>
              )}
            </div>

            <div className="space-y-1">
              <div className="text-lg lg:text-2xl font-bold text-foreground font-mono">
                {formatValue(stat?.value, stat?.format)}
              </div>
              <div className="text-xs lg:text-sm text-muted-foreground">
                {stat?.label}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Additional market info */}
      {apiData?.ended_icos || apiData?.ongoing_icos ? (
        <div className="glass rounded-xl p-4 lg:p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
            <Icon name="Info" size={20} className="text-accent mr-2" />
            Market Overview
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            {apiData?.ended_icos && (
              <div>
                <div className="text-xl font-bold text-foreground">{formatNumber(apiData.ended_icos)}</div>
                <div className="text-sm text-muted-foreground">Ended ICOs</div>
              </div>
            )}
            {apiData?.ongoing_icos !== null && apiData?.ongoing_icos !== undefined && (
              <div>
                <div className="text-xl font-bold text-foreground">{formatNumber(apiData.ongoing_icos)}</div>
                <div className="text-sm text-muted-foreground">Ongoing ICOs</div>
              </div>
            )}
            {apiData?.upcoming_icos !== null && apiData?.upcoming_icos !== undefined && (
              <div>
                <div className="text-xl font-bold text-foreground">{formatNumber(apiData.upcoming_icos)}</div>
                <div className="text-sm text-muted-foreground">Upcoming ICOs</div>
              </div>
            )}
            {apiData?.updated_at && (
              <div>
                <div className="text-xl font-bold text-foreground">
                  {new Date(apiData.updated_at * 1000).toLocaleDateString()}
                </div>
                <div className="text-sm text-muted-foreground">Last Updated</div>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default MarketStats;