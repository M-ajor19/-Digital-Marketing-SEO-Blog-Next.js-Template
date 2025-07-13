'use client';

import { useState } from 'react';
import Link from 'next/link';

interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  count: number;
  color: string;
}

const categories: BlogCategory[] = [
  { id: '1', name: 'SEO', slug: 'seo', count: 12, color: 'bg-blue-500' },
  { id: '2', name: 'Content Marketing', slug: 'content-marketing', count: 8, color: 'bg-green-500' },
  { id: '3', name: 'Social Media', slug: 'social-media', count: 6, color: 'bg-purple-500' },
  { id: '4', name: 'PPC Advertising', slug: 'ppc', count: 5, color: 'bg-orange-500' },
  { id: '5', name: 'Analytics', slug: 'analytics', count: 4, color: 'bg-red-500' },
  { id: '6', name: 'Email Marketing', slug: 'email-marketing', count: 7, color: 'bg-pink-500' },
];

interface BlogCategoriesProps {
  selectedCategory?: string;
  onCategorySelect?: (category: string) => void;
  showCounts?: boolean;
}

export default function BlogCategories({ 
  selectedCategory = '', 
  onCategorySelect,
  showCounts = true 
}: BlogCategoriesProps) {
  const [activeCategory, setActiveCategory] = useState(selectedCategory);

  const handleCategoryClick = (categorySlug: string) => {
    setActiveCategory(categorySlug === activeCategory ? '' : categorySlug);
    onCategorySelect?.(categorySlug === activeCategory ? '' : categorySlug);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
        Categories
      </h3>
      
      <div className="space-y-2">
        {/* All Posts Option */}
        <button
          onClick={() => handleCategoryClick('')}
          className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
            activeCategory === '' 
              ? 'bg-primary-500 text-white' 
              : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <span>All Posts</span>
            {showCounts && (
              <span className="text-sm opacity-75">
                {categories.reduce((sum, cat) => sum + cat.count, 0)}
              </span>
            )}
          </div>
        </button>

        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategoryClick(category.slug)}
            className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
              activeCategory === category.slug
                ? 'bg-primary-500 text-white'
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div 
                  className={`w-3 h-3 rounded-full mr-3 ${category.color}`}
                ></div>
                <span>{category.name}</span>
              </div>
              {showCounts && (
                <span className="text-sm opacity-75">
                  {category.count}
                </span>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// Category Filter Tags Component
export function CategoryTags({ 
  categories: categoryList = categories, 
  selectedCategory = '',
  onCategorySelect 
}: {
  categories?: BlogCategory[];
  selectedCategory?: string;
  onCategorySelect?: (category: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onCategorySelect?.('')}
        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
          selectedCategory === ''
            ? 'bg-primary-500 text-white'
            : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-300 dark:hover:bg-zinc-600'
        }`}
      >
        All
      </button>
      
      {categoryList.map((category) => (
        <button
          key={category.id}
          onClick={() => onCategorySelect?.(category.slug)}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
            selectedCategory === category.slug
              ? 'bg-primary-500 text-white'
              : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-300 dark:hover:bg-zinc-600'
          }`}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}
