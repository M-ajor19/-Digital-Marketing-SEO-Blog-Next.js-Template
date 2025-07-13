'use client';

import { useEffect, useState } from 'react';
import EnhancedCTA from './enhanced-cta';
import { useLeadScoring } from '@/lib/lead-scoring';

interface CTAPlacement {
  id: string;
  type: 'newsletter' | 'webinar' | 'download' | 'consultation' | 'trial';
  placement: 'inline' | 'sidebar' | 'modal' | 'footer' | 'header';
  context: string;
  conditions?: {
    minTimeOnPage?: number;
    scrollPercentage?: number;
    pageViews?: number;
    leadScore?: number;
    previousConversions?: string[];
  };
  priority: number;
}

interface SmartCTAManagerProps {
  pageType: 'blog' | 'home' | 'about' | 'contact' | 'landing';
  postCategory?: string;
  postTags?: string[];
}

const ctaPlacements: CTAPlacement[] = [
  // Blog page CTAs
  {
    id: 'blog-newsletter-inline',
    type: 'newsletter',
    placement: 'inline',
    context: 'blog-middle',
    conditions: { scrollPercentage: 50 },
    priority: 3
  },
  {
    id: 'blog-download-sidebar',
    type: 'download',
    placement: 'sidebar',
    context: 'blog-sidebar',
    conditions: { minTimeOnPage: 60 },
    priority: 2
  },
  {
    id: 'blog-webinar-exit',
    type: 'webinar',
    placement: 'modal',
    context: 'exit-intent',
    conditions: { scrollPercentage: 80, minTimeOnPage: 120 },
    priority: 1
  },
  
  // Home page CTAs
  {
    id: 'home-trial-hero',
    type: 'trial',
    placement: 'header',
    context: 'hero-section',
    priority: 1
  },
  {
    id: 'home-consultation-footer',
    type: 'consultation',
    placement: 'footer',
    context: 'page-bottom',
    priority: 2
  },
  
  // High-intent CTAs for engaged users
  {
    id: 'engaged-consultation',
    type: 'consultation',
    placement: 'modal',
    context: 'high-engagement',
    conditions: { pageViews: 3, leadScore: 50 },
    priority: 1
  }
];

export default function SmartCTAManager({ pageType, postCategory, postTags }: SmartCTAManagerProps) {
  const [timeOnPage, setTimeOnPage] = useState(0);
  const [scrollPercentage, setScrollPercentage] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [activeCTAs, setActiveCTAs] = useState<CTAPlacement[]>([]);
  const { leadScore } = useLeadScoring();

  // Track time on page
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeOnPage(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Track scroll percentage
  useEffect(() => {
    const handleScroll = () => {
      const winHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;
      const scrollTop = window.pageYOffset;
      const trackLength = docHeight - winHeight;
      const percentage = Math.floor((scrollTop / trackLength) * 100);
      setScrollPercentage(Math.min(percentage, 100));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Determine which CTAs to show
  useEffect(() => {
    const currentScore = leadScore?.totalScore || 0;
    const pageViews = leadScore?.events?.filter((e: any) => e.type === 'page_view').length || 0;

    const eligibleCTAs = ctaPlacements.filter(cta => {
      // Check page type relevance
      if (pageType === 'blog' && !cta.id.includes('blog') && !cta.id.includes('engaged')) {
        return false;
      }
      if (pageType === 'home' && !cta.id.includes('home') && !cta.id.includes('engaged')) {
        return false;
      }

      // Check conditions
      if (cta.conditions) {
        if (cta.conditions.minTimeOnPage && timeOnPage < cta.conditions.minTimeOnPage) {
          return false;
        }
        if (cta.conditions.scrollPercentage && scrollPercentage < cta.conditions.scrollPercentage) {
          return false;
        }
        if (cta.conditions.pageViews && pageViews < cta.conditions.pageViews) {
          return false;
        }
        if (cta.conditions.leadScore && currentScore < cta.conditions.leadScore) {
          return false;
        }
      }

      return true;
    });

    // Sort by priority and update active CTAs
    const sortedCTAs = eligibleCTAs.sort((a, b) => a.priority - b.priority);
    setActiveCTAs(sortedCTAs);

    // Show modal CTAs when conditions are met
    const modalCTA = sortedCTAs.find(cta => cta.placement === 'modal');
    if (modalCTA && !showModal) {
      setShowModal(true);
    }
  }, [timeOnPage, scrollPercentage, pageType, showModal, leadScore]);

  // Exit intent detection
  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !showModal) {
        const exitCTA = activeCTAs.find(cta => cta.context === 'exit-intent');
        if (exitCTA) {
          setShowModal(true);
        }
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, [activeCTAs, showModal]);

  const getContextualCTAs = (placement: string) => {
    return activeCTAs.filter(cta => cta.placement === placement);
  };

  return (
    <>
      {/* Header CTAs */}
      {getContextualCTAs('header').map(cta => (
        <div key={cta.id} className="mb-4">
          <EnhancedCTA
            type={cta.type}
            placement={cta.placement}
            context={cta.context}
          />
        </div>
      ))}

      {/* Inline CTAs (rendered by parent components) */}
      {getContextualCTAs('inline').length > 0 && (
        <div id="inline-cta-container" className="my-8">
          {getContextualCTAs('inline').map(cta => (
            <EnhancedCTA
              key={cta.id}
              type={cta.type}
              placement={cta.placement}
              context={cta.context}
            />
          ))}
        </div>
      )}

      {/* Sidebar CTAs */}
      {getContextualCTAs('sidebar').length > 0 && (
        <div className="hidden lg:block lg:w-80 lg:ml-8">
          <div className="space-y-6">
            {getContextualCTAs('sidebar').map(cta => (
              <EnhancedCTA
                key={cta.id}
                type={cta.type}
                placement={cta.placement}
                context={cta.context}
              />
            ))}
          </div>
        </div>
      )}

      {/* Footer CTAs */}
      {getContextualCTAs('footer').map(cta => (
        <div key={cta.id} className="mt-8">
          <EnhancedCTA
            type={cta.type}
            placement={cta.placement}
            context={cta.context}
          />
        </div>
      ))}

      {/* Modal CTAs */}
      {showModal && getContextualCTAs('modal').length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            {getContextualCTAs('modal')[0] && (
              <EnhancedCTA
                type={getContextualCTAs('modal')[0].type}
                placement={getContextualCTAs('modal')[0].placement}
                context={getContextualCTAs('modal')[0].context}
              />
            )}
          </div>
        </div>
      )}

      {/* Debug info (only in development) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 left-4 bg-black bg-opacity-75 text-white p-2 rounded text-xs">
          <div>Time: {timeOnPage}s</div>
          <div>Scroll: {scrollPercentage}%</div>
          <div>Active CTAs: {activeCTAs.length}</div>
        </div>
      )}
    </>
  );
}
