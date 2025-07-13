'use client';

import { useState } from 'react';
import PerformanceDashboard from '@/components/performance-dashboard';
import { PopularPosts } from '@/components/content-recommendations';
import { useLeadScoring } from '@/lib/lead-scoring';
import { useABTest } from '@/lib/ab-testing';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics' | 'leads' | 'content'>('overview');
  const { leadScore } = useLeadScoring();

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      {/* Header */}
      <header className="bg-white dark:bg-zinc-800 shadow-sm border-b border-zinc-200 dark:border-zinc-700">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              Marketing Dashboard
            </h1>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-zinc-600 dark:text-zinc-400">
                Last updated: {new Date().toLocaleTimeString()}
              </div>
              <button className="btn text-sm">
                Export Report
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700">
        <div className="container">
          <div className="flex space-x-8">
            {[
              { id: 'overview', name: 'Overview' },
              { id: 'analytics', name: 'Analytics' },
              { id: 'leads', name: 'Lead Scoring' },
              { id: 'content', name: 'Content Performance' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="container py-8">
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'analytics' && <PerformanceDashboard />}
        {activeTab === 'leads' && <LeadScoringTab />}
        {activeTab === 'content' && <ContentPerformanceTab />}
      </main>
    </div>
  );
}

function OverviewTab() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <QuickStatCard
          title="Today's Visitors"
          value="347"
          change={12.5}
          icon="👥"
        />
        <QuickStatCard
          title="Newsletter Signups"
          value="23"
          change={-8.2}
          icon="📧"
        />
        <QuickStatCard
          title="Contact Forms"
          value="8"
          change={25.0}
          icon="📝"
        />
        <QuickStatCard
          title="Blog Reads"
          value="156"
          change={15.3}
          icon="📖"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-xl font-bold mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {[
              { action: 'New contact form submission', user: 'john@example.com', time: '2 minutes ago' },
              { action: 'Newsletter signup', user: 'sarah@company.com', time: '15 minutes ago' },
              { action: 'Blog post read', user: 'Anonymous', time: '23 minutes ago' },
              { action: 'A/B test conversion', user: 'mike@startup.io', time: '1 hour ago' },
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b border-zinc-100 dark:border-zinc-700 last:border-b-0">
                <div>
                  <div className="font-medium text-sm">{activity.action}</div>
                  <div className="text-xs text-zinc-500 dark:text-zinc-400">{activity.user}</div>
                </div>
                <div className="text-xs text-zinc-400">{activity.time}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-6">
          <PopularPosts maxPosts={5} />
        </div>
      </div>
    </div>
  );
}

function LeadScoringTab() {
  const { leadScore } = useLeadScoring();

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <h3 className="text-xl font-bold mb-4">Your Lead Score</h3>
        {leadScore ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-500">{leadScore.totalScore}</div>
              <div className="text-sm text-zinc-500 dark:text-zinc-400">Total Score</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-500">{leadScore.conversionProbability.toFixed(1)}%</div>
              <div className="text-sm text-zinc-500 dark:text-zinc-400">Conversion Probability</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-blue-500 capitalize">{leadScore.stage}</div>
              <div className="text-sm text-zinc-500 dark:text-zinc-400">Lead Stage</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-purple-500">{leadScore.events.length}</div>
              <div className="text-sm text-zinc-500 dark:text-zinc-400">Total Events</div>
            </div>
          </div>
        ) : (
          <div className="text-center text-zinc-500 dark:text-zinc-400">
            No lead scoring data available yet. Interact with the site to generate data.
          </div>
        )}
      </div>

      <div className="card p-6">
        <h3 className="text-xl font-bold mb-4">Lead Scoring Guide</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-3">Event Scoring</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Page View</span>
                <span className="font-medium">+1 point</span>
              </div>
              <div className="flex justify-between">
                <span>Blog Read</span>
                <span className="font-medium">+3 points</span>
              </div>
              <div className="flex justify-between">
                <span>Newsletter Signup</span>
                <span className="font-medium">+15 points</span>
              </div>
              <div className="flex justify-between">
                <span>Contact Form</span>
                <span className="font-medium">+25 points</span>
              </div>
              <div className="flex justify-between">
                <span>Demo Request</span>
                <span className="font-medium">+40 points</span>
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-medium mb-3">Lead Stages</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Cold (0-49 points)</span>
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              </div>
              <div className="flex justify-between">
                <span>Warm (50-99 points)</span>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              </div>
              <div className="flex justify-between">
                <span>Hot (100-149 points)</span>
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              </div>
              <div className="flex justify-between">
                <span>Qualified (150+ points)</span>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ContentPerformanceTab() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6">
          <h3 className="text-lg font-bold mb-4">Top Performing Posts</h3>
          <div className="space-y-3">
            {[
              { title: 'The Future of SEO', views: 1234, engagement: '8.5%' },
              { title: 'Digital Marketing Strategy', views: 987, engagement: '6.2%' },
              { title: 'Content Marketing Guide', views: 756, engagement: '7.8%' },
            ].map((post, index) => (
              <div key={index} className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-sm line-clamp-1">{post.title}</div>
                  <div className="text-xs text-zinc-500 dark:text-zinc-400">{post.views} views</div>
                </div>
                <div className="text-sm font-medium text-green-600">{post.engagement}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-bold mb-4">Content Categories</h3>
          <div className="space-y-3">
            {[
              { category: 'SEO', posts: 5, avgViews: 890 },
              { category: 'Content Marketing', posts: 3, avgViews: 654 },
              { category: 'Social Media', posts: 2, avgViews: 432 },
            ].map((cat, index) => (
              <div key={index} className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-sm">{cat.category}</div>
                  <div className="text-xs text-zinc-500 dark:text-zinc-400">{cat.posts} posts</div>
                </div>
                <div className="text-sm font-medium">{cat.avgViews} avg views</div>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-bold mb-4">Content Goals</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Monthly Blog Posts</span>
                <span>8/12</span>
              </div>
              <div className="w-full bg-zinc-200 dark:bg-zinc-700 rounded-full h-2">
                <div className="bg-primary-500 h-2 rounded-full" style={{ width: '67%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Newsletter Growth</span>
                <span>245/300</span>
              </div>
              <div className="w-full bg-zinc-200 dark:bg-zinc-700 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '82%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function QuickStatCard({ 
  title, 
  value, 
  change, 
  icon 
}: { 
  title: string; 
  value: string; 
  change: number; 
  icon: string; 
}) {
  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="text-2xl">{icon}</div>
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
