# Manual Testing Instructions for Timeline Fix

## Timeline Thumbnail Fix Verification

### Test Steps:

1. **Open the deployed site:**
   - Navigate to: https://petrsurf.github.io/memories/

2. **Scroll to Timeline Section:**
   - Scroll down to the "Timeline" section (should be near the bottom of the page)
   - You should see timeline items with small thumbnail images on the right side

3. **Test Timeline Thumbnail Clicks:**
   - Click on any timeline thumbnail image
   - **Expected Result:** The lightbox should open showing the FULL-SIZE version of that exact image
   - **Previous Bug:** The lightbox would open but show the wrong image or fail to find the image

4. **Test Multiple Timeline Items:**
   - Close the lightbox (click X or press Escape)
   - Click on a different timeline thumbnail
   - Verify it opens the correct corresponding image

5. **Test Lightbox Navigation:**
   - While in the lightbox (opened from timeline), use the arrow buttons to navigate
   - Verify you can browse through other images in the gallery

### Additional Verification Tests:

6. **Test Other Sections:**
   - **Hero Section:** Verify the main hero image displays correctly
   - **Albums Section:** Click on album cards to verify they open in lightbox
   - **Gallery Section:** Click on gallery images to verify lightbox opens correctly
   - **Navigation:** Test scrolling and section navigation

7. **Responsive Design:**
   - Resize browser window to test mobile/tablet views
   - Verify timeline thumbnails are still clickable and functional

### What to Look For:

✅ **Success Indicators:**
- Timeline thumbnails open the correct corresponding images
- Lightbox displays full-size images properly
- Navigation between images works smoothly
- No console errors in browser developer tools

❌ **Failure Indicators:**
- Timeline thumbnails open wrong images
- Lightbox shows "image not found" or blank
- Console errors related to image loading
- Clicking thumbnails does nothing

### Technical Details:

**The Fix:**
- Timeline items with IDs like `moment-abc123` now correctly strip the `moment-` prefix
- This allows the lightbox to find the actual upload with ID `abc123`
- Both generated timeline items and manual timeline items work correctly

**Code Location:**
- File: `src/components/TimelineSection.tsx`
- Lines: 88-95 (onClick handler with ID prefix stripping)

### Reporting Issues:

If you encounter any problems:
1. Open browser Developer Tools (F12)
2. Check the Console tab for errors
3. Note which specific timeline item failed
4. Report the issue with details about what happened vs. what was expected
