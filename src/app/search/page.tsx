import { Metadata } from 'next';
import { Suspense } from 'react';
import AdvancedSearch from '@/components/advanced-search';
import { generateBreadcrumbSchema } from '@/lib/schema';

export const metadata: Metadata = {
  title: 'Search - Digital Marketing & SEO Blog',
  description: 'Search our comprehensive library of digital marketing and SEO articles, guides, and tutorials.',
  openGraph: {
    title: 'Search - Digital Marketing & SEO Blog',
    description: 'Search our comprehensive library of digital marketing and SEO articles, guides, and tutorials.',
    type: 'website',
  },
};

export default function SearchPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Search', url: '/search' }
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Search Our Blog
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Find the perfect marketing strategies, SEO tips, and digital growth insights for your business.
            </p>
          </div>

          <Suspense fallback={
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading search...</p>
            </div>
          }>
            <AdvancedSearch />
          </Suspense>

          {/* Search Tips */}
          <div className="mt-16 bg-white rounded-lg shadow-sm border p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Search Tips</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Popular Topics</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• SEO optimization techniques</li>
                  <li>• Google Ads best practices</li>
                  <li>• Content marketing strategies</li>
                  <li>• Social media marketing</li>
                  <li>• Email marketing automation</li>
                  <li>• Analytics and tracking</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Search Examples</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• &quot;keyword research tools&quot;</li>
                  <li>• &quot;local SEO checklist&quot;</li>
                  <li>• &quot;Facebook ads targeting&quot;</li>
                  <li>• &quot;conversion rate optimization&quot;</li>
                  <li>• &quot;Google Analytics setup&quot;</li>
                  <li>• &quot;link building strategies&quot;</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
