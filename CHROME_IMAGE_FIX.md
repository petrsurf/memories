# Chrome Image Display Fix - Complete Guide

## Problem
- ✅ Images work in **Firefox**
- ❌ Images don't work in **Chrome**
- Shows only themes/styling but no images

## Root Cause
Chrome has **aggressively cached** the old version of the site that had the `/memories` basePath issue. Even though the site now works at `http://localhost:3000`, Chrome is serving cached content.

## Solution: Clear Chrome Cache Completely

### Method 1: Hard Refresh (Try This First)
1. Open Chrome
2. Go to `http://localhost:3000`
3. Press **Ctrl + Shift + R** (Windows) or **Cmd + Shift + R** (Mac)
4. This forces Chrome to reload without cache

### Method 2: Clear All Chrome Cache (Recommended)
1. Open Chrome
2. Press **Ctrl + Shift + Delete** (Windows) or **Cmd + Shift + Delete** (Mac)
3. Select:
   - ✅ **Cached images and files**
   - ✅ **Cookies and other site data** (optional but recommended)
4. Time range: **All time**
5. Click **Clear data**
6. Close Chrome completely
7. Reopen Chrome
8. Go to `http://localhost:3000`

### Method 3: Chrome DevTools Cache Clear
1. Open Chrome
2. Go to `http://localhost:3000`
3. Press **F12** to open DevTools
4. **Right-click** the refresh button (while DevTools is open)
5. Select **"Empty Cache and Hard Reload"**
6. Wait for page to reload

### Method 4: Disable Cache in DevTools (For Development)
1. Open Chrome
2. Press **F12** to open DevTools
3. Go to **Network** tab
4. Check **"Disable cache"** checkbox
5. Keep DevTools open while developing
6. Refresh the page

### Method 5: Use Incognito Mode (Quick Test)
1. Open Chrome
2. Press **Ctrl + Shift + N** (Windows) or **Cmd + Shift + N** (Mac)
3. Go to `http://localhost:3000`
4. If images load here, it confirms it's a cache issue

### Method 6: Clear Site Data (Nuclear Option)
1. Open Chrome
2. Go to `http://localhost:3000`
3. Click the **lock icon** (or "Not secure") in address bar
4. Click **"Site settings"**
5. Scroll down and click **"Clear data"**
6. Confirm
7. Refresh the page

## Verification Steps

After clearing cache, you should see:

### ✅ Static Images:
- **Hero Section**: Large kitchen window with morning light
- **Gallery Section**: Grid of album images
- **Albums Section**: 4 album cover images
  - Winter Kitchen
  - Snow Walks
  - Sunday Tables
  - Autumn Woods
- **Timeline Section**: 3 thumbnail images
  - Snow window
  - Candlelight
  - Market

### ✅ Page Elements:
- Navigation bar with "edit" button
- Smooth scrolling between sections
- Hover effects on images
- Paper texture background

## Why This Happens

### Chrome's Aggressive Caching:
1. **Service Workers**: Chrome may have registered a service worker
2. **HTTP Cache**: Chrome caches static assets aggressively
3. **Memory Cache**: Chrome keeps resources in memory
4. **Disk Cache**: Chrome stores files on disk
5. **DNS Cache**: Chrome caches DNS lookups

### The `/memories` Issue:
- Site was configured for GitHub Pages with `/memories` basePath
- Chrome cached redirects and 404 pages
- Even after fixing the config, Chrome serves old cached content
- Firefox doesn't have this cached data, so it works fine

## Technical Details

### CSS Fix Already Applied:
The `globals.css` file already contains the Chrome SVG fix:

```css
/* Fix Next.js Image component color transparent issue - Chrome SVG bug */
img[data-nimg="fill"] {
  color: currentColor !important;
}

img[data-nimg] {
  color: currentColor !important;
}

/* Specific fix for SVG images in Chrome */
img[src*=".svg"] {
  color: #2b2723 !important;
}
```

This fixes a known Chrome bug where SVG images with `color: transparent` don't render.

## Still Not Working?

### Check Console for Errors:
1. Press **F12** in Chrome
2. Go to **Console** tab
3. Look for errors related to:
   - Image loading failures
   - 404 errors
   - CORS errors
   - Path issues

### Check Network Tab:
1. Press **F12** in Chrome
2. Go to **Network** tab
3. Refresh the page
4. Look for image requests:
   - Should see requests to `/media/*.svg`
   - Status should be **200 OK**
   - If **404**, the basePath issue persists

### Verify Dev Server:
1. Check terminal shows: `Local: http://localhost:3000`
2. No errors in terminal output
3. Server is running (not crashed)

### Try Different Port:
If nothing works, try a different port:
```bash
# Kill current server
taskkill /F /IM node.exe

# Start on different port
npm run dev -- -p 3001
```

Then access: `http://localhost:3001`

## Prevention for Future

### For Development:
1. **Always use DevTools with cache disabled**
2. **Use Incognito mode** for testing
3. **Clear cache** after major config changes
4. **Use different browsers** to verify

### For Deployment:
1. The production build will work correctly
2. GitHub Pages will serve from `/memories` path
3. Users won't have this caching issue
4. Cache-busting is handled by Next.js build hashes

## Summary

**The Fix:**
1. Clear Chrome cache completely (Method 2 above)
2. Hard refresh (Ctrl + Shift + R)
3. Access `http://localhost:3000` (not `/memories/`)

**Why It Works in Firefox:**
- Firefox doesn't have the cached `/memories` redirects
- Fresh browser state = no cache conflicts

**Current Status:**
- ✅ Site configuration is correct
- ✅ Dev server is running properly
- ✅ CSS fixes are in place
- ❌ Chrome has old cached data (needs clearing)

**Next Step:**
Clear Chrome cache using Method 2 above, then access `http://localhost:3000`
