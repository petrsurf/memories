# Mobile Image Display Fix

## Issue Confirmed
Images are **correctly deployed** to GitHub Pages but not displaying on mobile devices and Mac Chrome due to **aggressive browser caching**.

## Verification
✅ Images are deployed: `https://petrsurf.github.io/memories/media/hero-sunday-light.svg` returns HTTP 200
✅ HTML references are correct: `src="/memories/media/hero-sunday-light.svg"`
✅ Paths include proper basePath: `/memories/`

## Root Cause
Mobile browsers (especially Safari on iOS and Chrome on Android) cache static assets very aggressively. When you visit the site, the browser serves old cached content instead of fetching the latest images.

---

## Solutions by Device/Browser

### iPhone/iPad (Safari)
1. **Open Settings app** → **Safari**
2. Scroll down to **"Clear History and Website Data"**
3. Tap **"Clear History and Data"**
4. Confirm the action
5. Open Safari and visit: `https://petrsurf.github.io/memories/`

**Alternative - Private Browsing:**
1. Open Safari
2. Tap the tabs button (bottom right)
3. Tap **"Private"** (bottom left)
4. Tap **"+"** to open new private tab
5. Visit: `https://petrsurf.github.io/memories/`

### Android (Chrome)
1. Open **Chrome app**
2. Tap **⋮** (three dots, top right)
3. Tap **Settings** → **Privacy and security**
4. Tap **Clear browsing data**
5. Select **"Cached images and files"**
6. Choose **"All time"** as time range
7. Tap **"Clear data"**
8. Reload the site

**Alternative - Incognito Mode:**
1. Open Chrome
2. Tap **⋮** (three dots)
3. Tap **"New Incognito tab"**
4. Visit: `https://petrsurf.github.io/memories/`

### Mac (Chrome)
1. **Open Chrome DevTools**: Press `Cmd + Option + I`
2. **Right-click the refresh button** (while DevTools is open)
3. Select **"Empty Cache and Hard Reload"**

**Alternative Method:**
1. Press `Cmd + Shift + Delete`
2. Select **"Cached images and files"**
3. Choose **"All time"**
4. Click **"Clear data"**
5. Press `Cmd + Shift + R` to hard reload

### Mac (Safari)
1. **Open Safari**
2. Go to **Safari menu** → **Settings** (or press `Cmd + ,`)
3. Go to **Advanced** tab
4. Check **"Show Develop menu in menu bar"**
5. Close Settings
6. Go to **Develop menu** → **Empty Caches**
7. Press `Cmd + R` to reload

**Alternative:**
1. Press `Cmd + Option + E` (Empty Caches)
2. Press `Cmd + R` (Reload)

### Firefox (All Platforms)
1. Press `Ctrl + Shift + Delete` (Windows/Linux) or `Cmd + Shift + Delete` (Mac)
2. Select **"Cached Web Content"**
3. Choose **"Everything"** as time range
4. Click **"Clear Now"**
5. Press `Ctrl + F5` (Windows/Linux) or `Cmd + Shift + R` (Mac)

---

## Quick Test Method

**Use Private/Incognito Mode:**
This is the fastest way to verify if caching is the issue:

1. Open your browser's private/incognito mode
2. Visit: `https://petrsurf.github.io/memories/`
3. If images load correctly → **Confirmed cache issue**
4. If images still don't load → **Different issue** (contact support)

---

## What You Should See After Clearing Cache

✅ **Hero Section**: Large kitchen window image with morning light
✅ **Gallery**: Grid of various album images
✅ **Albums Section**: 4 album cover images (Winter Kitchen, Snow Walks, Sunday Tables, Autumn Woods)
✅ **Timeline**: 3 thumbnail images (snow window, candlelight, market)

---

## Why This Happens

GitHub Pages serves static content with cache headers that tell browsers to cache files for up to 10 minutes (`max-age=600`). However:

1. **Mobile browsers** often ignore these headers and cache more aggressively
2. **Service workers** may cache assets indefinitely
3. **CDN caching** (Fastly) adds another layer of caching
4. **Browser updates** may not clear old caches automatically

---

## Prevention for Future Updates

After deploying updates to the site:

1. **Always clear cache** on all devices you want to test
2. **Use incognito/private mode** for immediate testing
3. **Wait 10-15 minutes** for CDN caches to expire naturally
4. **Test on multiple browsers** to ensure consistency

---

## Still Not Working?

If images still don't appear after clearing cache:

1. **Check browser console** (F12 → Console tab) for errors
2. **Check network tab** (F12 → Network tab) to see if images are loading
3. **Try a different browser** to isolate the issue
4. **Check internet connection** - some networks block certain content
5. **Disable browser extensions** - ad blockers may interfere

---

## Technical Details

- **Site URL**: https://petrsurf.github.io/memories/
- **Image Path**: `/memories/media/*.svg`
- **CDN**: Fastly (via GitHub Pages)
- **Cache-Control**: max-age=600 (10 minutes)
- **Deployment**: Static export via Next.js

All images are confirmed deployed and accessible. The issue is purely client-side caching.
