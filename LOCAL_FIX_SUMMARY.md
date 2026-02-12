# Local Development 404 Fix - SOLVED

## Problem
Getting 404 error when accessing `http://localhost:3000`

## Root Cause
The `next.config.ts` was configured with `basePath: "/memories"` for GitHub Pages deployment, which caused the local dev server to expect URLs at `http://localhost:3000/memories/` instead of `http://localhost:3000/`.

## Solution Applied
Modified `next.config.ts` to use basePath only in production:

```typescript
// Use basePath only for production (GitHub Pages)
const isProduction = process.env.NODE_ENV === "production";
const basePath = isProduction ? "/memories" : "";
```

## How to Access the Site Locally

### ✅ CORRECT URL:
```
http://localhost:3000
```

### ❌ WRONG URL (will give 404):
```
http://localhost:3000/memories/
```

## Steps to Test

1. **Make sure dev server is running:**
   ```bash
   npm run dev
   ```
   You should see: `Local: http://localhost:3000`

2. **Open your browser and go to:**
   ```
   http://localhost:3000
   ```
   (NOT `/memories/`)

3. **You should see:**
   - Hero section with kitchen window image
   - Gallery with album images
   - Albums section
   - Timeline section
   - About section

## If Still Getting 404

### Option 1: Clear Browser Cache
1. Press `Ctrl + Shift + Delete`
2. Select "Cached images and files"
3. Click "Clear data"
4. Try again at `http://localhost:3000`

### Option 2: Use Incognito/Private Mode
1. Open incognito window (`Ctrl + Shift + N` in Chrome)
2. Go to `http://localhost:3000`

### Option 3: Try a Different Browser
- If using Chrome, try Firefox or Edge
- Fresh browser = no cached redirects

### Option 4: Restart Everything
```bash
# Kill all Node processes
taskkill /F /IM node.exe

# Remove cache
Remove-Item -Recurse -Force .next

# Start fresh
npm run dev
```

Then access `http://localhost:3000` (not `/memories/`)

## Testing Upload Functionality

Once the site loads:

1. **Enter Edit Mode:**
   - Click "edit" button in navigation
   - Password: `Bluesky`

2. **Upload Images:**
   - Scroll to Upload section
   - Select or create an album
   - Upload images
   - Images are stored in browser's IndexedDB

3. **Verify Images Appear:**
   - Check Upload section (preview cards)
   - Check Gallery section (mixed with static images)
   - Check Albums section (under selected album)

## Deployment to GitHub Pages

When you're ready to deploy, the configuration will automatically use `/memories` basePath:

```bash
npm run build
npm run deploy
```

The site will be available at:
```
https://petrsurf.github.io/memories/
```

## Summary

- **Local Development**: `http://localhost:3000` (no basePath)
- **Production (GitHub Pages)**: `https://petrsurf.github.io/memories/` (with basePath)
- **Configuration**: Automatically switches based on `NODE_ENV`

## Current Status

✅ Configuration fixed
✅ Dev server running on port 3000
✅ Ready to test at `http://localhost:3000`

**Next Step**: Open your browser and navigate to `http://localhost:3000` (remove `/memories/` from the URL if you have it)
