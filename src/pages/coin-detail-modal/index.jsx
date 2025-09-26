import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ModalContainer from '../../components/ui/ModalContainer';
import CoinHeader from './components/CoinHeader';
import PriceChart from './components/PriceChart';
import CoinStatistics from './components/CoinStatistics';
import LoadingSkeleton from './components/LoadingSkeleton';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

import { useGetCoinDetailsQuery, useGetCoinChartQuery } from '../../store/services/cryptoApi';

const CoinDetailModal = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [coinId, setCoinId] = useState(null);
  const [chartDays, setChartDays] = useState(7);

  // Get coin ID from URL params or location state
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const id = urlParams?.get('id') || location?.state?.coinId || 'vanry';
    setCoinId(id);
  }, [location]);

  // RTK Query hooks
  const {
    data: coinDetails,
    isLoading: detailsLoading,
    error: detailsError,
    refetch: refetchDetails
  } = useGetCoinDetailsQuery(coinId, {
    skip: !coinId, // Skip query if coinId is not available
  });

  const {
    data: chartData,
    isLoading: chartLoading,
    error: chartError,
    refetch: refetchChart
  } = useGetCoinChartQuery(
    { coinId, days: chartDays },
    {
      skip: !coinId, // Skip query if coinId is not available
    }
  );

  // Transform API data to match component expectations
  const transformedCoin = coinDetails ? {
    id: coinDetails.id,
    symbol: coinDetails.symbol,
    name: coinDetails.name,
    image: coinDetails.image?.large || coinDetails.image?.small,
    current_price: coinDetails.market_data?.current_price?.usd,
    market_cap: coinDetails.market_data?.market_cap?.usd,
    market_cap_rank: coinDetails.market_cap_rank,
    total_volume: coinDetails.market_data?.total_volume?.usd,
    price_change_percentage_24h: coinDetails.market_data?.price_change_percentage_24h,
    price_change_percentage_7d_in_currency: coinDetails.market_data?.price_change_percentage_7d,
    price_change_percentage_30d_in_currency: coinDetails.market_data?.price_change_percentage_30d,
    circulating_supply: coinDetails.market_data?.circulating_supply,
    total_supply: coinDetails.market_data?.total_supply,
    max_supply: coinDetails.market_data?.max_supply,
    ath: coinDetails.market_data?.ath?.usd,
    ath_date: coinDetails.market_data?.ath_date?.usd,
    atl: coinDetails.market_data?.atl?.usd,
    atl_date: coinDetails.market_data?.atl_date?.usd,
    description: coinDetails.description?.en,
    homepage: coinDetails.links?.homepage?.[0],
    blockchain_site: coinDetails.links?.blockchain_site?.[0],
    // Additional useful data
    categories: coinDetails.categories,
    genesis_date: coinDetails.genesis_date,
    hashing_algorithm: coinDetails.hashing_algorithm,
  } : null;

  const handleClose = () => {
    navigate('/cryptocurrency-dashboard');
  };

  const handleChartPeriodChange = (days) => {
    setChartDays(days);
  };

  const handleRetry = () => {
    refetchDetails();
    refetchChart();
  };

  const isLoading = detailsLoading || chartLoading;
  const hasError = detailsError || chartError;

  // Enhanced error message handling
  const getErrorMessage = () => {
    const detailsErr = detailsError?.data?.error || detailsError?.error || detailsError?.message;
    const chartErr = chartError?.data?.error || chartError?.error || chartError?.message;

    // Check for rate limit errors
    if (detailsError?.status === 429 || chartError?.status === 429) {
      return 'Rate limit exceeded. CoinGecko API allows limited requests for free accounts. Please try again in a few minutes.';
    }

    // Check for network errors
    if (detailsError?.status === 'FETCH_ERROR' || chartError?.status === 'FETCH_ERROR') {
      return 'Network error. Please check your internet connection and try again.';
    }

    // Check for 404 errors
    if (detailsError?.status === 404 || chartError?.status === 404) {
      return `Cryptocurrency "${coinId}" not found. The coin may have been delisted or the ID is incorrect.`;
    }

    // Check for 500+ server errors
    if ((detailsError?.status >= 500 && detailsError?.status < 600) ||
      (chartError?.status >= 500 && chartError?.status < 600)) {
      return 'CoinGecko server is currently unavailable. Please try again later.';
    }

    // Return specific API error messages if available
    if (detailsErr && typeof detailsErr === 'string') {
      return `Details Error: ${detailsErr}`;
    }
    if (chartErr && typeof chartErr === 'string') {
      return `Chart Error: ${chartErr}`;
    }

    // Return generic error with status codes if available
    if (detailsError?.status || chartError?.status) {
      const status = detailsError?.status || chartError?.status;
      return `API Error (${status}): Failed to load cryptocurrency data. Please try again.`;
    }

    return 'Failed to load cryptocurrency data. Please try again.';
  };

  const errorMessage = getErrorMessage();

  return (
    <AnimatePresence>
      <ModalContainer
        isOpen={true}
        onClose={handleClose}
        size="xl"
        showCloseButton={false}
        closeOnBackdropClick={true}
        closeOnEscape={true}
        className="max-w-6xl"
        title={transformedCoin?.name || coinId || "Cryptocurrency Details"}
        description={`View detailed information for ${transformedCoin?.name || coinId || "cryptocurrency"}`}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{
            duration: 0.2,
            ease: [0.4, 0.0, 0.2, 1]
          }}
          className="w-full max-h-[90vh] overflow-hidden"
        >
          {isLoading ? (
            <LoadingSkeleton />
          ) : hasError ? (
            <div className="p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-error/10 rounded-full flex items-center justify-center">
                <Icon name="AlertCircle" size={32} className="text-error" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {detailsError?.status === 429 || chartError?.status === 429
                  ? 'Rate Limit Exceeded'
                  : 'Error Loading Data'}
              </h3>
              <div className="max-w-md mx-auto mb-6">
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {errorMessage}
                </p>
                {(detailsError?.status === 429 || chartError?.status === 429) && (
                  <div className="mt-3 p-3 bg-warning/10 border border-warning/20 rounded-lg">
                    <p className="text-warning text-xs">
                      💡 Tip: Consider upgrading to CoinGecko Pro for higher rate limits and more features.
                    </p>
                  </div>
                )}
                {/* Show additional error details in development */}
                {process.env.NODE_ENV === 'development' && (
                  <details className="mt-4 text-left">
                    <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground">
                      Debug Information
                    </summary>
                    <div className="mt-2 p-2 bg-muted/50 rounded text-xs font-mono">
                      <div>Details Error: {JSON.stringify(detailsError, null, 2)}</div>
                      <div>Chart Error: {JSON.stringify(chartError, null, 2)}</div>
                    </div>
                  </details>
                )}
              </div>
              <div className="flex gap-3 justify-center">
                <Button
                  variant="outline"
                  onClick={handleRetry}
                  iconName="RefreshCw"
                  iconPosition="left"
                  disabled={isLoading}
                >
                  {isLoading ? 'Retrying...' : 'Try Again'}
                </Button>
                <Button
                  variant="ghost"
                  onClick={handleClose}
                  iconName="X"
                  iconPosition="left"
                >
                  Close & Go Back
                </Button>
              </div>
            </div>
          ) : transformedCoin ? (
            <>
              <CoinHeader coin={transformedCoin} onClose={handleClose} />
              <div className="overflow-y-auto max-h-[calc(90vh-5rem)]">
                <PriceChart
                  coin={transformedCoin}
                  chartData={chartData}
                  isLoading={chartLoading}
                  onPeriodChange={handleChartPeriodChange}
                  selectedPeriod={chartDays}
                />
                <CoinStatistics
                  coin={transformedCoin}
                  isLoading={detailsLoading}
                />
              </div>
            </>
          ) : (
            <div className="p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-warning/10 rounded-full flex items-center justify-center">
                <Icon name="Search" size={32} className="text-warning" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Cryptocurrency Not Found
              </h3>
              <p className="text-muted-foreground mb-4">
                The requested cryptocurrency could not be found. It may have been delisted or the ID is incorrect.
              </p>
              <div className="flex gap-3 justify-center">
                <Button
                  variant="outline"
                  onClick={handleRetry}
                  iconName="RefreshCw"
                  iconPosition="left"
                >
                  Retry
                </Button>
                <Button
                  variant="ghost"
                  onClick={handleClose}
                  iconName="X"
                  iconPosition="left"
                >
                  Close & Go Back
                </Button>
              </div>
            </div>
          )}
        </motion.div>
      </ModalContainer>
    </AnimatePresence>
  );
};

export default CoinDetailModal;
