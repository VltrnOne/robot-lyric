#!/bin/bash

# Setup script for GitHub deployment
# Run this after creating your GitHub repository

echo "🚀 ROBOT LYRIC - GitHub Setup"
echo "=============================="
echo ""

# Check if remote already exists
if git remote get-url origin &> /dev/null; then
    echo "⚠️  Remote 'origin' already exists:"
    git remote get-url origin
    echo ""
    read -p "Do you want to update it? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        read -p "Enter your GitHub username: " GITHUB_USERNAME
        read -p "Enter your repository name (default: robot-lyric): " REPO_NAME
        REPO_NAME=${REPO_NAME:-robot-lyric}
        git remote set-url origin "https://github.com/$GITHUB_USERNAME/$REPO_NAME.git"
        echo "✅ Remote updated!"
    else
        echo "Keeping existing remote."
    fi
else
    read -p "Enter your GitHub username: " GITHUB_USERNAME
    read -p "Enter your repository name (default: robot-lyric): " REPO_NAME
    REPO_NAME=${REPO_NAME:-robot-lyric}
    
    echo ""
    echo "📝 Adding remote repository..."
    git remote add origin "https://github.com/$GITHUB_USERNAME/$REPO_NAME.git"
    echo "✅ Remote added!"
fi

echo ""
echo "📤 Pushing to GitHub..."
git branch -M main
git push -u origin main

echo ""
echo "✅ Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Go to https://github.com/$GITHUB_USERNAME/$REPO_NAME/settings/pages"
echo "2. Under 'Source', select branch 'main' and folder '/ (root)'"
echo "3. Click 'Save'"
echo "4. Wait 1-2 minutes for deployment"
echo "5. Your game will be live at: https://$GITHUB_USERNAME.github.io/$REPO_NAME"
echo ""
echo "🎮 Game Portal: https://$GITHUB_USERNAME.github.io/$REPO_NAME/portal.html"

