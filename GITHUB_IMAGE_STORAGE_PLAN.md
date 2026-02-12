# GitHub Image Storage Implementation Plan

## Current Situation
- Uploaded images are stored in browser's IndexedDB as blobs
- Images are only accessible on the device where they were uploaded
- Images don't persist across devices or browsers

## Goal
Store uploaded images in the GitHub repository so they:
- Persist across all devices
- Are included in deployments
- Are accessible from anywhere

## Implementation Options

### Option 1: Manual Workflow (Recommended for Static Sites)
**How it works:**
1. User uploads images through the UI
2. Images are downloaded to local filesystem
3. User manually adds images to `public/media/uploads/` folder
4. User commits and pushes to GitHub
5. Runs `npm run deploy` to redeploy

**Pros:**
- Simple, no backend required
- Works with static GitHub Pages
- Full control over what gets committed
- No API tokens needed in browser

**Cons:**
- Manual process
- Requires Git knowledge
- Not real-time

### Option 2: GitHub API Integration (Complex)
**How it works:**
1. User uploads images through UI
2. App converts images to base64
3. App uses GitHub API to commit images directly
4. Requires GitHub Personal Access Token
5. Triggers automatic redeployment

**Pros:**
- Automatic
- Real-time updates

**Cons:**
- Requires GitHub API token (security risk if exposed)
- Complex implementation
- Rate limits
- Requires backend or secure token management
- Not suitable for static sites

### Option 3: Hybrid Approach (Best Balance)
**How it works:**
1. User uploads images through UI
2. App stores images in IndexedDB (temporary)
3. App provides "Export Images" button
4. Downloads all uploaded images as a ZIP file
5. User extracts to `public/media/uploads/`
6. User commits, pushes, and redeploys

**Pros:**
- User-friendly
- No security concerns
- Works with static sites
- Batch operations

**Cons:**
- Still requires manual Git operations
- Not fully automatic

## Recommended Solution: Option 3 (Hybrid Approach)

### Implementation Steps

#### 1. Create Upload Storage Structure
```
public/
  media/
    uploads/           # New folder for user uploads
      albums/          # Organized by album
        album-id-1/
          image-1.jpg
          image-2.jpg
```

#### 2. Add Export Functionality
- Add "Export Images" button in edit mode
- Generate ZIP file with all uploaded images
- Include a manifest.json with metadata (titles, albums, etc.)

#### 3. Add Import Functionality
- Add "Import Images" button
- User selects the uploads folder
- App reads images and metadata
- Populates the gallery

#### 4. Update Image Resolution
- Modify `resolveAssetSrc()` to check for uploaded images in `/media/uploads/`
- Fall back to IndexedDB if not found in public folder

#### 5. Documentation
- Create guide for users on how to:
  - Export images
  - Add to repository
  - Commit and deploy

### File Changes Required

1. **src/app/page.tsx**
   - Add export images function
   - Add import images function
   - Update resolveAssetSrc to check uploads folder

2. **public/media/uploads/.gitkeep**
   - Create folder structure

3. **UPLOAD_WORKFLOW.md**
   - User documentation

## Alternative: Simpler Approach

### Option 4: Direct File Management (Simplest)
**For users comfortable with file management:**

1. User uploads images through UI (stored in IndexedDB)
2. User manually saves images from browser to `public/media/uploads/`
3. User updates the code to reference these images
4. Commits and deploys

This is the simplest but requires the most manual work.

## Recommendation

For a static GitHub Pages site, **Option 3 (Hybrid Approach)** is the best balance of:
- User experience
- Security
- Maintainability
- Compatibility with static hosting

Would you like me to implement Option 3, or would you prefer a different approach?
