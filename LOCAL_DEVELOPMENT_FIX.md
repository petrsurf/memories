# Local Development Fix

## Issue
The site is configured with `basePath: "/memories"` for GitHub Pages deployment, which causes a 404 error when running locally.

## Quick Solution

### Option 1: Access the Correct Local URL (Easiest)
Instead of visiting `http://localhost:3000/`, visit:

**http://localhost:3000/memories/**

This matches the basePath configuration and will work immediately.

### Option 2: Temporarily Disable basePath for Local Development

1. Open `next.config.ts`
2. Comment out the basePath for local development:

```typescript
import type { NextConfig } from "next";

// Use basePath only for production (GitHub Pages)
const basePath = process.env.NODE_ENV === "production" ? "/memories" : "";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath,
  assetPrefix: basePath,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
```

3. Restart the dev server (Ctrl+C, then `npm run dev`)
4. Now you can access the site at `http://localhost:3000/`

**Important:** This change makes basePath conditional - it only applies in production builds, not during development.

## Recommended Approach

**Use Option 1** (access http://localhost:3000/memories/) because:
- No code changes needed
- Matches production environment exactly
- Prevents deployment issues
- Tests the actual deployed configuration

## After the Fix

Once you access the correct URL, you should see:
- ✅ The full site loads (no 404)
- ✅ All static SVG images display correctly
- ✅ Navigation works properly
- ✅ All sections render as expected

## Why This Happens

The `basePath` configuration tells Next.js that the app is hosted at a subdirectory (`/memories/`) rather than the root (`/`). This is required for GitHub Pages when your repository name is "memories", but it means:

- **Production URL**: `https://petrsurf.github.io/memories/` ✅
- **Local URL**: `http://localhost:3000/memories/` ✅
- **Wrong Local URL**: `http://localhost:3000/` ❌ (404 error)

## Testing Checklist

After accessing the correct URL:
1. ✅ Hero section displays with kitchen image
2. ✅ Gallery shows multiple images
3. ✅ Albums section shows 4 album covers
4. ✅ Timeline shows 3 thumbnail images
5. ✅ All navigation links work
6. ✅ No console errors in DevTools
