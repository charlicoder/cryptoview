import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import SearchInterface from '../../components/ui/SearchInterface';
import SearchResultsHeader from './components/SearchResultsHeader';
import SearchResultsTable from './components/SearchResultsTable';
import EmptySearchState from './components/EmptySearchState';
import SearchLoadingState from './components/SearchLoadingState';
import CoinDetailModal from './components/CoinDetailModal';

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    sortBy: 'market_cap',
    order: 'desc',
    category: 'all'
  });

  // Mock cryptocurrency data with VANRY featured
  const mockCryptocurrencies = [
    {
      id: 'vanry',
      symbol: 'vanry',
      name: 'VANRY',
      image: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=32&h=32&fit=crop&crop=center',
      current_price: 0.125,
      market_cap: 125000000,
      market_cap_rank: 1,
      price_change_percentage_24h: 8.45,
      total_volume: 15000000,
      high_24h: 0.135,
      low_24h: 0.118,
      circulating_supply: 1000000000,
      max_supply: 2000000000
    },
    {
      id: 'bitcoin',
      symbol: 'btc',
      name: 'Bitcoin',
      image: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=32&h=32&fit=crop&crop=center',
      current_price: 43250.75,
      market_cap: 847500000000,
      market_cap_rank: 2,
      price_change_percentage_24h: 2.34,
      total_volume: 28500000000,
      high_24h: 43800.00,
      low_24h: 42100.00,
      circulating_supply: 19600000,
      max_supply: 21000000
    },
    {
      id: 'ethereum',
      symbol: 'eth',
      name: 'Ethereum',
      image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=32&h=32&fit=crop&crop=center',
      current_price: 2650.40,
      market_cap: 318500000000,
      market_cap_rank: 3,
      price_change_percentage_24h: -1.25,
      total_volume: 15200000000,
      high_24h: 2720.00,
      low_24h: 2580.00,
      circulating_supply: 120200000,
      max_supply: null
    },
    {
      id: 'binancecoin',
      symbol: 'bnb',
      name: 'BNB',
      image: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=32&h=32&fit=crop&crop=center',
      current_price: 315.80,
      market_cap: 47200000000,
      market_cap_rank: 4,
      price_change_percentage_24h: 3.67,
      total_volume: 1800000000,
      high_24h: 325.00,
      low_24h: 305.00,
      circulating_supply: 149500000,
      max_supply: 200000000
    },
    {
      id: 'solana',
      symbol: 'sol',
      name: 'Solana',
      image: 'https://images.unsplash.com/photo-1640340434855-6084b1f4901c?w=32&h=32&fit=crop&crop=center',
      current_price: 98.45,
      market_cap: 42800000000,
      market_cap_rank: 5,
      price_change_percentage_24h: 5.23,
      total_volume: 2100000000,
      high_24h: 102.00,
      low_24h: 92.50,
      circulating_supply: 434800000,
      max_supply: null
    },
    {
      id: 'ripple',
      symbol: 'xrp',
      name: 'XRP',
      image: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=32&h=32&fit=crop&crop=center',
      current_price: 0.625,
      market_cap: 34200000000,
      market_cap_rank: 6,
      price_change_percentage_24h: -2.15,
      total_volume: 1500000000,
      high_24h: 0.650,
      low_24h: 0.610,
      circulating_supply: 54700000000,
      max_supply: 100000000000
    },
    {
      id: 'cardano',
      symbol: 'ada',
      name: 'Cardano',
      image: 'https://images.unsplash.com/photo-1640340434855-6084b1f4901c?w=32&h=32&fit=crop&crop=center',
      current_price: 0.485,
      market_cap: 17200000000,
      market_cap_rank: 7,
      price_change_percentage_24h: 1.85,
      total_volume: 850000000,
      high_24h: 0.495,
      low_24h: 0.470,
      circulating_supply: 35500000000,
      max_supply: 45000000000
    },
    {
      id: 'dogecoin',
      symbol: 'doge',
      name: 'Dogecoin',
      image: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=32&h=32&fit=crop&crop=center',
      current_price: 0.085,
      market_cap: 12100000000,
      market_cap_rank: 8,
      price_change_percentage_24h: 4.12,
      total_volume: 680000000,
      high_24h: 0.089,
      low_24h: 0.081,
      circulating_supply: 142300000000,
      max_supply: null
    },
    {
      id: 'polygon',
      symbol: 'matic',
      name: 'Polygon',
      image: 'https://images.unsplash.com/photo-1640340434855-6084b1f4901c?w=32&h=32&fit=crop&crop=center',
      current_price: 0.925,
      market_cap: 8600000000,
      market_cap_rank: 9,
      price_change_percentage_24h: -0.75,
      total_volume: 420000000,
      high_24h: 0.945,
      low_24h: 0.910,
      circulating_supply: 9300000000,
      max_supply: 10000000000
    },
    {
      id: 'avalanche',
      symbol: 'avax',
      name: 'Avalanche',
      image: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=32&h=32&fit=crop&crop=center',
      current_price: 24.80,
      market_cap: 9200000000,
      market_cap_rank: 10,
      price_change_percentage_24h: 6.34,
      total_volume: 580000000,
      high_24h: 25.50,
      low_24h: 23.20,
      circulating_supply: 371000000,
      max_supply: 720000000
    }
  ];

  // Initialize search query from location state or URL params
  useEffect(() => {
    const queryFromState = location?.state?.query;
    const urlParams = new URLSearchParams(location.search);
    const queryFromUrl = urlParams?.get('q');
    
    const initialQuery = queryFromState || queryFromUrl || '';
    setSearchQuery(initialQuery);
    
    // Simulate loading
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, [location]);

  // Filter cryptocurrencies based on search query
  const filteredCryptocurrencies = useMemo(() => {
    if (!searchQuery?.trim()) {
      return mockCryptocurrencies;
    }

    const query = searchQuery?.toLowerCase()?.trim();
    const filtered = mockCryptocurrencies?.filter(crypto => 
      crypto?.name?.toLowerCase()?.includes(query) ||
      crypto?.symbol?.toLowerCase()?.includes(query)
    );

    // Ensure VANRY appears first if it matches the search
    const vanryIndex = filtered?.findIndex(crypto => crypto?.symbol?.toLowerCase() === 'vanry');
    if (vanryIndex > 0) {
      const vanry = filtered?.splice(vanryIndex, 1)?.[0];
      filtered?.unshift(vanry);
    }

    return filtered;
  }, [searchQuery]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    
    // Update URL without navigation
    const newUrl = query ? `/search-results?q=${encodeURIComponent(query)}` : '/search-results';
    window.history?.replaceState(null, '', newUrl);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    window.history?.replaceState(null, '', '/search-results');
  };

  const handleBackToDashboard = () => {
    navigate('/cryptocurrency-dashboard');
  };

  const handleCoinClick = (coin) => {
    setSelectedCoin(coin);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCoin(null);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        onSearch={handleSearch}
        searchQuery={searchQuery}
      />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SearchResultsHeader
          searchQuery={searchQuery}
          resultsCount={filteredCryptocurrencies?.length}
          onClearSearch={handleClearSearch}
        />

        <div className="mb-6">
          <SearchInterface
            onSearch={handleSearch}
            value={searchQuery}
            placeholder="Search cryptocurrencies by name or symbol..."
            showFilters={true}
            filters={filters}
            onFilterChange={handleFilterChange}
            className="max-w-2xl"
          />
        </div>

        {isLoading ? (
          <SearchLoadingState />
        ) : filteredCryptocurrencies?.length === 0 ? (
          <EmptySearchState
            searchQuery={searchQuery}
            onClearSearch={handleClearSearch}
            onBackToDashboard={handleBackToDashboard}
          />
        ) : (
          <SearchResultsTable
            cryptocurrencies={filteredCryptocurrencies}
            onCoinClick={handleCoinClick}
            searchQuery={searchQuery}
          />
        )}

        <CoinDetailModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          coin={selectedCoin}
        />
      </main>
    </div>
  );
};

export default SearchResults;