// A/B Testing utilities for conversion optimization

export interface ABTest {
  id: string;
  name: string;
  variants: ABVariant[];
  trafficSplit: number[]; // e.g., [50, 50] for 50/50 split
  status: 'draft' | 'running' | 'paused' | 'completed';
  startDate: Date;
  endDate?: Date;
  conversionGoal: string;
}

export interface ABVariant {
  id: string;
  name: string;
  description: string;
  config: Record<string, any>;
  impressions: number;
  conversions: number;
  conversionRate: number;
}

export interface ABTestResult {
  testId: string;
  variantId: string;
  confidence: number;
  isSignificant: boolean;
  winningVariant?: string;
}

// Local storage keys
const AB_TEST_STORAGE_KEY = 'ab_test_assignments';
const AB_TEST_EVENTS_KEY = 'ab_test_events';

// Get user's assigned variant for a test
export function getTestVariant(testId: string): string | null {
  if (typeof window === 'undefined') return null;
  
  const assignments = JSON.parse(localStorage.getItem(AB_TEST_STORAGE_KEY) || '{}');
  
  if (assignments[testId]) {
    return assignments[testId];
  }
  
  // Assign user to a variant
  const variant = assignUserToVariant(testId);
  assignments[testId] = variant;
  localStorage.setItem(AB_TEST_STORAGE_KEY, JSON.stringify(assignments));
  
  // Track impression
  trackABTestEvent(testId, variant, 'impression');
  
  return variant;
}

// Assign user to a variant based on traffic split
function assignUserToVariant(testId: string): string {
  const tests = getABTests();
  const test = tests.find(t => t.id === testId);
  
  if (!test || test.status !== 'running') {
    return 'control'; // Default to control if test not found or not running
  }
  
  const random = Math.random() * 100;
  let cumulative = 0;
  
  for (let i = 0; i < test.variants.length; i++) {
    cumulative += test.trafficSplit[i];
    if (random <= cumulative) {
      return test.variants[i].id;
    }
  }
  
  return test.variants[0].id; // Fallback to first variant
}

// Track A/B test events
export function trackABTestEvent(testId: string, variantId: string, eventType: 'impression' | 'conversion', value?: number) {
  if (typeof window === 'undefined') return;
  
  const events = JSON.parse(localStorage.getItem(AB_TEST_EVENTS_KEY) || '[]');
  
  const event = {
    testId,
    variantId,
    eventType,
    value: value || 1,
    timestamp: new Date().toISOString(),
    userId: getUserId(),
  };
  
  events.push(event);
  localStorage.setItem(AB_TEST_EVENTS_KEY, JSON.stringify(events));
  
  // Send to analytics
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'ab_test_' + eventType, {
      event_category: 'A/B Testing',
      event_label: `${testId}_${variantId}`,
      value: value || 1,
    });
  }
}

// Get or generate user ID
function getUserId(): string {
  if (typeof window === 'undefined') return 'anonymous';
  
  let userId = localStorage.getItem('user_id');
  if (!userId) {
    userId = 'user_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('user_id', userId);
  }
  return userId;
}

// Calculate statistical significance
export function calculateSignificance(variantA: ABVariant, variantB: ABVariant): ABTestResult {
  const { impressions: nA, conversions: cA } = variantA;
  const { impressions: nB, conversions: cB } = variantB;
  
  if (nA < 100 || nB < 100) {
    return {
      testId: '',
      variantId: '',
      confidence: 0,
      isSignificant: false,
    };
  }
  
  const pA = cA / nA;
  const pB = cB / nB;
  const pooled = (cA + cB) / (nA + nB);
  
  const standardError = Math.sqrt(pooled * (1 - pooled) * (1/nA + 1/nB));
  const zScore = Math.abs(pA - pB) / standardError;
  
  // Convert z-score to confidence level
  const confidence = (1 - 2 * (1 - normalCDF(Math.abs(zScore)))) * 100;
  const isSignificant = confidence >= 95;
  
  return {
    testId: '',
    variantId: pB > pA ? variantB.id : variantA.id,
    confidence,
    isSignificant,
    winningVariant: pB > pA ? variantB.id : variantA.id,
  };
}

// Normal distribution CDF approximation
function normalCDF(x: number): number {
  return 0.5 * (1 + erf(x / Math.sqrt(2)));
}

function erf(x: number): number {
  // Approximation of error function
  const a1 =  0.254829592;
  const a2 = -0.284496736;
  const a3 =  1.421413741;
  const a4 = -1.453152027;
  const a5 =  1.061405429;
  const p  =  0.3275911;

  const sign = x >= 0 ? 1 : -1;
  x = Math.abs(x);

  const t = 1.0 / (1.0 + p * x);
  const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

  return sign * y;
}

// Sample A/B tests configuration
export function getABTests(): ABTest[] {
  return [
    {
      id: 'cta_button_test',
      name: 'CTA Button Color Test',
      variants: [
        {
          id: 'control',
          name: 'Blue Button',
          description: 'Original blue CTA button',
          config: { color: 'primary', text: 'Get Free Consultation' },
          impressions: 0,
          conversions: 0,
          conversionRate: 0,
        },
        {
          id: 'variant_a',
          name: 'Green Button',
          description: 'Green CTA button variant',
          config: { color: 'secondary', text: 'Get Free Consultation' },
          impressions: 0,
          conversions: 0,
          conversionRate: 0,
        },
      ],
      trafficSplit: [50, 50],
      status: 'running',
      startDate: new Date(),
      conversionGoal: 'contact_form_submit',
    },
    {
      id: 'headline_test',
      name: 'Homepage Headline Test',
      variants: [
        {
          id: 'control',
          name: 'Original Headline',
          description: 'Boost Your Online Presence',
          config: { 
            headline: 'Boost Your Online Presence',
            subheadline: 'Insights, Strategies, and Tools for Digital Marketing & SEO Success.'
          },
          impressions: 0,
          conversions: 0,
          conversionRate: 0,
        },
        {
          id: 'variant_a',
          name: 'Results-Focused Headline',
          description: 'Get More Leads & Sales Online',
          config: { 
            headline: 'Get More Leads & Sales Online',
            subheadline: 'Proven Digital Marketing Strategies That Drive Real Results for Your Business.'
          },
          impressions: 0,
          conversions: 0,
          conversionRate: 0,
        },
      ],
      trafficSplit: [50, 50],
      status: 'running',
      startDate: new Date(),
      conversionGoal: 'newsletter_signup',
    },
  ];
}

// React hook for A/B testing
export function useABTest(testId: string) {
  const [variant, setVariant] = useState<string | null>(null);
  const [config, setConfig] = useState<Record<string, any>>({});
  
  useEffect(() => {
    const assignedVariant = getTestVariant(testId);
    setVariant(assignedVariant);
    
    const tests = getABTests();
    const test = tests.find(t => t.id === testId);
    const variantConfig = test?.variants.find(v => v.id === assignedVariant)?.config || {};
    setConfig(variantConfig);
  }, [testId]);
  
  const trackConversion = useCallback((value?: number) => {
    if (variant) {
      trackABTestEvent(testId, variant, 'conversion', value);
    }
  }, [testId, variant]);
  
  return { variant, config, trackConversion };
}

// Import useState, useEffect, useCallback at the top
import { useState, useEffect, useCallback } from 'react';
