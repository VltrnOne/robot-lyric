# 🎮 VLT Games Portal

A micro games portal for hosting multiple HTML5 games in iframes with inline play and fullscreen support.

## 🌐 URL

**Portal URL:** `https://vltrngames.com` (or subdomain)

## 🎯 Features

- **Multiple Games**: Host multiple micro games in a single portal
- **Inline Play**: Play games directly in the portal without leaving the page
- **Fullscreen Mode**: Click to expand any game to fullscreen
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Easy to Add Games**: Simply add games to the `games` array in `portal.html`

## 🚀 How to Use

### Adding a New Game

1. Add your game HTML file to the project directory
2. Open `portal.html`
3. Add a new game object to the `games` array:

```javascript
{
    id: 'your-game-id',
    title: '🎮 Your Game Title',
    by: 'by Creator Name',
    url: 'your-game.html',
    description: 'Game description'
}
```

### Running the Portal

```bash
# Start the portal server
npm run portal

# Or manually
npx http-server -p 3003
```

Then open `http://localhost:3003/portal.html` in your browser.

## 📁 Current Games

1. **🤖 ROBOT LYRIC** by Lyric and Aria
   - Fast-paced, retro-style robot game
   - File: `index.html`

## 🎨 Portal Features

### Game Cards
- Each game is displayed in a card with:
  - Game title and creator credits
  - Live preview (scaled down iframe)
  - Play button (enables inline play)
  - Fullscreen button (opens in modal)

### Inline Play
- Click "Play" to enable pointer events on the game iframe
- Game scrolls into view automatically
- Other games remain disabled for preview

### Fullscreen Mode
- Click "Fullscreen" to open game in fullscreen modal
- Press `ESC` or click "Close" to exit
- Modal is responsive and works on all screen sizes

## 🌐 Deployment

### For vltrngames.com

1. Upload all game files and `portal.html` to your web server
2. Set `portal.html` as the index page (or link to it)
3. Ensure all game files are in the same directory or update paths
4. Configure DNS records as needed

### Recommended Structure

```
vltrngames.com/
├── portal.html          # Main portal page
├── index.html          # ROBOT LYRIC game
├── game2.html          # Future game 2
├── game3.html          # Future game 3
└── assets/             # Shared assets (if any)
```

## 🔧 Technical Details

- **Pure HTML/CSS/JavaScript**: No external dependencies
- **Iframe-based**: Each game runs in its own iframe for isolation
- **Responsive Grid**: CSS Grid layout adapts to screen size
- **Modal System**: Fullscreen games use a modal overlay
- **Event Handling**: Proper pointer event management for preview vs play

## 📱 Mobile Support

The portal is fully responsive and works great on:
- Desktop browsers
- Tablets
- Mobile phones

Games will scale appropriately and fullscreen mode works on all devices.

## 🎮 Future Enhancements

- [ ] Game categories/tags
- [ ] Search functionality
- [ ] Game ratings/reviews
- [ ] User favorites
- [ ] Game statistics
- [ ] Social sharing
- [ ] Game thumbnails/screenshots
- [ ] Loading states
- [ ] Error handling for failed game loads

---

**Created for VLT Games Portal**  
*Hosting micro games for instant play*

