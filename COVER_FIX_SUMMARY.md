# Album Cover Fix Summary

## Problem Identified

The system was automatically setting album covers when uploads were added, violating the rule that **covers must ONLY be set manually by the user** through the "set as cover" menu option.

## Root Cause

Two locations in the code had automatic fallback logic:

1. **src/app/page.tsx** - Hero section cover:
   ```typescript
   // BEFORE (WRONG):
   const heroCoverItem = heroAlbum
     ? uploadsByAlbum[heroAlbum.id]?.find((item) => item.id === heroAlbum.coverId) ??
       uploadsByAlbum[heroAlbum.id]?.[0]  // ❌ Automatic fallback to first upload
     : undefined;
   ```

2. **src/components/AlbumsSection.tsx** - Album covers:
   ```typescript
   // BEFORE (WRONG):
   const coverItems = uploadsByAlbum[album.id]?.slice(0, 3) ?? [];
   // This showed first 3 uploads regardless of coverId
   ```

## Solution Implemented

### 1. Fixed Hero Section (page.tsx)
Removed the automatic fallback to `[0]`:

```typescript
// AFTER (CORRECT):
const heroCoverItem = heroAlbum
  ? uploadsByAlbum[heroAlbum.id]?.find((item) => item.id === heroAlbum.coverId)
  : undefined;
// Now only shows cover if coverId is explicitly set
```

### 2. Fixed Albums Section (AlbumsSection.tsx)
Changed to only show cover when `coverId` is set:

```typescript
// AFTER (CORRECT):
const hasCover = album.coverId && uploadsByAlbum[album.id];
const coverItem = hasCover 
  ? uploadsByAlbum[album.id]?.find((item) => item.id === album.coverId)
  : null;

// Shows coverItem if set, otherwise shows default placeholder image
```

## How "Set as Cover" Works

The manual cover setting functionality was already correctly implemented:

1. **Location:** Lightbox menu in edit mode
2. **Access:** Open any image → Click "menu" button → "set cover" dropdown
3. **Function:** `setAlbumCoverFromItem(albumId, item)` sets `album.coverId = item.id`
4. **Restriction:** Only works for local uploads (`item.isLocal === true`)

## Result

- ✅ Albums without a manually set `coverId` now show the default placeholder image
- ✅ Only albums where the user explicitly set a cover via "set cover" menu show that cover
- ✅ No automatic/random cover selection
- ✅ User has full control over which images are album covers

## Files Modified

1. `src/app/page.tsx` - Removed automatic hero cover fallback
2. `src/components/AlbumsSection.tsx` - Changed to respect coverId only

## Deployment

- **Commit:** 4eba487 - "Fix: Remove automatic cover fallback - covers must be set manually by user"
- **Branch:** main (pushed to origin)
- **Deployment:** gh-pages (in progress)
- **Live URL:** https://petrsurf.github.io/memories/

## Testing Instructions

1. Navigate to https://petrsurf.github.io/memories/
2. Enter edit mode (password: Bluesky)
3. Upload images to an album
4. Verify the album shows the default placeholder (not the first upload)
5. Open any uploaded image in lightbox
6. Click "menu" → "set cover" → select the album
7. Verify the album now shows the selected image as cover
8. Verify other albums without set covers still show placeholders
