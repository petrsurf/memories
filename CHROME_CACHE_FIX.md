# Chrome Cache Fix

## Problem
Images load in Firefox but not in Chrome - this is a Chrome caching issue.

## Solution: Clear Chrome Cache

### Method 1: Hard Refresh (Quick)
1. Open the site in Chrome: https://petrsurf.github.io/memories/
2. Press `Ctrl + Shift + Delete` (Windows/Linux) or `Cmd + Shift + Delete` (Mac)
3. Select "Cached images and files"
4. Click "Clear data"
5. Refresh the page with `Ctrl + F5`

### Method 2: DevTools Clear Cache (Recommended)
1. Open Chrome DevTools: Press `F12`
2. Right-click the refresh button (while DevTools is open)
3. Select "Empty Cache and Hard Reload"
4. This will clear cache and reload the page

### Method 3: Incognito Mode (Temporary Test)
1. Press `Ctrl + Shift + N` (Windows/Linux) or `Cmd + Shift + N` (Mac)
2. Open: https://petrsurf.github.io/memories/
3. Images should load correctly in incognito mode

### Method 4: Clear Site Data (Most Thorough)
1. Open Chrome DevTools: Press `F12`
2. Go to "Application" tab
3. In left sidebar, click "Storage"
4. Click "Clear site data" button
5. Refresh the page

### Method 5: Chrome Settings (Complete Clear)
1. Go to: `chrome://settings/clearBrowserData`
2. Select "Advanced" tab
3. Time range: "All time"
4. Check: "Cached images and files"
5. Click "Clear data"
6. Reload the site

## Why This Happens

Chrome aggressively caches static sites like GitHub Pages. When you deploy updates:
- Firefox may fetch new content immediately
- Chrome may serve cached content for hours/days
- This is normal browser behavior

## Verification

After clearing cache, verify:
- ✅ Hero image loads (Sunday light kitchen scene)
- ✅ Album covers load (4 album thumbnails)
- ✅ Timeline thumbnails load (3 recent moments)
- ✅ Navigation works without hash in URL

## Prevention

For future deployments, always:
1. Clear Chrome cache after deploying
2. Or use incognito mode to test
3. Or use Firefox for immediate testing
