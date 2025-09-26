import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import SearchInterface from '../../components/ui/SearchInterface';
import CryptoTable from './components/CryptoTable';
import CryptoMobileCard from './components/CryptoMobileCard';
import MarketStats from './components/MarketStats';
import CoinDetailModal from './components/CoinDetailModal';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

import { useGetCryptocurrenciesQuery, useGetGlobalStatsQuery } from '../../store/services/cryptoApi'

const CryptocurrencyDashboard = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'market_cap_rank', direction: 'asc' });
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [filters, setFilters] = useState({
    sortBy: 'market_cap',
    order: 'desc',
    category: 'all'
  });

  // API calls
  const {
    data: cryptocurrencies,
    isLoading: cryptosLoading,
    refetch: refetchCryptos
  } = useGetCryptocurrenciesQuery({
    search: searchQuery,
    sortBy: filters.sortBy
  });

  const {
    data: marketData,
    isLoading: marketLoading
  } = useGetGlobalStatsQuery();

  console.log("marketData: ", marketData)

  // Check for mobile view
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleSort = (config) => {
    setSortConfig(config);
  };

  const handleCoinClick = (coin) => {
    setSelectedCoin(coin);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedCoin(null);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    // Convert filter format to sort config
    setSortConfig({
      key: newFilters?.sortBy === 'market_cap' ? 'market_cap' : newFilters?.sortBy,
      direction: newFilters?.order
    });
  };

  const handleRefresh = () => {
    refetchCryptos();
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onSearch={handleSearch} searchQuery={searchQuery} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Cryptocurrency Dashboard
              </h1>
              <p className="text-muted-foreground font-medium">
                Track top 100 cryptocurrencies with real-time market data
              </p>
            </div>
            <Button
              variant="outline"
              onClick={handleRefresh}
              iconName="RefreshCw"
              iconPosition="left"
              disabled={cryptosLoading}
              className="hidden sm:flex border-border/40 shadow-sm"
            >
              Refresh
            </Button>
          </div>

          {/* Featured Badge for VANRY with enhanced styling */}
          <div className="glass rounded-lg p-4 mb-6 border border-accent/30 shadow-md">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center border border-accent/30">
                <Icon name="Star" size={20} className="text-accent" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Featured Trading Pair</h3>
                <p className="text-sm text-muted-foreground font-medium">
                  VANRY/USDT is prominently featured as our primary trading pair
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Market Stats */}
        <MarketStats marketData={marketData || {}} isLoading={marketLoading} />

        {/* Search Interface */}
        <div className="mb-6">
          <SearchInterface
            onSearch={handleSearch}
            placeholder="Search cryptocurrencies by name or symbol..."
            value={searchQuery}
            showFilters={true}
            filters={filters}
            onFilterChange={handleFilterChange}
            className="max-w-2xl"
          />
        </div>

        {/* Cryptocurrency List */}
        <div className="mb-8">
          {isMobile ? (
            <CryptoMobileCard
              cryptocurrencies={cryptocurrencies || []}
              onCoinClick={handleCoinClick}
              isLoading={cryptosLoading}
              searchQuery={searchQuery}
            />
          ) : (
            <CryptoTable
              cryptocurrencies={cryptocurrencies || []}
              onCoinClick={handleCoinClick}
              isLoading={cryptosLoading}
              searchQuery={searchQuery}
              sortConfig={sortConfig}
              onSort={handleSort}
            />
          )}
        </div>
      </main>

      {/* Coin Detail Modal */}
      <CoinDetailModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        coin={selectedCoin}
      />

      {/* Footer with enhanced styling */}
      <footer className="border-t border-border/40 mt-16 bg-card/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gradient-to-br from-accent to-accent/80 rounded-md flex items-center justify-center shadow-sm">
                <Icon name="TrendingUp" size={14} color="white" />
              </div>
              <span className="font-semibold text-foreground">CryptoView</span>
            </div>
            <div className="text-sm text-muted-foreground font-medium">
              © {new Date()?.getFullYear()} CryptoView. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CryptocurrencyDashboard;