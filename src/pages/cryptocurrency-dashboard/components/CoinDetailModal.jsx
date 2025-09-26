import React, { useState, useEffect } from 'react';
import ModalContainer, { ModalBody } from '../../../components/ui/ModalContainer';

import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const CoinDetailModal = ({ isOpen, onClose, coin }) => {
  const [chartData, setChartData] = useState([]);
  const [chartPeriod, setChartPeriod] = useState('7d');
  const [isLoadingChart, setIsLoadingChart] = useState(false);

  useEffect(() => {
    if (isOpen && coin) {
      loadChartData();
    }
  }, [isOpen, coin, chartPeriod]);

  const loadChartData = async () => {
    setIsLoadingChart(true);
    
    // Mock chart data generation
    const periods = {
      '1d': 24,
      '7d': 7,
      '30d': 30,
      '90d': 90,
      '1y': 365
    };

    const dataPoints = periods?.[chartPeriod];
    const basePrice = coin?.current_price || 100;
    const mockData = [];

    for (let i = 0; i < dataPoints; i++) {
      const date = new Date();
      if (chartPeriod === '1d') {
        date?.setHours(date?.getHours() - (dataPoints - i));
      } else {
        date?.setDate(date?.getDate() - (dataPoints - i));
      }

      // Generate realistic price fluctuations
      const volatility = 0.05; // 5% volatility
      const randomChange = (Math.random() - 0.5) * volatility;
      const price = basePrice * (1 + randomChange * (i / dataPoints));

      mockData?.push({
        date: date?.toISOString(),
        price: price,
        timestamp: date?.getTime(),
        formattedDate: chartPeriod === '1d' ? date?.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
          : date?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      });
    }

    setTimeout(() => {
      setChartData(mockData);
      setIsLoadingChart(false);
    }, 500);
  };

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

  const chartPeriods = [
    { value: '1d', label: '1D' },
    { value: '7d', label: '7D' },
    { value: '30d', label: '30D' },
    { value: '90d', label: '90D' },
    { value: '1y', label: '1Y' }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="glass rounded-lg p-3 border border-border/50">
          <p className="text-sm text-muted-foreground mb-1">{payload?.[0]?.payload?.formattedDate}</p>
          <p className="font-mono font-semibold text-foreground">
            {formatPrice(payload?.[0]?.value)}
          </p>
        </div>
      );
    }
    return null;
  };

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
            <p className="text-sm text-muted-foreground uppercase">{coin?.symbol}</p>
          </div>
        </div>
      }
    >
      <ModalBody>
        <div className="space-y-6">
          {/* Price Overview with enhanced cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="glass rounded-lg p-4 border border-border/30 shadow-sm">
              <div className="text-sm text-muted-foreground mb-1 font-medium">Current Price</div>
              <div className="text-2xl font-bold font-mono text-foreground">
                {formatPrice(coin?.current_price)}
              </div>
            </div>
            
            <div className="glass rounded-lg p-4 border border-border/30 shadow-sm">
              <div className="text-sm text-muted-foreground mb-1 font-medium">24h Change</div>
              <div className={`text-2xl font-bold font-mono ${getPercentageColor(coin?.price_change_percentage_24h)}`}>
                {formatPercentage(coin?.price_change_percentage_24h)}
              </div>
            </div>
            
            <div className="glass rounded-lg p-4 border border-border/30 shadow-sm">
              <div className="text-sm text-muted-foreground mb-1 font-medium">Market Cap</div>
              <div className="text-2xl font-bold font-mono text-foreground">
                {formatMarketCap(coin?.market_cap)}
              </div>
            </div>
          </div>

          {/* Chart Section with enhanced styling */}
          <div className="glass rounded-lg p-6 border border-border/30 shadow-sm bg-card/40">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-foreground">Price Chart</h3>
              <div className="flex items-center space-x-1">
                {chartPeriods?.map((period) => (
                  <Button
                    key={period?.value}
                    variant={chartPeriod === period?.value ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setChartPeriod(period?.value)}
                    className="h-8 px-3 border border-border/20"
                  >
                    {period?.label}
                  </Button>
                ))}
              </div>
            </div>

            <div className="h-64 w-full bg-card/20 rounded-lg p-2">
              {isLoadingChart ? (
                <div className="flex items-center justify-center h-full">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-accent animate-pulse rounded-full" />
                    <span className="text-muted-foreground font-medium">Loading chart...</span>
                  </div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                    <XAxis 
                      dataKey="formattedDate"
                      stroke="var(--color-muted-foreground)"
                      fontSize={12}
                    />
                    <YAxis 
                      stroke="var(--color-muted-foreground)"
                      fontSize={12}
                      tickFormatter={(value) => formatPrice(value)}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="price"
                      stroke="var(--color-accent)"
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 4, fill: 'var(--color-accent)' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Additional Stats with enhanced cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="glass rounded-lg p-4 text-center border border-border/30 shadow-sm">
              <div className="text-sm text-muted-foreground mb-1 font-medium">Rank</div>
              <div className="text-lg font-semibold text-foreground">
                #{coin?.market_cap_rank}
              </div>
            </div>
            
            <div className="glass rounded-lg p-4 text-center border border-border/30 shadow-sm">
              <div className="text-sm text-muted-foreground mb-1 font-medium">Volume 24h</div>
              <div className="text-lg font-semibold font-mono text-foreground">
                {formatMarketCap(coin?.total_volume)}
              </div>
            </div>
            
            <div className="glass rounded-lg p-4 text-center border border-border/30 shadow-sm">
              <div className="text-sm text-muted-foreground mb-1 font-medium">High 24h</div>
              <div className="text-lg font-semibold font-mono text-foreground">
                {formatPrice(coin?.high_24h)}
              </div>
            </div>
            
            <div className="glass rounded-lg p-4 text-center border border-border/30 shadow-sm">
              <div className="text-sm text-muted-foreground mb-1 font-medium">Low 24h</div>
              <div className="text-lg font-semibold font-mono text-foreground">
                {formatPrice(coin?.low_24h)}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border/30">
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
            <Button
              variant="ghost"
              className="flex-1"
              iconName="Share2"
              iconPosition="left"
            >
              Share
            </Button>
          </div>

          {/* Description with enhanced styling */}
          {coin?.symbol === 'vanry' && (
            <div className="glass rounded-lg p-6 border border-border/30 shadow-sm bg-card/30">
              <h3 className="text-lg font-semibold text-foreground mb-3">About VANRY</h3>
              <p className="text-muted-foreground leading-relaxed">
                VANRY is a cutting-edge blockchain platform designed to revolutionize decentralized finance and digital asset management. 
                Built with advanced security protocols and scalable infrastructure, VANRY offers users seamless trading experiences 
                and innovative DeFi solutions. The platform focuses on providing high-performance transactions with minimal fees, 
                making it an attractive option for both retail and institutional investors in the cryptocurrency space.
              </p>
            </div>
          )}
        </div>
      </ModalBody>
    </ModalContainer>
  );
};

export default CoinDetailModal;