import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// This ensures that the `src` directory is recognized as the root for Next.js
// when deploying to platforms like Netlify which might default to the project root.
const nextConfig = {
  experimental: {
    // This flag is often useful for advanced setups, though not strictly required for this basic example.
    // serverActions: true,
  },
  // Output a standalone build for better deployment to serverless environments
  output: 'standalone',
  // Configure the root directory if your Next.js app is inside a 'src' folder
  // This is crucial for Netlify's 'Base directory' setting.
  distDir: '.next', // Default, but explicitly stated
  // Adjust webpack config if needed, e.g., for specific loaders or plugins
  webpack: (config, { isServer }) => {
    // Example: If you needed to handle markdown files with a custom loader
    // config.module.rules.push({
    //   test: /\.md$/,
    //   use: 'raw-loader',
    // });
    return config;
  },
};

export default nextConfig;
