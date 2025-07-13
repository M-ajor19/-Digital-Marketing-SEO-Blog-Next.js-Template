'use client';

import { useEffect, useState } from 'react';
import { useLeadScoring } from '@/lib/lead-scoring';

interface WebVitalsMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  timestamp: number;
}

interface PerformanceData {
  webVitals: WebVitalsMetric[];
  pageLoadTime: number;
  timeToInteractive: number;
  resourceTimings: PerformanceResourceTiming[];
  navigationTiming: PerformanceNavigationTiming | null;
}

export default function PerformanceMonitor() {
  const [performanceData, setPerformanceData] = useState<PerformanceData>({
    webVitals: [],
    pageLoadTime: 0,
    timeToInteractive: 0,
    resourceTimings: [],
    navigationTiming: null
  });
  const { trackEvent } = useLeadScoring();

  useEffect(() => {
    // Core Web Vitals monitoring
    const vitalsObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'navigation') {
          const navEntry = entry as PerformanceNavigationTiming;
          setPerformanceData(prev => ({
            ...prev,
            navigationTiming: navEntry,
            pageLoadTime: navEntry.loadEventEnd - navEntry.loadEventStart
          }));
        }

        if (entry.entryType === 'resource') {
          const resourceEntry = entry as PerformanceResourceTiming;
          setPerformanceData(prev => ({
            ...prev,
            resourceTimings: [...prev.resourceTimings, resourceEntry]
          }));
        }
      }
    });

    vitalsObserver.observe({ entryTypes: ['navigation', 'resource'] });

    // Largest Contentful Paint (LCP)
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      
      if (lastEntry) {
        const rating = lastEntry.startTime <= 2500 ? 'good' : 
                      lastEntry.startTime <= 4000 ? 'needs-improvement' : 'poor';
        
        const metric: WebVitalsMetric = {
          name: 'LCP',
          value: lastEntry.startTime,
          rating,
          timestamp: Date.now()
        };

        setPerformanceData(prev => ({
          ...prev,
          webVitals: [...prev.webVitals.filter(m => m.name !== 'LCP'), metric]
        }));

        // Track performance metric
        trackEvent('performance_metric', {
          metric: 'LCP',
          value: lastEntry.startTime,
          rating
        });
      }
    });

    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

    // First Input Delay (FID)
    const fidObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const fidEntry = entry as any;
        const rating = fidEntry.processingStart - fidEntry.startTime <= 100 ? 'good' :
                      fidEntry.processingStart - fidEntry.startTime <= 300 ? 'needs-improvement' : 'poor';
        
        const metric: WebVitalsMetric = {
          name: 'FID',
          value: fidEntry.processingStart - fidEntry.startTime,
          rating,
          timestamp: Date.now()
        };

        setPerformanceData(prev => ({
          ...prev,
          webVitals: [...prev.webVitals.filter(m => m.name !== 'FID'), metric]
        }));

        trackEvent('performance_metric', {
          metric: 'FID',
          value: metric.value,
          rating
        });
      }
    });

    fidObserver.observe({ entryTypes: ['first-input'] });

    // Cumulative Layout Shift (CLS)
    let clsValue = 0;
    const clsObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const layoutShiftEntry = entry as any;
        if (!layoutShiftEntry.hadRecentInput) {
          clsValue += layoutShiftEntry.value;
        }
      }

      const rating = clsValue <= 0.1 ? 'good' : 
                    clsValue <= 0.25 ? 'needs-improvement' : 'poor';
      
      const metric: WebVitalsMetric = {
        name: 'CLS',
        value: clsValue,
        rating,
        timestamp: Date.now()
      };

      setPerformanceData(prev => ({
        ...prev,
        webVitals: [...prev.webVitals.filter(m => m.name !== 'CLS'), metric]
      }));
    });

    clsObserver.observe({ entryTypes: ['layout-shift'] });

    // Time to Interactive (TTI) estimation
    const estimateTTI = () => {
      const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigationEntry) {
        const tti = navigationEntry.domInteractive - navigationEntry.fetchStart;
        setPerformanceData(prev => ({
          ...prev,
          timeToInteractive: tti
        }));
      }
    };

    // Estimate TTI after page load
    if (document.readyState === 'complete') {
      estimateTTI();
    } else {
      window.addEventListener('load', estimateTTI);
    }

    // Send performance data to analytics
    const sendPerformanceData = () => {
      if (performanceData.webVitals.length > 0) {
        trackEvent('page_performance', {
          lcp: performanceData.webVitals.find(m => m.name === 'LCP')?.value,
          fid: performanceData.webVitals.find(m => m.name === 'FID')?.value,
          cls: performanceData.webVitals.find(m => m.name === 'CLS')?.value,
          pageLoadTime: performanceData.pageLoadTime,
          timeToInteractive: performanceData.timeToInteractive,
          url: window.location.pathname
        });
      }
    };

    // Send data before page unload
    window.addEventListener('beforeunload', sendPerformanceData);

    return () => {
      vitalsObserver.disconnect();
      lcpObserver.disconnect();
      fidObserver.disconnect();
      clsObserver.disconnect();
      window.removeEventListener('load', estimateTTI);
      window.removeEventListener('beforeunload', sendPerformanceData);
    };
  }, [trackEvent, performanceData.pageLoadTime, performanceData.timeToInteractive, performanceData.webVitals]);

  // Only show in development mode
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'good': return 'text-green-600';
      case 'needs-improvement': return 'text-yellow-600';
      case 'poor': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const formatValue = (name: string, value: number) => {
    switch (name) {
      case 'LCP':
      case 'FID':
        return `${value.toFixed(0)}ms`;
      case 'CLS':
        return value.toFixed(3);
      default:
        return value.toString();
    }
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-xs z-50">
      <h3 className="text-sm font-semibold text-gray-900 mb-2">Performance Monitor</h3>
      
      {/* Core Web Vitals */}
      <div className="space-y-2 mb-3">
        {performanceData.webVitals.map((metric) => (
          <div key={metric.name} className="flex justify-between items-center">
            <span className="text-xs text-gray-600">{metric.name}:</span>
            <span className={`text-xs font-medium ${getRatingColor(metric.rating)}`}>
              {formatValue(metric.name, metric.value)}
            </span>
          </div>
        ))}
      </div>

      {/* Other metrics */}
      <div className="space-y-1 text-xs text-gray-600 border-t pt-2">
        <div className="flex justify-between">
          <span>Page Load:</span>
          <span>{performanceData.pageLoadTime.toFixed(0)}ms</span>
        </div>
        <div className="flex justify-between">
          <span>TTI:</span>
          <span>{performanceData.timeToInteractive.toFixed(0)}ms</span>
        </div>
        <div className="flex justify-between">
          <span>Resources:</span>
          <span>{performanceData.resourceTimings.length}</span>
        </div>
      </div>

      {/* Rating legend */}
      <div className="mt-2 pt-2 border-t text-xs">
        <div className="flex space-x-2">
          <span className="text-green-600">Good</span>
          <span className="text-yellow-600">OK</span>
          <span className="text-red-600">Poor</span>
        </div>
      </div>
    </div>
  );
}
