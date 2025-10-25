# 🤖 ROBOT LYRIC

A fast-paced, retro-style HTML5 game featuring a robot navigating through obstacles while collecting power-ups and competing against Player 2!

## 🎮 Game Features

### Core Gameplay
- **Progressive Difficulty**: Game speed increases as you complete levels
- **Robot Character**: Control a futuristic robot with smooth physics
- **Obstacle Navigation**: Dodge gates and barriers while maintaining momentum
- **Scoring System**: Earn points by passing through gates unscathed

### Power-Up System
- **🪙 Coins**: Collect coins to earn shields (invincibility frames)
- **⭐ Super Coins**: Rare coins that release a plethora of regular coins
- **🚀 Rockets**: Slow down time and gain full control for 3 seconds
- **🛢️ Oil Cans**: Restore 50% health with satisfying "gulp" sound

### Player 2 Competitive Mode
- **Missile Combat**: Player 2 fires spiral missiles at the robot
- **Missile Economy**: Earn missiles by collecting Player 1's shields
- **Power System**: Missiles deal 10% damage to robot's health
- **Strategic Gameplay**: Balance offense and defense

### Visual & Audio
- **8-Bit Soundtrack**: Dynamic music that intensifies with level progression
- **Retro Sound Effects**: Distinct 8-bit sounds for all game events
- **Multiple Backgrounds**: Sunset, Aurora, and Nighttime themes
- **Particle Effects**: Visual feedback for all power-ups and events

### Personalization
- **Player Names**: Global name system with persistent storage
- **Leaderboard**: Track high scores across sessions
- **Settings Menu**: Customize background and view leaderboard
- **Responsive Design**: Works on desktop and mobile devices

## 🚀 How to Play

### Player 1 (Robot)
- **Space Bar**: Jump
- **WASD/Arrow Keys**: Move during rocket power-up
- **P**: Activate Player 2 mode

### Player 2 (Missile Controller)
- **Arrow Keys**: Move cursor
- **Enter**: Fire missile at robot

### Power-Ups
- **Coins**: Collect for shields (invincibility)
- **Rockets**: Press Space to activate slow-motion control
- **Oil Cans**: Collect to restore 50% health
- **Super Coins**: Collect for coin plethora

## 🛠️ Technical Details

### Built With
- **HTML5 Canvas**: For smooth 2D graphics
- **Vanilla JavaScript**: No external dependencies
- **Web Audio API**: For 8-bit sound generation
- **CSS3**: For UI animations and effects
- **Local Storage**: For persistent data

### Game Engine
- **60 FPS Game Loop**: Smooth animation and physics
- **Collision Detection**: Precise circular and rectangular collision
- **Procedural Generation**: Random obstacle and power-up placement
- **State Management**: Clean game state transitions

### Audio System
- **Dynamic Music**: Multi-layered 8-bit soundtrack
- **Sound Effects**: Procedurally generated 8-bit sounds
- **Volume Control**: Toggle sound on/off
- **Performance Optimized**: Efficient audio processing

## 🎯 Game Mechanics

### Difficulty Progression
- **Level 1-5**: Learning phase with slower obstacles
- **Level 6-10**: Moderate speed increase
- **Level 11+**: High-speed challenge mode
- **Music Intensity**: Tempo and complexity scale with level

### Scoring System
- **Gate Passing**: +10 points per gate (only when not invincible)
- **Level Completion**: +100 points per level
- **Power-Up Collection**: No direct points, but enables higher scores

### Health System
- **Starting Health**: 100%
- **Missile Damage**: -10% per hit
- **Oil Can Restoration**: +50% per can
- **Game Over**: When health reaches 0%

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- No additional software required!

### Installation
1. Clone or download this repository
2. Open `index.html` in your web browser
3. Start playing immediately!

### Local Development Server
```bash
# Using Python
python3 -m http.server 3000

# Using Node.js
npx http-server -p 3000

# Using PHP
php -S localhost:3000
```

Then open `http://localhost:3000` in your browser.

## 📁 Project Structure

```
ROBOT-LYRIC/
├── index.html              # Main game file
├── README.md              # This file
├── .gitignore            # Git ignore rules
├── package.json          # Node.js dependencies
└── InTheAir/             # Original Unity project
    ├── Assets/           # Unity assets
    ├── ProjectSettings/  # Unity settings
    └── ...
```

## 🎨 Customization

### Adding New Backgrounds
1. Modify the background options in the settings menu
2. Add new background styles in the CSS
3. Update the background switching logic

### Adding New Power-Ups
1. Create power-up object in `createPowerUp()` method
2. Add collision detection in `checkPowerUpCollisions()`
3. Implement collection logic and visual effects
4. Add sound effect in `playSound()` method

### Modifying Game Balance
- **Coin Frequency**: Adjust `coinInterval` (default: 6000ms)
- **Rocket Duration**: Modify `rocketTimeLeft` (default: 3000ms)
- **Missile Damage**: Change damage value in `hitByMissile()`
- **Health Restoration**: Adjust restoration amount in `collectOilCan()`

## 🏆 High Scores

The game features a persistent leaderboard that saves:
- Player names
- High scores
- Level reached
- Date achieved

## 🐛 Known Issues

- Mobile touch controls need optimization
- Some older browsers may not support Web Audio API
- High score persistence requires browser local storage

## 🔮 Future Enhancements

- [ ] Mobile touch controls
- [ ] Multiplayer online mode
- [ ] More power-up types
- [ ] Boss battles
- [ ] Achievement system
- [ ] Sound effect customization
- [ ] Level editor
- [ ] Save/load game states

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

If you encounter any issues or have suggestions, please open an issue on GitHub.

---

**Enjoy playing ROBOT LYRIC!** 🤖🎵

*Made with ❤️ and lots of 8-bit nostalgia*