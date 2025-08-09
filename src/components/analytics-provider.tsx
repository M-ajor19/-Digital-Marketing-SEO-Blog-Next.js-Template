'use client';

import { useEffect, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useLeadScoring } from '@/lib/lead-scoring';

declare global {
  interface Window {
    fbq: (...args: any[]) => void;
    dataLayer: any[];
  }
}

interface AnalyticsConfig {
  googleAnalyticsId?: string;
  facebookPixelId?: string;
  linkedInPartnerId?: string;
  hotjarId?: string;
  enableDebug?: boolean;
}

interface AnalyticsEvent {
  name: string;
  parameters?: Record<string, any>;
  value?: number;
  currency?: string;
}

const defaultConfig: AnalyticsConfig = {
  googleAnalyticsId: process.env.NEXT_PUBLIC_GA_ID,
  facebookPixelId: process.env.NEXT_PUBLIC_FB_PIXEL_ID,
  linkedInPartnerId: process.env.NEXT_PUBLIC_LINKEDIN_PARTNER_ID,
  hotjarId: process.env.NEXT_PUBLIC_HOTJAR_ID,
  enableDebug: process.env.NODE_ENV === 'development'
};

export default function AnalyticsProvider({ 
  config = defaultConfig,
  children 
}: { 
  config?: AnalyticsConfig;
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<div>{children}</div>}>
      <AnalyticsProviderInner config={config}>
        {children}
      </AnalyticsProviderInner>
    </Suspense>
  );
}

function AnalyticsProviderInner({ 
  config = defaultConfig,
  children 
}: { 
  config?: AnalyticsConfig;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { leadScore } = useLeadScoring();

  useEffect(() => {
    // Initialize Google Analytics 4
    if (config.googleAnalyticsId) {
      const script = document.createElement('script');
      script.src = `https://www.googletagmanager.com/gtag/js?id=${config.googleAnalyticsId}`;
      script.async = true;
      document.head.appendChild(script);

      script.onload = () => {
        window.dataLayer = window.dataLayer || [];
        window.gtag = function gtag() {
          window.dataLayer.push(arguments);
        };

        (window as any).gtag('js', new Date());
        if (config.googleAnalyticsId) {
          (window as any).gtag('config', config.googleAnalyticsId, {
            page_title: document.title,
            page_location: window.location.href,
            debug_mode: config.enableDebug
          });

          // Enhanced ecommerce tracking
          (window as any).gtag('config', config.googleAnalyticsId, {
            custom_map: {
              custom_parameter_1: 'lead_score',
              custom_parameter_2: 'user_type'
            }
          });
        }
      };
    }

    // Initialize Facebook Pixel
    if (config.facebookPixelId) {
      const fbScript = document.createElement('script');
      fbScript.innerHTML = `
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window,document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        
        fbq('init', '${config.facebookPixelId}');
        fbq('track', 'PageView');
      `;
      document.head.appendChild(fbScript);
    }

    // Initialize LinkedIn Insight Tag
    if (config.linkedInPartnerId) {
      const linkedInScript = document.createElement('script');
      linkedInScript.innerHTML = `
        _linkedin_partner_id = "${config.linkedInPartnerId}";
        window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
        window._linkedin_data_partner_ids.push(_linkedin_partner_id);
      `;
      document.head.appendChild(linkedInScript);

      const linkedInScript2 = document.createElement('script');
      linkedInScript2.src = 'https://snap.licdn.com/li.lms-analytics/insight.min.js';
      linkedInScript2.async = true;
      document.body.appendChild(linkedInScript2);
    }

    // Initialize Hotjar
    if (config.hotjarId) {
      const hotjarScript = document.createElement('script');
      hotjarScript.innerHTML = `
        (function(h,o,t,j,a,r){
          h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
          h._hjSettings={hjid:${config.hotjarId},hjsv:6};
          a=o.getElementsByTagName('head')[0];
          r=o.createElement('script');r.async=1;
          r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
          a.appendChild(r);
        })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
      `;
      document.head.appendChild(hotjarScript);
    }

    return () => {
      // Cleanup scripts on unmount
      const scripts = document.querySelectorAll('script[src*="googletagmanager"], script[src*="fbevents"], script[src*="licdn"], script[src*="hotjar"]');
      scripts.forEach(script => script.remove());
    };
  }, [config]);

  // Track page views
  useEffect(() => {
    const url = pathname + (searchParams ? searchParams.toString() : '');
    
    // Google Analytics page view
    if ((window as any).gtag && config.googleAnalyticsId) {
      const currentScore = leadScore?.totalScore || 0;
      
      (window as any).gtag('config', config.googleAnalyticsId, {
        page_path: url,
        custom_parameter_1: currentScore,
        custom_parameter_2: currentScore > 50 ? 'qualified' : 'visitor'
      });
    }

    // Facebook Pixel page view
    if (window.fbq && config.facebookPixelId) {
      window.fbq('track', 'PageView');
    }

    // Debug logging
    if (config.enableDebug) {
      console.log('Analytics: Page view tracked', { url, pathname });
    }
  }, [pathname, searchParams, config, leadScore]);

  return <>{children}</>;
}

// Analytics event tracking hook
export function useAnalytics(config: AnalyticsConfig = defaultConfig) {
  const { trackEvent: trackLeadEvent } = useLeadScoring();

  const trackEvent = (event: AnalyticsEvent) => {
    // Google Analytics 4 event
    if ((window as any).gtag && config.googleAnalyticsId) {
      (window as any).gtag('event', event.name, {
        ...event.parameters,
        value: event.value,
        currency: event.currency || 'USD'
      });
    }

    // Facebook Pixel event
    if (window.fbq && config.facebookPixelId) {
      const fbEventName = mapToFacebookEvent(event.name);
      if (fbEventName) {
        window.fbq('track', fbEventName, {
          ...event.parameters,
          value: event.value,
          currency: event.currency || 'USD'
        });
      }
    }

    // Custom lead scoring event
    trackLeadEvent(event.name as any, event.parameters);

    // Debug logging
    if (config.enableDebug) {
      console.log('Analytics: Event tracked', event);
    }
  };

  const trackConversion = (conversionType: string, value?: number, transactionId?: string) => {
    const event: AnalyticsEvent = {
      name: 'conversion',
      parameters: {
        conversion_type: conversionType,
        transaction_id: transactionId,
        timestamp: Date.now()
      },
      value
    };

    trackEvent(event);

    // Enhanced conversion tracking for Google Ads
    if ((window as any).gtag && config.googleAnalyticsId) {
      (window as any).gtag('event', 'conversion', {
        send_to: config.googleAnalyticsId,
        value: value,
        currency: 'USD',
        transaction_id: transactionId
      });
    }
  };

  const trackUserEngagement = (engagementType: string, details: Record<string, any>) => {
    const event: AnalyticsEvent = {
      name: 'user_engagement',
      parameters: {
        engagement_type: engagementType,
        ...details
      }
    };

    trackEvent(event);
  };

  const identifyUser = (userId: string, traits: Record<string, any>) => {
    // Google Analytics user identification
    if ((window as any).gtag && config.googleAnalyticsId) {
      (window as any).gtag('config', config.googleAnalyticsId, {
        user_id: userId,
        custom_map: traits
      });
    }

    // Facebook Pixel user identification
    if (window.fbq && config.facebookPixelId) {
      window.fbq('track', 'Lead', traits);
    }

    if (config.enableDebug) {
      console.log('Analytics: User identified', { userId, traits });
    }
  };

  return {
    trackEvent,
    trackConversion,
    trackUserEngagement,
    identifyUser
  };
}

// Map custom events to Facebook Pixel standard events
function mapToFacebookEvent(eventName: string): string | null {
  const mapping: Record<string, string> = {
    'newsletter_signup': 'Lead',
    'blog_read': 'ViewContent',
    'download': 'Lead',
    'webinar_registration': 'CompleteRegistration',
    'consultation_booking': 'Schedule',
    'trial_signup': 'StartTrial',
    'purchase': 'Purchase',
    'add_to_cart': 'AddToCart',
    'search': 'Search',
    'cta_conversion': 'Lead'
  };

  return mapping[eventName] || null;
}
