import React from 'react';

const LoadingSkeleton = () => {
  return (
    <div className="animate-pulse">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between p-6 border-b border-border/50">
        <div className="flex items-center space-x-4 flex-1">
          <div className="w-12 h-12 bg-muted rounded-full"></div>
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <div className="h-6 bg-muted rounded w-32"></div>
              <div className="h-4 bg-muted rounded w-12"></div>
              <div className="h-4 bg-muted rounded w-8"></div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="h-8 bg-muted rounded w-24"></div>
              <div className="h-4 bg-muted rounded w-16"></div>
            </div>
          </div>
        </div>
        <div className="w-8 h-8 bg-muted rounded-lg"></div>
      </div>
      {/* Chart Skeleton */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="h-6 bg-muted rounded w-24 mb-2"></div>
            <div className="flex items-center space-x-3">
              <div className="h-8 bg-muted rounded w-32"></div>
              <div className="h-4 bg-muted rounded w-20"></div>
            </div>
          </div>
          <div className="flex space-x-1 bg-muted rounded-lg p-1">
            {Array.from({ length: 5 })?.map((_, i) => (
              <div key={i} className="h-8 w-12 bg-muted-foreground/20 rounded"></div>
            ))}
          </div>
        </div>
        <div className="h-80 bg-muted rounded-lg"></div>
        <div className="mt-4 flex items-center justify-center space-x-6">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-muted rounded-full"></div>
            <div className="h-3 bg-muted rounded w-16"></div>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-4 h-4 bg-muted rounded"></div>
            <div className="h-3 bg-muted rounded w-20"></div>
          </div>
        </div>
      </div>
      {/* Statistics Skeleton */}
      <div className="p-6 border-t border-border/50">
        <div className="h-6 bg-muted rounded w-32 mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 })?.map((_, index) => (
            <div key={index} className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 bg-muted rounded-lg"></div>
                <div className="h-4 bg-muted rounded w-20"></div>
              </div>
              <div className="h-6 bg-muted rounded w-16 mb-2"></div>
              <div className="h-3 bg-muted rounded w-full mb-1"></div>
              <div className="h-3 bg-muted rounded w-3/4"></div>
            </div>
          ))}
        </div>
        <div className="mt-6 p-4 bg-muted/30 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-4 h-4 bg-muted rounded"></div>
            <div className="h-4 bg-muted rounded w-32"></div>
          </div>
          <div className="space-y-2">
            <div className="h-3 bg-muted rounded w-full"></div>
            <div className="h-3 bg-muted rounded w-4/5"></div>
            <div className="h-3 bg-muted rounded w-3/5"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSkeleton;