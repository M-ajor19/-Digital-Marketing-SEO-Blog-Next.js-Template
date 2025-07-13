'use client';

import { useState } from 'react';
import { useLeadScoring } from '@/lib/lead-scoring';
import { useABTest } from '@/lib/ab-testing';

interface CTAVariant {
  id: string;
  title: string;
  description: string;
  buttonText: string;
  style: 'primary' | 'secondary' | 'success' | 'warning';
  size: 'sm' | 'md' | 'lg';
}

interface EnhancedCTAProps {
  type: 'newsletter' | 'webinar' | 'download' | 'consultation' | 'trial';
  placement: 'inline' | 'sidebar' | 'modal' | 'footer' | 'header';
  context?: string;
  customTitle?: string;
  customDescription?: string;
  customButtonText?: string;
}

const ctaVariants: Record<string, CTAVariant[]> = {
  newsletter: [
    {
      id: 'newsletter-primary',
      title: 'Stay Ahead of the Competition',
      description: 'Get weekly marketing insights and SEO tips delivered straight to your inbox.',
      buttonText: 'Subscribe Now',
      style: 'primary',
      size: 'md'
    },
    {
      id: 'newsletter-success',
      title: 'Join 10,000+ Marketers',
      description: 'Discover proven strategies that drive real results for businesses like yours.',
      buttonText: 'Get Free Updates',
      style: 'success',
      size: 'lg'
    }
  ],
  webinar: [
    {
      id: 'webinar-primary',
      title: 'Free SEO Masterclass',
      description: 'Learn the exact strategies we use to rank #1 on Google in 90 days.',
      buttonText: 'Reserve Your Spot',
      style: 'primary',
      size: 'lg'
    },
    {
      id: 'webinar-warning',
      title: 'Limited Seats Available',
      description: 'Join our live training session and transform your digital marketing approach.',
      buttonText: 'Register Today',
      style: 'warning',
      size: 'md'
    }
  ],
  download: [
    {
      id: 'download-secondary',
      title: 'Free SEO Checklist',
      description: 'Download our comprehensive 50-point SEO audit checklist used by professionals.',
      buttonText: 'Download Free',
      style: 'secondary',
      size: 'md'
    },
    {
      id: 'download-success',
      title: 'Ultimate Marketing Toolkit',
      description: 'Get access to templates, checklists, and guides worth $500 - completely free.',
      buttonText: 'Get Instant Access',
      style: 'success',
      size: 'lg'
    }
  ],
  consultation: [
    {
      id: 'consultation-primary',
      title: 'Free Strategy Session',
      description: 'Get a personalized marketing plan tailored to your business goals.',
      buttonText: 'Book Free Call',
      style: 'primary',
      size: 'lg'
    },
    {
      id: 'consultation-secondary',
      title: 'Need Expert Advice?',
      description: 'Schedule a 30-minute consultation with our marketing specialists.',
      buttonText: 'Schedule Call',
      style: 'secondary',
      size: 'md'
    }
  ],
  trial: [
    {
      id: 'trial-success',
      title: 'Try Our Platform Free',
      description: 'Start your 14-day free trial and see results in your first week.',
      buttonText: 'Start Free Trial',
      style: 'success',
      size: 'lg'
    },
    {
      id: 'trial-primary',
      title: 'Ready to Scale?',
      description: 'Join thousands of businesses growing with our marketing platform.',
      buttonText: 'Get Started',
      style: 'primary',
      size: 'md'
    }
  ]
};

export default function EnhancedCTA({ 
  type, 
  placement, 
  context,
  customTitle,
  customDescription,
  customButtonText 
}: EnhancedCTAProps) {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { trackEvent } = useLeadScoring();
  
  // A/B test for CTA variants
  const testId = `cta-${type}-${placement}`;
  const { variant: variantId } = useABTest(testId);
  
  // Get the variant config from our predefined variants
  const variants = ctaVariants[type] || [];
  const variant = variants.find(v => v.id === variantId) || variants[0];
  
  if (!variant) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || isLoading) return;

    setIsLoading(true);
    
    try {
      // Track CTA conversion
      trackEvent('cta_conversion', {
        ctaType: type,
        ctaPlacement: placement,
        ctaVariant: variant.id,
        context: context || 'unknown',
        email: email
      });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsSubmitted(true);
    } catch (error) {
      console.error('CTA submission failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getContainerClasses = () => {
    const baseClasses = 'rounded-lg border';
    
    switch (placement) {
      case 'inline':
        return `${baseClasses} p-8 my-8`;
      case 'sidebar':
        return `${baseClasses} p-6 sticky top-4`;
      case 'modal':
        return `${baseClasses} p-8 max-w-md mx-auto`;
      case 'footer':
        return `${baseClasses} p-6`;
      case 'header':
        return `${baseClasses} p-4`;
      default:
        return `${baseClasses} p-6`;
    }
  };

  const getButtonClasses = () => {
    const sizeClasses = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-3 text-base',
      lg: 'px-8 py-4 text-lg'
    };

    const styleClasses = {
      primary: 'bg-blue-600 hover:bg-blue-700 text-white',
      secondary: 'bg-gray-600 hover:bg-gray-700 text-white',
      success: 'bg-green-600 hover:bg-green-700 text-white',
      warning: 'bg-orange-600 hover:bg-orange-700 text-white'
    };

    return `font-semibold rounded-lg transition-colors ${sizeClasses[variant.size]} ${styleClasses[variant.style]}`;
  };

  if (isSubmitted) {
    return (
      <div className={`${getContainerClasses()} bg-green-50 border-green-200 text-center`}>
        <div className="text-green-600 mb-4">
          <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-green-800 mb-2">Success!</h3>
        <p className="text-green-700">
          {type === 'newsletter' && "You've been subscribed to our newsletter."}
          {type === 'webinar' && "Your webinar seat has been reserved."}
          {type === 'download' && "Check your email for the download link."}
          {type === 'consultation' && "We'll contact you soon to schedule your call."}
          {type === 'trial' && "Your free trial is ready! Check your email."}
        </p>
      </div>
    );
  }

  return (
    <div className={`${getContainerClasses()} bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200`}>
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          {customTitle || variant.title}
        </h3>
        <p className="text-gray-600 mb-6">
          {customDescription || variant.description}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              type="submit"
              disabled={isLoading}
              className={`${getButtonClasses()} disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap`}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Loading...
                </div>
              ) : (
                customButtonText || variant.buttonText
              )}
            </button>
          </div>
        </form>

        <p className="text-xs text-gray-500 mt-3">
          No spam, ever. Unsubscribe at any time.
        </p>
      </div>

      {/* Trust indicators based on CTA type */}
      {type === 'newsletter' && (
        <div className="mt-6 flex items-center justify-center space-x-6 text-sm text-gray-500">
          <span>10,000+ subscribers</span>
          <span>Weekly insights</span>
          <span>Free forever</span>
        </div>
      )}

      {type === 'webinar' && (
        <div className="mt-6 flex items-center justify-center space-x-4 text-sm text-gray-500">
          <span>🕒 60 minutes</span>
          <span>📈 Live Q&A</span>
          <span>💼 Actionable tips</span>
        </div>
      )}

      {type === 'download' && (
        <div className="mt-6 flex items-center justify-center space-x-4 text-sm text-gray-500">
          <span>📄 PDF format</span>
          <span>⚡ Instant download</span>
          <span>🎯 Proven strategies</span>
        </div>
      )}
    </div>
  );
}
