// Google Analytics 4 tracking utilities
declare global {
  interface Window {
    gtag: (command: string, targetId: string, config?: any) => void;
    dataLayer: any[];
  }
}

// Initialize Google Analytics
export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID || '';

// Track page views
export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_TRACKING_ID, {
      page_path: url,
    });
  }
};

// Track custom events
export const event = ({
  action,
  category,
  label,
  value,
}: {
  action: string;
  category: string;
  label?: string;
  value?: number;
}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Common marketing events
export const trackFormSubmission = (formName: string, success: boolean = true) => {
  event({
    action: success ? 'form_submit_success' : 'form_submit_error',
    category: 'Lead Generation',
    label: formName,
  });
};

export const trackNewsletterSignup = (success: boolean = true) => {
  event({
    action: success ? 'newsletter_signup' : 'newsletter_signup_error',
    category: 'Email Marketing',
    label: 'Newsletter Subscription',
  });
};

export const trackDownload = (fileName: string, fileType: string) => {
  event({
    action: 'file_download',
    category: 'Content Engagement',
    label: `${fileName} (${fileType})`,
  });
};

export const trackOutboundLink = (url: string, linkText?: string) => {
  event({
    action: 'click',
    category: 'Outbound Link',
    label: linkText || url,
  });
};

export const trackBlogRead = (postTitle: string, timeOnPage?: number) => {
  event({
    action: 'blog_read',
    category: 'Content Engagement',
    label: postTitle,
    value: timeOnPage,
  });
};

export const trackCTAClick = (ctaName: string, location: string) => {
  event({
    action: 'cta_click',
    category: 'Lead Generation',
    label: `${ctaName} - ${location}`,
  });
};

// Facebook Pixel tracking
export const trackFacebookEvent = (eventName: string, parameters?: any) => {
  if (typeof window !== 'undefined' && (window as any).fbq) {
    (window as any).fbq('track', eventName, parameters);
  }
};

// LinkedIn Insight Tag tracking
export const trackLinkedInEvent = (eventName: string) => {
  if (typeof window !== 'undefined' && (window as any).lintrk) {
    (window as any).lintrk('track', { conversion_id: eventName });
  }
};

// Core Web Vitals tracking
export const trackWebVitals = (metric: any) => {
  event({
    action: metric.name,
    category: 'Web Vitals',
    label: metric.id,
    value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
  });
};
