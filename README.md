# Digital Marketing & SEO Blog Next.js Template

A high-performance, SEO-optimized blog template built with Next.js App Router, TypeScript, and Tailwind CSS. Designed for digital marketing agencies, SEO consultants, and affiliate marketers.

## Features

-   **Fast Loading Times:** Optimized for Core Web Vitals using Next.js features like `next/image` and `next/font`.
-   **SEO Optimization:** Includes dynamic JSON-LD schema markup for rich snippets (Website and Article).
-   **Simple Search Function:** Client-side search to filter blog posts by title and excerpt.
-   **Clear Call-to-Action (CTA) Sections:** Integrated components for lead generation.
-   **Responsive Design:** Looks great on mobile, tablet, and desktop.
-   **Light & Dark Mode:** (Implemented via Tailwind CSS, can be toggled manually or with a future component).
-   **Local Markdown Content:** Easy content management using Markdown files.
-   **Clean Codebase:** Built with TypeScript for type safety and maintainability.
-   **Customizable Styling:** Utilizes Tailwind CSS with custom components for easy branding.

## Technologies Used

-   [Next.js 14+](https://nextjs.org/) (App Router)
-   [React 18+](https://react.dev/)
-   [TypeScript](https://www.typescriptlang.org/)
-   [Tailwind CSS](https://tailwindcss.com/)
-   [gray-matter](https://www.npmjs.com/package/gray-matter) for Markdown parsing

## Getting Started

Follow these steps to set up and run your template locally:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/M-ajor19/my-seo-blog.git
    cd my-seo-blog
    ```
    *(If you're starting from scratch, follow the `create-next-app` instructions at the top of the code, then copy these files into your new project.)*

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## Project Setup Instructions

To start this project from scratch:

1. Open your terminal.
2. Run: `npx create-next-app@latest my-seo-blog --typescript --tailwind --eslint`
3. Follow the prompts:
   - Would you like to use ESLint? **Yes**
   - Would you like to use Tailwind CSS? **Yes**
   - Would you like to use `src/` directory? **Yes** (CRITICAL: Select Yes here)
   - Would you like to use App Router? **Yes**
   - Would you like to customize the default import alias? **No**
4. Once the project is created, navigate into it: `cd my-seo-blog`
5. Replace the contents of your `my-seo-blog` directory with the files provided in this template.
6. Install additional dependencies for Markdown parsing: `npm install gray-matter`
7. Push to GitHub and deploy to Netlify (remember to set Base directory to `src/` and install the Essential Next.js Build Plugin).

## Deployment

This template is optimized for deployment on platforms like Netlify or Vercel.

### Deploying to Netlify

1.  **Connect to GitHub:** Log in to [Netlify](https://www.netlify.com/) and connect your GitHub account.
2.  **Import Project:** Select your `my-seo-blog` repository.
3.  **Configure Build Settings:**
    * **Base directory:** `src/` (Crucial for `src/app` structure)
    * **Build command:** `next build`
    * **Publish directory:** `.next`
4.  **Install Essential Next.js Build Plugin:**
    * After the initial deployment attempt, go to your site's settings on Netlify.
    * Navigate to the "Plugins" tab.
    * Search for and install the "Essential Next.js Build Plugin."
    * Netlify will automatically trigger a new deployment.

### Deploying to Vercel

1.  **Connect to GitHub:** Log in to [Vercel](https://vercel.com/) and connect your GitHub account.
2.  **Import Project:** Select your `my-seo-blog` repository.
3.  **Configure Build Settings:**
    * **Root Directory:** `src/` (Crucial for `src/app` structure)
    * **Framework Preset:** `Next.js` (Ensure this is selected)
    * Leave other settings as default.
4.  **Deploy:** Click "Deploy."

## Customization

-   **Content:** Add or edit Markdown files in `src/posts/`.
-   **Styling:** Modify `tailwind.config.ts` for theme colors and `src/app/globals.css` for custom CSS.
-   **Components:** Customize existing components in `src/components/` or add new ones.
-   **SEO Metadata:** Update `src/app/layout.tsx` for global SEO, and `src/app/(blog)/[slug]/page.tsx` for article-specific schema.

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
