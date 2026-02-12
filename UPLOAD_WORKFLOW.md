# Image Upload Workflow - GitHub Storage

## Overview
This guide explains how to upload images through the UI and store them permanently on GitHub so they're accessible from any device.

## How It Works

### 1. Upload Images (Browser Storage)
1. Enter **Edit Mode** (password: "Bluesky")
2. Navigate to the **Upload** section
3. Select an album or create a new one
4. Upload your images through the UI
5. Images are temporarily stored in your browser's IndexedDB

### 2. Export Images (Download to Computer)
1. In Edit Mode, scroll to the Upload section
2. Click the **"Export Images"** button
3. A ZIP file named `sunday-album-uploads-[date].zip` will download
4. This ZIP contains:
   - All your uploaded images (organized by album)
   - `manifest.json` with metadata (titles, albums, dates, etc.)

### 3. Add Images to Repository
1. **Extract the ZIP file** to your computer
2. **Copy the contents** to your project folder:
   ```
   public/media/uploads/
   ```
3. Your folder structure should look like:
   ```
   public/
     media/
       uploads/
         album-winter-kitchen/
           image-1.jpg
           image-2.jpg
         album-snow-walks/
           image-3.jpg
   ```

### 4. Commit and Deploy
1. **Commit the changes** to Git:
   ```bash
   git add public/media/uploads/
   git commit -m "Add uploaded images"
   git push origin main
   ```

2. **Deploy to GitHub Pages**:
   ```bash
   npm run deploy
   ```

3. Wait 2-5 minutes for GitHub Pages to process the deployment

### 5. Import Images (Load from GitHub)
1. After deployment, visit your site
2. Enter Edit Mode
3. Click **"Import Images from GitHub"** button
4. The app will:
   - Load images from `/media/uploads/` folder
   - Read the `manifest.json` for metadata
   - Populate your gallery with the images

## Benefits

✅ **Persistent Storage**: Images are stored in your GitHub repository
✅ **Cross-Device Access**: Available on any device that accesses the site
✅ **Version Control**: Images are tracked in Git history
✅ **Backup**: Automatically backed up with your repository
✅ **No Database Needed**: Works with static GitHub Pages hosting

## File Organization

### Exported ZIP Structure
```
sunday-album-uploads-2026-02-11/
├── manifest.json
└── albums/
    ├── album-winter-kitchen/
    │   ├── photo-1.jpg
    │   └── photo-2.jpg
    └── album-snow-walks/
        └── photo-3.jpg
```

### Repository Structure
```
public/
  media/
    uploads/
      albums/
        album-winter-kitchen/
          photo-1.jpg
          photo-2.jpg
        album-snow-walks/
          photo-3.jpg
      manifest.json
```

## Manifest.json Format

The manifest file stores metadata about your images:

```json
{
  "version": "1.0",
  "exportDate": "2026-02-11T13:00:00.000Z",
  "images": [
    {
      "id": "unique-id",
      "filename": "photo-1.jpg",
      "title": "Morning Light",
      "detail": "Kitchen window at sunrise",
      "alt": "Warm morning light through kitchen window",
      "albumId": "album-winter-kitchen",
      "albumTitle": "Winter Kitchen",
      "type": "image",
      "timestamp": 1707656400000,
      "path": "albums/album-winter-kitchen/photo-1.jpg"
    }
  ]
}
```

## Workflow Summary

```
┌─────────────────┐
│  Upload Images  │  ← Through UI in Edit Mode
│  (IndexedDB)    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Export Images  │  ← Click "Export Images" button
│  (Download ZIP) │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Extract & Copy │  ← Manual: Extract ZIP to public/media/uploads/
│  to Repository  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Git Commit &   │  ← git add, commit, push
│  Deploy         │     npm run deploy
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Import Images  │  ← Click "Import Images" button
│  (Load from GH) │
└─────────────────┘
```

## Tips

### For Frequent Updates
- Export images regularly to avoid losing work
- Keep the ZIP files as backups
- Commit images in logical batches (e.g., by album or date)

### For Large Collections
- Consider image optimization before upload
- Use appropriate file formats (JPEG for photos, PNG for graphics)
- Keep file sizes reasonable (< 2MB per image recommended)

### For Collaboration
- Share the repository with collaborators
- They can add images by following the same workflow
- Use descriptive commit messages for image additions

## Troubleshooting

### Images Not Showing After Import
1. Clear browser cache (Ctrl+Shift+Delete)
2. Verify files are in `public/media/uploads/` folder
3. Check that `manifest.json` is present and valid
4. Ensure deployment completed successfully

### Export Button Not Working
1. Verify you're in Edit Mode
2. Check browser console for errors (F12)
3. Ensure you have uploaded images in IndexedDB

### Import Button Not Finding Images
1. Verify deployment completed (check GitHub Pages)
2. Ensure `manifest.json` is in `/media/uploads/` folder
3. Check file paths match the manifest
4. Wait a few minutes after deployment for CDN to update

## Advanced: Automated Workflow (Future Enhancement)

For users comfortable with GitHub Actions, you could automate deployment:

1. Set up GitHub Actions workflow
2. Automatically deploy on push to main branch
3. No need to run `npm run deploy` manually

See `.github/workflows/` for examples (if available).

## Support

For issues or questions:
- Check browser console (F12) for error messages
- Verify file paths and structure
- Ensure Git and npm commands completed successfully
- Review deployment logs on GitHub Pages settings
