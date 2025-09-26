import React from 'react';

const SearchLoadingState = () => {
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden shadow-elevation-1">
      {/* Desktop Loading Table */}
      <div className="hidden lg:block">
        <div className="bg-muted/30 border-b border-border p-4">
          <div className="grid grid-cols-6 gap-4">
            <div className="h-4 bg-muted animate-pulse rounded"></div>
            <div className="h-4 bg-muted animate-pulse rounded"></div>
            <div className="h-4 bg-muted animate-pulse rounded"></div>
            <div className="h-4 bg-muted animate-pulse rounded"></div>
            <div className="h-4 bg-muted animate-pulse rounded"></div>
            <div className="h-4 bg-muted animate-pulse rounded"></div>
          </div>
        </div>
        
        <div className="divide-y divide-border">
          {Array.from({ length: 10 })?.map((_, index) => (
            <div key={index} className="p-4">
              <div className="grid grid-cols-6 gap-4 items-center">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-4 bg-muted animate-pulse rounded"></div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-muted animate-pulse rounded-full"></div>
                  <div className="space-y-2">
                    <div className="w-20 h-4 bg-muted animate-pulse rounded"></div>
                    <div className="w-12 h-3 bg-muted animate-pulse rounded"></div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="w-16 h-4 bg-muted animate-pulse rounded ml-auto"></div>
                </div>
                <div className="text-right">
                  <div className="w-12 h-4 bg-muted animate-pulse rounded ml-auto"></div>
                </div>
                <div className="text-right">
                  <div className="w-20 h-4 bg-muted animate-pulse rounded ml-auto"></div>
                </div>
                <div className="text-right">
                  <div className="w-16 h-4 bg-muted animate-pulse rounded ml-auto"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Mobile Loading Cards */}
      <div className="lg:hidden space-y-4 p-4">
        {Array.from({ length: 6 })?.map((_, index) => (
          <div key={index} className="bg-background border border-border rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-muted animate-pulse rounded-full"></div>
                <div className="space-y-2">
                  <div className="w-24 h-4 bg-muted animate-pulse rounded"></div>
                  <div className="w-16 h-3 bg-muted animate-pulse rounded"></div>
                </div>
              </div>
              <div className="text-right space-y-2">
                <div className="w-20 h-5 bg-muted animate-pulse rounded ml-auto"></div>
                <div className="w-16 h-4 bg-muted animate-pulse rounded ml-auto"></div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="w-16 h-3 bg-muted animate-pulse rounded"></div>
                <div className="w-20 h-4 bg-muted animate-pulse rounded"></div>
              </div>
              <div className="space-y-2">
                <div className="w-20 h-3 bg-muted animate-pulse rounded"></div>
                <div className="w-16 h-4 bg-muted animate-pulse rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchLoadingState;