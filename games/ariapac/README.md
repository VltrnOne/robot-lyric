# AriaPac

A 2-player Jurassic Park/Safari themed Pacman variant built with pure HTML5, CSS, and JavaScript.

## Game Overview

**AriaPac** combines classic Pacman gameplay with a strategic 2-player twist. Player 1 controls a Safari Explorer collecting pellets through a jungle maze, while Player 2 commands a pack of dinosaurs with unique abilities, hunting down the explorer.

### Key Features

- **Pure HTML5/CSS/JavaScript** - No external game engines or dependencies
- **Canvas-based rendering** - Smooth 60 FPS performance
- **2-player local multiplayer** - Competitive gameplay on one keyboard
- **Unique dinosaur abilities** - Each dinosaur type has special powers that evolve through levels
- **Strategic power-up system** - Color-coded freeze abilities to counter specific dinosaurs
- **Progressive difficulty** - AI and abilities improve across 8+ levels
- **Responsive design** - Fully embeddable in iframes
- **Fullscreen support** - Immersive gameplay experience

---

## Quick Start

### Local Setup

1. Clone or download the repository
2. Open `index.html` in a modern web browser
3. No build process required - just open and play!

### Deployment

Simply upload all files to your web server. The game is self-contained and requires no backend.

### Embedding

Embed the game in your website using an iframe:

```html
<iframe
  src="https://yourdomain.com/ariapac/index.html"
  width="896"
  height="992"
  frameborder="0"
  allowfullscreen>
</iframe>
```

---

## How to Play

### Player 1: Safari Explorer

**Objective:** Collect all pellets while avoiding dinosaurs

**Controls:**
- **W / ↑** - Move Up
- **A / ←** - Move Left
- **S / ↓** - Move Down
- **D / →** - Move Right
- **SHIFT** - Sprint (limited stamina)
- **1** - Use Red Freeze (anti-Raptor)
- **2** - Use Blue Freeze (anti-Pterodactyl)
- **3** - Use Green Freeze (anti-Triceratops)
- **4** - Use Orange Freeze (anti-T-Rex)

**Strategy:**
- Manage stamina carefully - sprinting drains it fast
- Collect power pellets to gain freeze abilities
- Use freeze strategically to escape tight situations
- Extra lives spawn every 50 pellets collected

### Player 2: Dinosaur Controller

**Objective:** Catch the Safari Explorer before all pellets are collected

**Controls:**
- **I** - Move Up
- **K** - Move Down
- **J** - Move Left
- **L** - Move Right
- **U** - Switch to Raptor (Red)
- **O** - Switch to Pterodactyl (Blue)
- **P** - Switch to Triceratops (Green)
- **[** - Switch to T-Rex (Orange)
- **TAB** - Cycle through dinosaurs
- **SPACE** - Activate special ability

**Strategy:**
- Only ONE dinosaur is actively controlled at a time - others use AI
- Switch between dinosaurs to coordinate attacks
- Each dinosaur has unique strengths and abilities
- Use special abilities to trap or catch the explorer

---

## Dinosaur Types

### Raptor (Red) - "The Hunter"
- **Speed:** 110% of player speed
- **Size:** Small (navigates tight spaces easily)
- **Ability:** **Pounce** - Dash forward 3 tiles instantly
- **Cooldown:** 8 seconds
- **Evolution:** Gains predictive movement at level 5+
- **Counter:** Red Freeze (5 second freeze)

### Pterodactyl (Blue) - "The Scout"
- **Speed:** 90% of player speed
- **Size:** Medium
- **Vision:** Can "see" through 2 maze walls
- **Ability:** **Sonar Pulse** - Reveals player position for 3 seconds
- **Cooldown:** 12 seconds
- **Evolution:** Extended vision range at level 3+, can fly over walls at level 5+
- **Counter:** Blue Freeze (5 seconds + disables vision)

### Triceratops (Green) - "The Tank"
- **Speed:** 70% of player speed
- **Size:** Large (blocks corridors)
- **Resistance:** Immune to one freeze per level
- **Ability:** **Stampede** - Charge at 200% speed for 2 seconds, destroying pellets
- **Cooldown:** 15 seconds
- **Evolution:** Can create temporary wall barriers at level 3+
- **Counter:** Green Freeze (4 seconds - shorter due to resistance)

### T-Rex (Orange) - "The Boss"
- **Speed:** 85% of player speed
- **Size:** Large (intimidating)
- **Ability:** **Roar** - AoE (5 tile radius) that impairs player movement
- **Cooldown:** 20 seconds
- **Evolution:** Roar reverses player controls at level 5+
- **Counter:** Orange Freeze (6 seconds + prevents roar)

---

## Game Mechanics

### Scoring System

| Action | Points |
|--------|--------|
| Pellet | 10 |
| Power Pellet | 50 |
| Freeze Dinosaur | 200 |
| Level Complete | 1,000 + time bonus |
| Perfect Level | 2,000 bonus |
| No Deaths | 5,000 bonus |

### Power-Up System

**Freeze Power-Ups:**
- Obtained by collecting power pellets (large glowing orbs)
- Random color assigned (Red, Blue, Green, or Orange)
- Each color freezes a specific dinosaur type
- Maximum 2 of each color in inventory

**Special Power-Ups:**
- **Sprint Boost** (Gold boot) - Spawns every 30 seconds, +50% stamina duration for 10 seconds
- **Extra Life** (Safari hat) - Spawns every 50 pellets collected, +1 life (max 5)

### Level Progression

**Levels 1-2: Tutorial**
- Simple maze layout
- 3 dinosaurs (Raptor, Pterodactyl, Triceratops)
- Basic AI behavior
- 4 power pellets

**Levels 3-4: Intermediate**
- Complex maze
- 4 dinosaurs (all types)
- Improved AI pathfinding
- Dinosaurs coordinate patrols

**Levels 5-7: Advanced**
- Tight corridors
- +10% dinosaur speed
- Predictive AI behavior
- Dynamic maze (walls shift every 60 seconds)
- 3 power pellets

**Levels 8+: Expert**
- Extreme complexity
- +20% dinosaur speed
- Team-based AI strategies
- "Hunt Mode" speed boosts
- 2 power pellets

---

## File Structure

```
ariapac/
├── index.html              # Main game page
├── css/
│   └── style.css          # Game styling
├── js/
│   ├── constants.js       # Configuration and constants
│   ├── input.js           # Keyboard input handler
│   ├── renderer.js        # Canvas rendering
│   ├── maze.js            # Maze generation and collision
│   ├── powerups.js        # Power-up system
│   ├── player.js          # Safari Explorer class
│   ├── enemy.js           # Dinosaur classes and AI
│   └── game.js            # Core game engine
├── assets/
│   ├── sprites/           # Character sprites (optional)
│   └── sounds/            # Sound effects (optional)
└── README.md              # This file
```

---

## Architecture Overview

### Core Systems

**Game Engine (game.js)**
- Main game loop using `requestAnimationFrame` (60 FPS)
- State machine: MENU → PLAYING → PAUSED → GAME_OVER → LEVEL_COMPLETE
- Collision detection coordinator
- Score and timer management

**Renderer (renderer.js)**
- Multi-layer canvas system (background, entities, UI)
- Optimized rendering with dirty flags
- Particle effects and animations
- Debug visualization support

**Input Handler (input.js)**
- Dual-player keyboard input
- Input buffering (100ms) for smooth controls
- Key mapping system

**Maze System (maze.js)**
- Classic Pacman-style 28x31 tile grid
- BFS pathfinding for AI
- Collision detection (AABB and tile-based)
- Pellet collection tracking

**Power-Up Manager (powerups.js)**
- Inventory system (max 2 per color)
- Spawn timers for special items
- Visual effects coordination

**Player (player.js)**
- Movement with stamina system
- Invincibility frames after hit
- Speed scaling per level

**Dinosaurs (enemy.js)**
- 4 behavior modes: CHASE, PATROL, AMBUSH, SCATTER
- Ability system with cooldowns
- AI difficulty scaling
- Player-controlled or autonomous

### State Management

```javascript
GameState {
  LOADING,
  MENU,
  INSTRUCTIONS,
  PLAYING,
  PAUSED,
  LEVEL_COMPLETE,
  GAME_OVER
}
```

### Collision Detection

- **Grid-based:** 32x32 pixel tiles
- **AABB:** Axis-Aligned Bounding Box for entity collisions
- **Spatial partitioning:** Sector-based optimization
- **Input buffering:** 100ms buffer for smooth directional changes

---

## Performance

- **Target:** 60 FPS
- **Canvas Size:** 896x992 pixels (28x31 tiles @ 32px each)
- **File Size:** < 500KB total
- **Browser Support:** All modern browsers with ES6+ support
- **Mobile:** Touch controls not yet implemented (keyboard only)

### Optimization Techniques

1. **Multi-layer canvas** - Only redraw changed layers
2. **Dirty flags** - Static background drawn once
3. **Object pooling** - Reuse particle objects
4. **Delta time** - Frame-independent movement
5. **Spatial partitioning** - Reduced collision checks

---

## Configuration

Edit `js/constants.js` to customize game parameters:

```javascript
// Adjust player speed
PLAYER_CONFIG.BASE_SPEED = 3;

// Modify dinosaur abilities
DINOSAUR_CONFIG[DinosaurType.RAPTOR].abilityCooldown = 8000;

// Change scoring
SCORE.PELLET = 10;

// Adjust level difficulty
LEVEL_CONFIG[1].speedMultiplier = 1.0;
```

---

## Debug Mode

Enable debug visualizations in `js/constants.js`:

```javascript
const DEBUG = {
    ENABLED: true,
    SHOW_GRID: true,
    SHOW_COLLISION_BOXES: true,
    SHOW_AI_PATHS: true,
    SHOW_FPS: true
};
```

---

## Browser Compatibility

**Supported Browsers:**
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

**Required Features:**
- HTML5 Canvas
- ES6+ JavaScript
- LocalStorage (for high score)
- Fullscreen API (optional)

---

## Future Enhancements

### Phase 2
- Online multiplayer (WebRTC/WebSocket)
- Tournament mode
- Custom maze editor
- Character customization
- Achievement system
- Global leaderboards
- Mobile touch controls

### Phase 3
- Power-up shop
- Story mode with narrative
- Procedural maze generation
- Replay system
- Discord integration

---

## Development

### Adding New Dinosaur Types

1. Define in `constants.js`:
```javascript
DinosaurType.NEW_DINO = 'new_dino';
```

2. Configure abilities:
```javascript
DINOSAUR_CONFIG[DinosaurType.NEW_DINO] = {
    name: 'New Dino',
    color: '#hexcode',
    speedMultiplier: 1.0,
    size: 28,
    abilityName: 'Special Move',
    abilityCooldown: 10000
};
```

3. Implement ability in `enemy.js`:
```javascript
executeNewDinoAbility(player, maze) {
    // Ability logic here
}
```

### Creating New Levels

Add level configuration in `constants.js`:

```javascript
LEVEL_CONFIG[9] = {
    dinosaurCount: 4,
    dinosaurTypes: [...],
    speedMultiplier: 1.3,
    powerPellets: 2,
    aiDifficulty: 'expert'
};
```

### Custom Maze Layouts

Edit `maze.js` - modify the grid array:

```javascript
this.grid = [
    [1,1,1,...], // Row 0
    [1,2,2,...], // Row 1
    // ... 31 rows total
];
```

**Tile Types:**
- `0` = Empty space
- `1` = Wall
- `2` = Pellet
- `3` = Power pellet
- `4` = Player spawn
- `5` = Enemy spawn

---

## Credits

**Game Design:** AriaPac Team
**Programming:** Pure JavaScript (no frameworks)
**Theme:** Jurassic Park / Safari
**Inspired by:** Classic Pacman (Namco, 1980)

---

## License

This project is open source. Feel free to modify and use for your own projects.

---

## Support

For bugs, feature requests, or questions:
- Open an issue on GitHub
- Contact: support@vltrngames.com

---

## Changelog

### Version 1.0.0 (Initial Release)
- Core gameplay mechanics
- 4 dinosaur types with unique abilities
- 8+ levels with progressive difficulty
- Power-up system
- Local high score tracking
- Fullscreen support
- Responsive design for iframe embedding

---

**Enjoy playing AriaPac!**

*Safari vs Dinosaurs - Who will win?*
