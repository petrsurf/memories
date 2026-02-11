# Troubleshooting: No Images Loading

## Issue
Images not displaying on https://petrsurf.github.io/memories/

## Possible Causes & Solutions

### 1. Browser Cache (Most Likely)
**Solution:** Hard refresh the page
- **Windows/Linux:** `Ctrl + F5` or `Ctrl + Shift + R`
- **Mac:** `Cmd + Shift + R`
- **Alternative:** Open in incognito/private browsing mode

### 2. GitHub Pages Propagation Delay
**Solution:** Wait 2-5 minutes for GitHub Pages to fully deploy
- The deployment just completed (commit 543d73b on gh-pages)
- GitHub Pages can take a few minutes to propagate changes

### 3. Check Deployment Status
**Verify:**
1. Go to: https://github.com/petrsurf/memories/settings/pages
2. Check if "Your site is live at https://petrsurf.github.io/memories/" is shown
3. Look for any error messages

### 4. Check Browser Console
**Steps:**
1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for any 404 errors for images
4. Check Network tab for failed requests

### 5. Verify Image Paths
The site uses these image paths:
- `/memories/media/album-*.svg` (album covers)
- `/memories/media/hero-*.svg` (hero image)
- `/memories/media/thumb-*.svg` (timeline thumbnails)

All paths should include the `/memories` base path.

## Quick Test

Try accessing an image directly:
```
https://petrsurf.github.io/memories/media/hero-sunday-light.svg
```

If this loads, the images are deployed correctly and it's a cache issue.

## Current Deployment Status

- ✅ Main branch: 08cea3d (latest changes)
- ✅ gh-pages branch: 543d73b (deployed)
- ✅ Build successful
- ✅ Static export generated
- ⏳ GitHub Pages propagation: May take 2-5 minutes

## If Images Still Don't Load

1. **Clear browser cache completely**
2. **Try a different browser**
3. **Wait 5 minutes and try again**
4. **Check if the old version (with hash navigation) had images** - if yes, it's definitely a cache issue

## Reverting if Needed

If you need to revert to the previous version:
```bash
git revert 08cea3d
git push origin main
npm run deploy
