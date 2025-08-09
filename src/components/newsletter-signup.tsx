'use client';

import { useState } from 'react';
import { subscribeToNewsletter } from '@/lib/email';
import { trackNewsletterSignup } from '@/lib/analytics';

interface NewsletterProps {
  className?: string;
}

export default function NewsletterSignup({ className = '' }: NewsletterProps) {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const validateEmail = (email: string) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError('Email is required');
      return;
    }
    
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      // Send to API route
      await subscribeToNewsletter({ email });
      
      // Track successful subscription
      trackNewsletterSignup(true);
      
      console.log('Newsletter signup:', email);
      setIsSubmitted(true);
      setEmail('');
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setIsSubmitted(false);
      }, 3000);
    } catch (error) {
      console.error('Newsletter signup error:', error);
      
      // Track failed subscription
      trackNewsletterSignup(false);
      
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`${className}`}>
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white p-8 rounded-4xl shadow-xl">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold mb-2">Stay Updated</h3>
          <p className="opacity-90">
            Get the latest digital marketing insights, SEO tips, and exclusive content delivered to your inbox.
          </p>
        </div>
        
        {isSubmitted ? (
          <div className="text-center">
            <div className="bg-green-100 bg-opacity-20 border border-green-300 border-opacity-30 text-white px-4 py-3 rounded mb-4">
              <div className="flex items-center justify-center mb-2">
                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <strong>Success!</strong>
              </div>
              <p>You&apos;ve been subscribed to our newsletter. Check your email for confirmation.</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                placeholder="Enter your email address"
                className="w-full px-4 py-3 rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 text-zinc-900 placeholder-zinc-500"
              />
              {error && <p className="text-red-200 text-sm mt-2">{error}</p>}
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-white text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-zinc-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Subscribing...
                </>
              ) : (
                'Subscribe to Newsletter'
              )}
            </button>
          </form>
        )}
        
        <p className="text-center text-sm opacity-75 mt-4">
          No spam, unsubscribe at any time. We respect your privacy.
        </p>
      </div>
    </div>
  );
}
