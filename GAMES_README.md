# Adding Games to VLTRN GAMES Portal

This repository supports multiple games that all auto-deploy via GitHub Actions.

## Repository Structure

```
/
├── portal.html          # Main portal page (entry point)
├── games/              # Games folder
│   ├── robot-lyric/   # Game 1
│   │   └── index.html
│   ├── game-2/        # Game 2 (example)
│   │   └── index.html
│   └── game-3/        # Game 3 (example)
│       └── index.html
└── .github/
    └── workflows/
        └── deploy.yml  # Auto-deploy workflow
```

## How to Add a New Game

### Step 1: Create Game Folder

Create a new folder in the `games/` directory:

```bash
mkdir games/your-game-name
```

### Step 2: Add Your Game Files

Place your game's `index.html` and any assets in the new folder:

```
games/your-game-name/
├── index.html
├── assets/
│   ├── images/
│   ├── sounds/
│   └── ...
└── ...
```

### Step 3: Register Game in Portal

Edit `portal.html` and add your game to the `games` array:

```javascript
const games = [
    {
        id: 'robot-lyric',
        title: '🤖 ROBOT LYRIC',
        by: 'by Lyric and Aria',
        url: 'games/robot-lyric/index.html',
        description: 'A fast-paced, retro-style game'
    },
    // Add your new game here:
    {
        id: 'your-game-name',
        title: '🎮 Your Game Title',
        by: 'by Your Name',
        url: 'games/your-game-name/index.html',
        description: 'Your game description'
    }
];
```

### Step 4: Commit and Push

```bash
git add .
git commit -m "Add new game: Your Game Name"
git push origin main
```

The game will automatically deploy via GitHub Actions!

## Game Requirements

### Iframe Compatibility

Your game should work in an iframe. If your game needs to request fullscreen expansion, it should send a postMessage:

```javascript
// In your game code
if (window.self !== window.top) {
    // Game is in iframe
    window.parent.postMessage({
        type: 'request-fullscreen',
        game: 'your-game-id',
        url: window.location.href
    }, '*');
}
```

### Mobile Responsiveness

Games should be responsive and work on mobile devices. Use viewport meta tag:

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
```

### Game Ready Notification

Optionally, notify the portal when your game is ready:

```javascript
if (window.self !== window.top) {
    window.parent.postMessage({
        type: 'game-ready',
        game: 'your-game-id'
    }, '*');
}
```

## Auto-Deployment

All games automatically deploy to GitHub Pages when you push to the `main` branch. The deployment workflow:

1. Triggers on push to `main`
2. Deploys all files in the repository
3. Makes games available at: `https://yourusername.github.io/repo-name/`

## Best Practices

1. **Unique IDs**: Use unique game IDs (e.g., `robot-lyric`, `space-shooter`)
2. **Descriptive Titles**: Use emojis and clear titles
3. **Self-Contained**: Keep game assets in its own folder
4. **Testing**: Test your game in the portal before pushing
5. **Documentation**: Add a README in your game folder if needed

## Example Game Structure

```
games/my-awesome-game/
├── index.html          # Main game file
├── js/
│   └── game.js        # Game logic
├── css/
│   └── style.css      # Game styles
├── assets/
│   ├── images/       # Game images
│   └── sounds/        # Game sounds
└── README.md          # Game documentation (optional)
```

## Questions?

If you need help adding a game, check the existing `robot-lyric` game as a reference!

