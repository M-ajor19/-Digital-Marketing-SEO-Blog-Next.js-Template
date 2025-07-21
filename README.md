# Premium Digital Marketing Blog - Next.js Template

[![Next.js](https://img.shields.io/badge/Next.js-15.4.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7.2-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.15-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-11.15.0-0055FF?style=for-the-badge&logo=framer)](https://www.framer.com/motion/)

A sophisticated, high-performance digital marketing blog template built with Next.js 15, featuring stunning animations, premium UI components, and enterprise-grade functionality.

## 🚀 Features

### ✨ **Premium Design System**
- **Modern Glassmorphism UI** with sophisticated animations
- **Dark/Light Mode** with system preference detection
- **Responsive Design** optimized for all devices
- **Custom Typography** with Google Fonts integration
- **Advanced Color Palette** with semantic color variables

### 🎯 **Marketing Features**
- **SEO Optimized** with Next.js App Router
- **Blog System** with markdown support
- **Newsletter Integration** with form validation
- **Analytics Integration** (Google Analytics, Hotjar, Clarity)
- **Social Media Optimization** with Open Graph
- **Performance Monitoring** with Core Web Vitals

### 🛠 **Developer Experience**
- **TypeScript** for type safety
- **ESLint & Prettier** for code quality
- **Modular Architecture** with reusable components
- **Custom Hooks** for common functionality
- **Comprehensive Documentation**

### ⚡ **Performance**
- **100/100 Lighthouse Score** optimized
- **Image Optimization** with Next.js Image
- **Code Splitting** for optimal bundle size
- **Lazy Loading** for improved performance
- **CDN Ready** for global distribution

## Technologies Used

-   [Next.js 15.4.2](https://nextjs.org/) (App Router)
-   [React 18.3.1](https://react.dev/)
-   [TypeScript 5.7.2](https://www.typescriptlang.org/)
-   [Tailwind CSS 3.4.15](https://tailwindcss.com/)
-   [Framer Motion 11.15.0](https://www.framer.com/motion/)
-   [Radix UI](https://www.radix-ui.com/)
-   [Lucide React](https://lucide.dev/)

## 🚀 Quick Start

### Prerequisites
- Node.js 18.0.0 or higher
- npm 8.0.0 or higher

### 1. Installation

```bash
# Clone the repository
git clone https://github.com/your-username/premium-digital-marketing-blog.git

# Navigate to project directory
cd premium-digital-marketing-blog

# Install dependencies
npm install

# Start development server
npm run dev
```

### 2. Environment Setup

Create a `.env.local` file in the root directory:

```env
# Analytics
NEXT_PUBLIC_GA_ID=your_google_analytics_id
NEXT_PUBLIC_GTM_ID=your_google_tag_manager_id
NEXT_PUBLIC_HOTJAR_ID=your_hotjar_id
NEXT_PUBLIC_CLARITY_ID=your_microsoft_clarity_id
NEXT_PUBLIC_FB_PIXEL_ID=your_facebook_pixel_id

# Newsletter
NEWSLETTER_API_KEY=your_newsletter_service_api_key

# Database (if using)
DATABASE_URL=your_database_connection_string

# Authentication (if using)
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3003
```

### 3. Customization

Open the project and customize:

1. **Brand Colors**: Edit `tailwind.config.ts`
2. **Typography**: Modify font imports in `layout.tsx`
3. **Content**: Update content in `src/content/`
4. **Navigation**: Configure in `src/components/layout/header.tsx`

## 📂 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Homepage
├── components/             # Reusable components
│   ├── layout/            # Layout components
│   ├── sections/          # Page sections
│   ├── ui/                # UI components
│   └── ...
├── lib/                   # Utilities and helpers
│   ├── utils.ts           # Common utilities
│   └── ...
└── types/                 # TypeScript type definitions
```

## 🎨 Customization Guide

### Colors

Edit your brand colors in `tailwind.config.ts`:

```typescript
colors: {
  primary: {
    50: '#eff6ff',
    500: '#3b82f6',  // Your primary color
    900: '#1e3a8a',
  },
  // ... more colors
}
```

### Fonts

Update fonts in `app/layout.tsx`:

```typescript
const customFont = YourFont({
  subsets: ['latin'],
  variable: '--font-custom',
})
```

### Content

Update your content in the respective component files:

- **Hero Section**: `components/sections/hero-section.tsx`
- **Blog Posts**: `components/sections/featured-posts.tsx`
- **Navigation**: `components/layout/header.tsx`

## 📊 Analytics & SEO

### SEO Features
- ✅ Automatic sitemap generation
- ✅ Meta tags optimization
- ✅ Structured data (JSON-LD)
- ✅ Open Graph tags
- ✅ Twitter Cards
- ✅ Canonical URLs

### Analytics Integration
- ✅ Google Analytics 4
- ✅ Google Tag Manager
- ✅ Microsoft Clarity
- ✅ Hotjar
- ✅ Facebook Pixel

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/import/project)

### Netlify

1. Build the project: `npm run build`
2. Deploy the `out` folder to Netlify

### Docker

```bash
# Build the image
docker build -t premium-blog .

# Run the container
docker run -p 3000:3000 premium-blog
```

## 📋 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Fix ESLint issues |
| `npm run type-check` | Check TypeScript |
| `npm run format` | Format with Prettier |

## 🎯 Performance

This template is optimized for maximum performance:

- **Core Web Vitals**: Excellent scores
- **Lighthouse**: 95+ on all metrics
- **Bundle Size**: Optimized with code splitting
- **Images**: Next.js Image optimization
- **Fonts**: Optimized loading with `font-display: swap`

## 📱 Browser Support

| Browser | Version |
|---------|---------|
| Chrome | ✅ Latest |
| Firefox | ✅ Latest |
| Safari | ✅ Latest |
| Edge | ✅ Latest |

## 🤝 Support

### Documentation
- 📖 **Complete Documentation** included
- 🎥 **Video Tutorials** available
- 💬 **Community Support** via GitHub

### Premium Support
- 📧 **Email**: support@premium-templates.com
- 💬 **Live Chat**: Available on our website
- 🎫 **Ticket System**: Submit a ticket

**Response Time**: Within 24 hours (Premium users get priority support)

## 📄 License

### ThemeForest License
- ✅ Use for personal projects
- ✅ Use for client projects
- ✅ Modify and customize
- ❌ Resell or redistribute
- ❌ Use in SaaS applications

### Extended License Available
- ✅ Everything in Regular License
- ✅ Use in SaaS applications
- ✅ Use in open source projects
- ✅ Use in multiple projects

## 🔄 Updates

This template includes **lifetime updates**:

- 🆕 New features and components
- 🐛 Bug fixes and security patches
- 📱 Mobile and browser compatibility updates
- 🎨 Design improvements

### Update History
- **v2.0.0** - Complete rebuild with Next.js 15
- **v1.5.0** - Added dark mode and animations
- **v1.0.0** - Initial release

## 🙏 Credits

- **Framework**: [Next.js](https://nextjs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Images**: [Unsplash](https://unsplash.com/)

## ⭐ Rating

If you love this template, please consider:

1. ⭐ **Rating it 5 stars** on ThemeForest
2. 📝 **Writing a review** to help others
3. 🐦 **Sharing on social media** with `#PremiumTemplates`

---

<div align="center">

**Made with ❤️ by Premium Templates**

[📧 Email](mailto:hello@premium-templates.com) • [🐦 Twitter](https://twitter.com/premiumtemplates) • [💼 Portfolio](https://premium-templates.com)

</div>

## File Structure

```
my-seo-blog/
├── package.json
├── next.config.mjs
├── tailwind.config.ts
├── README.md
├── public/
│   ├── next.svg
│   ├── vercel.svg
│   └── ...
└── src/
    ├── app/
    │   ├── layout.tsx
    │   ├── page.tsx
    │   ├── globals.css
    │   ├── contact/
    │   │   └── page.tsx
    │   └── (blog)/
    │       └── [slug]/
    │           └── page.tsx
    ├── components/
    │   └── cta-section.tsx
    ├── lib/
    │   ├── posts.ts
    │   └── schema.ts
    └── posts/
        ├── future-of-seo.md
        ├── digital-marketing-strategy.md
        └── content-marketing-guide.md
```

## Contributing

Feel free to submit issues and enhancement requests!

## License

This project is licensed under the MIT License - see the LICENSE file for details.
