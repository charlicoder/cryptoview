import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const EmptySearchState = ({ searchQuery, onClearSearch, onBackToDashboard }) => {
  const suggestions = [
    "Try searching for popular coins like Bitcoin, Ethereum, or VANRY",
    "Check your spelling and try again",
    "Use cryptocurrency symbols like BTC, ETH, or VANRY",
    "Search for broader terms like \'DeFi\' or \'Layer 1'"
  ];

  return (
    <div className="bg-card border border-border rounded-xl p-12 text-center">
      <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-6">
        <Icon name="SearchX" size={32} className="text-muted-foreground" />
      </div>
      <h2 className="text-xl font-semibold text-foreground mb-2">
        No Results Found
      </h2>
      <p className="text-muted-foreground mb-6 max-w-md mx-auto">
        We couldn't find any cryptocurrencies matching "{searchQuery}". 
        Try adjusting your search terms.
      </p>
      <div className="bg-muted/30 rounded-lg p-6 mb-8 text-left max-w-lg mx-auto">
        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center">
          <Icon name="Lightbulb" size={16} className="mr-2 text-accent" />
          Search Suggestions
        </h3>
        <ul className="space-y-2">
          {suggestions?.map((suggestion, index) => (
            <li key={index} className="text-sm text-muted-foreground flex items-start">
              <Icon name="ArrowRight" size={14} className="mr-2 mt-0.5 text-muted-foreground/50 flex-shrink-0" />
              {suggestion}
            </li>
          ))}
        </ul>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button
          variant="outline"
          onClick={onClearSearch}
          iconName="RotateCcw"
          iconPosition="left"
        >
          Clear Search
        </Button>
        <Button
          variant="default"
          onClick={onBackToDashboard}
          iconName="ArrowLeft"
          iconPosition="left"
        >
          Back to Dashboard
        </Button>
      </div>
      <div className="mt-8 pt-6 border-t border-border">
        <p className="text-xs text-muted-foreground">
          Showing results from top 100 cryptocurrencies • Updated {new Date()?.toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
};

export default EmptySearchState;