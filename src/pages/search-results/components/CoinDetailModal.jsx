import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import ModalContainer, { ModalBody } from '../../../components/ui/ModalContainer';

import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const CoinDetailModal = ({ isOpen, onClose, coin }) => {
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('7d');

  useEffect(() => {
    if (isOpen && coin) {
      generateMockChartData();
    }
  }, [isOpen, coin, timeframe]);

  const generateMockChartData = () => {
    setIsLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      const days = timeframe === '24h' ? 1 : timeframe === '7d' ? 7 : timeframe === '30d' ? 30 : 90;
      const dataPoints = timeframe === '24h' ? 24 : days;
      const basePrice = coin?.current_price || 1;
      const volatility = 0.05; // 5% volatility
      
      const data = [];
      for (let i = 0; i < dataPoints; i++) {
        const randomChange = (Math.random() - 0.5) * 2 * volatility;
        const price = basePrice * (1 + randomChange * (i / dataPoints));
        const date = new Date();
        
        if (timeframe === '24h') {
          date?.setHours(date?.getHours() - (dataPoints - i));
        } else {
          date?.setDate(date?.getDate() - (dataPoints - i));
        }
        
        data?.push({
          date: date?.toISOString(),
          price: Math.max(0.000001, price),
          timestamp: date?.getTime()
        });
      }
      
      setChartData(data);
      setIsLoading(false);
    }, 800);
  };

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

  const handleViewOnCoinGecko = () => {
    if (coin?.id) {
      const coinGeckoUrl = `https://www.coingecko.com/en/coins/${coin?.id}`;
      window.open(coinGeckoUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      const date = new Date(label);
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-elevation-2">
          <p className="text-sm text-muted-foreground mb-1">
            {timeframe === '24h' 
              ? date?.toLocaleTimeString() 
              : date?.toLocaleDateString()
            }
          </p>
          <p className="text-sm font-semibold text-foreground font-mono">
            {formatPrice(payload?.[0]?.value)}
          </p>
        </div>
      );
    }
    return null;
  };

  const timeframeOptions = [
    { value: '24h', label: '24H' },
    { value: '7d', label: '7D' },
    { value: '30d', label: '30D' },
    { value: '90d', label: '90D' }
  ];

  if (!coin) return null;

  return (
    <ModalContainer
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      description=""
      title={
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-muted">
            <Image
              src={coin?.image}
              alt={coin?.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">{coin?.name}</h2>
            <p className="text-sm text-muted-foreground uppercase font-mono">{coin?.symbol}</p>
          </div>
        </div>
      }
    >
      <ModalBody>
        <div className="space-y-6">
          {/* Price Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-muted/30 rounded-lg p-4">
              <div className="text-sm text-muted-foreground mb-1">Current Price</div>
              <div className="text-2xl font-bold text-foreground font-mono">
                {formatPrice(coin?.current_price)}
              </div>
              <div className={`text-sm font-semibold font-mono mt-1 ${
                coin?.price_change_percentage_24h >= 0 ? 'text-success' : 'text-error'
              }`}>
                {coin?.price_change_percentage_24h >= 0 ? '+' : ''}
                {coin?.price_change_percentage_24h?.toFixed(2)}% (24h)
              </div>
            </div>
            
            <div className="bg-muted/30 rounded-lg p-4">
              <div className="text-sm text-muted-foreground mb-1">Market Cap</div>
              <div className="text-xl font-bold text-foreground font-mono">
                {formatMarketCap(coin?.market_cap)}
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                Rank #{coin?.market_cap_rank}
              </div>
            </div>
            
            <div className="bg-muted/30 rounded-lg p-4">
              <div className="text-sm text-muted-foreground mb-1">24h Volume</div>
              <div className="text-xl font-bold text-foreground font-mono">
                {formatVolume(coin?.total_volume)}
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                Trading Volume
              </div>
            </div>
          </div>

          {/* Chart Section */}
          <div className="bg-muted/30 rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-foreground">Price Chart</h3>
              <div className="flex items-center space-x-1 bg-background rounded-lg p-1">
                {timeframeOptions?.map((option) => (
                  <button
                    key={option?.value}
                    onClick={() => setTimeframe(option?.value)}
                    className={`px-3 py-1 text-sm font-medium rounded-md transition-all duration-150 ${
                      timeframe === option?.value
                        ? 'bg-accent text-accent-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    }`}
                  >
                    {option?.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-64 w-full">
              {isLoading ? (
                <div className="h-full flex items-center justify-center">
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <div className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-sm">Loading chart data...</span>
                  </div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                    <XAxis 
                      dataKey="date"
                      tickFormatter={(value) => {
                        const date = new Date(value);
                        return timeframe === '24h' 
                          ? date?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                          : date?.toLocaleDateString([], { month: 'short', day: 'numeric' });
                      }}
                      stroke="var(--color-muted-foreground)"
                      fontSize={12}
                    />
                    <YAxis 
                      tickFormatter={(value) => formatPrice(value)}
                      stroke="var(--color-muted-foreground)"
                      fontSize={12}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Line 
                      type="monotone" 
                      dataKey="price" 
                      stroke="var(--color-accent)" 
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 4, fill: "var(--color-accent)" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Additional Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <div className="text-sm text-muted-foreground mb-1">24h High</div>
              <div className="text-sm font-semibold text-foreground font-mono">
                {formatPrice(coin?.high_24h || coin?.current_price * 1.05)}
              </div>
            </div>
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <div className="text-sm text-muted-foreground mb-1">24h Low</div>
              <div className="text-sm font-semibold text-foreground font-mono">
                {formatPrice(coin?.low_24h || coin?.current_price * 0.95)}
              </div>
            </div>
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <div className="text-sm text-muted-foreground mb-1">Circulating Supply</div>
              <div className="text-sm font-semibold text-foreground font-mono">
                {coin?.circulating_supply ? 
                  `${(coin?.circulating_supply / 1e6)?.toFixed(2)}M` : 
                  'N/A'
                }
              </div>
            </div>
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <div className="text-sm text-muted-foreground mb-1">Max Supply</div>
              <div className="text-sm font-semibold text-foreground font-mono">
                {coin?.max_supply ? 
                  `${(coin?.max_supply / 1e6)?.toFixed(2)}M` : 
                  '∞'
                }
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border">
            <Button
              variant="default"
              className="flex-1"
              iconName="TrendingUp"
              iconPosition="left"
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
        </div>
      </ModalBody>
    </ModalContainer>
  );
};

export default CoinDetailModal;