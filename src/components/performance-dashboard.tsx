'use client';

import { useState, useEffect } from 'react';
import { getLeadAnalytics, LeadStage } from '@/lib/lead-scoring';
import { getABTests, calculateSignificance } from '@/lib/ab-testing';

interface PerformanceMetrics {
  totalPageViews: number;
  uniqueVisitors: number;
  conversionRate: number;
  bounceRate: number;
  avgSessionDuration: number;
  coreWebVitals: {
    lcp: number;
    fid: number;
    cls: number;
  };
  leadMetrics: {
    totalLeads: number;
    byStage: Record<LeadStage, number>;
    avgScore: number;
  };
}

export default function PerformanceDashboard() {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

  useEffect(() => {
    loadMetrics();
  }, [timeRange]);

  const loadMetrics = async () => {
    setIsLoading(true);
    try {
      // Simulate API call to get real metrics
      const mockMetrics: PerformanceMetrics = {
        totalPageViews: 12847,
        uniqueVisitors: 8901,
        conversionRate: 3.2,
        bounceRate: 42.1,
        avgSessionDuration: 245,
        coreWebVitals: {
          lcp: 1.8,
          fid: 12,
          cls: 0.05,
        },
        leadMetrics: getLeadAnalytics(),
      };
      
      setTimeout(() => {
        setMetrics(mockMetrics);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error loading metrics:', error);
      setIsLoading(false);
    }
  };

  if (isLoading || !metrics) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold">Performance Dashboard</h2>
          <div className="animate-pulse bg-zinc-200 dark:bg-zinc-700 rounded h-10 w-32"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="card p-6 animate-pulse">
              <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded mb-4"></div>
              <div className="h-8 bg-zinc-200 dark:bg-zinc-700 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Performance Dashboard</h2>
        <div className="flex space-x-2">
          {(['7d', '30d', '90d'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                timeRange === range
                  ? 'bg-primary-500 text-white'
                  : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300'
              }`}
            >
              {range === '7d' ? 'Last 7 days' : range === '30d' ? 'Last 30 days' : 'Last 90 days'}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Page Views"
          value={metrics.totalPageViews.toLocaleString()}
          change={8.2}
          icon={
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
            </svg>
          }
        />
        
        <MetricCard
          title="Unique Visitors"
          value={metrics.uniqueVisitors.toLocaleString()}
          change={12.4}
          icon={
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"></path>
            </svg>
          }
        />
        
        <MetricCard
          title="Conversion Rate"
          value={`${metrics.conversionRate}%`}
          change={-2.1}
          icon={
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
            </svg>
          }
        />
        
        <MetricCard
          title="Avg. Session"
          value={`${Math.floor(metrics.avgSessionDuration / 60)}:${(metrics.avgSessionDuration % 60).toString().padStart(2, '0')}`}
          change={5.8}
          icon={
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          }
        />
      </div>

      {/* Core Web Vitals */}
      <div className="card p-6">
        <h3 className="text-xl font-bold mb-4">Core Web Vitals</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <WebVitalCard
            title="Largest Contentful Paint"
            value={`${metrics.coreWebVitals.lcp}s`}
            status={getWebVitalStatus(metrics.coreWebVitals.lcp, 'lcp')}
            description="Loading performance"
          />
          <WebVitalCard
            title="First Input Delay"
            value={`${metrics.coreWebVitals.fid}ms`}
            status={getWebVitalStatus(metrics.coreWebVitals.fid, 'fid')}
            description="Interactivity"
          />
          <WebVitalCard
            title="Cumulative Layout Shift"
            value={metrics.coreWebVitals.cls.toFixed(3)}
            status={getWebVitalStatus(metrics.coreWebVitals.cls, 'cls')}
            description="Visual stability"
          />
        </div>
      </div>

      {/* Lead Pipeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-xl font-bold mb-4">Lead Pipeline</h3>
          <div className="space-y-4">
            {Object.entries(metrics.leadMetrics.byStage).map(([stage, count]) => (
              <div key={stage} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-3 ${getStageColor(stage as LeadStage)}`}></div>
                  <span className="capitalize font-medium">{stage} Leads</span>
                </div>
                <span className="text-2xl font-bold">{count}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-700">
            <div className="flex items-center justify-between text-sm">
              <span>Average Lead Score</span>
              <span className="font-bold">{Math.round(metrics.leadMetrics.avgScore)}</span>
            </div>
          </div>
        </div>

        <ABTestResults />
      </div>

      {/* Conversion Funnel */}
      <div className="card p-6">
        <h3 className="text-xl font-bold mb-4">Conversion Funnel</h3>
        <ConversionFunnel metrics={metrics} />
      </div>
    </div>
  );
}

function MetricCard({ 
  title, 
  value, 
  change, 
  icon 
}: { 
  title: string; 
  value: string; 
  change: number; 
  icon: React.ReactNode; 
}) {
  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="text-zinc-500 dark:text-zinc-400">{icon}</div>
        <div className={`flex items-center text-sm ${
          change >= 0 ? 'text-green-600' : 'text-red-600'
        }`}>
          {change >= 0 ? '↗' : '↘'} {Math.abs(change)}%
        </div>
      </div>
      <div className="text-2xl font-bold mb-2">{value}</div>
      <div className="text-zinc-600 dark:text-zinc-400 text-sm">{title}</div>
    </div>
  );
}

function WebVitalCard({ 
  title, 
  value, 
  status, 
  description 
}: { 
  title: string; 
  value: string; 
  status: 'good' | 'needs-improvement' | 'poor'; 
  description: string; 
}) {
  const statusColors = {
    good: 'text-green-600 bg-green-100',
    'needs-improvement': 'text-yellow-600 bg-yellow-100',
    poor: 'text-red-600 bg-red-100',
  };

  return (
    <div className="text-center">
      <div className="text-2xl font-bold mb-2">{value}</div>
      <div className="text-sm font-medium mb-2">{title}</div>
      <div className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${statusColors[status]}`}>
        {status.replace('-', ' ')}
      </div>
      <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">{description}</div>
    </div>
  );
}

function ABTestResults() {
  const [tests, setTests] = useState(getABTests());

  return (
    <div className="card p-6">
      <h3 className="text-xl font-bold mb-4">A/B Test Results</h3>
      <div className="space-y-4">
        {tests.map((test) => (
          <div key={test.id} className="border border-zinc-200 dark:border-zinc-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">{test.name}</span>
              <span className={`px-2 py-1 rounded-full text-xs ${
                test.status === 'running' ? 'bg-green-100 text-green-600' : 'bg-zinc-100 text-zinc-600'
              }`}>
                {test.status}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {test.variants.map((variant) => (
                <div key={variant.id} className="text-center">
                  <div className="font-medium">{variant.name}</div>
                  <div className="text-zinc-500 dark:text-zinc-400">
                    {variant.conversionRate.toFixed(1)}% conversion
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ConversionFunnel({ metrics }: { metrics: PerformanceMetrics }) {
  const funnelSteps = [
    { name: 'Visitors', count: metrics.uniqueVisitors, percentage: 100 },
    { name: 'Page Views', count: metrics.totalPageViews, percentage: 85 },
    { name: 'Newsletter Signups', count: Math.round(metrics.uniqueVisitors * 0.12), percentage: 12 },
    { name: 'Contact Forms', count: Math.round(metrics.uniqueVisitors * 0.032), percentage: 3.2 },
    { name: 'Qualified Leads', count: Math.round(metrics.uniqueVisitors * 0.015), percentage: 1.5 },
  ];

  return (
    <div className="space-y-4">
      {funnelSteps.map((step, index) => (
        <div key={step.name} className="flex items-center">
          <div className="w-24 text-sm font-medium">{step.name}</div>
          <div className="flex-1 mx-4">
            <div className="bg-zinc-200 dark:bg-zinc-700 rounded-full h-8 relative overflow-hidden">
              <div 
                className="bg-primary-500 h-full rounded-full flex items-center justify-end pr-3 text-white text-sm font-medium transition-all duration-1000"
                style={{ width: `${Math.max(step.percentage, 5)}%` }}
              >
                {step.percentage.toFixed(1)}%
              </div>
            </div>
          </div>
          <div className="w-20 text-right text-sm font-bold">
            {step.count.toLocaleString()}
          </div>
        </div>
      ))}
    </div>
  );
}

// Helper functions
function getWebVitalStatus(value: number, metric: 'lcp' | 'fid' | 'cls'): 'good' | 'needs-improvement' | 'poor' {
  const thresholds = {
    lcp: { good: 2.5, poor: 4.0 },
    fid: { good: 100, poor: 300 },
    cls: { good: 0.1, poor: 0.25 },
  };

  const threshold = thresholds[metric];
  if (value <= threshold.good) return 'good';
  if (value <= threshold.poor) return 'needs-improvement';
  return 'poor';
}

function getStageColor(stage: LeadStage): string {
  const colors = {
    cold: 'bg-blue-500',
    warm: 'bg-yellow-500',
    hot: 'bg-orange-500',
    qualified: 'bg-green-500',
    customer: 'bg-purple-500',
  };
  return colors[stage];
}
