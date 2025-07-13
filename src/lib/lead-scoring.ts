// Lead scoring system for tracking user engagement and conversion potential

export interface LeadScore {
  userId: string;
  email?: string;
  totalScore: number;
  lastUpdated: Date;
  events: LeadEvent[];
  demographicScore: number;
  behaviorScore: number;
  engagementScore: number;
  conversionProbability: number;
  stage: LeadStage;
}

export interface LeadEvent {
  id: string;
  type: LeadEventType;
  timestamp: Date;
  score: number;
  metadata?: Record<string, any>;
}

export type LeadEventType =
  | 'page_view'
  | 'blog_read'
  | 'newsletter_signup'
  | 'contact_form_submit'
  | 'download'
  | 'email_open'
  | 'email_click'
  | 'social_share'
  | 'return_visit'
  | 'pricing_page_view'
  | 'case_study_view'
  | 'video_watch'
  | 'webinar_signup'
  | 'demo_request'
  | 'cta_conversion'
  | 'performance_metric'
  | 'page_performance';

export type LeadStage = 'cold' | 'warm' | 'hot' | 'qualified' | 'customer';

// Scoring rules for different events
const SCORING_RULES: Record<LeadEventType, number> = {
  page_view: 1,
  blog_read: 3,
  newsletter_signup: 15,
  contact_form_submit: 25,
  download: 10,
  email_open: 2,
  email_click: 5,
  social_share: 8,
  return_visit: 5,
  pricing_page_view: 20,
  case_study_view: 12,
  video_watch: 8,
  webinar_signup: 30,
  demo_request: 40,
  cta_conversion: 20,
  performance_metric: 0,
  page_performance: 0,
};

// Storage key for lead data
const LEAD_SCORE_STORAGE_KEY = 'lead_score_data';

// Get current user's lead score
export function getCurrentLeadScore(): LeadScore | null {
  if (typeof window === 'undefined') return null;
  
  const userId = getUserId();
  const leadData = JSON.parse(localStorage.getItem(LEAD_SCORE_STORAGE_KEY) || '{}');
  
  return leadData[userId] || null;
}

// Track a lead event and update score
export function trackLeadEvent(
  eventType: LeadEventType,
  metadata?: Record<string, any>
): void {
  if (typeof window === 'undefined') return;
  
  const userId = getUserId();
  const leadData = JSON.parse(localStorage.getItem(LEAD_SCORE_STORAGE_KEY) || '{}');
  
  let leadScore: LeadScore = leadData[userId] || {
    userId,
    totalScore: 0,
    lastUpdated: new Date(),
    events: [],
    demographicScore: 0,
    behaviorScore: 0,
    engagementScore: 0,
    conversionProbability: 0,
    stage: 'cold',
  };
  
  // Create new event
  const event: LeadEvent = {
    id: generateEventId(),
    type: eventType,
    timestamp: new Date(),
    score: SCORING_RULES[eventType] || 0,
    metadata,
  };
  
  // Add event and update scores
  leadScore.events.push(event);
  leadScore = calculateScores(leadScore);
  leadScore.lastUpdated = new Date();
  
  // Save updated lead score
  leadData[userId] = leadScore;
  localStorage.setItem(LEAD_SCORE_STORAGE_KEY, JSON.stringify(leadData));
  
  // Send to analytics
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'lead_scoring', {
      event_category: 'Lead Scoring',
      event_label: eventType,
      value: event.score,
      custom_parameters: {
        total_score: leadScore.totalScore,
        lead_stage: leadScore.stage,
        conversion_probability: leadScore.conversionProbability,
      },
    });
  }
}

// Calculate comprehensive lead scores
function calculateScores(leadScore: LeadScore): LeadScore {
  const recentEvents = leadScore.events.filter(
    event => new Date(event.timestamp) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
  );
  
  // Behavior Score (based on actions taken)
  leadScore.behaviorScore = recentEvents.reduce((sum, event) => sum + event.score, 0);
  
  // Engagement Score (based on frequency and recency)
  const uniqueDays = new Set(
    recentEvents.map(event => new Date(event.timestamp).toDateString())
  ).size;
  
  const engagementMultiplier = Math.min(uniqueDays / 7, 2); // Max 2x multiplier for daily engagement
  leadScore.engagementScore = leadScore.behaviorScore * engagementMultiplier;
  
  // Demographic Score (would be calculated based on form data, company size, etc.)
  leadScore.demographicScore = calculateDemographicScore(leadScore);
  
  // Total Score
  leadScore.totalScore = leadScore.behaviorScore + leadScore.engagementScore + leadScore.demographicScore;
  
  // Conversion Probability (0-100%)
  leadScore.conversionProbability = Math.min(leadScore.totalScore / 200 * 100, 100);
  
  // Lead Stage
  leadScore.stage = determineLeadStage(leadScore.totalScore, leadScore.events);
  
  return leadScore;
}

// Calculate demographic score based on available data
function calculateDemographicScore(leadScore: LeadScore): number {
  let score = 0;
  
  // Check for high-value indicators in form submissions
  const contactEvents = leadScore.events.filter(e => e.type === 'contact_form_submit');
  
  contactEvents.forEach(event => {
    const metadata = event.metadata || {};
    
    // Company size indicators
    if (metadata.company) score += 10;
    if (metadata.phone) score += 5;
    
    // Service interest indicators
    const highValueServices = ['consulting', 'web-design', 'ppc'];
    if (highValueServices.includes(metadata.service)) score += 15;
  });
  
  return score;
}

// Determine lead stage based on score and specific events
function determineLeadStage(totalScore: number, events: LeadEvent[]): LeadStage {
  const hasContactForm = events.some(e => e.type === 'contact_form_submit');
  const hasDemoRequest = events.some(e => e.type === 'demo_request');
  const hasNewsletterSignup = events.some(e => e.type === 'newsletter_signup');
  
  if (hasDemoRequest || totalScore >= 150) return 'qualified';
  if (hasContactForm || totalScore >= 100) return 'hot';
  if (hasNewsletterSignup || totalScore >= 50) return 'warm';
  
  return 'cold';
}

// Get user ID (same as in ab-testing.ts)
function getUserId(): string {
  if (typeof window === 'undefined') return 'anonymous';
  
  let userId = localStorage.getItem('user_id');
  if (!userId) {
    userId = 'user_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('user_id', userId);
  }
  return userId;
}

// Generate unique event ID
function generateEventId(): string {
  return 'event_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
}

// Get lead analytics data
export function getLeadAnalytics(): {
  totalLeads: number;
  byStage: Record<LeadStage, number>;
  avgScore: number;
  topEvents: Array<{ type: LeadEventType; count: number }>;
} {
  if (typeof window === 'undefined') {
    return { totalLeads: 0, byStage: { cold: 0, warm: 0, hot: 0, qualified: 0, customer: 0 }, avgScore: 0, topEvents: [] };
  }
  
  const leadData = JSON.parse(localStorage.getItem(LEAD_SCORE_STORAGE_KEY) || '{}');
  const leads = Object.values(leadData) as LeadScore[];
  
  const byStage: Record<LeadStage, number> = {
    cold: 0,
    warm: 0,
    hot: 0,
    qualified: 0,
    customer: 0,
  };
  
  let totalScore = 0;
  const eventCounts: Record<string, number> = {};
  
  leads.forEach(lead => {
    byStage[lead.stage]++;
    totalScore += lead.totalScore;
    
    lead.events.forEach(event => {
      eventCounts[event.type] = (eventCounts[event.type] || 0) + 1;
    });
  });
  
  const topEvents = Object.entries(eventCounts)
    .map(([type, count]) => ({ type: type as LeadEventType, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
  
  return {
    totalLeads: leads.length,
    byStage,
    avgScore: leads.length > 0 ? totalScore / leads.length : 0,
    topEvents,
  };
}

// React hook for lead scoring
export function useLeadScoring() {
  const [leadScore, setLeadScore] = useState<LeadScore | null>(null);
  
  useEffect(() => {
    const score = getCurrentLeadScore();
    setLeadScore(score);
  }, []);
  
  const trackEvent = useCallback((eventType: LeadEventType, metadata?: Record<string, any>) => {
    trackLeadEvent(eventType, metadata);
    // Refresh lead score
    const updatedScore = getCurrentLeadScore();
    setLeadScore(updatedScore);
  }, []);
  
  return { leadScore, trackEvent };
}

// Export necessary React imports
import { useState, useEffect, useCallback } from 'react';
