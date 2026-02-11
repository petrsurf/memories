# Deployment Guide

## Deployment to GitHub Pages

This project is configured to deploy to GitHub Pages at: **https://petrsurf.github.io/memories/**

### Automated Deployment

The project uses `gh-pages` package for automated deployment.

#### Deploy Command
```bash
npm run deploy
```

This command will:
1. Build the project (`npm run build`)
2. Deploy the `out/` directory to the `gh-pages` branch
3. Push to GitHub

### Configuration

#### Next.js Configuration (`next.config.ts`)
- **basePath**: `/memories` - matches the GitHub Pages repository name
- **output**: `export` - enables static site generation
- **trailingSlash**: `true` - ensures proper routing on GitHub Pages
- **images.unoptimized**: `true` - required for static export

#### Package Scripts
- `npm run build` - Builds the static site
- `npm run deploy` - Builds and deploys to GitHub Pages

### GitHub Pages Settings

To enable GitHub Pages for your repository:

1. Go to your repository on GitHub: https://github.com/petrsurf/memories
2. Navigate to **Settings** → **Pages**
3. Under **Source**, select:
   - Branch: `gh-pages`
   - Folder: `/ (root)`
4. Click **Save**

### Verification

After deployment, your site should be available at:
**https://petrsurf.github.io/memories/**

It may take a few minutes for GitHub Pages to build and publish your site after the first deployment.

### Manual Deployment (Alternative)

If you prefer manual deployment:

1. Build the project:
   ```bash
   npm run build
   ```

2. The static files will be in the `out/` directory

3. Deploy the `out/` directory to the `gh-pages` branch manually

### Troubleshooting

- **404 errors**: Ensure the basePath in `next.config.ts` matches your repository name
- **Assets not loading**: Check that `assetPrefix` is correctly set
- **Routing issues**: Verify `trailingSlash: true` is enabled
- **Deployment fails**: Check that you have push access to the repository

### Local Testing

To test the production build locally:

```bash
npm run build
npx serve out
```

Then visit `http://localhost:3000/memories/` to preview the site.
