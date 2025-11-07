# AriaPac - Quick Start Guide

## Instant Play

### Local Play (Recommended for Development)
1. Navigate to the `ariapac` folder
2. Open `index.html` in any modern browser (Chrome, Firefox, Safari, Edge)
3. Click "Start Game" and enjoy!

**No installation, no build process, no dependencies required.**

---

## Controls At a Glance

### Player 1 (Safari Explorer)
```
Movement:  W/A/S/D or Arrow Keys
Sprint:    SHIFT
Freezes:   1 (Red)  2 (Blue)  3 (Green)  4 (Orange)
```

### Player 2 (Dinosaur Pack)
```
Movement:  I/J/K/L
Ability:   SPACE
Switch:    U (Raptor)  O (Pterodactyl)  P (Triceratops)  [ (T-Rex)
Cycle:     TAB
```

### System
```
Pause:     ESC
Fullscreen: F11 or fullscreen button
```

---

## Game Objective

**Player 1:** Collect all pellets without getting caught
**Player 2:** Catch Player 1 before pellets are collected

---

## Quick Tips

### For Player 1:
1. Collect power pellets (large glowing orbs) to get freeze abilities
2. Use freezes strategically - each color freezes a specific dinosaur
3. Manage stamina - don't sprint constantly
4. Collect 50 pellets to spawn an extra life

### For Player 2:
1. Only ONE dinosaur is controlled at a time - others use AI
2. Switch dinosaurs to coordinate attacks
3. Each dinosaur has unique speed and abilities
4. Use abilities to trap or catch Player 1

---

## Dinosaur Quick Reference

| Dinosaur | Speed | Ability | Cooldown | Counter |
|----------|-------|---------|----------|---------|
| Raptor (Red) | Fast (110%) | Pounce (dash 3 tiles) | 8s | Red Freeze |
| Pterodactyl (Blue) | Medium (90%) | Sonar (reveal player) | 12s | Blue Freeze |
| Triceratops (Green) | Slow (70%) | Stampede (charge) | 15s | Green Freeze |
| T-Rex (Orange) | Medium (85%) | Roar (impair player) | 20s | Orange Freeze |

---

## File Structure

```
ariapac/
├── index.html           # Open this file to play
├── css/style.css        # Game styling
├── js/
│   ├── game.js         # Core game engine
│   ├── player.js       # Player mechanics
│   ├── enemy.js        # Dinosaur AI
│   ├── maze.js         # Level layout
│   ├── powerups.js     # Power-up system
│   ├── renderer.js     # Graphics rendering
│   ├── input.js        # Keyboard controls
│   └── constants.js    # Game configuration
├── README.md           # Full documentation
└── ARCHITECTURE_SUMMARY.md  # Technical details
```

---

## Customization

Want to adjust game parameters? Edit `js/constants.js`:

```javascript
// Make player faster
PLAYER_CONFIG.BASE_SPEED = 4;  // Default: 3

// Adjust dinosaur abilities
DINOSAUR_CONFIG[DinosaurType.RAPTOR].abilityCooldown = 5000;  // Default: 8000

// Change scoring
SCORE.PELLET = 20;  // Default: 10

// Modify stamina
PLAYER_CONFIG.MAX_STAMINA = 150;  // Default: 100
```

---

## Troubleshooting

### Game won't load?
- Ensure you're using a modern browser (Chrome 90+, Firefox 88+, Safari 14+)
- Check browser console for errors (F12)
- Disable any ad blockers or script blockers

### Controls not working?
- Click on the game canvas to focus it
- Check if another application is intercepting keys
- Refresh the page (F5)

### Performance issues?
- Close other browser tabs
- Disable debug mode in `constants.js` (set `DEBUG.ENABLED = false`)
- Try a different browser

### Can't see the game?
- Zoom out if canvas is too large (Ctrl + -)
- Check browser compatibility
- Clear browser cache

---

## Deployment to vltrngames.com

### Option 1: Direct Upload
1. Upload entire `ariapac/` folder to web server
2. Access via: `https://vltrngames.com/ariapac/index.html`

### Option 2: Iframe Embed
Add to any page on vltrngames.com:

```html
<div class="game-container">
  <iframe
    src="/ariapac/index.html"
    width="896"
    height="992"
    frameborder="0"
    allowfullscreen
    allow="fullscreen">
  </iframe>
</div>
```

### Option 3: CDN Hosting
Upload to any static hosting service:
- GitHub Pages
- Netlify
- Vercel
- AWS S3
- CloudFlare Pages

No server-side processing required - pure static files!

---

## Development Mode

Enable debug visualizations for development:

Edit `js/constants.js`:
```javascript
const DEBUG = {
    ENABLED: true,        // Enable debug mode
    SHOW_GRID: true,      // Show tile grid overlay
    SHOW_COLLISION_BOXES: true,  // Show entity hitboxes
    SHOW_AI_PATHS: true,  // Show AI pathfinding
    SHOW_FPS: true        // Show FPS counter
};
```

---

## Next Steps

1. **Play the game** - Open `index.html` and test all features
2. **Read README.md** - Full documentation of mechanics and systems
3. **Review ARCHITECTURE_SUMMARY.md** - Technical architecture details
4. **Customize** - Modify `constants.js` to tune gameplay
5. **Deploy** - Upload to vltrngames.com when ready

---

## Support

- **Documentation:** See `README.md` for complete guide
- **Technical Details:** See `ARCHITECTURE_SUMMARY.md` and `ARIAPAC_DESIGN_SPEC.md`
- **Code Issues:** Check browser console (F12) for errors

---

## Version Info

**Version:** 1.0.0
**Release Date:** November 2025
**Total Code:** ~5,200 lines
**Dependencies:** None (pure vanilla JavaScript)

---

**Ready to Play!**

Just open `index.html` in your browser and start the safari adventure!

*Safari Explorer vs Dinosaurs - The hunt begins...*
