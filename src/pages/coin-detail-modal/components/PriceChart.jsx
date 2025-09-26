import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PriceChart = ({ coin, isLoading = false }) => {
  const [timeframe, setTimeframe] = useState('7d');

  // Mock historical data for demonstration
  const generateMockData = (days) => {
    const data = [];
    const basePrice = coin?.current_price || 50000;
    const now = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date?.setDate(date?.getDate() - i);
      
      // Generate realistic price variations
      const variation = (Math.random() - 0.5) * 0.1; // ±5% variation
      const price = basePrice * (1 + variation * (i / days));
      
      data?.push({
        date: date?.toISOString()?.split('T')?.[0],
        timestamp: date?.getTime(),
        price: Math.max(price, basePrice * 0.8), // Minimum 80% of base price
        volume: Math.random() * 1000000000 + 500000000
      });
    }
    
    return data;
  };

  const timeframes = [
    { key: '1d', label: '1D', days: 1 },
    { key: '7d', label: '7D', days: 7 },
    { key: '30d', label: '30D', days: 30 },
    { key: '90d', label: '90D', days: 90 },
    { key: '1y', label: '1Y', days: 365 }
  ];

  const chartData = generateMockData(timeframes?.find(t => t?.key === timeframe)?.days || 7);

  const formatPrice = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 6
    })?.format(value);
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp)?.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: timeframe === '1d' ? 'numeric' : undefined,
      minute: timeframe === '1d' ? '2-digit' : undefined
    });
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      const data = payload?.[0]?.payload;
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-elevation-2">
          <p className="text-sm text-muted-foreground mb-1">
            {formatDate(data?.timestamp)}
          </p>
          <p className="text-lg font-bold text-foreground">
            {formatPrice(data?.price)}
          </p>
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="h-6 bg-muted animate-pulse rounded w-32"></div>
          <div className="flex space-x-2">
            {timeframes?.map((tf) => (
              <div key={tf?.key} className="h-8 w-12 bg-muted animate-pulse rounded"></div>
            ))}
          </div>
        </div>
        <div className="h-80 bg-muted animate-pulse rounded-lg"></div>
      </div>
    );
  }

  const currentPrice = chartData?.[chartData?.length - 1]?.price || 0;
  const firstPrice = chartData?.[0]?.price || 0;
  const priceChange = currentPrice - firstPrice;
  const priceChangePercent = firstPrice ? (priceChange / firstPrice) * 100 : 0;
  const isPositive = priceChange >= 0;

  return (
    <div className="p-6">
      {/* Chart Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-1">Price Chart</h3>
          <div className="flex items-center space-x-3">
            <span className="text-2xl font-bold text-foreground">
              {formatPrice(currentPrice)}
            </span>
            <span className={`text-sm font-medium ${isPositive ? 'text-success' : 'text-error'}`}>
              {isPositive ? '+' : ''}{formatPrice(priceChange)} ({isPositive ? '+' : ''}{priceChangePercent?.toFixed(2)}%)
            </span>
          </div>
        </div>

        {/* Timeframe Selector */}
        <div className="flex space-x-1 bg-muted rounded-lg p-1">
          {timeframes?.map((tf) => (
            <Button
              key={tf?.key}
              variant={timeframe === tf?.key ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setTimeframe(tf?.key)}
              className="h-8 px-3 text-xs font-medium"
            >
              {tf?.label}
            </Button>
          ))}
        </div>
      </div>
      {/* Chart */}
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.3} />
            <XAxis 
              dataKey="timestamp"
              tickFormatter={formatDate}
              stroke="var(--color-muted-foreground)"
              fontSize={12}
              axisLine={false}
              tickLine={false}
            />
            <YAxis 
              tickFormatter={(value) => `$${value?.toLocaleString()}`}
              stroke="var(--color-muted-foreground)"
              fontSize={12}
              axisLine={false}
              tickLine={false}
              width={80}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="price"
              stroke={isPositive ? 'var(--color-success)' : 'var(--color-error)'}
              strokeWidth={2}
              dot={false}
              activeDot={{ 
                r: 4, 
                fill: isPositive ? 'var(--color-success)' : 'var(--color-error)',
                strokeWidth: 2,
                stroke: 'var(--color-background)'
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      {/* Chart Info */}
      <div className="mt-4 flex items-center justify-center space-x-6 text-sm text-muted-foreground">
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${isPositive ? 'bg-success' : 'bg-error'}`}></div>
          <span>Price ({timeframe?.toUpperCase()})</span>
        </div>
        <div className="flex items-center space-x-1">
          <Icon name="TrendingUp" size={14} />
          <span>Hover for details</span>
        </div>
      </div>
    </div>
  );
};

export default PriceChart;