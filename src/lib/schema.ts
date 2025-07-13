// Basic Website Schema
export function generateWebsiteSchema({ name, url, description }: { name: string; url: string; description: string; }) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": name,
    "url": url,
    "description": description,
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${url}/search?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };
}

// Article Schema (for blog posts)
export function generateArticleSchema({
  headline,
  image,
  datePublished,
  dateModified,
  authorName,
  publisherName,
  publisherLogo,
  description,
  articleBody,
  url,
}: {
  headline: string;
  image: string;
  datePublished: string;
  dateModified: string;
  authorName: string;
  publisherName: string;
  publisherLogo: string;
  description: string;
  articleBody: string;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": headline,
    "image": [image],
    "datePublished": datePublished,
    "dateModified": dateModified,
    "author": {
      "@type": "Person",
      "name": authorName
    },
    "publisher": {
      "@type": "Organization",
      "name": publisherName,
      "logo": {
        "@type": "ImageObject",
        "url": publisherLogo
      }
    },
    "description": description,
    "articleBody": articleBody,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": url
    }
  };
}

// Organization Schema (for company/brand)
export function generateOrganizationSchema({
  name,
  url,
  logo,
  description,
  address,
  telephone,
  email,
  socialMedia,
}: {
  name: string;
  url: string;
  logo: string;
  description: string;
  address?: {
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
  };
  telephone?: string;
  email?: string;
  socialMedia?: string[];
}) {
  const schema: any = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": name,
    "url": url,
    "logo": logo,
    "description": description,
  };

  if (address) {
    schema.address = {
      "@type": "PostalAddress",
      ...address
    };
  }

  if (telephone) schema.telephone = telephone;
  if (email) schema.email = email;
  if (socialMedia) schema.sameAs = socialMedia;

  return schema;
}

// LocalBusiness Schema (for local marketing agencies)
export function generateLocalBusinessSchema({
  name,
  url,
  logo,
  description,
  address,
  telephone,
  email,
  openingHours,
  priceRange,
  serviceArea,
}: {
  name: string;
  url: string;
  logo: string;
  description: string;
  address: {
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
  };
  telephone: string;
  email?: string;
  openingHours?: string[];
  priceRange?: string;
  serviceArea?: string;
}) {
  const schema: any = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": name,
    "url": url,
    "logo": logo,
    "description": description,
    "address": {
      "@type": "PostalAddress",
      ...address
    },
    "telephone": telephone,
  };

  if (email) schema.email = email;
  if (openingHours) schema.openingHours = openingHours;
  if (priceRange) schema.priceRange = priceRange;
  if (serviceArea) schema.areaServed = serviceArea;

  return schema;
}

// BreadcrumbList Schema
export function generateBreadcrumbSchema(breadcrumbs: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": crumb.name,
      "item": crumb.url
    }))
  };
}

// Service Schema (for marketing services)
export function generateServiceSchema({
  name,
  description,
  provider,
  areaServed,
  serviceType,
  offers,
}: {
  name: string;
  description: string;
  provider: string;
  areaServed?: string;
  serviceType?: string;
  offers?: {
    price: string;
    priceCurrency: string;
    description: string;
  };
}) {
  const schema: any = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": name,
    "description": description,
    "provider": {
      "@type": "Organization",
      "name": provider
    }
  };

  if (areaServed) schema.areaServed = areaServed;
  if (serviceType) schema.serviceType = serviceType;
  if (offers) {
    schema.offers = {
      "@type": "Offer",
      ...offers
    };
  }

  return schema;
}

// FAQ Schema (for blog posts with Q&A sections)
export function generateFAQSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
}
