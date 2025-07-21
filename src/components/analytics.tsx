'use client'

import { useEffect } from 'react'
import Script from 'next/script'

/**
 * Analytics component for tracking user interactions and performance
 * Includes Google Analytics, Google Tag Manager, and other tracking tools
 */
export function Analytics() {
  useEffect(() => {
    // Track page views for SPA navigation
    const handleRouteChange = () => {
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('config', process.env.NEXT_PUBLIC_GA_ID as string, {
          page_title: document.title,
          page_location: window.location.href,
        })
      }
    }

    // Listen for route changes
    window.addEventListener('popstate', handleRouteChange)
    return () => window.removeEventListener('popstate', handleRouteChange)
  }, [])

  // Only render analytics in production
  if (process.env.NODE_ENV !== 'production') {
    return null
  }

  return (
    <>
      {/* Google Analytics */}
      {process.env.NEXT_PUBLIC_GA_ID && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
                page_title: document.title,
                page_location: window.location.href,
                anonymize_ip: true,
                cookie_flags: 'SameSite=None;Secure',
              });
            `}
          </Script>
        </>
      )}

      {/* Google Tag Manager */}
      {process.env.NEXT_PUBLIC_GTM_ID && (
        <>
          <Script id="google-tag-manager" strategy="afterInteractive">
            {`
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${process.env.NEXT_PUBLIC_GTM_ID}');
            `}
          </Script>
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${process.env.NEXT_PUBLIC_GTM_ID}`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            />
          </noscript>
        </>
      )}

      {/* Microsoft Clarity */}
      {process.env.NEXT_PUBLIC_CLARITY_ID && (
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "${process.env.NEXT_PUBLIC_CLARITY_ID}");
          `}
        </Script>
      )}

      {/* Hotjar */}
      {process.env.NEXT_PUBLIC_HOTJAR_ID && (
        <Script id="hotjar" strategy="afterInteractive">
          {`
            (function(h,o,t,j,a,r){
              h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
              h._hjSettings={hjid:${process.env.NEXT_PUBLIC_HOTJAR_ID},hjsv:6};
              a=o.getElementsByTagName('head')[0];
              r=o.createElement('script');r.async=1;
              r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
              a.appendChild(r);
            })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
          `}
        </Script>
      )}

      {/* Facebook Pixel */}
      {process.env.NEXT_PUBLIC_FB_PIXEL_ID && (
        <Script id="facebook-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${process.env.NEXT_PUBLIC_FB_PIXEL_ID}');
            fbq('track', 'PageView');
          `}
        </Script>
      )}
    </>
  )
}

// Extend the Window interface for TypeScript
declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event' | 'js',
      targetId: string | Date,
      config?: Record<string, any>
    ) => void
    dataLayer: Record<string, any>[]
    fbq: (command: string, eventName: string, parameters?: Record<string, any>) => void
    hj: (command: string, ...args: any[]) => void
    clarity: (command: string, ...args: any[]) => void
  }
}

/**
 * Utility functions for tracking events
 */
export const trackEvent = {
  /**
   * Track a custom event with Google Analytics
   */
  ga: (eventName: string, parameters?: Record<string, any>) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', eventName, parameters)
    }
  },

  /**
   * Track a custom event with Facebook Pixel
   */
  fb: (eventName: string, parameters?: Record<string, any>) => {
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', eventName, parameters)
    }
  },

  /**
   * Track page view
   */
  pageView: (url: string, title?: string) => {
    // Google Analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', process.env.NEXT_PUBLIC_GA_ID as string, {
        page_title: title || document.title,
        page_location: url,
      })
    }

    // Facebook Pixel
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'PageView')
    }
  },

  /**
   * Track form submission
   */
  formSubmit: (formName: string, success: boolean = true) => {
    trackEvent.ga('form_submit', {
      form_name: formName,
      success: success,
    })
    
    if (success) {
      trackEvent.fb('Lead')
    }
  },

  /**
   * Track button click
   */
  buttonClick: (buttonName: string, location?: string) => {
    trackEvent.ga('click', {
      event_category: 'engagement',
      event_label: buttonName,
      page_location: location || window.location.href,
    })
  },

  /**
   * Track scroll depth
   */
  scrollDepth: (percentage: number) => {
    trackEvent.ga('scroll', {
      event_category: 'engagement',
      scroll_depth: percentage,
    })
  },

  /**
   * Track file download
   */
  fileDownload: (fileName: string, fileType: string) => {
    trackEvent.ga('file_download', {
      event_category: 'engagement',
      file_name: fileName,
      file_type: fileType,
    })
  },

  /**
   * Track video interaction
   */
  videoPlay: (videoTitle: string, progress?: number) => {
    trackEvent.ga('video_play', {
      event_category: 'engagement',
      video_title: videoTitle,
      video_progress: progress,
    })
  },

  /**
   * Track search
   */
  search: (searchTerm: string, resultsCount?: number) => {
    trackEvent.ga('search', {
      search_term: searchTerm,
      results_count: resultsCount,
    })
  },

  /**
   * Track newsletter signup
   */
  newsletterSignup: (source?: string) => {
    trackEvent.ga('newsletter_signup', {
      event_category: 'conversion',
      signup_source: source,
    })
    
    trackEvent.fb('Subscribe')
  },
}
