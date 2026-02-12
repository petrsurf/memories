# Local Development & Testing Guide

## Current Status
✅ Development server is running at `http://localhost:3000`
✅ All static images are working
✅ Upload functionality stores images locally in IndexedDB
✅ Images persist across browser sessions on the same device

## How to Test Locally

### 1. Start Development Server
```bash
npm run dev
```
Server will start at: `http://localhost:3000`

### 2. View the Site
Open your browser and navigate to:
- **Local URL**: `http://localhost:3000`

### 3. Test Static Images
You should see:
- ✅ Hero section with kitchen window image
- ✅ Gallery section with album images
- ✅ Albums section with 4 album covers
- ✅ Timeline section with 3 thumbnails

### 4. Test Upload Functionality

#### Enter Edit Mode:
1. Look for the "edit" button in the top navigation
2. Click it and enter password: **Bluesky**
3. You'll see the Upload section appear

#### Upload Images:
1. Scroll to the **Upload** section
2. Select an album from the dropdown (or create a new one)
3. Click **"choose files"** or drag & drop images
4. Images will be uploaded and stored in your browser's IndexedDB
5. You should see them appear in:
   - Upload section (preview cards)
   - Gallery section (mixed with static images)
   - Albums section (under the selected album)

#### Test Features:
- ✅ Create new albums
- ✅ Upload multiple images
- ✅ Set album covers (drag image to album)
- ✅ View images in lightbox (click any image)
- ✅ Navigate between images (prev/next buttons)
- ✅ Edit image titles and details
- ✅ Delete images
- ✅ Crop/resize images in lightbox
- ✅ Add notes to images

### 5. Test Persistence
1. Upload some images
2. Close the browser
3. Reopen and visit `http://localhost:3000`
4. Enter Edit Mode
5. Your uploaded images should still be there ✅

## Important Notes

### Local Storage (IndexedDB)
- Uploaded images are stored in your **browser's IndexedDB**
- They persist across browser sessions
- They are **only available on this device/browser**
- They are **not synced** to other devices
- Maximum storage: ~50MB to several GB (depends on browser)

### Static Images
- Located in `public/media/` folder
- These are part of the codebase
- They will be included when you deploy
- They are visible to everyone

### Configuration
The site is configured with `basePath: "/memories"` for GitHub Pages deployment. For local development:
- This is automatically handled by Next.js
- You access the site at `http://localhost:3000` (not `/memories`)
- Images load correctly from `/media/` paths

## Testing Checklist

### Basic Functionality
- [ ] Site loads at `http://localhost:3000`
- [ ] All static images are visible
- [ ] Navigation works (scroll to sections)
- [ ] Lightbox opens when clicking images
- [ ] Lightbox navigation (prev/next) works

### Edit Mode
- [ ] Can enter edit mode with password "Bluesky"
- [ ] Upload section appears
- [ ] Can create new albums
- [ ] Can upload images (JPG, PNG)
- [ ] Can upload videos (MP4, MOV)
- [ ] Uploaded images appear in gallery
- [ ] Can set album covers
- [ ] Can delete images
- [ ] Can edit image titles/details

### Theme Customization
- [ ] Can open editor window
- [ ] Can change colors (palette)
- [ ] Can change fonts
- [ ] Can apply text effects
- [ ] Can apply paper textures
- [ ] Changes reflect immediately
- [ ] Can undo/redo changes

### Persistence
- [ ] Uploaded images persist after browser restart
- [ ] Theme changes persist
- [ ] Content edits persist
- [ ] Album organization persists

## Known Limitations (Local Development)

### What Works:
✅ All UI features
✅ Image uploads (stored locally)
✅ Theme customization
✅ Content editing
✅ Lightbox and navigation
✅ Album management

### What Doesn't Work:
❌ Uploaded images are not accessible from other devices
❌ Uploaded images are not backed up
❌ No server-side storage
❌ No cross-device sync

## Next Steps for Production

When you're ready to deploy with server storage, you have these options:

### Option 1: Firebase (Recommended)
- Free tier: 5GB storage
- Real-time sync across devices
- Easy integration
- Works with any hosting

### Option 2: Vercel
- Deploy to Vercel instead of GitHub Pages
- Use Vercel Blob Storage
- Automatic deployments
- Free tier available

### Option 3: Cloudinary
- Specialized image hosting
- Free tier: 25GB storage
- Image optimization included
- Easy to integrate

### Option 4: Keep Local Storage
- Continue using IndexedDB
- Works fine for single-user, single-device
- No costs
- No setup needed

## Troubleshooting

### Images Not Loading
1. Check browser console (F12) for errors
2. Verify files exist in `public/media/` folder
3. Clear browser cache (Ctrl+Shift+Delete)
4. Restart development server

### Upload Not Working
1. Verify you're in Edit Mode
2. Check browser console for errors
3. Try a different image format (JPG, PNG)
4. Check file size (keep under 10MB)

### Theme Changes Not Saving
1. Check browser console for errors
2. Verify localStorage is enabled
3. Try in incognito mode to test
4. Check browser storage quota

### Port Already in Use
If you see "Port 3000 is already in use":
```bash
# Kill the process using port 3000
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or use a different port:
npm run dev -- -p 3001
```

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server (after build)
npm start

# Run linter
npm run lint

# Deploy to GitHub Pages
npm run deploy
```

## File Structure

```
project/
├── public/
│   └── media/           # Static images (included in deployment)
│       ├── hero-sunday-light.svg
│       ├── album-*.svg
│       └── thumb-*.svg
├── src/
│   ├── app/
│   │   ├── page.tsx     # Main application
│   │   ├── types.ts     # TypeScript types
│   │   └── globals.css  # Global styles
│   └── components/      # React components
│       ├── HeroSection.tsx
│       ├── GallerySection.tsx
│       ├── AlbumsSection.tsx
│       ├── TimelineSection.tsx
│       ├── UploadSection.tsx
│       └── AboutSection.tsx
└── out/                 # Build output (after npm run build)
```

## Browser Storage

Your uploaded images are stored in:
- **Location**: Browser's IndexedDB
- **Database**: `sunday-album-db`
- **Store**: `uploads`
- **View**: Open DevTools (F12) → Application → IndexedDB

## Support

For issues:
1. Check browser console (F12)
2. Review this guide
3. Check the ERROR_REPORT.md file
4. Verify all dependencies are installed (`npm install`)

---

**Current Status**: ✅ Local development is working perfectly!
**Next Step**: Research free web hosting options that support server-side storage
