# Deployment Guide - ROBOT LYRIC

This guide will help you deploy ROBOT LYRIC to GitHub Pages with automatic updates.

## 🚀 Quick Setup

### Step 1: Create GitHub Repository

1. Go to [GitHub](https://github.com/new)
2. Create a new repository named `robot-lyric` (or your preferred name)
3. **DO NOT** initialize with README, .gitignore, or license (we already have these)
4. Click "Create repository"

### Step 2: Connect Local Repository to GitHub

```bash
# Add the remote repository (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/robot-lyric.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Step 3: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** → **Pages**
3. Under **Source**, select:
   - **Branch**: `main`
   - **Folder**: `/ (root)`
4. Click **Save**

### Step 4: Enable GitHub Actions

1. Go to **Settings** → **Actions** → **General**
2. Under **Workflow permissions**, select:
   - **Read and write permissions**
   - **Allow GitHub Actions to create and approve pull requests**
3. Click **Save**

### Step 5: Update package.json (Optional)

Update the repository URL in `package.json`:

```json
"repository": {
  "type": "git",
  "url": "https://github.com/YOUR_USERNAME/robot-lyric.git"
},
"homepage": "https://YOUR_USERNAME.github.io/robot-lyric"
```

## ✅ Auto-Deployment

Once set up, every time you push to the `main` branch:

1. GitHub Actions will automatically deploy your game
2. Your game will be live at: `https://YOUR_USERNAME.github.io/robot-lyric`
3. Updates typically take 1-2 minutes to go live

## 🔗 Access Your Game

- **Main Game**: `https://YOUR_USERNAME.github.io/robot-lyric/`
- **Game Portal**: `https://YOUR_USERNAME.github.io/robot-lyric/portal.html`

## 📝 Making Updates

1. Make your changes locally
2. Commit your changes:
   ```bash
   git add .
   git commit -m "Your update description"
   ```
3. Push to GitHub:
   ```bash
   git push
   ```
4. Wait 1-2 minutes for auto-deployment
5. Your changes will be live automatically!

## 🛠️ Troubleshooting

### Deployment Not Working?

1. Check GitHub Actions tab in your repository
2. Look for any failed workflow runs
3. Ensure GitHub Pages is enabled in Settings → Pages
4. Verify the workflow file exists at `.github/workflows/deploy.yml`

### Game Not Loading?

1. Check browser console for errors
2. Ensure `index.html` is in the root directory
3. Verify `.nojekyll` file exists (tells GitHub not to use Jekyll)

### Need to Force Redeploy?

1. Go to **Actions** tab in GitHub
2. Click **Deploy to GitHub Pages** workflow
3. Click **Run workflow** → **Run workflow**

## 📦 Local Development

To test locally before deploying:

```bash
npm start
# or
npm run dev
```

Game will be available at `http://localhost:3003`

## 🎮 Features

- ✅ Automatic deployment on every push
- ✅ No build process needed (pure HTML5/JS)
- ✅ Fast deployment (1-2 minutes)
- ✅ Free hosting via GitHub Pages
- ✅ Custom domain support (optional)

---

**Created by Lyric and Aria** 🎮

