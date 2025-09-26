import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const CoinHeader = ({ coin, onClose }) => {
  if (!coin) return null;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 6
    })?.format(price);
  };

  const formatPercentage = (percentage) => {
    if (!percentage) return '0.00%';
    return `${percentage >= 0 ? '+' : ''}${percentage?.toFixed(2)}%`;
  };

  const getChangeColor = (change) => {
    if (!change) return 'text-muted-foreground';
    return change >= 0 ? 'text-success' : 'text-error';
  };

  return (
    <div className="flex items-center justify-between p-6 border-b border-border/50">
      <div className="flex items-center space-x-4 flex-1 min-w-0">
        {/* Coin Image */}
        <div className="w-12 h-12 rounded-full overflow-hidden bg-muted flex-shrink-0">
          <Image
            src={coin?.image}
            alt={`${coin?.name} logo`}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Coin Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <h2 className="text-xl font-bold text-foreground truncate">
              {coin?.name}
            </h2>
            <span className="text-sm font-mono text-muted-foreground uppercase bg-muted px-2 py-1 rounded">
              {coin?.symbol}
            </span>
            {coin?.market_cap_rank && (
              <span className="text-xs bg-accent/10 text-accent px-2 py-1 rounded-full font-medium">
                #{coin?.market_cap_rank}
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-2xl font-bold text-foreground">
              {formatPrice(coin?.current_price)}
            </span>
            <span className={`text-sm font-medium ${getChangeColor(coin?.price_change_percentage_24h)}`}>
              {formatPercentage(coin?.price_change_percentage_24h)}
            </span>
          </div>
        </div>
      </div>
      {/* Close Button */}
      <button
        onClick={onClose}
        className="w-8 h-8 rounded-lg hover:bg-muted/50 flex items-center justify-center transition-colors duration-150 flex-shrink-0 ml-4 focus-ring"
        aria-label="Close modal"
      >
        <Icon name="X" size={18} className="text-muted-foreground" />
      </button>
    </div>
  );
};

export default CoinHeader;