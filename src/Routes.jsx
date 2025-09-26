import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import SearchResults from './pages/search-results';
import CryptocurrencyDashboard from './pages/cryptocurrency-dashboard';
import CoinDetailModal from './pages/coin-detail-modal';
import { Navigate } from 'react-router-dom'

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />
        <RouterRoutes>
          {/* Define your route here */}
          <Route path="/" element={<CryptocurrencyDashboard />} />
          <Route path="/search-results" element={<SearchResults />} />
          <Route path="/cryptocurrency-dashboard" element={<CryptocurrencyDashboard />} />
          <Route path="/coin-detail-modal" element={<CoinDetailModal />} />
          <Route path="*" element={<NotFound />} />
        </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
